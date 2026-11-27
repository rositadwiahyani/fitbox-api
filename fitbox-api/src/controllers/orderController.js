import { OrderModel } from "../models/orderModel.js";
import { PackageModel } from "../models/packageModel.js";

const wibDateFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
});

// Tanggal minimal pesan = besok (H-1) menurut zona waktu Asia/Jakarta (WIB)
const getTomorrowWIB = () => wibDateFormatter.format(new Date(Date.now() + 24 * 60 * 60 * 1000));

const deviceOf = (req) => req.query.device_id || req.body?.device_id;

// Pesanan hanya boleh diakses oleh perangkat yang membuatnya
async function findOwned(req, res) {
    const order = await OrderModel.getById(req.params.id).catch(() => null);
    if (!order) {
        res.status(404).json({ error: "Pesanan tidak ditemukan" });
        return null;
    }
    if (order.device_id !== deviceOf(req)) {
        res.status(403).json({ error: "Ini bukan pesanan kamu" });
        return null;
    }
    return order;
}

const locked = (res, order) =>
    order.status !== "menunggu" &&
    res.status(400).json({ error: "Pesanan sudah diproses, tidak bisa diubah" });

const checkForm = (b, days) => {
    if (!b.customer_name || !b.phone || !b.address || !b.start_date)
        return "Nama, nomor HP, alamat, dan tanggal mulai wajib diisi";
    if (!Number.isInteger(days) || days < 1 || days > 30) return "Durasi harus 1-30 hari";
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b.start_date)) return "Format tanggal mulai tidak valid";
    if (b.start_date < getTomorrowWIB()) return "Tanggal mulai minimal H-1 (besok)";
    return null;
};

export const OrderController = {
    async getAll(req, res) {
        try {
            if (req.query.user_id) {
                return res.json(await OrderModel.getByUser(req.query.user_id));
            }
            if (!req.query.device_id) return res.status(400).json({ error: "device_id atau user_id wajib diisi" });
            res.json(await OrderModel.getByDevice(req.query.device_id));
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async create(req, res) {
        try {
            const b = req.body;
            const days = Number(b.duration_days);
            const problem = !b.device_id ? "device_id wajib diisi" : checkForm(b, days);
            if (problem) return res.status(400).json({ error: problem });

            if (!Array.isArray(b.items) || b.items.length === 0) {
                return res.status(400).json({ error: "Minimal pilih 1 paket menu" });
            }
            if (b.items.length > 3) {
                return res.status(400).json({ error: "Maksimal 3 paket menu per pesanan" });
            }

            const parsedItems = [];
            const seenIds = new Set();
            for (const rawItem of b.items) {
                const rawId = rawItem?.package_id;
                const isValidNumber = typeof rawId === "number" && Number.isInteger(rawId) && rawId > 0;
                const isValidString = typeof rawId === "string" && rawId.trim().length > 0;
                if (!isValidNumber && !isValidString) {
                    return res.status(400).json({ error: "package_id tidak valid" });
                }
                const packageId = isValidNumber ? rawId : rawId.trim();
                const qty = Number(rawItem?.qty);
                if (!Number.isInteger(qty) || qty < 1 || qty > 3) {
                    return res.status(400).json({ error: "Jumlah (qty) tiap paket harus antara 1 sampai 3" });
                }
                const key = String(packageId);
                if (seenIds.has(key)) {
                    return res.status(400).json({ error: "Paket yang sama tidak boleh duplikat dalam satu pesanan" });
                }
                seenIds.add(key);
                parsedItems.push({ package_id: packageId, qty });
            }

            const resolvedItems = [];
            for (const item of parsedItems) {
                const pack = await PackageModel.getById(item.package_id).catch(() => null);
                if (!pack || !(Number(pack.price_per_day) > 0)) {
                    return res.status(400).json({ error: `Paket dengan ID ${item.package_id} tidak ditemukan` });
                }
                resolvedItems.push({ pack, qty: item.qty });
            }

            const pricePerDay = resolvedItems.reduce(
                (sum, item) => sum + Number(item.pack.price_per_day) * item.qty,
                0
            );
            const total = pricePerDay * days;
            const packageName = resolvedItems.map((item) => `${item.pack.name}(×${item.qty})`).join(", ");
            const firstPackageId = resolvedItems[0].pack.id;

            const basePayload = {
                device_id: b.device_id,
                user_id: b.user_id || null,
                package_id: firstPackageId,
                package_name: packageName,
                price_per_day: pricePerDay,
                customer_name: b.customer_name,
                phone: b.phone,
                address: b.address,
                duration_days: days,
                start_date: b.start_date,
                notes: b.notes || "",
                payment_method: b.payment_method || "transfer_bank",
                status: "menunggu",
                total,
            };

            let order;
            try {
                order = await OrderModel.create(basePayload);
            } catch (insertErr) {
                // Jika tabel packages memakai UUID sementara kolom orders.package_id bertipe bigint
                const msg = insertErr?.message || "";
                if (insertErr?.code === "22P02" || msg.includes("invalid input syntax for type bigint")) {
                    order = await OrderModel.create({ ...basePayload, package_id: null });
                } else {
                    throw insertErr;
                }
            }
            res.status(201).json(order);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async update(req, res) {
        try {
            const order = await findOwned(req, res);
            if (!order || locked(res, order)) return;

            const b = req.body;
            const days = Number(b.duration_days);
            const problem = checkForm(b, days);
            if (problem) return res.status(400).json({ error: problem });

            res.json(
                await OrderModel.update(order.id, {
                    customer_name: b.customer_name,
                    phone: b.phone,
                    address: b.address,
                    duration_days: days,
                    start_date: b.start_date,
                    notes: b.notes || "",
                    total: Number(order.price_per_day) * days,
                })
            );
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    // Simulasi pembayaran (tanpa payment gateway)
    async pay(req, res) {
        try {
            const order = await findOwned(req, res);
            if (!order || locked(res, order)) return;
            res.json(await OrderModel.update(order.id, { status: "dibayar" }));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },

    async remove(req, res) {
        try {
            const order = await findOwned(req, res);
            if (!order || locked(res, order)) return;
            res.json(await OrderModel.remove(order.id));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};
