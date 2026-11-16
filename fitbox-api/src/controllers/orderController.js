import { OrderModel } from "../models/orderModel.js";
import { PackageModel } from "../models/packageModel.js";

// Tanggal minimal pesan = besok (H-1) menurut WIB: sekarang + 7 jam + 24 jam
const minDate = () => new Date(Date.now() + 31 * 3600 * 1000).toISOString().slice(0, 10);

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
    if (b.start_date < minDate()) return "Tanggal mulai minimal H-1 (besok)";
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

            let pack = null;
            if (b.package_id) {
                pack = await PackageModel.getById(b.package_id).catch(() => null);
            }
            const packageName = pack?.name || b.package_name || "Paket Menu Sehat";
            const pricePerDay = pack?.price_per_day || Number(b.price_per_day) || 45000;

            const order = await OrderModel.create({
                device_id: b.device_id,
                user_id: b.user_id || null,
                package_id: pack?.id || b.package_id || 1,
                package_name: packageName,
                price_per_day: pricePerDay,
                customer_name: b.customer_name,
                phone: b.phone,
                address: b.address,
                duration_days: days,
                start_date: b.start_date,
                notes: b.notes || "",
                payment_method: b.payment_method || "transfer_bank",
                total: b.total || pricePerDay * days,
            });
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
                    total: order.price_per_day * days,
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