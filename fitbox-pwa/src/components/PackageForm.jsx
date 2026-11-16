import { useState } from 'react'
import { X } from 'lucide-react'
import { GOALS } from '../data/seed'

const EMPTY = {
    name: '', emoji: '🥗', goal: 'maintenance', calories: 1500, protein: 60,
    price_per_day: 50000, description: '', menu_sample: '',
}

export default function PackageForm({ initial, onSubmit, onClose }) {
    const [f, setF] = useState(initial ? { ...EMPTY, ...initial } : EMPTY)
    const [saving, setSaving] = useState(false)
    const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

    const submit = async (e) => {
        e.preventDefault()
        setSaving(true)
        await onSubmit({
            ...f,
            calories: Number(f.calories),
            protein: Number(f.protein),
            price_per_day: Number(f.price_per_day),
        })
        setSaving(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={onClose}>
            <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="fade-up max-h-[90vh] w-full max-w-md space-y-3 overflow-y-auto border-2 border-ink bg-paper p-6 shadow-[6px_6px_0_#1c2a1f]" style={{ borderRadius: 4 }}>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl">{initial ? 'Edit paket' : 'Tambah paket'}</h2>
                    <button type="button" onClick={onClose} aria-label="Tutup"><X size={20} /></button>
                </div>

                <div className="grid grid-cols-[80px_1fr] gap-3">
                    <div><label className="label">Emoji</label><input className="input text-center" value={f.emoji} onChange={set('emoji')} maxLength={2} /></div>
                    <div><label className="label">Nama paket</label><input className="input" required value={f.name} onChange={set('name')} /></div>
                </div>

                <div>
                    <label className="label">Tujuan</label>
                    <select className="input" value={f.goal} onChange={set('goal')}>
                        {Object.entries(GOALS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <div><label className="label">Kkal</label><input type="number" min="1" required className="input" value={f.calories} onChange={set('calories')} /></div>
                    <div><label className="label">Protein (g)</label><input type="number" min="0" className="input" value={f.protein} onChange={set('protein')} /></div>
                    <div><label className="label">Harga/hari</label><input type="number" min="1" required className="input" value={f.price_per_day} onChange={set('price_per_day')} /></div>
                </div>

                <div><label className="label">Deskripsi</label><textarea rows="2" className="input" value={f.description} onChange={set('description')} /></div>
                <div>
                    <label className="label">Contoh menu (satu baris per waktu makan)</label>
                    <textarea rows="4" className="input" placeholder={'Sarapan: ...\nMakan siang: ...\nMakan malam: ...'} value={f.menu_sample} onChange={set('menu_sample')} />
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn btn-ghost flex-1">Batal</button>
                    <button disabled={saving} className="btn btn-primary flex-1">{saving ? 'Menyimpan...' : 'Simpan'}</button>
                </div>
            </form>
        </div>
    )
}