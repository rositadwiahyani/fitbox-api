import { Plus, ShieldAlert, LogIn } from 'lucide-react'
import { rupiah } from '../utils'

export const statusClass = (s) => (s === 'menunggu' ? 'bg-amber-100 text-amber-800' : 'bg-sage text-ink')

export default function Orders({ orders, loading, error, refetch, onOpen, onNewOrder, onNavigate, isLoggedIn }) {
    // Jika belum login, tampilkan prompt login
    if (!isLoggedIn) {
        return (
            <div className="space-y-6">
                <div className="border-b border-line pb-3">
                    <p className="hand text-lg text-leaf">riwayat &amp; pemesanan langganan</p>
                    <h1 className="text-4xl">Pesanan Saya</h1>
                </div>
                <div
                    className="border-2 border-dashed border-line py-20 text-center"
                    style={{ borderRadius: 4 }}
                >
                    <ShieldAlert size={40} className="mx-auto text-leaf mb-4" />
                    <p className="text-xl font-display text-ink">Masuk Akun untuk Melihat Pesanan</p>
                    <p className="text-sm text-ink/60 mt-2 max-w-xs mx-auto">
                        Riwayat pesanan dan status langganan tersimpan di akunmu.
                        Login atau daftar terlebih dahulu untuk melanjutkan.
                    </p>
                    <button
                        onClick={() => onNavigate('profile')}
                        className="btn btn-primary mt-6 shadow-[2.5px_2.5px_0_var(--color-ink)]"
                    >
                        <LogIn size={16} /> Masuk / Daftar Akun
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-end justify-between gap-3 border-b border-line pb-3">
                <div>
                    <p className="hand text-lg text-leaf">riwayat & pemesanan langganan</p>
                    <h1 className="text-4xl">Pesanan Saya</h1>
                </div>
                <button
                    onClick={() => onNewOrder?.()}
                    className="btn btn-primary shadow-[2.5px_2.5px_0_var(--color-ink)]"
                >
                    <Plus size={18} /> Buat Pesanan Baru
                </button>
            </div>

            {error && (
                <div className="flex items-center justify-between gap-3 border-l-4 border-brick bg-flour px-4 py-3 text-sm">
                    <span>Tidak bisa memuat pesanan ({error}).</span>
                    <button onClick={refetch} className="btn btn-ghost !px-3 !py-1.5 text-sm">
                        Coba lagi
                    </button>
                </div>
            )}

            {loading && orders.length === 0 ? (
                <p className="py-14 text-center text-ink/60">Memuat pesanan...</p>
            ) : orders.length === 0 ? (
                <div className="border-2 border-dashed border-line py-14 text-center" style={{ borderRadius: 4 }}>
                    <p className="text-xl font-display text-ink">Belum ada pesanan aktif.</p>
                    <p className="text-sm text-ink/60 mt-1 max-w-sm mx-auto">
                        Mulai langganan catering sehat harianmu sekarang. Pilih menu favoritmu dengan takaran kalori pas!
                    </p>
                    <div className="mt-5 flex justify-center gap-3">
                        <button onClick={() => onNewOrder?.()} className="btn btn-primary">
                            <Plus size={18} /> Buat Pesanan Sekarang
                        </button>
                        <button onClick={() => onNavigate('packages')} className="btn btn-ghost">
                            Lihat Menu Paket
                        </button>
                    </div>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    {orders.map((o) => (
                        <button
                            key={o.id}
                            onClick={() => onOpen(o.id)}
                            className="fade-up border-2 border-ink bg-flour p-4 text-left transition hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--color-ink)]"
                            style={{ borderRadius: 4 }}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <h3 className="text-xl font-bold font-display">{o.package_name}</h3>
                                <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded-xs border border-ink/20 ${statusClass(o.status)}`}>
                                    {o.status}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-ink/70">
                                Mulai {o.start_date} · {o.duration_days} hari
                            </p>
                            <div className="mt-3 flex items-center justify-between border-t border-dashed border-line/80 pt-2">
                                <span className="text-xs text-ink/60">Total Pembayaran:</span>
                                <span className="text-lg font-bold text-leaf font-display">{rupiah(o.total)}</span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
