import { useState, useMemo } from 'react'
import { Search, Plus } from 'lucide-react'
import PackageCard from '../components/PackageCard'
import { GOALS } from '../data/seed'

export default function Packages({
    packages,
    loading,
    error,
    refetch,
    notify,
    onOpen,
    onAddToCart,
    onToggleFavorite,
    isFavorite = () => false,
    isAdmin = false,
    onAdd,
    onEdit,
    onDelete,
}) {
    const [query, setQuery] = useState('')
    const [goal, setGoal] = useState('semua')

    const filtered = useMemo(() => {
        return packages.filter((p) => {
            const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
            if (!matchesQuery) return false
            if (goal === 'semua') return true
            return p.goal === goal
        })
    }, [packages, query, goal])

    return (
        <div className="space-y-6">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
                    <div>
                        <p className="hand text-lg text-leaf">
                            {isAdmin ? 'mode admin · kelola menu pilihan paket' : 'pilih menu sesuai targetmu'}
                        </p>
                        <h1 className="text-4xl">Pilihan Paket Makanan</h1>
                    </div>
                    {isAdmin && (
                        <button
                            type="button"
                            onClick={onAdd}
                            className="btn btn-primary shadow-[3px_3px_0_var(--color-ink)]"
                        >
                            <Plus size={18} /> Tambah Paket
                        </button>
                    )}
                </div>

                {error && (
                    <div className="flex items-center justify-between gap-3 border-l-4 border-brick bg-flour px-4 py-3 text-sm">
                        <span>Tidak bisa terhubung ke server ({error}). Menampilkan data menu tersimpan.</span>
                        <button onClick={refetch} className="btn btn-ghost !px-3 !py-1.5 text-sm">
                            Coba lagi
                        </button>
                    </div>
                )}

                <div className="relative">
                    <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Cari nama paket makanan atau bahan..."
                        className="input !pl-10"
                    />
                </div>

                <div className="-mx-4 flex gap-5 overflow-x-auto border-b border-line px-4 md:mx-0 md:px-0">
                    {[
                        ['semua', 'Semua Menu'],
                        ...Object.entries(GOALS),
                    ].map(([k, v]) => (
                        <button
                            key={k}
                            onClick={() => setGoal(k)}
                            className={`shrink-0 border-b-2 pb-2 font-bold transition ${goal === k ? 'border-leaf text-leaf' : 'border-transparent text-ink/55 hover:text-ink'
                                }`}
                        >
                            {v}
                        </button>
                    ))}
                </div>

                {loading && packages.length === 0 ? (
                    <p className="py-14 text-center text-ink/60">Memuat paket makanan...</p>
                ) : filtered.length === 0 ? (
                    <div className="border-2 border-dashed border-line py-14 text-center" style={{ borderRadius: 4 }}>
                        <p className="text-lg">
                            {packages.length === 0
                                ? 'Belum ada paket makanan.'
                                : 'Tidak ada paket yang cocok dengan pencarian.'}
                        </p>
                        <p className="text-sm text-ink/60 mt-1">
                            Coba kata kunci lain atau pilih kategori Semua Menu.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((p, i) => (
                            <PackageCard
                                key={p.id}
                                pack={p}
                                index={i}
                                onOpen={onOpen}
                                onAddToCart={onAddToCart}
                                onToggleFavorite={onToggleFavorite}
                                isFavorite={isFavorite(p.id)}
                                isAdmin={isAdmin}
                                onEdit={onEdit}
                                onDelete={onDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
            )
}
