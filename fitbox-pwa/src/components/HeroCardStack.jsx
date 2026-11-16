import { useState } from 'react'
import { Sparkles, ArrowRight, Flame, Heart } from 'lucide-react'
import { rupiah } from '../utils'

// Potongan selotip masking tape retro seperti di desain referensi
function MaskingTape({ className = '' }) {
    return (
        <div
            className={`pointer-events-none absolute -top-3 left-1/2 z-30 h-5 w-16 -translate-x-1/2 border-y border-white/50 bg-[#e4dbc7]/90 shadow-xs backdrop-blur-[1px] ${className}`}
            style={{
                clipPath: 'polygon(1% 0%, 99% 2%, 98% 98%, 2% 96%)',
            }}
        />
    )
}

const DEFAULT_CARDS = [
    {
        id: 1,
        name: 'Herb Rosemary Chicken Bowl',
        category: 'Tinggi Protein',
        badge: '💪 Otot & Energi',
        badgeColor: 'bg-leaf text-white',
        calories: 480,
        price_per_day: 45000,
        desc: 'Dada ayam panggang rosemary empuk, tumis asparagus & quinoa hangat.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=700&q=80',
        emoji: '🍗',
        rotate: '-rotate-6',
        hoverRotate: 'group-hover/card:-rotate-3',
        floatClass: 'animate-float',
        zIndex: 10,
        offset: 'translate-x-0 -translate-y-3 sm:-translate-x-5',
    },
    {
        id: 2,
        name: 'Salmon Green Goddess',
        category: 'Omega & Lemak Baik',
        badge: '🥑 Nutrisi Otak',
        badgeColor: 'bg-sage text-ink',
        calories: 520,
        price_per_day: 55000,
        desc: 'Pan-seared Atlantic salmon, alpukat mentega, edamame & nasi cokelat.',
        image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80',
        emoji: '🐟',
        rotate: 'rotate-4',
        hoverRotate: 'group-hover/card:rotate-2',
        floatClass: 'animate-float-reverse',
        zIndex: 15,
        offset: 'translate-x-5 -translate-y-1 sm:translate-x-8',
    },
    {
        id: 3,
        name: 'Garden Harvest Plant Box',
        category: 'Clean & Serat Tinggi',
        badge: '🌱 100% Organik',
        badgeColor: 'bg-olive text-white',
        calories: 390,
        price_per_day: 40000,
        desc: 'Tahu wijen panggang renyah, ubi madu oven & aneka sayur segar subuh.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=700&q=80',
        emoji: '🥗',
        rotate: '-rotate-2',
        hoverRotate: 'group-hover/card:rotate-0',
        floatClass: 'animate-float',
        zIndex: 20,
        offset: 'translate-x-1 translate-y-7 sm:translate-x-2 sm:translate-y-9',
    },
]

export default function HeroCardStack({ packages = [], onOpen, onNavigate }) {
    const [activeIndex, setActiveIndex] = useState(2) // Kartu depan default
    const [imgErrors, setImgErrors] = useState({})

    // Hubungkan dengan paket nyata jika tersedia
    const cards = DEFAULT_CARDS.map((card, idx) => {
        const pkg = packages[idx]
        if (!pkg) return card
        return {
            ...card,
            packageId: pkg.id,
            name: pkg.name || card.name,
            calories: pkg.calories || card.calories,
            price_per_day: pkg.price_per_day || card.price_per_day,
            emoji: pkg.emoji || card.emoji,
            desc: pkg.description || card.desc,
            image: pkg.image_url || card.image,
        }
    })

    const handleSelectCard = (index, card) => {
        setActiveIndex(index)
    }

    const handleCardAction = (card) => {
        if (card.packageId && onOpen) {
            onOpen(card.packageId)
        } else if (onNavigate) {
            onNavigate('packages')
        }
    }

    return (
        <div className="relative mx-auto flex w-full max-w-md flex-col items-center justify-center lg:max-w-none">
            {/* Area Tumpukan 3 Kartu Animatif */}
            <div className="relative h-[380px] w-full max-w-[340px] sm:h-[430px] sm:max-w-[390px]">
                {cards.map((card, index) => {
                    const isActive = activeIndex === index
                    const hasError = imgErrors[card.id]

                    // Dynamic z-index and styles based on active state
                    const zStyle = isActive ? 30 : card.zIndex
                    const transformClass = isActive
                        ? 'scale-105 rotate-0 z-30 shadow-[6px_6px_0_var(--color-ink)]'
                        : `${card.rotate} ${card.floatClass} hover:scale-102 hover:rotate-0 hover:z-25 shadow-[4px_4px_0_var(--color-ink)]`

                    return (
                        <div
                            key={card.id}
                            onClick={() => handleSelectCard(index, card)}
                            className={`group/card absolute inset-x-0 top-0 cursor-pointer rounded-xs border-2 border-ink bg-flour p-3 transition-all duration-300 ease-out select-none ${card.offset} ${transformClass}`}
                            style={{ zIndex: zStyle }}
                        >
                            {/* Selotip Masking Tape di atas kartu */}
                            <MaskingTape className={isActive ? 'bg-[#ebdcb9]' : ''} />

                            {/* Foto Makanan bergaya Vintage Print */}
                            <div className="relative aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-sage/40">
                                {!hasError ? (
                                    <img
                                        src={card.image}
                                        alt={card.name}
                                        onError={() => setImgErrors((prev) => ({ ...prev, [card.id]: true }))}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-sage text-6xl">
                                        {card.emoji}
                                    </div>
                                )}

                                {/* Badge Kategori / Label di sudut foto */}
                                <div className="absolute top-2.5 left-2.5">
                                    <span
                                        className={`inline-flex items-center gap-1 border border-ink px-2 py-0.5 text-[11px] font-bold tracking-wider uppercase shadow-[1.5px_1.5px_0_var(--color-ink)] ${card.badgeColor}`}
                                    >
                                        {card.badge}
                                    </span>
                                </div>

                                {/* Kalori Chip */}
                                <div className="absolute right-2.5 bottom-2.5">
                                    <span className="inline-flex items-center gap-1 border border-ink bg-flour/95 px-2 py-0.5 text-xs font-bold text-ink shadow-[1.5px_1.5px_0_var(--color-ink)]">
                                        <Flame size={12} className="text-leaf" />
                                        {card.calories} kkal
                                    </span>
                                </div>
                            </div>

                            {/* Info & Deskripsi Kartu */}
                            <div className="mt-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <h4 className="font-display text-base font-bold text-ink leading-tight sm:text-lg">
                                            {card.name}
                                        </h4>
                                        <p className="mt-1 line-clamp-1 text-xs text-ink/70">
                                            {card.desc}
                                        </p>
                                    </div>
                                    <span className="price-tag shrink-0 text-xs sm:text-sm">
                                        {rupiah(card.price_per_day)}
                                    </span>
                                </div>

                                {/* Tombol interaksi saat kartu aktif */}
                                <div className="mt-2.5 flex items-center justify-between border-t border-dashed border-line/80 pt-2 text-xs">
                                    <span className="hand text-xs text-leaf font-bold">
                                        {isActive ? '✨ Pilihan utama' : 'Klik untuk buka'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleCardAction(card)
                                        }}
                                        className="inline-flex items-center gap-1 font-bold text-ink underline decoration-leaf decoration-2 underline-offset-3 hover:text-leaf"
                                    >
                                        Detail menu <ArrowRight size={13} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
