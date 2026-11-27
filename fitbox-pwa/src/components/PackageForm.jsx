import { useState } from 'react'
import { X, Save, Plus } from 'lucide-react'
import { GOALS } from '../data/seed'

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'

const EMPTY = {
    name: '',
    emoji: '🥗',
    goal: 'maintenance',
    calories: 450,
    protein: 35,
    carbs: 40,
    fats: 12,
    fiber: 7,
    price_per_day: 38000,
    image_url: '',
    description: '',
    highlightsText: '',
    menu_sample: '',
}

export default function PackageForm({ initial, onSubmit, onClose }) {
    const [f, setF] = useState(() => {
        if (!initial) return EMPTY
        return {
            ...EMPTY,
            ...initial,
            highlightsText: Array.isArray(initial.highlights)
                ? initial.highlights.join('\n')
                : initial.highlights || '',
        }
    })
    const [saving, setSaving] = useState(false)

    const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

    const submit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const highlights = f.highlightsText
                .split('\n')
                .map((s) => s.trim())
                .filter(Boolean)

            await onSubmit({
                name: f.name.trim(),
                emoji: f.emoji.trim() || '🥗',
                goal: f.goal,
                calories: Number(f.calories),
                protein: Number(f.protein) || 0,
                carbs: Number(f.carbs) || 0,
                fats: Number(f.fats) || 0,
                fiber: Number(f.fiber) || 0,
                price_per_day: Number(f.price_per_day),
                image_url: f.image_url.trim() || DEFAULT_FOOD_IMAGE,
                description: f.description.trim(),
                highlights,
                menu_sample: f.menu_sample.trim(),
            })
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={onClose}>
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                className="fade-up max-h-[90vh] w-full max-w-lg space-y-3.5 overflow-y-auto border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_#1c2a1f]"
                style={{ borderRadius: 4 }}
            >
                <div className="flex items-start justify-between border-b border-line pb-3">
                    <div>
                        <span className="hand text-xs text-leaf font-bold">mode admin · kelola menu</span>
                        <h2 className="font-display text-2xl text-ink">
                            {initial ? 'Edit Paket Makanan' : 'Tambah Paket Makanan'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xs p-1 text-ink/70 hover:bg-flour hover:text-ink transition"
                        aria-label="Tutup"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="grid grid-cols-[76px_1fr] gap-3">
                    <div>
                        <label className="label">Emoji</label>
                        <input
                            className="input text-center"
                            value={f.emoji}
                            onChange={set('emoji')}
                            maxLength={4}
                        />
                    </div>
                    <div>
                        <label className="label">Nama Paket</label>
                        <input
                            className="input"
                            required
                            placeholder="Contoh: Salmon Green Goddess Bowl"
                            value={f.name}
                            onChange={set('name')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="label">Tujuan Diet</label>
                        <select className="input" value={f.goal} onChange={set('goal')}>
                            {Object.entries(GOALS).map(([k, v]) => (
                                <option key={k} value={k}>
                                    {v}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Harga / Hari (Rp)</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="input"
                            value={f.price_per_day}
                            onChange={set('price_per_day')}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    <div>
                        <label className="label">Kalori</label>
                        <input
                            type="number"
                            min="1"
                            required
                            className="input"
                            value={f.calories}
                            onChange={set('calories')}
                        />
                    </div>
                    <div>
                        <label className="label">Protein (g)</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={f.protein}
                            onChange={set('protein')}
                        />
                    </div>
                    <div>
                        <label className="label">Karbo (g)</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={f.carbs}
                            onChange={set('carbs')}
                        />
                    </div>
                    <div>
                        <label className="label">Lemak (g)</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={f.fats}
                            onChange={set('fats')}
                        />
                    </div>
                    <div>
                        <label className="label">Serat (g)</label>
                        <input
                            type="number"
                            min="0"
                            className="input"
                            value={f.fiber}
                            onChange={set('fiber')}
                        />
                    </div>
                </div>

                <div>
                    <label className="label">URL Gambar Makanan (Opsional)</label>
                    <input
                        type="url"
                        className="input"
                        placeholder="https://images.unsplash.com/..."
                        value={f.image_url}
                        onChange={set('image_url')}
                    />
                </div>

                <div>
                    <label className="label">Deskripsi Paket</label>
                    <textarea
                        rows="2"
                        className="input"
                        placeholder="Jelaskan bahan utama dan keunggulan menu ini..."
                        value={f.description}
                        onChange={set('description')}
                    />
                </div>

                <div>
                    <label className="label">Keunggulan (1 poin per baris)</label>
                    <textarea
                        rows="2"
                        className="input"
                        placeholder={'Tinggi Protein\nRendah Sodium & Tanpa MSG'}
                        value={f.highlightsText}
                        onChange={set('highlightsText')}
                    />
                </div>

                <div>
                    <label className="label">Jadwal Menu Harian (1 per baris)</label>
                    <textarea
                        rows="3"
                        className="input"
                        placeholder={'Pagi: ...\nSiang: ...\nMalam: ...'}
                        value={f.menu_sample}
                        onChange={set('menu_sample')}
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                        Batal
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="btn btn-primary flex-1 shadow-[2.5px_2.5px_0_var(--color-ink)]"
                    >
                        {initial ? <Save size={16} /> : <Plus size={16} />}
                        {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Tambah Paket'}
                    </button>
                </div>
            </form>
        </div>
    )
}
