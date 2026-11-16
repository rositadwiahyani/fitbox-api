import { useState, useEffect } from 'react'
import { X, Check, Copy, Building2, QrCode, Plus, Minus, ShoppingBag } from 'lucide-react'
import { DURATIONS } from '../data/seed'
import { rupiah } from '../utils'

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&q=80'

// pack = paket awal, order = pesanan yang sedang diubah, packages = daftar seluruh menu paket
// selectedItems = daftar menu dari keranjang (opsional)
export default function OrderForm({ pack, order, packages = [], profile, onSubmit, onClose, selectedItems = [] }) {

        // Inisialisasi selectedPacks dari keranjang atau dari paket tunggal
        const [selectedPacks, setSelectedPacks] = useState(() => {
            if (order) return []
            if (Array.isArray(selectedItems) && selectedItems.length > 0) {
                // Ambil maks 3 item dari keranjang
                return selectedItems.slice(0, 3).map(it => ({
                    pack: it.package,
                    qty: Math.min(3, it.quantity || 1)
                }))
            }
            if (pack) return [{ pack, qty: 1 }]
            return packages.length > 0 ? [{ pack: packages[0], qty: 1 }] : []
        })

        const [paymentMethod, setPaymentMethod] = useState(order?.payment_method || 'transfer_bank')
        const [copied, setCopied] = useState(false)
        const [saving, setSaving] = useState(false)
        const [f, setF] = useState({
            duration_days: order?.duration_days ?? 1,
            start_date: order?.start_date ?? '',
            customer_name: order?.customer_name || profile?.name || '',
            phone: order?.phone || profile?.phone || '',
            address: order?.address || profile?.address || '',
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

        // Toggle pilih/lepas paket (maks 3)
        const togglePack = (p) => {
            setSelectedPacks(prev => {
                const idx = prev.findIndex(sp => sp.pack.id === p.id)
                if (idx !== -1) {
                    // Lepas pilihan — tapi jangan sampai 0 jika hanya 1 pilihan tersisa
                    if (prev.length === 1) return prev
                    return prev.filter((_, i) => i !== idx)
                }
                if (prev.length >= 3) return prev // sudah maks 3
                return [...prev, { pack: p, qty: 1 }]
            })
        }

        // Update jumlah per paket (1–3)
        const updatePackQty = (packId, delta) => {
            setSelectedPacks(prev => prev.map(sp => {
                if (sp.pack.id !== packId) return sp
                const newQty = Math.max(1, Math.min(3, sp.qty + delta))
                return { ...sp, qty: newQty }
            }))
        }

        // Harga dasar per hari = jumlah (harga × qty) semua paket terpilih
        const totalBasePrice = order
            ? order.price_per_day
            : selectedPacks.reduce((sum, sp) => sum + (Number(sp.pack?.price_per_day) || 0) * sp.qty, 0)

        const grandTotal = totalBasePrice * Number(f.duration_days)

        const handleCopyRekening = () => {
            navigator.clipboard.writeText('4328432928')
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }

        const submit = async (e) => {
            e.preventDefault()
            if (!order && selectedPacks.length === 0) return
            setSaving(true)
            const packageName = order
                ? order.package_name
                : selectedPacks.map(sp => `${sp.pack.name}(×${sp.qty})`).join(', ')
            await onSubmit({
                ...f,
                duration_days: Number(f.duration_days),
                package_id: order ? order.package_id : selectedPacks[0]?.pack?.id,
                package_name: packageName,
                price_per_day: totalBasePrice,
                payment_method: paymentMethod,
                total: grandTotal,
            })
            setSaving(false)
        }

        const isPackSelected = (p) => selectedPacks.some(sp => sp.pack.id === p.id)
        const getPackQty = (p) => selectedPacks.find(sp => sp.pack.id === p.id)?.qty || 0

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={onClose}>
                <form
                    onSubmit={submit}
                    onClick={(e) => e.stopPropagation()}
                    className="fade-up max-h-[92vh] w-full max-w-lg space-y-4 overflow-y-auto border-2 border-ink bg-paper p-5 sm:p-6 shadow-[6px_6px_0_#1c2a1f]"
                    style={{ borderRadius: 4 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-line pb-3">
                        <div>
                            <span className="hand text-xs text-leaf font-bold">langganan catering diet</span>
                            <h2 className="font-display text-2xl">{order ? 'Ubah Pesanan' : 'Form Pemesanan Catering'}</h2>
                        </div>
                        <button type="button" onClick={onClose} aria-label="Tutup" className="p-1 hover:text-leaf">
                            <X size={20} />
                        </button>
                    </div>

                        {/* ===== Galeri Pilihan Menu (hanya untuk pesanan baru) ===== */ }
                {!order && packages.length > 0 && (
                        <div className="space-y-2">
                            {/* Header seksi */}
                            <div className="flex items-center justify-between">
                                <label className="label !mb-0">Pilih Menu Paket Makanan</label>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-ink/60">{packages.length} menu tersedia</span>
                                    {selectedPacks.length >= 3 && (
                                        <span className="text-[10px] font-bold text-brick bg-brick/10 px-1.5 py-0.5 rounded-xs border border-brick/40">
                                            Maks 3 menu
                                        </span>
                                    )}
                                </div>
                            </div>

                        {/* Indikator jumlah terpilih */ }
                                    < div className = "flex items-center gap-1.5" >
                                    {
                                        [1, 2, 3].map(n => (
                                            <div
                                                key={n}
                                                className={`h-1.5 flex-1 rounded-full transition-all ${selectedPacks.length >= n ? 'bg-leaf' : 'bg-line'
                                                    }`}
                                            />
                                        ))
                                    }
                            <span className="text-xs text-ink/60 ml-1 shrink-0">
                                {selectedPacks.length}/3 dipilih
                            </span>
                        </div>

                        {/* Grid Galeri */}
                        <div className="mt-1 grid grid-cols-2 gap-2 max-h-52 overflow-y-auto border border-line bg-flour/60 p-2 rounded-xs pr-1">
                            {packages.map((p) => {
                                const selected = isPackSelected(p)
                                const qty = getPackQty(p)
                                const maxReached = selectedPacks.length >= 3 && !selected

                                return (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => togglePack(p)}
                                        disabled={maxReached}
                                        className={`flex items-center gap-2 p-1.5 rounded-xs text-left border transition relative ${selected
                                                ? 'border-leaf bg-sage/40 shadow-xs ring-1 ring-leaf'
                                                : maxReached
                            ? 'border-line/30 bg-flour/40 opacity-50 cursor-not-allowed'
                            : 'border-line/60 bg-paper hover:bg-flour active:scale-[.98]'
                                        }`}
                                    >
                                        {/* Thumbnail */}
                                <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xs border border-ink bg-sage relative">
                                    <img
                                        src={p.image_url || DEFAULT_FOOD_IMAGE}
                                        alt={p.name}
                                        className="h-full w-full object-cover"
                                        onError={(e) => { e.currentTarget.src = DEFAULT_FOOD_IMAGE }}
                                    />
                                    {/* Badge centang jika terpilih */}
                                    {selected && (
                                        <div className="absolute inset-0 bg-leaf/70 flex items-center justify-center">
                                            <Check size={16} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                {/* Info paket */}
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-xs font-bold text-ink leading-tight">{p.name}</p>
                                    <p className="text-[11px] text-olive font-medium">{p.calories} kkal</p>
                                    <p className="text-[11px] font-bold text-ink/75">{rupiah(p.price_per_day)}</p>
                                </div>
                            </button>
                            )
                            })}
                        </div>

                        {/* Kontrol jumlah per paket terpilih */}
                        {selectedPacks.length > 0 && (
                            <div className="space-y-1.5 mt-1">
                                <p className="text-[11px] font-bold uppercase tracking-wide text-ink/60">Jumlah per Paket</p>
                                {selectedPacks.map(sp => (
                                    <div
                                        key={sp.pack.id}
                                        className="flex items-center justify-between gap-2 bg-sage/20 border border-leaf/50 rounded-xs px-2.5 py-1.5"
                                    >
                                        <span className="text-xs font-bold text-ink truncate flex-1">{sp.pack.name}</span>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => updatePackQty(sp.pack.id, -1)}
                                                disabled={sp.qty <= 1}
                                                className="w-6 h-6 flex items-center justify-center rounded-xs border border-ink bg-paper hover:bg-flour disabled:opacity-30 disabled:cursor-not-allowed transition"
                                            >
                                                <Minus size={11} />
                                            </button>
                                            <span className="text-xs font-bold w-5 text-center">{sp.qty}</span>
                                            <button
                                                type="button"
                                                onClick={() => updatePackQty(sp.pack.id, +1)}
                                                disabled={sp.qty >= 3}
                                                className="w-6 h-6 flex items-center justify-center rounded-xs border border-ink bg-leaf text-white hover:bg-leaf/80 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                            >
                                                <Plus size={11} />
                                            </button>
                                            <span className="text-[11px] text-ink/60 ml-1">
                                                {rupiah(sp.pack.price_per_day * sp.qty)}/hari
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                                        {/* ===== Ringkasan Paket Terpilih ===== */}
                                        <div className="border-l-4 border-leaf bg-flour p-3 rounded-r-xs space-y-1">
                                            {order ? (
                                                <>
                                                    <p className="font-bold text-ink text-sm">{order.package_name}</p>
                                                    <p className="text-xs text-ink/65">{rupiah(order.price_per_day)} per hari</p>
                                                </>
                                            ) : selectedPacks.length > 0 ? (
                                                <>
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            {selectedPacks.map(sp => (
                                                                <div key={sp.pack.id} className="flex justify-between text-xs text-ink/80 leading-snug">
                                                                    <span className="truncate mr-2">{sp.pack.name} ×{sp.qty}</span>
                                                                    <span className="shrink-0 font-medium">{rupiah(sp.pack.price_per_day * sp.qty)}/hari</span>
                                                                </div>
                                                            ))}
                                                            {selectedPacks.length > 1 && (
                                                                <div className="flex justify-between text-xs font-bold text-ink border-t border-line/50 mt-1 pt-1">
                                                                    <span>Total per hari</span>
                                                                    <span>{rupiah(totalBasePrice)}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                <span className="price-tag !text-sm shrink-0">{rupiah(totalBasePrice)}/hari</span>
                                            </div>
                                        </>
                                        ) : (
                                        <p className="text-xs text-ink/50 italic">Belum ada menu dipilih</p>
                    )}
                                    </div>

                {/* Durasi & Tanggal Mulai */ }
                                    < div className = "grid grid-cols-2 gap-3" >
                    <div>
                        <label className="label">Durasi Langganan</label>
                        <select className="input" value={f.duration_days} onChange={set('duration_days')}>
                            {DURATIONS.map((d) => (
                                <option key={d} value={d}>{d} hari</option>
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

                            {/* Data Pemesan */}
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

                            {/* Metode Pembayaran */}
                            <div className="space-y-2 border-t border-line pt-3">
                                <label className="label">Metode Pembayaran</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('transfer_bank')}
                                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xs border font-bold text-xs sm:text-sm transition ${paymentMethod === 'transfer_bank'
                                                    ? 'border-leaf bg-sage/40 text-leaf ring-1 ring-leaf'
                                                    : 'border-line bg-flour text-ink/75 hover:bg-sage/20'
                            }`}
                                    >
                                        <Building2 size={16} /> Transfer Bank
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('qris')}
                                        className={`flex items-center justify-center gap-2 p-2.5 rounded-xs border font-bold text-xs sm:text-sm transition ${paymentMethod === 'qris'
                                                    ? 'border-leaf bg-sage/40 text-leaf ring-1 ring-leaf'
                                                    : 'border-line bg-flour text-ink/75 hover:bg-sage/20'
                            }`}
                                    >
                                        <QrCode size={16} /> QRIS
                                    </button>
                                </div>

                                {/* Detail Transfer Bank BTN */}
                                {paymentMethod === 'transfer_bank' && (
                                    <div className="fade-up rounded-xs border-2 border-ink bg-flour p-3.5 space-y-2 shadow-[2px_2px_0_var(--color-ink)]">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs font-bold uppercase text-ink/60">Bank Tujuan</span>
                                            <span className="font-bold text-ink text-sm">Bank BTN</span>
                                        </div>
                                        <div className="flex items-center justify-between bg-paper p-2 border border-line rounded-xs">
                                            <div>
                                                <p className="text-[10px] text-ink/60 font-bold uppercase">Nomor Rekening</p>
                                                <p className="font-mono text-base font-bold text-leaf tracking-wider">4328 4329 28</p>
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

                                {/* Detail QRIS */}
                                {paymentMethod === 'qris' && (
                                    <div className="fade-up rounded-xs border-2 border-ink bg-flour p-3.5 space-y-3 text-center shadow-[2px_2px_0_var(--color-ink)]">
                                        <div className="flex items-center justify-between border-b border-line pb-2">
                                            <span className="text-xs font-bold uppercase text-ink/60">QRIS FitBox Official</span>
                                            <span className="border border-ink bg-leaf text-white px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase">
                                                NMID: ID1020261115
                                            </span>
                                        </div>
                                        <div className="mx-auto flex h-44 w-44 flex-col items-center justify-center border-2 border-ink bg-white p-2 shadow-xs">
                                            <svg viewBox="0 0 100 100" className="h-full w-full">
                                                <rect x="5" y="5" width="26" height="26" fill="#1c2a1f" />
                                                <rect x="8" y="8" width="20" height="20" fill="#ffffff" />
                                                <rect x="12" y="12" width="12" height="12" fill="#2f6b3a" />
                                                <rect x="69" y="5" width="26" height="26" fill="#1c2a1f" />
                                                <rect x="72" y="8" width="20" height="20" fill="#ffffff" />
                                                <rect x="76" y="12" width="12" height="12" fill="#2f6b3a" />
                                                <rect x="5" y="69" width="26" height="26" fill="#1c2a1f" />
                                                <rect x="8" y="72" width="20" height="20" fill="#ffffff" />
                                                <rect x="12" y="76" width="12" height="12" fill="#2f6b3a" />
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

                            {/* Total Biaya */}
                            <div className="flex items-baseline justify-between border-t border-line pt-3">
                                <div>
                                    <span className="text-sm font-bold text-ink/70">Total Biaya ({f.duration_days} hari):</span>
                                    {!order && selectedPacks.length > 1 && (
                                        <p className="text-[11px] text-ink/50">
                                            {rupiah(totalBasePrice)}/hari × {f.duration_days} hari
                                        </p>
                                    )}
                                </div>
                                <span className="font-display text-2xl font-bold text-leaf">{rupiah(grandTotal)}</span>
                            </div>

                            {/* Tombol Aksi */}
                            <div className="flex gap-3 pt-2">
                                <button type="button" onClick={onClose} className="btn btn-ghost flex-1">
                                    Batal
                                </button>
                                    <button
                                        disabled={saving || (!order && selectedPacks.length === 0)}
                                        className="btn btn-primary flex-1 shadow-[2.5px_2.5px_0_var(--color-ink)]"
                                    >
                                        {saving ? 'Menyimpan...' : order ? 'Simpan Perubahan' : 'Konfirmasi Pesanan'}
                                    </button>
                            </div>
                        </form>
        </div>
        )
    }
