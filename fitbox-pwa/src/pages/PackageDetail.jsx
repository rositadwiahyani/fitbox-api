import { useState } from 'react'
import { ArrowLeft, ShoppingBag, Heart, Flame, ShieldCheck, Sparkles, Utensils, CheckCircle2 } from 'lucide-react'
import { GOALS } from '../data/seed'
import { rupiah } from '../utils'

const DEFAULT_FOOD_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'

export default function PackageDetail({
    pack,
    onBack,
    onOrder,
    onAddToCart,
    onToggleFavorite,
    isFavorite = false,
}) {
    const [imgError, setImgError] = useState(false)
    const imageUrl = pack?.image_url || DEFAULT_FOOD_IMAGE

    const handleImgError = (e) => {
        if (e.currentTarget.src !== DEFAULT_FOOD_IMAGE) {
            e.currentTarget.src = DEFAULT_FOOD_IMAGE
        } else {
            setImgError(true)
        }
    }

    if (!pack) {
        return (
            <div className="py-20 text-center">
                <p className="text-lg">Paket ini sudah tidak tersedia.</p>
                <button onClick={onBack} className="btn btn-primary mt-5">
                    Kembali
                </button>
            </div>
        )
    }

    const meals = (pack.menu_sample || '').split('\n').filter(Boolean)
    const highlights = pack.highlights || [
        '100% Bahan Alami Segar Tanpa Pengawet',
        'Rendah Garam & Bebas Minyak Trans',
        'Dimasak Segar Setiap Subuh Hari',
        'Wadah Food-Grade & Microwave Safe',
    ]

    return (
        <div className="fade-up space-y-10">
            {/* Tombol Navigasi Kembali */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 font-bold text-ink/75 hover:text-leaf transition"
            >
                <ArrowLeft size={18} /> Kembali ke daftar paket
            </button>

            {/* Bagian Hero Detail Paket */}
            <div className="grid gap-8 md:grid-cols-12 md:items-start">
                {/* Visual Foto Makanan Berkualitas Tinggi */}
                <div className="md:col-span-6">
                    <div
                        className="relative aspect-[4/3] w-full overflow-hidden border-2 border-ink bg-sage shadow-[6px_6px_0_var(--color-ink)]"
                        style={{ borderRadius: 4 }}
                    >
                        {!imgError ? (
                            <img
                                src={imageUrl}
                                alt={pack.name}
                                onError={handleImgError}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center bg-sage p-4 text-center">
                                <span className="text-6xl mb-2">{pack.emoji || '🥗'}</span>
                                <span className="text-sm font-bold text-ink/75 font-display">{pack.name}</span>
                            </div>
                        )}

                        <div className="absolute top-3 left-3">
                            <span className="border border-ink bg-flour/95 px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-ink shadow-[2px_2px_0_var(--color-ink)]">
                                {GOALS[pack.goal] || pack.goal}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Utama & Deskripsi Paket */}
                <div className="md:col-span-6 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="hand text-base text-leaf font-bold">menu diet terkurasi</span>
                        </div>
                        <h1 className="mt-1 font-display text-3xl sm:text-4xl leading-tight text-ink">
                            {pack.name}
                        </h1>

                        <div className="mt-4 flex flex-wrap items-baseline gap-3">
                            <span className="price-tag !text-xl">{rupiah(pack.price_per_day)}/hari</span>
                            <span className="hand text-lg text-olive font-bold">
                                {pack.calories} kkal · {pack.protein || 40}g protein per hari
                            </span>
                        </div>

                        {/* Deskripsi Lengkap Paket */}
                        <div className="mt-5 border-t border-b border-line py-4">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
                                Tentang Paket Makanan Ini
                            </h3>
                            <p className="text-base text-ink/85 leading-relaxed">
                                {pack.description ||
                                    'Menu sehat bernutrisi seimbang yang diolah dari bahan segar pilihan, rendah sodium, dan dimasak tanpa bahan pengawet.'}
                            </p>
                        </div>

                        {/* Kartu Rincian Makronutrisi */}
                        <div className="mt-5 grid grid-cols-4 gap-2 text-center">
                            <div className="border border-line bg-flour p-2 rounded-xs">
                                <span className="block text-[11px] font-bold text-ink/60 uppercase">Kalori</span>
                                <span className="text-base font-bold text-ink font-display">{pack.calories}</span>
                                <span className="text-[10px] text-ink/60 block">kkal</span>
                            </div>
                            <div className="border border-line bg-flour p-2 rounded-xs">
                                <span className="block text-[11px] font-bold text-ink/60 uppercase">Protein</span>
                                <span className="text-base font-bold text-leaf font-display">{pack.protein || 40}</span>
                                <span className="text-[10px] text-ink/60 block">gram</span>
                            </div>
                            <div className="border border-line bg-flour p-2 rounded-xs">
                                <span className="block text-[11px] font-bold text-ink/60 uppercase">Karbo</span>
                                <span className="text-base font-bold text-olive font-display">{pack.carbs || 38}</span>
                                <span className="text-[10px] text-ink/60 block">gram</span>
                            </div>
                            <div className="border border-line bg-flour p-2 rounded-xs">
                                <span className="block text-[11px] font-bold text-ink/60 uppercase">Lemak Baik</span>
                                <span className="text-base font-bold text-ink font-display">{pack.fats || 12}</span>
                                <span className="text-[10px] text-ink/60 block">gram</span>
                            </div>
                        </div>
                    </div>

                    {/* Tombol Aksi: Keranjang, Favorit & Pesan Sekarang */}
                    <div className="mt-6 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={() => onAddToCart?.(pack)}
                            className="btn btn-primary px-5 py-2.5 text-base flex-1 min-w-[150px] shadow-[3px_3px_0_var(--color-ink)]"
                        >
                            <ShoppingBag size={18} /> + Ke Keranjang
                        </button>

                        <button
                            type="button"
                            onClick={() => onToggleFavorite?.(pack)}
                            className={`btn px-4 py-2.5 text-base border-1.5 border-ink transition ${
                                isFavorite
                                    ? 'bg-brick/15 text-brick border-brick shadow-[2px_2px_0_var(--color-brick)]'
                                    : 'bg-flour text-ink shadow-[2px_2px_0_var(--color-ink)] hover:bg-sage/40'
                            }`}
                            title={isFavorite ? 'Hapus dari favorit' : 'Simpan favorit'}
                        >
                            <Heart size={18} className={isFavorite ? 'fill-brick text-brick' : 'text-ink/70'} />
                            <span>{isFavorite ? 'Favorit' : 'Favorit'}</span>
                        </button>

                        {onOrder && (
                            <button
                                type="button"
                                onClick={() => {
                                    if (typeof navigator !== 'undefined' && !navigator.onLine) {
                                        alert('Tidak dapat melakukan pemesanan saat offline. Pastikan perangkat Anda tersambung ke internet.')
                                        return
                                    }
                                    onOrder(pack)
                                }}
                                className="btn border-1.5 border-ink bg-sage px-5 py-2.5 text-base text-ink font-bold shadow-[2px_2px_0_var(--color-ink)] hover:bg-sage/80"
                            >
                                Pesan Langganan
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Keunggulan & Jaminan Higienis */}
            <section className="rounded border-2 border-ink bg-flour p-6 shadow-[4px_4px_0_var(--color-ink)]">
                <h3 className="font-display text-xl mb-4 flex items-center gap-2 text-ink">
                    <ShieldCheck className="text-leaf" size={22} /> Standar Kualitas Dapur FitBox
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                    {highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-sm text-ink/80">
                            <CheckCircle2 size={18} className="text-leaf shrink-0 mt-0.5" />
                            <span>{h}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bagian Jadwal Menu Harian */}
            <section>
                <div className="mb-4 border-b border-line pb-2 flex items-baseline justify-between">
                    <h2 className="text-2xl font-display">Jadwal Menu Harian</h2>
                    <span className="hand text-sm text-leaf">variasi menu setiap hari</span>
                </div>
                {meals.length ? (
                    <div className="grid gap-3 sm:grid-cols-3">
                        {meals.map((m, idx) => {
                            const [time, ...rest] = m.split(':')
                            return (
                                <div
                                    key={idx}
                                    className="border-2 border-ink bg-paper p-4 rounded-xs shadow-[3px_3px_0_var(--color-ink)]"
                                >
                                    <div className="flex items-center gap-1.5 text-leaf font-bold text-xs uppercase tracking-wider mb-1.5">
                                        <Utensils size={14} />
                                        <span>{time || `Waktu Makan ${idx + 1}`}</span>
                                    </div>
                                    <p className="text-sm text-ink/80 leading-relaxed font-medium">
                                        {rest.join(':').trim() || m}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p className="text-ink/60">Jadwal menu harian sedang disiapkan oleh tim koki.</p>
                )}
            </section>
        </div>
    )
}
