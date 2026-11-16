import { useState } from 'react'
import { ArrowLeft, Building2, QrCode, Copy, Check, Trash2, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { statusClass } from './Orders'
import { rupiah } from '../utils'
import ConfirmModal from '../components/ConfirmModal'

export default function OrderDetail({ order, onBack, onPay, onDelete, notify }) {
    const [confirmingCancel, setConfirmingCancel] = useState(false)
    const [copied, setCopied] = useState(false)

    if (!order) {
        return (
            <div className="py-20 text-center space-y-4">
                <p className="text-xl font-display text-ink">Pesanan tidak ditemukan atau telah dihapus.</p>
                <button onClick={onBack} className="btn btn-primary">
                    Kembali ke Pesanan Saya
                </button>
            </div>
        )
    }

    const handleCopyRekening = () => {
        navigator.clipboard.writeText('4328432928')
        setCopied(true)
        if (notify) notify('Nomor rekening BTN disalin ke clipboard')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleConfirmCancel = async () => {
        try {
            await onDelete(order.id)
            if (notify) notify('Pesanan berhasil dibatalkan / dihapus')
            setConfirmingCancel(false)
            onBack()
        } catch (err) {
            if (notify) notify(`Gagal membatalkan: ${err.message}`)
        }
    }

    const handlePay = async () => {
        try {
            await onPay(order.id)
            if (notify) notify('Pembayaran berhasil diverifikasi! 🎉')
        } catch (err) {
            if (notify) notify(`Gagal konfirmasi bayar: ${err.message}`)
        }
    }

    const isPending = order.status === 'menunggu'
    const isCancelled = order.status === 'dibatalkan'

    return (
        <div className="fade-up mx-auto max-w-2xl space-y-6">
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 font-bold text-ink/75 hover:text-leaf transition"
            >
                <ArrowLeft size={18} /> Kembali ke daftar pesanan
            </button>

            {/* Header Status Pesanan */}
            <div
                className="border-2 border-ink bg-flour p-5 sm:p-6 shadow-[5px_5px_0_var(--color-ink)]"
                style={{ borderRadius: 4 }}
            >
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
                    <div>
                        <span className="hand text-xs text-leaf font-bold">rincian transaksi langganan</span>
                        <h1 className="font-display text-2xl sm:text-3xl text-ink">Pesanan #{order.id.slice(-6)}</h1>
                        <p className="text-xs text-ink/60 mt-0.5">
                            Dibuat pada: {order.created_at ? new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Hari ini'}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-xs border border-ink/20 ${statusClass(order.status)}`}>
                            {order.status}
                        </span>
                    </div>
                </div>

                {/* Info Menu Paket */}
                <div className="mt-5 space-y-4">
                    <div className="border border-line bg-paper p-4 rounded-xs">
                        <p className="text-xs font-bold uppercase tracking-wider text-ink/60">Menu Paket Terpilih</p>
                        <div className="mt-2 flex items-center justify-between">
                            <div>
                                <h3 className="font-display text-xl font-bold text-ink">{order.package_name}</h3>
                                <p className="text-xs text-ink/70 mt-0.5">
                                    Durasi Langganan: <strong>{order.duration_days} Hari</strong>
                                </p>
                            </div>
                            <span className="price-tag !text-sm">
                                {rupiah(order.price_per_day || order.total / order.duration_days)}/hari
                            </span>
                        </div>
                    </div>

                    {/* Rincian Pengiriman & Jadwal */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        <div className="border border-line bg-paper p-3 rounded-xs">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink/60 block">Tanggal Mulai</span>
                            <span className="font-bold text-ink text-base">{order.start_date}</span>
                            <span className="text-xs text-ink/60 block mt-0.5">Diantar setiap pagi (subuh)</span>
                        </div>

                        <div className="border border-line bg-paper p-3 rounded-xs">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink/60 block">Penerima</span>
                            <span className="font-bold text-ink text-base">{order.customer_name}</span>
                            <span className="text-xs text-ink/60 block mt-0.5">{order.phone}</span>
                        </div>
                    </div>

                    {/* Alamat & Catatan */}
                    <div className="border border-line bg-paper p-3.5 rounded-xs text-sm space-y-2">
                        <div>
                            <span className="text-xs font-bold uppercase tracking-wider text-ink/60 block">Alamat Pengantaran:</span>
                            <p className="text-ink font-medium mt-0.5">{order.address}</p>
                        </div>
                        {order.notes && (
                            <div className="border-t border-line/60 pt-2">
                                <span className="text-xs font-bold uppercase tracking-wider text-ink/60 block">Catatan Khusus:</span>
                                <p className="text-ink/80 italic text-xs">{order.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Rincian Pembayaran */}
                    <div className="border-2 border-dashed border-line p-4 rounded-xs space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold uppercase tracking-wider text-ink/60">Metode Pembayaran</span>
                            <span className="font-bold text-sm text-ink flex items-center gap-1.5">
                                {order.payment_method === 'qris' ? (
                                    <>
                                        <QrCode size={15} className="text-leaf" /> QRIS Official
                                    </>
                                ) : (
                                    <>
                                        <Building2 size={15} className="text-leaf" /> Transfer Bank BTN
                                    </>
                                )}
                            </span>
                        </div>

                        {order.payment_method === 'transfer_bank' && (
                            <div className="flex items-center justify-between bg-flour p-2.5 border border-line rounded-xs">
                                <div>
                                    <p className="text-[10px] text-ink/60 uppercase font-bold">Bank BTN (a.n. FitBox Official)</p>
                                    <p className="font-mono text-sm font-bold text-leaf tracking-wider">4328 4329 28</p>
                                </div>
                                <button
                                    onClick={handleCopyRekening}
                                    className="btn btn-ghost !p-1.5 text-xs border border-ink bg-paper"
                                >
                                    {copied ? <Check size={14} className="text-leaf" /> : <Copy size={14} />}
                                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                                </button>
                            </div>
                        )}

                        <div className="border-t border-line pt-2 flex items-baseline justify-between">
                            <span className="font-bold text-sm text-ink/75">Total Tagihan ({order.duration_days} hari):</span>
                            <span className="font-display text-2xl font-bold text-leaf">{rupiah(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Tombol Aksi: Bayar & Batalkan Pesanan */}
                <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-line pt-4">
                    {isPending && (
                        <button
                            type="button"
                            onClick={handlePay}
                            className="btn btn-primary flex-1 shadow-[2.5px_2.5px_0_var(--color-ink)]"
                        >
                            <CheckCircle2 size={18} /> Konfirmasi Pembayaran (Simulasi)
                        </button>
                    )}

                    {!isCancelled && (
                        <button
                            type="button"
                            onClick={() => setConfirmingCancel(true)}
                            className="btn border border-brick bg-flour text-brick hover:bg-brick/10 text-sm shadow-[1.5px_1.5px_0_var(--color-brick)]"
                        >
                            <Trash2 size={16} /> Batalkan / Hapus Pesanan
                        </button>
                    )}
                </div>
            </div>

            {/* Modal Konfirmasi Pembatalan */}
            {confirmingCancel && (
                <ConfirmModal
                    title="Batalkan Pesanan Ini?"
                    message={`Apakah Anda yakin ingin membatalkan pesanan "${order.package_name}"? Tindakan ini akan menghapus riwayat pesanan.`}
                    onConfirm={handleConfirmCancel}
                    onCancel={() => setConfirmingCancel(false)}
                />
            )}
        </div>
    )
}
