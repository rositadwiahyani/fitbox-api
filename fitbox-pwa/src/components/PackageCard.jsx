import { useState } from 'react'
import { Heart, ShoppingBag, Flame } from 'lucide-react'
import { GOALS } from '../data/seed'
import { rupiah } from '../utils'

export default function PackageCard({
    pack,
    index = 0,
    onOpen,
    onAddToCart,
    onToggleFavorite,
    isFavorite = false,
}) {
    const [imgError, setImgError] = useState(false)

    return (
        <article
            className="group fade-up flex flex-col justify-between border-2 border-ink bg-flour p-3.5 transition-all duration-200 hover:-translate-y-1 hover:shadow-[5px_5px_0_var(--color-ink)]"
            style={{ borderRadius: 4, animationDelay: `${Math.min(index, 8) * 45}ms` }}
        >
            <div>
                {/* Visual Foto Menu Makanan yang Sesuai */}
                <div
                    onClick={() => onOpen?.(pack.id)}
                    className="relative flex aspect-[4/3] w-full cursor-pointer items-center justify-center overflow-hidden border-2 border-ink bg-sage/50"
                    style={{ borderRadius: 3 }}
                >
                    {pack.image_url && !imgError ? (
                        <img
                            src={pack.image_url}
                            alt={pack.name}
                            onError={() => setImgError(true)}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-sage text-6xl">
                            {pack.emoji || '🥗'}
                        </div>
                    )}

                    {/* Badge Tujuan / Goal Diet */}
                    <div className="absolute left-2.5 top-2.5">
                        <span className="border border-ink bg-flour/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink shadow-[1.5px_1.5px_0_var(--color-ink)]">
                            {GOALS[pack.goal] || pack.goal}
                        </span>
                    </div>

                    {/* Badge Kalori di sudut foto */}
                    <div className="absolute bottom-2.5 right-2.5">
                        <span className="inline-flex items-center gap-1 border border-ink bg-flour/95 px-2 py-0.5 text-xs font-bold text-ink shadow-[1.5px_1.5px_0_var(--color-ink)]">
                            <Flame size={12} className="text-leaf" />
                            {pack.calories} kkal
                        </span>
                    </div>
                </div>

                {/* Info Paket */}
                <div className="mt-3.5">
                    <button onClick={() => onOpen?.(pack.id)} className="text-left w-full">
                        <h3 className="font-display text-xl font-bold leading-tight text-ink decoration-leaf decoration-2 underline-offset-4 hover:underline">
                            {pack.name}
                        </h3>
                    </button>

                    <div className="mt-1 flex items-center gap-2 text-xs font-bold text-olive">
                        <span>{pack.protein ? `${pack.protein}g protein` : ''}</span>
                        {pack.carbs && <span>• {pack.carbs}g karbo</span>}
                    </div>

                    <p className="mt-2 line-clamp-2 text-xs text-ink/75 leading-relaxed">
                        {pack.description || 'Paket catering sehat dengan gizi terukur dan bahan segar pilihan.'}
                    </p>
                </div>
            </div>

            {/* Bagian Bawah: Harga & Fitur Keranjang + Favorit (Menggantikan Pesan, Edit, Hapus) */}
            <div className="mt-4 pt-3 border-t border-dashed border-line">
                <div className="flex items-center justify-between mb-3">
                    <span className="price-tag !text-sm">{rupiah(pack.price_per_day)}/hari</span>
                    <span className="hand text-xs text-leaf font-bold">Menu subuh segar</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Fitur Favorit */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onToggleFavorite?.(pack)
                        }}
                        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold border-1.5 border-ink rounded-xs transition active:translate-y-0.5 ${
                            isFavorite
                                ? 'bg-brick/15 text-brick border-brick shadow-[1.5px_1.5px_0_var(--color-brick)]'
                                : 'bg-flour text-ink/75 hover:bg-sage/40 hover:text-ink shadow-[1.5px_1.5px_0_var(--color-ink)]'
                        }`}
                        title={isFavorite ? 'Hapus dari favorit' : 'Tambah ke favorit'}
                        aria-label="Favorit"
                    >
                        <Heart
                            size={16}
                            className={isFavorite ? 'fill-brick text-brick' : 'text-ink/65'}
                        />
                        <span>{isFavorite ? 'Favorit' : 'Favorit'}</span>
                    </button>

                    {/* Fitur Keranjang */}
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            onAddToCart?.(pack)
                        }}
                        className="btn btn-primary !px-3 !py-1.5 text-xs flex-1 justify-center gap-1.5 shadow-[2px_2px_0_var(--color-ink)] active:shadow-none"
                    >
                        <ShoppingBag size={15} /> + Keranjang
                    </button>
                </div>
            </div>
        </article>
    )
}
