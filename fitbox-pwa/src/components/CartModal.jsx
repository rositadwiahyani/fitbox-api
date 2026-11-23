import { useState, useEffect } from 'react'
import { X, Trash2, ArrowRight, ShoppingBag, Plus, Minus, CheckSquare, Square } from 'lucide-react'
import { rupiah } from '../utils'

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'

export default function CartModal({
    cart = [],
    onRemove,
    onClear,
    onCheckout,
    onClose,
    onUpdateQuantity,
    onOfflineAlert,
}) {
    // Set ID item yang dicentang / dipilih untuk dipesan
    const [selectedIds, setSelectedIds] = useState(() => new Set(cart.map((item) => item.id)))

    // Sinkronkan pilihan saat isi keranjang berubah
    useEffect(() => {
        setSelectedIds((prev) => {
            const next = new Set()
            cart.forEach((item) => {
                // Pertahankan pilihan sebelumnya jika ada, atau centang secara default
                if (prev.has(item.id) || prev.size === 0) {
                    next.add(item.id)
                }
            })
            // Jika sebelumnya kosong tapi ada cart baru, pilih semua
            if (next.size === 0 && cart.length > 0) {
                cart.forEach((item) => next.add(item.id))
            }
            return next
        })
    }, [cart.length])

    const toggleSelect = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const allSelected = cart.length > 0 && cart.every((item) => selectedIds.has(item.id))
    const toggleSelectAll = () => {
        if (allSelected) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(cart.map((item) => item.id)))
        }
    }

    // Filter hanya item yang dicentang untuk perhitungan dan checkout
    const selectedItems = cart.filter((item) => selectedIds.has(item.id))

    // Perhitungan harga yang benar dan manusiawi: harga per menu x porsi
    const totalAmount = selectedItems.reduce((sum, item) => {
        const price = Number(item.package.price_per_day) || 35000
        const qty = Number(item.quantity) || 1
        return sum + price * qty
    }, 0)

    const handleCheckout = () => {
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            const msg = 'Tidak dapat checkout keranjang saat offline. Pastikan perangkat Anda tersambung ke internet.'
            if (onOfflineAlert) onOfflineAlert(msg)
            else alert(msg)
            return
        }
        if (selectedItems.length === 0) return
        // Kirim paket pertama yang dipilih dan seluruh array paket terpilih
        onCheckout(selectedItems[0].package, selectedItems)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="fade-up max-h-[88vh] w-full max-w-lg space-y-4 overflow-y-auto border-2 border-ink bg-paper p-5 sm:p-6 shadow-[6px_6px_0_#1c2a1f]"
                style={{ borderRadius: 4 }}
            >
                {/* Header Modal */}
                <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-leaf" />
                        <div>
                            <h2 className="font-display text-2xl text-ink leading-tight">Keranjang Pesanan</h2>
                            <span className="hand text-xs text-leaf">pilih menu yang ingin di-checkout</span>
                        </div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Tutup" className="p-1 hover:text-leaf transition">
                        <X size={20} />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="py-12 text-center space-y-3">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sage/50 text-leaf">
                            <ShoppingBag size={24} />
                        </div>
                        <p className="text-ink font-display text-lg">Keranjang belanja masih kosong</p>
                        <p className="text-xs text-ink/60 max-w-xs mx-auto">
                            Pilih menu catering sehat favoritmu lalu klik tombol "+ Keranjang" pada katalog.
                        </p>
                        <button type="button" onClick={onClose} className="btn btn-primary mt-2">
                            Mulai Pilih Paket
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Baris Pilih Semua */}
                        <div className="flex items-center justify-between border-b border-line pb-2.5 px-1">
                            <button
                                type="button"
                                onClick={toggleSelectAll}
                                className="inline-flex items-center gap-2 text-xs font-bold text-ink hover:text-leaf transition"
                            >
                                {allSelected ? (
                                    <CheckSquare size={18} className="text-leaf" />
                                ) : (
                                    <Square size={18} className="text-ink/40" />
                                )}
                                <span>Pilih Semua ({cart.length} item)</span>
                            </button>
                            <span className="text-xs text-ink/60 font-bold">
                                {selectedItems.length} dari {cart.length} dipilih
                            </span>
                        </div>

                        {/* Daftar Item Keranjang */}
                        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                            {cart.map((item) => {
                                const isChecked = selectedIds.has(item.id)
                                const unitPrice = Number(item.package.price_per_day) || 35000
                                const qty = Number(item.quantity) || 1
                                const subtotal = unitPrice * qty
                                const imgUrl = item.package.image_url || DEFAULT_FOOD_IMAGE

                                return (
                                    <div
                                        key={item.id}
                                        className={`flex items-center gap-3 border-2 p-3 transition rounded-xs ${
                                            isChecked
                                                ? 'border-leaf bg-flour shadow-[2px_2px_0_var(--color-leaf)]'
                                                : 'border-line/70 bg-paper/60 opacity-75'
                                        }`}
                                    >
                                        {/* Checkbox untuk Memilih Menu */}
                                        <button
                                            type="button"
                                            onClick={() => toggleSelect(item.id)}
                                            className="shrink-0 p-0.5 hover:text-leaf transition"
                                            title={isChecked ? 'Batal pilih' : 'Pilih menu ini'}
                                        >
                                            {isChecked ? (
                                                <CheckSquare size={20} className="text-leaf" />
                                            ) : (
                                                <Square size={20} className="text-ink/40" />
                                            )}
                                        </button>

                                        {/* Foto Makanan */}
                                        <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xs border border-ink bg-sage">
                                            <img
                                                src={imgUrl}
                                                alt={item.package.name}
                                                onError={(e) => {
                                                    if (e.currentTarget.src !== DEFAULT_FOOD_IMAGE) {
                                                        e.currentTarget.src = DEFAULT_FOOD_IMAGE
                                                    }
                                                }}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>

                                        {/* Informasi Menu & Harga */}
                                        <div className="min-w-0 flex-1">
                                            <p className="font-bold text-sm text-ink truncate leading-tight">
                                                {item.package.name}
                                            </p>
                                            <p className="text-xs text-ink/65 mt-0.5">
                                                {rupiah(unitPrice)} <span className="text-[11px] text-ink/50">/ porsi</span>
                                            </p>
                                            <p className="text-xs font-bold text-leaf font-display mt-1">
                                                Subtotal: {rupiah(subtotal)}
                                            </p>
                                        </div>

                                        {/* Pengatur Jumlah Porsi (+ / -) */}
                                        <div className="flex items-center border border-ink bg-paper rounded-xs shadow-xs">
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity?.(item.id, -1)}
                                                className="px-1.5 py-1 text-ink/70 hover:bg-flour hover:text-ink active:scale-90 transition"
                                                title="Kurangi porsi"
                                            >
                                                <Minus size={13} />
                                            </button>
                                            <span className="px-2 text-xs font-bold text-ink font-display min-w-[20px] text-center">
                                                {qty}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => onUpdateQuantity?.(item.id, 1)}
                                                className="px-1.5 py-1 text-ink/70 hover:bg-flour hover:text-ink active:scale-90 transition"
                                                title="Tambah porsi"
                                            >
                                                <Plus size={13} />
                                            </button>
                                        </div>

                                        {/* Tombol Hapus */}
                                        <button
                                            type="button"
                                            onClick={() => onRemove(item.package.id)}
                                            className="text-ink/40 hover:text-brick p-1 transition"
                                            title="Hapus dari keranjang"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Rincian Total Pembayaran Manusiawi */}
                        <div className="border-t-2 border-dashed border-line pt-3.5 space-y-1.5">
                            <div className="flex items-baseline justify-between text-xs text-ink/65">
                                <span>Menu yang Dipilih:</span>
                                <span className="font-bold text-ink">{selectedItems.length} menu</span>
                            </div>
                            <div className="flex items-baseline justify-between">
                                <div>
                                    <span className="text-sm font-bold text-ink">Total Pembayaran:</span>
                                    <p className="text-[11px] text-ink/50">Harga sudah termasuk takaran gizi & packaging</p>
                                </div>
                                <span className="font-display text-2xl text-leaf font-bold">
                                    {rupiah(totalAmount)}
                                </span>
                            </div>
                        </div>

                        {/* Tombol Navigasi Checkout */}
                        <div className="flex gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-ghost flex-1 text-sm border border-line hover:border-ink"
                            >
                                Lanjut Belanja
                            </button>
                            <button
                                type="button"
                                disabled={selectedItems.length === 0}
                                onClick={handleCheckout}
                                className="btn btn-primary flex-1 text-sm shadow-[3px_3px_0_var(--color-ink)] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Checkout ({selectedItems.length}) <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
