import { useState, useEffect } from 'react'
import { LogIn, UserPlus, LogOut, CheckCircle2, Mail, Lock, Eye, EyeOff, Heart, ShoppingBag, ArrowRight } from 'lucide-react'
import { rupiah } from '../utils'

export default function Profile({
    profile,
    user,
    isLoggedIn,
    onLogin,
    onRegister,
    onLogout,
    onSave,
    notify,
    onNavigate,
    packages = [],
    favorites = [],
    onToggleFavorite,
    onAddToCart,
    onOpen,
}) {
    const [tab, setTab] = useState('login') // 'login' | 'register'

    // State toggle visibilitas password
    const [showLoginPwd, setShowLoginPwd] = useState(false)
    const [showRegPwd, setShowRegPwd] = useState(false)

    // State untuk Login
    const [loginData, setLoginData] = useState({ email: '', password: '' })

    // State untuk Register
    const [regData, setRegData] = useState({
        name: '',
        email: '',
        password: '',
        phone: profile?.phone || '081234567890',
        address: profile?.address || 'Jl. Sehat Bugar No. 10, Jakarta',
    })

    // State untuk Edit Profil saat sudah login
    const [f, setF] = useState({
        name: user?.name || profile?.name || '',
        phone: user?.phone || profile?.phone || '',
        address: user?.address || profile?.address || '',
    })

    // SINKRONISASI OTOMATIS: pastikan form selalu terisi lengkap ketika user login/register
    useEffect(() => {
        if (user) {
            setF({
                name: user.name || profile?.name || 'User FitBox',
                phone: user.phone || profile?.phone || '081234567890',
                address: user.address || profile?.address || 'Jl. Sehat Bugar No. 10, Jakarta',
            })
        }
    }, [user, profile?.name, profile?.phone, profile?.address])

    // Daftar paket favorit pengguna
    const favoritePackages = (packages || []).filter((p) => (favorites || []).includes(p.id))

    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleLogin = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await onLogin(loginData.email, loginData.password)
            if (res.success) {
                setF({
                    name: res.user.name || '',
                    phone: res.user.phone || '',
                    address: res.user.address || '',
                })
                notify(`Selamat datang kembali, ${res.user.name}! 👋`)
            } else {
                notify(`Gagal: ${res.error}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await onRegister(regData)
            if (res.success) {
                setF({
                    name: res.user.name || '',
                    phone: res.user.phone || '',
                    address: res.user.address || '',
                })
                notify(`Akun berhasil dibuat! Selamat datang, ${res.user.name} 🎉`)
            } else {
                notify(`Gagal: ${res.error}`)
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSaveProfile = (e) => {
        e.preventDefault()
        onSave(f)
        notify('Profil pemesan berhasil diperbarui')
    }

    const handleLogout = () => {
        onLogout()
        notify('Anda telah keluar dari akun')
    }

    // Komponen Tentang Aplikasi (ditampilkan baik sebelum maupun sesudah login)
    const aboutSection = (
        <section className="border-2 border-dashed border-line p-5 rounded-xs space-y-3">
            <h2 className="text-xl font-display">Tentang Aplikasi</h2>
            <p className="text-sm text-ink/80 leading-relaxed">
                FitBox adalah aplikasi pemesanan catering diet dan makanan sehat. Pengguna dapat menghitung
                kebutuhan kalori harian, memilih paket menu sesuai tujuan, lalu berlangganan sesuai durasi
                yang diinginkan.
            </p>
        </section>
    )

    // Komponen Kartu Menu Favorit
    const favoritesSection = (
        <section
            className="fade-up border-2 border-ink bg-flour p-5 shadow-[5px_5px_0_var(--color-ink)]"
            style={{ borderRadius: 4 }}
        >
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
                <div className="flex items-center gap-2">
                    <Heart size={20} className="fill-brick text-brick" />
                    <h2 className="font-display text-2xl text-ink">Menu Favorit Saya</h2>
                </div>
                <span className="text-xs font-bold text-ink/70 bg-paper px-2.5 py-1 border border-ink/20 rounded-xs">
                    {favoritePackages.length} Menu
                </span>
            </div>

            {favoritePackages.length === 0 ? (
                <div className="border-2 border-dashed border-line p-6 text-center rounded-xs">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-sage/50 text-brick mb-2">
                        <Heart size={20} />
                    </div>
                    <p className="text-base font-bold text-ink">Belum ada menu favorit.</p>
                    <p className="text-xs text-ink/60 mt-1 max-w-sm mx-auto">
                        Tandai menu diet yang kamu suka dengan menekan ikon hati ❤️ di halaman paket makanan.
                    </p>
                    <button
                        type="button"
                        onClick={() => onNavigate('packages')}
                        className="btn btn-ghost text-xs mt-3 border border-ink inline-flex items-center gap-1"
                    >
                        Jelajahi Menu Paket <ArrowRight size={14} />
                    </button>
                </div>
            ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                    {favoritePackages.map((p) => (
                        <div
                            key={p.id}
                            className="flex flex-col justify-between border-2 border-ink bg-paper p-3 shadow-[2.5px_2.5px_0_var(--color-ink)] rounded-xs"
                        >
                            <div className="flex gap-3">
                                <img
                                    src={p.image_url}
                                    alt={p.name}
                                    className="h-16 w-16 rounded object-cover border border-ink shrink-0"
                                />
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-display text-base font-bold text-ink truncate leading-snug">
                                        {p.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[11px] font-bold text-leaf bg-sage/50 px-1.5 py-0.5 rounded-xs">
                                            {p.calories} kkal
                                        </span>
                                        <span className="text-xs font-bold text-ink">
                                            {rupiah(p.price_per_day)}/hari
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between gap-2 mt-3 pt-2 border-t border-line">
                                <button
                                    type="button"
                                    onClick={() => onOpen?.(p.id)}
                                    className="btn btn-ghost !px-2 !py-1 text-xs"
                                >
                                    Lihat Detail
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <button
                                        type="button"
                                        onClick={() => onAddToCart?.(p)}
                                        className="btn btn-primary !px-2.5 !py-1 text-xs inline-flex items-center gap-1"
                                        title="Tambah ke keranjang"
                                    >
                                        <ShoppingBag size={13} /> + Keranjang
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onToggleFavorite?.(p)}
                                        className="flex h-7 w-7 items-center justify-center border border-ink/40 bg-flour rounded-xs text-brick hover:bg-brick/10 transition"
                                        title="Hapus dari favorit"
                                    >
                                        <Heart size={14} className="fill-brick text-brick" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )

    // Jika pengguna BELUM LOGIN, tampilkan Form Login & Registrasi
    if (!isLoggedIn) {
        return (
            <div className="mx-auto max-w-md space-y-6">
                <div className="text-center">
                    <p className="hand text-lg text-leaf">akses riwayat catering</p>
                    <h1 className="font-display text-3xl sm:text-4xl">Akun Pengguna</h1>
                    <p className="mt-2 text-sm text-ink/70">
                        Masuk atau daftar untuk melakukan pemesanan dan menyimpan riwayat langganan catering sehatmu.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="grid grid-cols-2 border-2 border-ink bg-paper p-1 shadow-[3px_3px_0_var(--color-ink)]" style={{ borderRadius: 4 }}>
                    <button
                        type="button"
                        onClick={() => setTab('login')}
                        className={`flex items-center justify-center gap-1.5 py-2 text-sm font-bold transition rounded-xs ${tab === 'login' ? 'bg-leaf text-white shadow-xs' : 'text-ink/65 hover:text-ink'
                            }`}
                    >
                        <LogIn size={16} /> Masuk (Login)
                    </button>
                    <button
                        type="button"
                        onClick={() => setTab('register')}
                        className={`flex items-center justify-center gap-1.5 py-2 text-sm font-bold transition rounded-xs ${tab === 'register' ? 'bg-leaf text-white shadow-xs' : 'text-ink/65 hover:text-ink'
                            }`}
                    >
                        <UserPlus size={16} /> Daftar Akun
                    </button>
                </div>

                {/* Form Login */}
                {tab === 'login' && (
                    <form
                        onSubmit={handleLogin}
                        className="fade-up space-y-4 border-2 border-ink bg-flour p-6 shadow-[5px_5px_0_var(--color-ink)]"
                        style={{ borderRadius: 4 }}
                    >
                        <h2 className="font-display text-xl text-ink">Masuk ke FitBox</h2>

                        <div>
                            <label className="label">Alamat Email</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                                <input
                                    type="email"
                                    required
                                    placeholder="nama@email.com"
                                    className="input !pl-9"
                                    value={loginData.email}
                                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="label">Kata Sandi (Password)</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                                <input
                                    type={showLoginPwd ? 'text' : 'password'}
                                    required
                                    placeholder="Minimal 6 karakter"
                                    className="input !pl-9 !pr-10"
                                    value={loginData.password}
                                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowLoginPwd((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition"
                                    tabIndex={-1}
                                >
                                    {showLoginPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full shadow-[2.5px_2.5px_0_var(--color-ink)] disabled:opacity-60"
                        >
                            <LogIn size={16} /> {isSubmitting ? 'Memproses Masuk...' : 'Masuk Sekarang'}
                        </button>
                    </form>
                )}

                {/* Form Register */}
                {tab === 'register' && (
                    <form
                        onSubmit={handleRegister}
                        className="fade-up space-y-3.5 border-2 border-ink bg-flour p-6 shadow-[5px_5px_0_var(--color-ink)]"
                        style={{ borderRadius: 4 }}
                    >
                        <h2 className="font-display text-xl text-ink">Buat Akun Baru</h2>

                        <div>
                            <label className="label">Nama Lengkap</label>
                            <input
                                required
                                placeholder="Contoh: Rian Pratama"
                                className="input"
                                value={regData.name}
                                onChange={(e) => setRegData({ ...regData, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="label">Alamat Email</label>
                            <input
                                type="email"
                                required
                                placeholder="nama@email.com"
                                className="input"
                                value={regData.email}
                                onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="label">Password (Min. 6 Karakter)</label>
                            <div className="relative">
                                <input
                                    type={showRegPwd ? 'text' : 'password'}
                                    required
                                    minLength={6}
                                    placeholder="Buat kata sandi aman"
                                    className="input !pr-10"
                                    value={regData.password}
                                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowRegPwd((v) => !v)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink transition"
                                    tabIndex={-1}
                                >
                                    {showRegPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="label">No. WhatsApp / HP</label>
                            <input
                                required
                                type="tel"
                                placeholder="08xxxxxxxxxx"
                                className="input"
                                value={regData.phone}
                                onChange={(e) => setRegData({ ...regData, phone: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="label">Alamat Lengkap Pengantaran</label>
                            <textarea
                                required
                                rows="2"
                                placeholder="Jl. Mawar No. 12, RT 01/RW 02..."
                                className="input"
                                value={regData.address}
                                onChange={(e) => setRegData({ ...regData, address: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary w-full shadow-[2.5px_2.5px_0_var(--color-ink)] disabled:opacity-60"
                        >
                            <UserPlus size={16} /> {isSubmitting ? 'Mendaftarkan Akun...' : 'Daftar & Mulai Langganan'}
                        </button>
                    </form>
                )}

                {/* Tentang FitBox */}
                {aboutSection}
            </div>
        )
    }

    // Jika pengguna SUDAH LOGIN
    const initials = (user.name || 'User')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className="mx-auto max-w-xl space-y-8">
            {/* Kartu Profil Pengguna Terdaftar */}
            <section
                className="fade-up border-2 border-ink bg-flour shadow-[6px_6px_0_var(--color-sage)]"
                style={{ borderRadius: 4 }}
            >
                <div className="flex items-center justify-between border-b-2 border-ink bg-leaf p-5 text-paper">
                    <div className="flex items-center gap-4">
                        <div className="font-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 border-paper bg-leaf-dark text-xl font-bold">
                            {initials}
                        </div>
                        <div>
                            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-sage font-bold">
                                <CheckCircle2 size={13} /> Akun Terverifikasi
                            </span>
                            <h1 className="font-display text-2xl leading-tight">{user.name}</h1>
                            <p className="text-xs text-paper/80">{user.email}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="btn border border-paper bg-leaf-dark text-xs text-paper hover:bg-brick hover:border-brick transition"
                    >
                        <LogOut size={14} /> Keluar
                    </button>
                </div>

                {/* Form Edit Data Pemesan */}
                <form onSubmit={handleSaveProfile} className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink/60">
                            Data Pengantaran Default
                        </p>
                        <span className="hand text-xs text-leaf">otomatis terisi saat memesan</span>
                    </div>

                    <div>
                        <label className="label">Nama Lengkap</label>
                        <input className="input" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                    </div>

                    <div>
                        <label className="label">No. WhatsApp / HP</label>
                        <input
                            type="tel"
                            className="input"
                            value={f.phone}
                            onChange={(e) => setF({ ...f, phone: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="label">Alamat Pengantaran</label>
                        <textarea
                            rows="2"
                            className="input"
                            value={f.address}
                            onChange={(e) => setF({ ...f, address: e.target.value })}
                        />
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <button className="btn btn-primary shadow-[2px_2px_0_var(--color-ink)]">
                            Simpan Perubahan
                        </button>
                        <button
                            type="button"
                            onClick={() => onNavigate('orders')}
                            className="btn btn-ghost text-sm"
                        >
                            Lihat Riwayat Pesanan →
                        </button>
                    </div>
                </form>
            </section>

            {/* Menu Favorit Saya di Profil */}
            {favoritesSection}

            {/* Tentang FitBox */}
            {aboutSection}
        </div>
    )
}
