import { WifiOff, AlertTriangle, X, Check } from 'lucide-react'

export default function OfflineAlertModal({ message, onClose }) {
    if (!message) return null

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/65 p-4 backdrop-blur-[2px] transition-opacity"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="fade-up relative w-full max-w-sm space-y-4 border-2 border-ink bg-paper p-5 sm:p-6 shadow-[6px_6px_0_#1c2a1f] text-center"
                style={{ borderRadius: 4 }}
            >
                {/* Tombol X Tutup di Sudut Kanan Atas */}
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Tutup alert"
                    className="absolute right-3 top-3 p-1 text-ink/60 hover:text-ink transition"
                >
                    <X size={18} />
                </button>

                {/* Ikon Warning WifiOff Besar */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-brick/15 text-brick shadow-[2px_2px_0_var(--color-ink)]">
                    <WifiOff size={32} strokeWidth={2.2} />
                </div>

                {/* Judul & Pesan Alert */}
                <div className="space-y-1.5">
                    <span className="hand text-xs text-brick font-bold tracking-wide">
                        koneksi internet terputus
                    </span>
                    <h3 className="font-display text-xl font-bold text-ink">
                        Tidak Dapat Memesan
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/75 leading-relaxed pt-1">
                        {message}
                    </p>
                </div>

                {/* Badge Penjelasan Status Offline */}
                <div className="rounded-xs border border-line bg-flour p-2.5 text-[11px] text-ink/65 text-left flex items-start gap-2">
                    <AlertTriangle size={15} className="text-brick shrink-0 mt-0.5" />
                    <span>
                        Fitur katalog dan kalori tetap dapat dilihat saat offline, namun pembuatan atau checkout pesanan membutuhkan koneksi internet aktif.
                    </span>
                </div>

                {/* Tombol Aksi */}
                <button
                    type="button"
                    autoFocus
                    onClick={onClose}
                    className="btn btn-primary w-full shadow-[2.5px_2.5px_0_var(--color-ink)] text-sm py-2.5 font-bold"
                >
                    <Check size={16} /> Saya Mengerti
                </button>
            </div>
        </div>
    )
}
