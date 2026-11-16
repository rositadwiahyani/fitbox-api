import { Home, Salad, Calculator, ClipboardList, User } from 'lucide-react'

const NAV_ITEMS = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'packages', label: 'Paket', icon: Salad },
    { id: 'calc', label: 'Kalori', icon: Calculator },
    { id: 'orders', label: 'Pesanan', icon: ClipboardList },
    { id: 'profile', label: 'Profil', icon: User },
]

export default function Navbar({ page, onNavigate }) {
    const active = (id) =>
        page === id || (page === 'package' && id === 'packages') || (page === 'order' && id === 'orders')

    return (
        <>
            {/* Desktop */}
            <header className="hidden border-b border-line md:block">
                <div className="mx-auto flex max-w-6xl items-baseline justify-between px-6 pb-3 pt-5">
                    <button onClick={() => onNavigate('home')} className="font-display text-2xl text-leaf">
                        FitBox
                    </button>
                    <nav className="flex items-center gap-7">
                        {NAV_ITEMS.map(({ id, label }) => (
                            <button
                                key={id}
                                onClick={() => onNavigate(id)}
                                className={`border-b-2 pb-1 font-bold transition ${
                                    active(id)
                                        ? 'border-leaf text-leaf'
                                        : 'border-transparent text-ink/60 hover:text-ink'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            {/* Mobile: judul + bottom navigation */}
            <header className="flex items-center justify-between border-b border-line px-4 py-3 md:hidden">
                <span className="font-display text-xl text-leaf">FitBox</span>
                <span className="hand text-xs text-ink/55">catering sehat</span>
            </header>

            <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper pb-[env(safe-area-inset-bottom)] md:hidden">
                <div className="grid grid-cols-5">
                    {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => onNavigate(id)}
                            className={`flex flex-col items-center gap-0.5 py-2.5 text-[11px] font-bold ${
                                active(id) ? 'bg-flour text-leaf' : 'text-ink/55'
                            }`}
                        >
                            <Icon size={20} strokeWidth={active(id) ? 2.4 : 1.8} />
                            {label}
                        </button>
                    ))}
                </div>
            </nav>
        </>
    )
}
