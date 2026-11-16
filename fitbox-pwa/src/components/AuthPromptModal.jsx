import { LogIn, UserPlus, X, ShieldAlert } from 'lucide-react'

export default function AuthPromptModal({ onGoToAuth, onClose }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4" onClick={onClose}>
            <div
                onClick={(e) => e.stopPropagation()}
                className="fade-up w-full max-w-sm space-y-4 border-2 border-ink bg-paper p-6 text-center shadow-[6px_6px_0_#1c2a1f]"
                style={{ borderRadius: 4 }}
            >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-ink bg-sage/60 text-leaf">
                    <ShieldAlert size={28} />
                </div>

                <div className="space-y-1">
                    <h3 className="font-display text-2xl text-ink">Perlu Masuk Akun</h3>
                    <p className="text-xs text-ink/75 leading-relaxed">
                        Untuk melanjutkan pemesanan catering dan menyimpan riwayat langganan Anda, silakan masuk (login) atau daftar akun terlebih dahulu.
                    </p>
                </div>

                <div className="space-y-2 pt-2">
                    <button
                        type="button"
                        onClick={onGoToAuth}
                        className="btn btn-primary w-full shadow-[2.5px_2.5px_0_var(--color-ink)]"
                    >
                        <LogIn size={16} /> Masuk / Daftar Akun
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-ghost w-full text-xs text-ink/60"
                    >
                        Nanti Saja
                    </button>
                </div>
            </div>
        </div>
    )
}
