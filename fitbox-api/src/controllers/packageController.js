import { PackageModel } from "../models/packageModel.js";

const GOALS = ["turun", "maintenance", "naik"];

const pick = (b) => ({
    name: b.name,
    goal: b.goal,
    calories: Number(b.calories),
    protein: Number(b.protein) || 0,
    price_per_day: Number(b.price_per_day),
    description: b.description || "",
    menu_sample: b.menu_sample || "",
    emoji: b.emoji || "🥗",
});

const invalid = (p) =>
    !p.name || !GOALS.includes(p.goal) || !(p.calories > 0) || !(p.price_per_day > 0);

export const PackageController = {
    async getAll(req, res) {
        try {
            res.json(await PackageModel.getAll());
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
    async getById(req, res) {
        try {
            res.json(await PackageModel.getById(req.params.id));
        } catch (err) {
            res.status(404).json({ error: "Paket tidak ditemukan" });
        }
    },
    async create(req, res) {
        try {
            const payload = pick(req.body);
            if (invalid(payload))
                return res.status(400).json({ error: "Nama, tujuan, kalori, dan harga wajib diisi dengan benar" });
            res.status(201).json(await PackageModel.create(payload));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async update(req, res) {
        try {
            const payload = pick(req.body);
            if (invalid(payload))
                return res.status(400).json({ error: "Nama, tujuan, kalori, dan harga wajib diisi dengan benar" });
            res.json(await PackageModel.update(req.params.id, payload));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
    async remove(req, res) {
        try {
            res.json(await PackageModel.remove(req.params.id));
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
    },
};