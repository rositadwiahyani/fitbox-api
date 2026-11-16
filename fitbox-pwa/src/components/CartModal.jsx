import { X, Trash2, ArrowRight, ShoppingBag } from 'lucide-react'
import { rupiah } from '../utils'

export default function CartModal({ cart = [], onRemove, onClear, onCheckout, onClose }) {
    const totalAmount = cart.reduce((sum, item) => sum + (item.package.price_per_day * (item.quantity || 1) * (item.duration_days || 7)), 0)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/55 p-4" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="fade-up max-h-[85vh] w-full max-w-md space-y-4 overflow-y-auto border-2 border-ink bg-paper p-5 sm:p-6 shadow-[6px_6px_0_#1c2a1f]"
                style={{ borderRadius: 4 }}
            >
                <div className="flex items-center justify-between border-b border-line pb-3">
                    <div className="flex items-center gap-2">
                        <ShoppingBag size={20} className="text-leaf" />
                        <h2 className="font-display text-2xl">Keranjang Menu</h2>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Tutup" className="p-1 hover:text-leaf">
                        <X size={20} />
                    </button>
                </div>

                {cart.length === 0 ? (
                    <div className="py-10 text-center space-y-3">
                        <p className="text-ink/65 text-base">Keranjang belanja masih kosong.</p>
                        <p className="text-xs text-ink/50">Pilih menu sehat favoritmu lalu klik "+ Keranjang".</p>
                        <button type="button" onClick={onClose} className="btn btn-primary mt-2">
                            Mulai Pilih Paket
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                            {cart.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 border border-line bg-flour p-2.5 rounded-xs"
                                >
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xs border border-ink bg-sage">
                                        {item.package.image_url ? (
                                            <img
                                                src={item.package.image_url}
                                                alt={item.package.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center text-xl">
                                                {item.package.emoji || '🥗'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="font-bold text-sm text-ink truncate">{item.package.name}</p>
                                        <p className="text-xs text-ink/70">
                                            {rupiah(item.package.price_per_day)}/hari ({item.quantity} porsi)
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => onRemove(item.package.id)}
                                        className="text-ink/40 hover:text-brick p-1"
                                        title="Hapus dari keranjang"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-line pt-3 flex items-baseline justify-between">
                            <span className="text-sm font-bold text-ink/70">Estimasi Langganan:</span>
                            <span className="font-display text-xl text-leaf font-bold">{rupiah(totalAmount)}</span>
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn btn-ghost flex-1 text-sm"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (cart.length > 0) {
                                        onCheckout(cart[0].package)
                                    }
                                }}
                                className="btn btn-primary flex-1 text-sm shadow-[2px_2px_0_var(--color-ink)]"
                            >
                                Pesan Sekarang <ArrowRight size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
