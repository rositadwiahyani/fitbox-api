import { Home, Salad, Calculator, ClipboardList, User, ShoppingBag } from 'lucide-react'

const USER_NAV_ITEMS = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'packages', label: 'Paket', icon: Salad },
    { id: 'calc', label: 'Kalori', icon: Calculator },
    { id: 'orders', label: 'Pesanan', icon: ClipboardList },
    { id: 'profile', label: 'Profil', icon: User },
]

const ADMIN_NAV_ITEMS = [
    { id: 'packages', label: 'Paket', icon: Salad },
    { id: 'orders', label: 'Pesanan', icon: ClipboardList },
    { id: 'profile', label: 'Profil', icon: User },
]

export default function Navbar({ page, onNavigate, cartCount = 0, onOpenCart, isAdmin = false }) {
    const navItems = isAdmin ? ADMIN_NAV_ITEMS : USER_NAV_ITEMS
    const active = (id) =>
        page === id || (page === 'package' && id === 'packages') || (page === 'order' && id === 'orders')

    return (
        <>
            {/* Desktop */}
            <header className="hidden border-b border-line md:block">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pb-3 pt-5">
                    <button
                        onClick={() => onNavigate(isAdmin ? 'packages' : 'home')}
                        className="font-display text-2xl text-leaf"
                    >
                        FitBox
                    </button>
                    <nav className="flex items-center gap-7">
                        {navItems.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => onNavigate(id)}
                                className={`border-b-2 pb-1 font-bold transition ${active(id)
                                        ? 'border-leaf text-leaf'
                                        : 'border-transparent text-ink/60 hover:text-ink'
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                        {!isAdmin && (
                            <button
                                type="button"
                                onClick={onOpenCart}
                                className="relative flex h-10 w-10 items-center justify-center border-2 border-ink bg-leaf text-paper shadow-[2.5px_2.5px_0_var(--color-ink)] transition hover:bg-leaf-dark active:translate-y-0.5"
                                style={{ borderRadius: 4 }}
                                title="Buka Keranjang Belanja"
                                aria-label="Keranjang Belanja"
                            >
                                <ShoppingBag size={18} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-ink bg-brick text-[11px] font-bold text-white shadow-xs">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </nav>
                </div>
            </header>

            {/* Mobile: judul + bottom navigation */}
            <header className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
                <span className="font-display text-xl text-leaf">FitBox</span>
                <span className="hand text-xs text-ink/55">{isAdmin ? 'mode admin' : 'catering sehat'}</span>
            </header>

            <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden">
                <div className={`grid ${isAdmin ? 'grid-cols-3' : 'grid-cols-6'}`}>
                    {navItems.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onNavigate(id)}
                            className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] sm:text-[11px] font-bold ${active(id) ? 'bg-flour text-leaf' : 'text-ink/55'
                                }`}
                        >
                            <Icon size={20} strokeWidth={active(id) ? 2.4 : 1.8} />
                            {label}
                        </button>
                    ))}
                    {!isAdmin && (
                        <button
                            type="button"
                            onClick={onOpenCart}
                            className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] sm:text-[11px] font-bold text-ink/55 hover:text-ink"
                            title="Buka Keranjang Belanja"
                            aria-label="Keranjang Belanja"
                        >
                            <span className="relative">
                                <ShoppingBag size={20} strokeWidth={1.8} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full border border-ink bg-brick px-1 text-[9px] font-bold leading-none text-white">
                                        {cartCount}
                                    </span>
                                )}
                            </span>
                            Keranjang
                        </button>
                    )}
                </div>
            </nav>
        </>
    )
}
