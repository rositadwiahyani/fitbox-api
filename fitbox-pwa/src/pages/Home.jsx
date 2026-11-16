import { ArrowRight, CheckCircle2 } from 'lucide-react'
import PackageCard from '../components/PackageCard'
import HeroCardStack from '../components/HeroCardStack'

const STEPS = [
    ['1', 'Hitung kalori', 'Isi data tubuhmu di halaman Kalori untuk tahu kebutuhan harian.'],
    ['2', 'Pilih paket', 'Pilih paket menu lezat yang sesuai target defisit atau surplusmu.'],
    ['3', 'Pesan & Nikmati', 'Tentukan durasi berlangganan (1 - 30 hari), kami antar tepat waktu.'],
]

export default function Home({ packages, onNavigate, onOpen, onAddToCart, onToggleFavorite, isFavorite = () => false }) {
    return (
        <div className="space-y-16">
            {/* Hero Section bergaya editorial referensi dengan 3 Card Animatif di sebelah kanan */}
            <section className="fade-up border-b border-line pb-12 pt-2">
                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
                    {/* Sisi Kiri: Headline Editorial & CTA bergaya Desain Referensi */}
                    <div className="lg:col-span-7">
                        <p className="hand text-xl text-leaf sm:text-2xl">
                            sehat, segar & lezat setiap hari
                        </p>
                        
                        <h1 className="mt-2 text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.12] text-ink tracking-tight font-display">
                            Menu sehat lezat yang dimasak segar setiap subuh.
                        </h1>

                        <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-ink/75">
                            Di dapur FitBox, setiap porsi kami racik dengan takaran nutrisi presisi dan bahan segar pilihan. 
                            Dimasak subuh hari tanpa pengawet, rendah minyak, dan siap diantar hangat langsung ke mejamu.
                        </p>

                        {/* Dua Tombol CTA Sesuai Desain Referensi */}
                        <div className="mt-7 flex flex-wrap items-center gap-3.5">
                            <button
                                onClick={() => onNavigate('packages')}
                                className="btn btn-primary px-5 py-2.5 text-base"
                            >
                                Lihat menu <ArrowRight size={18} />
                            </button>
                            <button
                                onClick={() => onNavigate('calc')}
                                className="btn border-1.5 border-ink bg-flour/70 px-5 py-2.5 text-base text-ink shadow-[2.5px_2.5px_0_var(--color-ink)] hover:bg-flour active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                            >
                                Hitung kalori
                            </button>
                        </div>

                        {/* Nilai Tambah / Keunggulan */}
                        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line/70 pt-4 text-xs sm:text-sm text-ink/70">
                            <span className="flex items-center gap-1.5 font-medium">
                                <span className="text-leaf font-bold">✓</span> 100% Bahan Alami Segar
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <span className="text-leaf font-bold">✓</span> Kalori & Protein Terukur
                            </span>
                            <span className="flex items-center gap-1.5 font-medium">
                                <span className="text-leaf font-bold">✓</span> Diantar Hangat Pagi Hari
                            </span>
                        </div>
                    </div>

                    {/* Sisi Kanan: 3 Card Animatif Bertumpuk (Polaroid & Masking Tape) */}
                    <div className="lg:col-span-5">
                        <HeroCardStack packages={packages} onOpen={onOpen} onNavigate={onNavigate} />
                    </div>
                </div>
            </section>

            {/* Bagian Cara Pesan */}
            <section>
                <div className="mb-6 flex items-baseline justify-between border-b border-line pb-2">
                    <h2 className="text-2xl sm:text-3xl">Cara pesan</h2>
                    <span className="hand text-sm text-leaf">mudah & praktis</span>
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    {STEPS.map(([n, title, text]) => (
                        <div key={n} className="rounded-xs border border-line/60 bg-flour/40 p-5 shadow-xs">
                            <span className="font-display text-4xl text-leaf">{n}</span>
                            <h3 className="mt-2 text-xl font-bold">{title}</h3>
                            <p className="mt-1 text-sm text-ink/70 leading-relaxed">{text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bagian Paket Unggulan */}
            {packages.length > 0 && (
                <section>
                    <div className="mb-6 flex items-baseline justify-between border-b border-line pb-2">
                        <h2 className="text-2xl sm:text-3xl">Paket unggulan</h2>
                        <button
                            onClick={() => onNavigate('packages')}
                            className="hand text-base text-leaf hover:underline"
                        >
                            semua paket →
                        </button>
                    </div>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {packages.slice(0, 3).map((p, i) => (
                            <PackageCard
                                key={p.id}
                                pack={p}
                                index={i}
                                onOpen={onOpen}
                                onAddToCart={onAddToCart}
                                onToggleFavorite={onToggleFavorite}
                                isFavorite={isFavorite(p.id)}
                            />
                        ))}
                    </div>
                </section>
            )}
        </div>
    )
}
