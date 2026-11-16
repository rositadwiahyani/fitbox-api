import { useState, useId } from 'react'
import {
    Flame,
    Zap,
    Scale,
    TrendingDown,
    TrendingUp,
    Activity as ActivityIcon,
    Sparkles,
    Check,
    ArrowRight,
    RefreshCw,
    Dumbbell,
    HeartPulse,
    User,
    ShieldCheck,
    Salad,
} from 'lucide-react'
import { ACTIVITY, GOALS } from '../data/seed'
import { calcTDEE, rupiah } from '../utils'

const GOAL_OPTIONS = [
    {
        id: 'turun',
        title: 'Turun Lemak',
        subtitle: 'Defisit 500 kkal',
        icon: TrendingDown,
        badge: '-500 kkal',
        color: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    },
    {
        id: 'maintenance',
        title: 'Jaga Berat Badan',
        subtitle: 'Keseimbangan kalori',
        icon: HeartPulse,
        badge: 'Seimbang',
        color: 'bg-blue-100 text-blue-800 border-blue-300',
    },
    {
        id: 'naik',
        title: 'Tambah Massa Otot',
        subtitle: 'Surplus 350 kkal',
        icon: Dumbbell,
        badge: '+350 kkal',
        color: 'bg-amber-100 text-amber-800 border-amber-300',
    },
]

export default function Calculator({ packages = [], onOpen }) {
    const [f, setF] = useState({
        gender: 'male',
        age: 24,
        weight: 62,
        height: 170,
        activity: 1.375,
        goal: 'turun',
    })
    const [res, setRes] = useState(null)
    const [isCalculating, setIsCalculating] = useState(false)

    const updateField = (key, val) => {
        setF((prev) => ({ ...prev, [key]: val }))
    }

    const hitung = (e) => {
        e?.preventDefault()
        setIsCalculating(true)

        // Smooth transition animation delay
        setTimeout(() => {
            const bmr = Math.round(
                10 * Number(f.weight) +
                6.25 * Number(f.height) -
                5 * Number(f.age) +
                (f.gender === 'male' ? 5 : -161)
            )
            const tdee = Math.round(bmr * Number(f.activity))
            const target =
                f.goal === 'turun'
                    ? Math.max(1200, tdee - 500)
                    : f.goal === 'naik'
                        ? tdee + 350
                        : tdee

            // BMI Calculation
            const heightM = Number(f.height) / 100
            const bmi = Number((Number(f.weight) / (heightM * heightM)).toFixed(1))
            let bmiStatus = 'Ideal (Normal)'
            let bmiColor = 'text-leaf bg-sage/50 border-leaf'
            if (bmi < 18.5) {
                bmiStatus = 'Berat Kurang'
                bmiColor = 'text-amber-800 bg-amber-100 border-amber-300'
            } else if (bmi >= 25 && bmi < 30) {
                bmiStatus = 'Berat Berlebih'
                bmiColor = 'text-amber-900 bg-amber-200 border-amber-400'
            } else if (bmi >= 30) {
                bmiStatus = 'Obesitas'
                bmiColor = 'text-brick bg-red-100 border-brick'
            }

            // Makronutrisi ideal harian
            const proteinG = Math.round((target * 0.3) / 4)
            const carbsG = Math.round((target * 0.45) / 4)
            const fatsG = Math.round((target * 0.25) / 9)

            // Estimasi porsi kalori per meal catering (~1/3 kalori harian)
            const targetPerMeal = Math.round(target / 3)

            // Cari paket yang paling mendekati target porsi makan
            const sorted = [...packages].sort((a, b) => {
                const diffA = Math.abs(a.calories - targetPerMeal)
                const diffB = Math.abs(b.calories - targetPerMeal)
                return diffA - diffB
            })

            const best = sorted[0] || packages[0]
            const runnerUp = sorted[1] || packages[1]

            setRes({
                bmr,
                tdee,
                target,
                bmi,
                bmiStatus,
                bmiColor,
                targetPerMeal,
                proteinG,
                carbsG,
                fatsG,
                best,
                runnerUp,
            })

            setIsCalculating(false)

            // Scroll ke hasil kalkulasi dengan mulus
            setTimeout(() => {
                const el = document.getElementById('kalkulator-hasil')
                if (el) {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
            }, 100)
        }, 320)
    }

    return (
        <div className="mx-auto max-w-2xl space-y-7">
            {/* Header Editorial */}
            <div className="border-b border-line pb-4">
                <div className="flex items-center gap-2 text-leaf mb-1">
                    <Sparkles size={18} className="animate-pulse" />
                    <span className="hand text-lg">kebutuhan gizi & nutrisi akurat</span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl text-ink">
                    Kalkulator Kalori &amp; Diet
                </h1>
                <p className="mt-1 text-sm text-ink/70 max-w-lg leading-relaxed">
                    Hitung pengeluaran energi harian (TDEE) dengan formula ilmiah Mifflin-St Jeor
                    dan dapatkan rekomendasi paket makanan FitBox yang tepat sasaran.
                </p>
            </div>

            {/* Form Input Interaktif */}
            <form
                onSubmit={hitung}
                className="space-y-6 border-2 border-ink bg-flour p-6 shadow-[6px_6px_0_var(--color-ink)]"
                style={{ borderRadius: 4 }}
            >
                {/* 1. Pemilihan Jenis Kelamin */}
                <div>
                    <label className="label mb-2">1. Jenis Kelamin</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => updateField('gender', 'male')}
                            className={`flex items-center justify-center gap-2.5 py-3 px-4 border-2 font-bold transition rounded-xs active:translate-y-0.5 ${f.gender === 'male'
                                ? 'border-ink bg-leaf text-paper shadow-[3px_3px_0_var(--color-ink)]'
                                : 'border-line bg-paper text-ink/70 hover:border-ink hover:text-ink'
                                }`}
                        >
                            <span>Laki-laki</span>
                            {f.gender === 'male' && <Check size={16} className="ml-1 text-sage" />}
                        </button>
                        <button
                            type="button"
                            onClick={() => updateField('gender', 'female')}
                            className={`flex items-center justify-center gap-2.5 py-3 px-4 border-2 font-bold transition rounded-xs active:translate-y-0.5 ${f.gender === 'female'
                                ? 'border-ink bg-leaf text-paper shadow-[3px_3px_0_var(--color-ink)]'
                                : 'border-line bg-paper text-ink/70 hover:border-ink hover:text-ink'
                                }`}
                        >
                            <span>Perempuan</span>
                            {f.gender === 'female' && <Check size={16} className="ml-1 text-sage" />}
                        </button>
                    </div>
                </div>

                {/* 2. Pengukuran Tubuh (Usia, Berat, Tinggi) */}
                <div>
                    <label className="label mb-2">2. Data Fisik Tubuh</label>
                    <div className="grid grid-cols-3 gap-3">
                        <div className="border border-line bg-paper p-3 rounded-xs focus-within:border-leaf focus-within:ring-1 focus-within:ring-leaf">
                            <span className="block text-[11px] font-bold text-ink/60 uppercase">Usia</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <input
                                    type="number"
                                    min="14"
                                    max="85"
                                    required
                                    className="w-full font-display text-2xl font-bold bg-transparent border-0 p-0 text-ink outline-none"
                                    value={f.age}
                                    onChange={(e) => updateField('age', e.target.value)}
                                />
                                <span className="text-xs text-ink/50 font-bold">th</span>
                            </div>
                        </div>

                        <div className="border border-line bg-paper p-3 rounded-xs focus-within:border-leaf focus-within:ring-1 focus-within:ring-leaf">
                            <span className="block text-[11px] font-bold text-ink/60 uppercase">Berat</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <input
                                    type="number"
                                    min="30"
                                    max="220"
                                    required
                                    className="w-full font-display text-2xl font-bold bg-transparent border-0 p-0 text-ink outline-none"
                                    value={f.weight}
                                    onChange={(e) => updateField('weight', e.target.value)}
                                />
                                <span className="text-xs text-ink/50 font-bold">kg</span>
                            </div>
                        </div>

                        <div className="border border-line bg-paper p-3 rounded-xs focus-within:border-leaf focus-within:ring-1 focus-within:ring-leaf">
                            <span className="block text-[11px] font-bold text-ink/60 uppercase">Tinggi</span>
                            <div className="flex items-baseline gap-1 mt-1">
                                <input
                                    type="number"
                                    min="120"
                                    max="230"
                                    required
                                    className="w-full font-display text-2xl font-bold bg-transparent border-0 p-0 text-ink outline-none"
                                    value={f.height}
                                    onChange={(e) => updateField('height', e.target.value)}
                                />
                                <span className="text-xs text-ink/50 font-bold">cm</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Tingkat Aktivitas Harian */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="label !mb-0">3. Tingkat Aktivitas Fisik</label>
                        <span className="text-[11px] text-ink/50 font-bold">Pengali faktor energi</span>
                    </div>
                    <div className="relative">
                        <select
                            className="input !py-3 font-semibold text-sm cursor-pointer shadow-xs"
                            value={f.activity}
                            onChange={(e) => updateField('activity', e.target.value)}
                        >
                            {ACTIVITY.map(([v, label]) => (
                                <option key={v} value={v}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* 4. Target / Tujuan Diet */}
                <div>
                    <label className="label mb-2">4. Target / Tujuan Dietmu</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {GOAL_OPTIONS.map((item) => {
                            const Icon = item.icon
                            const isSelected = f.goal === item.id
                            return (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => updateField('goal', item.id)}
                                    className={`flex flex-col text-left p-3.5 border-2 rounded-xs transition active:translate-y-0.5 ${isSelected
                                        ? 'border-ink bg-sage shadow-[3px_3px_0_var(--color-ink)]'
                                        : 'border-line bg-paper hover:border-ink/60'
                                        }`}
                                >
                                    <div className="flex items-center justify-between w-full mb-1">
                                        <Icon size={18} className={isSelected ? 'text-leaf' : 'text-ink/60'} />
                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${item.color}`}>
                                            {item.badge}
                                        </span>
                                    </div>
                                    <span className="font-display font-bold text-sm text-ink">{item.title}</span>
                                    <span className="text-[11px] text-ink/60">{item.subtitle}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* Tombol Aksi Hitung */}
                <button
                    type="submit"
                    disabled={isCalculating}
                    className="btn btn-primary w-full !py-3.5 text-base font-bold shadow-[4px_4px_0_var(--color-ink)] hover:shadow-[2px_2px_0_var(--color-ink)] active:translate-y-1 transition duration-150"
                >
                    {isCalculating ? (
                        <span className="inline-flex items-center gap-2">
                            <RefreshCw size={18} className="animate-spin" /> Menghitung Kebutuhan Nutrisi...
                        </span>
                    ) : (
                        <span className="inline-flex items-center gap-2">
                            <Flame size={20} className="fill-amber-300 text-amber-300" /> Hitung Kebutuhan Kalori Saya
                        </span>
                    )}
                </button>
            </form>

            {/* HASIL KALKULASI DENGAN ANIMASI INTERAKTIF */}
            {res && (
                <div
                    id="kalkulator-hasil"
                    className="animate-pop-in space-y-5 border-2 border-ink bg-paper p-6 shadow-[7px_7px_0_var(--color-leaf)]"
                    style={{ borderRadius: 4 }}
                >
                    {/* Ringkasan Utama */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-line pb-5">
                        <div>
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-leaf text-white text-xs font-bold rounded-xs mb-2">
                                <Sparkles size={12} /> Hasil Analisis Personal
                            </div>
                            <h2 className="font-display text-2xl text-ink">Target Kalori Harianmu</h2>
                            <p className="text-xs text-ink/60 mt-0.5">
                                Disesuaikan dengan tujuan: <strong>{GOALS[f.goal] || f.goal}</strong>
                            </p>
                        </div>

                        {/* Angka Kalori Utama dengan Animasi Pulse */}
                        <div className="flex items-baseline gap-1.5 bg-flour border-2 border-ink px-4 py-2.5 rounded shadow-[3px_3px_0_var(--color-ink)] animate-pulse-gentle">
                            <Flame size={26} className="text-brick fill-brick" />
                            <span className="font-display text-3xl sm:text-4xl font-bold text-leaf">
                                {res.target.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs font-bold text-ink/60">kkal/hari</span>
                        </div>
                    </div>

                    {/* Gauge / Perbandingan BMR vs TDEE vs Target */}
                    <div className="bg-flour border border-line p-4 rounded-xs space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-ink/70">Perbandingan Energi Tubuh</span>
                            <span className="text-leaf">{res.target} kkal dibutuhkan</span>
                        </div>

                        {/* Progress Bar Visual Bertingkat */}
                        <div className="h-3.5 w-full bg-paper border border-line rounded-full overflow-hidden flex">
                            <div
                                style={{ width: `${Math.min(100, (res.bmr / res.tdee) * 100)}%` }}
                                className="bg-sage animate-progress"
                                title={`BMR: ${res.bmr} kkal`}
                            />
                            <div
                                style={{ width: `${Math.max(0, 100 - (res.bmr / res.tdee) * 100)}%` }}
                                className="bg-leaf animate-progress opacity-80"
                                title={`Aktivitas Tambahan: ${res.tdee - res.bmr} kkal`}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-2 pt-1 text-center text-xs">
                            <div className="border border-line/60 bg-paper/60 p-2 rounded-xs">
                                <span className="block text-[10px] text-ink/50 uppercase font-bold">BMR (Dasar)</span>
                                <strong className="text-ink font-display text-sm">{res.bmr} kkal</strong>
                            </div>
                            <div className="border border-line/60 bg-paper/60 p-2 rounded-xs">
                                <span className="block text-[10px] text-ink/50 uppercase font-bold">TDEE (Aktivitas)</span>
                                <strong className="text-ink font-display text-sm">{res.tdee} kkal</strong>
                            </div>
                            <div className="border border-line/60 bg-sage/40 p-2 rounded-xs">
                                <span className="block text-[10px] text-leaf uppercase font-bold">BMI ({res.bmi})</span>
                                <strong className="text-leaf font-display text-xs">{res.bmiStatus}</strong>
                            </div>
                        </div>
                    </div>

                    {/* Breakdown Makronutrisi Harian */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="font-display text-base font-bold text-ink">
                                Pembagian Makronutrisi Harian
                            </h3>
                            <span className="text-[11px] text-ink/50 font-bold">Standar Diet Sehat</span>
                        </div>

                        <div className="grid grid-cols-3 gap-2.5">
                            {/* Protein */}
                            <div className="border-2 border-ink bg-flour p-3 rounded-xs shadow-[2px_2px_0_var(--color-ink)]">
                                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide">
                                    🥩 Protein (30%)
                                </span>
                                <p className="font-display text-xl font-bold text-ink mt-0.5">
                                    {res.proteinG}g
                                </p>
                                <span className="text-[10px] text-ink/50">Pemulihan otot</span>
                            </div>

                            {/* Karbohidrat */}
                            <div className="border-2 border-ink bg-flour p-3 rounded-xs shadow-[2px_2px_0_var(--color-ink)]">
                                <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">
                                    🌾 Karbo (45%)
                                </span>
                                <p className="font-display text-xl font-bold text-ink mt-0.5">
                                    {res.carbsG}g
                                </p>
                                <span className="text-[10px] text-ink/50">Energi kompleks</span>
                            </div>

                            {/* Lemak Sehat */}
                            <div className="border-2 border-ink bg-flour p-3 rounded-xs shadow-[2px_2px_0_var(--color-ink)]">
                                <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wide">
                                    🥑 Lemak (25%)
                                </span>
                                <p className="font-display text-xl font-bold text-ink mt-0.5">
                                    {res.fatsG}g
                                </p>
                                <span className="text-[10px] text-ink/50">Hormon &amp; otak</span>
                            </div>
                        </div>
                    </div>

                    {/* Rekomendasi Menu Paket Catering Terbaik */}
                    {res.best && (
                        <div className="border-2 border-leaf bg-flour p-4 rounded-xs shadow-[4px_4px_0_var(--color-leaf)] space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-leaf bg-sage/60 px-2.5 py-0.5 rounded-xs border border-leaf/30">
                                    <Sparkles size={13} /> Menu FitBox Paling Cocok
                                </span>
                                <span className="text-xs font-bold text-ink/60">
                                    Porsi ~{res.targetPerMeal} kkal/meal
                                </span>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3.5 items-center">
                                <img
                                    src={res.best.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'}
                                    alt={res.best.name}
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'
                                    }}
                                    className="h-20 w-20 sm:h-24 sm:w-24 rounded object-cover border-2 border-ink shrink-0"
                                />
                                <div className="min-w-0 flex-1 text-center sm:text-left">
                                    <h4 className="font-display text-lg font-bold text-ink leading-snug">
                                        {res.best.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                                        <span className="text-xs font-bold text-leaf bg-sage/50 px-2 py-0.5 rounded-xs">
                                            {res.best.calories} kkal
                                        </span>
                                        <span className="text-xs font-bold text-ink">
                                            {rupiah(res.best.price_per_day)}/hari
                                        </span>
                                        <span className="text-xs text-ink/60">
                                            P: {res.best.protein}g · K: {res.best.carbs}g · L: {res.best.fats}g
                                        </span>
                                    </div>
                                    <p className="text-xs text-ink/70 mt-1 line-clamp-2">
                                        {res.best.description}
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => onOpen(res.best.id)}
                                className="btn btn-primary w-full !py-2.5 text-sm shadow-[2px_2px_0_var(--color-ink)] inline-flex items-center justify-center gap-1.5"
                            >
                                <Salad size={16} /> Pesan Paket Ini Sekarang <ArrowRight size={15} />
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
