import { useState, useEffect } from 'react'
import { X, Check, Copy, Building2, QrCode } from 'lucide-react'
import { DURATIONS } from '../data/seed'
import { rupiah } from '../utils'

// pack = paket awal, order = pesanan yang sedang diubah, packages = daftar seluruh menu paket
export default function OrderForm({ pack, order, packages = [], profile, onSubmit, onClose }) {
    const [selectedPack, setSelectedPack] = useState(() => {
        if (order) return null
        if (pack) return pack
        return packages.length > 0 ? packages[0] : null
    })

    const [paymentMethod, setPaymentMethod] = useState(order?.payment_method || 'transfer_bank') // 'transfer_bank' | 'qris'
    const [copied, setCopied] = useState(false)

    const price = order ? order.price_per_day : (selectedPack?.price_per_day || 0)
    const title = order ? order.package_name : (selectedPack?.name || 'Paket Makanan')

    const [saving, setSaving] = useState(false)
    const [f, setF] = useState({
        duration_days: order?.duration_days ?? 1,
        start_date: order?.start_date ?? '',
        customer_name: order?.customer_name || profile.name || '',
        phone: order?.phone || profile.phone || '',
        address: order?.address || profile.address || '',
        notes: order?.notes ?? '',
    })

    // Sinkronisasi otomatis data profil default pemesan
    useEffect(() => {
        if (!order && profile) {
            setF((prev) => ({
                ...prev,
                customer_name: prev.customer_name || profile.name || '',
                phone: prev.phone || profile.phone || '',
                address: prev.address || profile.address || '',
            }))
        }
    }, [profile, order])

    const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
    const tomorrow = new Date(Date.now() + 864e5).toLocaleDateString('en-CA')

    const handleCopyRekening = () => {
        navigator.clipboard.writeText('4328432928')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const submit = async (e) => {
        e.preventDefault()
        setSaving(true)
        await onSubmit({
            ...f,
            duration_days: Number(f.duration_days),
            package_id: order ? order.package_id : selectedPack?.id,
            package_name: title,
            price_per_day: price,
            payment_method: paymentMethod,
        })
        setSaving(false)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={onClose}>
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                className="fade-up max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto border-2 border-ink bg-paper p-5 sm:p-6 shadow-[6px_6px_0_#1c2a1f]"
                style={{ borderRadius: 4 }}
            >
                <div className="flex items-center justify-between border-b border-line pb-3">
                    <div>
                        <span className="hand text-xs text-leaf font-bold">langganan catering diet</span>
                        <h2 className="font-display text-2xl">{order ? 'Ubah Pesanan' : 'Form Pemesanan Catering'}</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Tutup" className="p-1 hover:text-leaf">
                        <X size={20} />
                    </button>
                </div>

                {/* Bagian Pemilihan Menu Paket / Menu Makanan */}
                {!order && packages.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="label !mb-0">Pilih Menu Paket Makanan</label>
                            <span className="text-xs text-ink/60">{packages.length} menu tersedia</span>
                        </div>

                        {/* Dropdown Cepat */}
                        <select
                            className="input font-bold"
                            value={selectedPack?.id || ''}
                            onChange={(e) => {
                                const found = packages.find((p) => p.id === Number(e.target.value) || p.id === e.target.value)
                                if (found) setSelectedPack(found)
                            }}
                        >
                            {packages.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name} — {p.calories} kkal ({rupiah(p.price_per_day)}/hari)
                                </option>
                            ))}
                        </select>

                        {/* Galeri Pilihan Visual Menu Makanan */}
                        <div className="mt-2 grid grid-cols-2 gap-2 max-h-44 overflow-y-auto border border-line bg-flour/60 p-2 rounded-xs">
                            {packages.map((p) => {
                                const isSelected = selectedPack?.id === p.id
                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSelectedPack(p)}
                                        className={`flex items-center gap-2 p-1.5 rounded-xs text-left border transition ${
                                            isSelected
                                                ? 'border-leaf bg-sage/40 shadow-xs ring-1 ring-leaf'
                                                : 'border-line/60 bg-paper hover:bg-flour'
                                        }`}
                                    >
                                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xs border border-ink bg-sage">
                                            {p.image_url ? (
                                                <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-lg">{p.emoji}</div>
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-xs font-bold text-ink leading-tight">{p.name}</p>
                                            <p className="text-[11px] text-olive font-medium">{p.calories} kkal</p>
                                            <p className="text-[11px] font-bold text-ink/75">{rupiah(p.price_per_day)}</p>
                                        </div>
                                        {isSelected && <Check size={14} className="text-leaf shrink-0 mr-1" />}
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Ringkasan Paket Terpilih */}
                <div className="border-l-4 border-leaf bg-flour p-3 rounded-r-xs flex items-center justify-between gap-2">
                    <div>
                        <p className="font-bold text-ink text-sm sm:text-base">{title}</p>
                        <p className="text-xs text-ink/65">{rupiah(price)} per hari</p>
                    </div>
                    <span className="price-tag !text-sm">{rupiah(price)}/hari</span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="label">Durasi Langganan</label>
                        <select className="input" value={f.duration_days} onChange={set('duration_days')}>
                            {DURATIONS.map((d) => (
                                <option key={d} value={d}>
                                    {d} hari
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Mulai Pengantaran</label>
                        <input
                            type="date"
                            min={tomorrow}
                            required
                            className="input"
                            value={f.start_date}
                            onChange={set('start_date')}
                        />
                    </div>
                </div>

                <div>
                    <label className="label">Nama Pemesan</label>
                    <input required className="input" value={f.customer_name} onChange={set('customer_name')} />
                </div>
                <div>
                    <label className="label">No. WhatsApp</label>
                    <input required type="tel" className="input" value={f.phone} onChange={set('phone')} />
                </div>
                <div>
                    <label className="label">Alamat Pengantaran</label>
                    <textarea required rows="2" className="input" value={f.address} onChange={set('address')} />
                </div>
                <div>
                    <label className="label">Catatan (Alergi / Preferensi Khusus)</label>
                    <textarea rows="2" className="input" placeholder="Contoh: Tanpa bawang bombay, sambal dipisah..." value={f.notes} onChange={set('notes')} />
                </div>

                {/* Pemilihan Metode Pembayaran (Transfer Bank BTN & QRIS) */}
                <div className="space-y-2 border-t border-line pt-3">
                    <label className="label">Metode Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('transfer_bank')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-xs border font-bold text-xs sm:text-sm transition ${
                                paymentMethod === 'transfer_bank'
                                    ? 'border-leaf bg-sage/40 text-leaf ring-1 ring-leaf font-bold'
                                    : 'border-line bg-flour text-ink/75 hover:bg-sage/20'
                            }`}
                        >
                            <Building2 size={16} /> Transfer Bank
                        </button>
                        <button
                            type="button"
                            onClick={() => setPaymentMethod('qris')}
                            className={`flex items-center justify-center gap-2 p-2.5 rounded-xs border font-bold text-xs sm:text-sm transition ${
                                paymentMethod === 'qris'
                                    ? 'border-leaf bg-sage/40 text-leaf ring-1 ring-leaf font-bold'
                                    : 'border-line bg-flour text-ink/75 hover:bg-sage/20'
                            }`}
                        >
                            <QrCode size={16} /> QRIS
                        </button>
                    </div>

                    {/* Tampilan Detail Transfer Bank BTN */}
                    {paymentMethod === 'transfer_bank' && (
                        <div className="fade-up rounded-xs border-2 border-ink bg-flour p-3.5 space-y-2 shadow-[2px_2px_0_var(--color-ink)]">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase text-ink/60">Bank Tujuan</span>
                                <span className="font-bold text-ink text-sm">Bank BTN</span>
                            </div>
                            <div className="flex items-center justify-between bg-paper p-2 border border-line rounded-xs">
                                <div>
                                    <p className="text-[10px] text-ink/60 font-bold uppercase">Nomor Rekening</p>
                                    <p className="font-mono text-base font-bold text-leaf tracking-wider">
                                        4328 4329 28
                                    </p>
                                    <p className="text-[11px] text-ink/70">a.n. FitBox Official</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleCopyRekening}
                                    className="btn btn-ghost !p-2 text-xs border border-ink bg-flour hover:bg-sage"
                                    title="Salin Nomor Rekening"
                                >
                                    {copied ? <Check size={14} className="text-leaf" /> : <Copy size={14} />}
                                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                                </button>
                            </div>
                            <p className="text-[11px] text-ink/65 leading-tight">
                                *Silakan transfer sesuai total tagihan, lalu lakukan konfirmasi pesanan.
                            </p>
                        </div>
                    )}

                    {/* Tampilan Detail Kode QRIS */}
                    {paymentMethod === 'qris' && (
                        <div className="fade-up rounded-xs border-2 border-ink bg-flour p-3.5 space-y-3 text-center shadow-[2px_2px_0_var(--color-ink)]">
                            <div className="flex items-center justify-between border-b border-line pb-2">
                                <span className="text-xs font-bold uppercase text-ink/60">QRIS FitBox Official</span>
                                <span className="border border-ink bg-leaf text-white px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                    NMID: ID1020261115
                                </span>
                            </div>

                            {/* Render QRIS SVG Mockup */}
                            <div className="mx-auto flex h-44 w-44 flex-col items-center justify-center border-2 border-ink bg-white p-2 shadow-xs">
                                <svg viewBox="0 0 100 100" className="h-full w-full">
                                    {/* Border and Finder patterns */}
                                    <rect x="5" y="5" width="26" height="26" fill="#1c2a1f" />
                                    <rect x="8" y="8" width="20" height="20" fill="#ffffff" />
                                    <rect x="12" y="12" width="12" height="12" fill="#2f6b3a" />

                                    <rect x="69" y="5" width="26" height="26" fill="#1c2a1f" />
                                    <rect x="72" y="8" width="20" height="20" fill="#ffffff" />
                                    <rect x="76" y="12" width="12" height="12" fill="#2f6b3a" />

                                    <rect x="5" y="69" width="26" height="26" fill="#1c2a1f" />
                                    <rect x="8" y="72" width="20" height="20" fill="#ffffff" />
                                    <rect x="12" y="76" width="12" height="12" fill="#2f6b3a" />

                                    {/* Data Blocks */}
                                    <rect x="36" y="10" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="48" y="10" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="36" y="24" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="48" y="24" width="8" height="8" fill="#1c2a1f" />

                                    <rect x="10" y="38" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="24" y="38" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="38" y="38" width="24" height="24" fill="#2f6b3a" rx="3" />
                                    <text x="50" y="53" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">FITBOX</text>

                                    <rect x="68" y="38" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="82" y="38" width="8" height="8" fill="#1c2a1f" />

                                    <rect x="36" y="68" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="48" y="68" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="68" y="68" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="82" y="68" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="36" y="82" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="48" y="82" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="68" y="82" width="8" height="8" fill="#1c2a1f" />
                                    <rect x="82" y="82" width="8" height="8" fill="#1c2a1f" />
                                </svg>
                            </div>

                            <p className="text-xs font-bold text-ink">
                                Scan dengan BCA, Mandiri, GoPay, OVO, ShopeePay, atau DANA
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-baseline justify-between border-t border-line pt-3">
                    <span className="text-sm font-bold text-ink/70">Total Biaya ({f.duration_days} hari):</span>
                    <span className="font-display text-2xl font-bold text-leaf">{rupiah(price * Number(f.duration_days))}</span>
                </div>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                        Batal
                    </button>
                    <button disabled={saving} className="btn btn-primary flex-1 shadow-[2.5px_2.5px_0_var(--color-ink)]">
                        {saving ? 'Menyimpan...' : order ? 'Simpan Perubahan' : 'Konfirmasi Pesanan'}
                    </button>
                </div>
            </form>
        </div>
    )
}
