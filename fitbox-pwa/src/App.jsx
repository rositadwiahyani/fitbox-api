import { useState } from 'react'
import Navbar from './components/Navbar'
import SplashScreen from './components/SplashScreen'
import StatusBar from './components/StatusBar'
import Footer from './components/Footer'
import OrderForm from './components/OrderForm'
import CartModal from './components/CartModal'
import Home from './pages/Home'
import Packages from './pages/Packages'
import PackageDetail from './pages/PackageDetail'
import Calculator from './pages/Calculator'
import Orders from './pages/Orders'
import OrderDetail from './pages/OrderDetail'
import Profile from './pages/Profile'
import { usePackages } from './hooks/usePackages'
import { useOrders } from './hooks/useOrders'
import { useProfile } from './hooks/useProfile'
import { useCartAndFavorites } from './hooks/useCartAndFavorites'
import { useOnlineStatus } from './hooks/useOnlineStatus'
import { useInstallPrompt } from './hooks/useInstallPrompt'

export default function App() {
    const [showSplash, setShowSplash] = useState(true)
    const [page, setPage] = useState('home')
    const [from, setFrom] = useState('packages') // halaman asal sebelum membuka detail paket
    const [packageId, setPackageId] = useState(null)
    const [orderId, setOrderId] = useState(null)
    const [orderModal, setOrderModal] = useState(null) // { pack } untuk baru, { order } untuk ubah
    const [showCart, setShowCart] = useState(false)
    const [toast, setToast] = useState('')

    const notify = (msg) => {
        setToast(msg)
        setTimeout(() => setToast(''), 2400)
    }

    const store = usePackages()
    const auth = useProfile()
    const { profile, saveProfile } = auth
    const orderStore = useOrders(profile.deviceId, auth.user)
    const cartStore = useCartAndFavorites(notify)
    const online = useOnlineStatus()
    const { canInstall, install } = useInstallPrompt()

    const go = (id) => {
        setPage(id)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const openPackage = (id) => {
        if (page !== 'package') setFrom(page)
        setPackageId(id)
        go('package')
    }

    const openOrder = (id) => {
        setOrderId(id)
        go('order')
    }

    // Helper untuk memastikan koneksi internet tersedia sebelum memesan
    const checkOnlineForOrder = (actionLabel = 'melakukan pemesanan') => {
        if (!online || (typeof navigator !== 'undefined' && !navigator.onLine)) {
            alert(`Tidak dapat ${actionLabel} saat offline. Pastikan perangkat Anda tersambung ke internet.`)
            notify(`Tidak dapat ${actionLabel} saat offline. Harus tersambung ke internet.`)
            return false
        }
        return true
    }

    // CREATE atau UPDATE pesanan dari modal
    const submitOrder = async (data) => {
        if (!checkOnlineForOrder('mengirim pesanan')) return
        try {
            if (orderModal.order) {
                await orderStore.updateOrder(orderModal.order.id, data)
                notify('Pesanan diperbarui')
                setOrderModal(null)
            } else {
                const created = await orderStore.addOrder({
                    ...data,
                    user_id: auth.user?.id || null,
                })
                saveProfile({ name: data.customer_name, phone: data.phone, address: data.address })
                notify('Pesanan berhasil dibuat 🎉')
                setOrderModal(null)
                if (created?.id) {
                    openOrder(created.id)
                }
            }
        } catch (err) {
            notify(`Gagal: ${err.message}`)
        }
    }

    const currentPackage = store.packages.find((p) => p.id === packageId) || store.packages[0]

    return (
        <div className="flex min-h-screen flex-col">
            {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}
            <StatusBar online={online} canInstall={canInstall} onInstall={install} />
            <Navbar page={page} onNavigate={go} />

            <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-20 pt-8 md:px-6 md:pb-14">
                {page === 'home' && (
                    <Home
                        packages={store.packages}
                        onNavigate={go}
                        onOpen={openPackage}
                        onAddToCart={cartStore.addToCart}
                        onToggleFavorite={cartStore.toggleFavorite}
                        isFavorite={cartStore.isFavorite}
                    />
                )}
                {page === 'packages' && (
                    <Packages
                        {...store}
                        notify={notify}
                        onOpen={openPackage}
                        onAddToCart={cartStore.addToCart}
                        onToggleFavorite={cartStore.toggleFavorite}
                        isFavorite={cartStore.isFavorite}
                        cartCount={cartStore.cartCount}
                        onOpenCart={() => setShowCart(true)}
                    />
                )}
                {page === 'package' && (
                    <PackageDetail
                        pack={currentPackage}
                        onBack={() => go(from)}
                        onOrder={(pack) => {
                            if (!checkOnlineForOrder('melakukan pemesanan')) return
                            setOrderModal({ pack })
                        }}
                        onAddToCart={cartStore.addToCart}
                        onToggleFavorite={cartStore.toggleFavorite}
                        isFavorite={currentPackage ? cartStore.isFavorite(currentPackage.id) : false}
                    />
                )}
                {page === 'calc' && <Calculator packages={store.packages} onOpen={openPackage} />}
                {page === 'orders' && (
                    <Orders
                        {...orderStore}
                        packages={store.packages}
                        onOpen={openOrder}
                        onNewOrder={() => {
                            if (!checkOnlineForOrder('membuat pesanan baru')) return
                            setOrderModal({ pack: store.packages[0] || null })
                        }}
                        onNavigate={go}
                        isLoggedIn={auth.isLoggedIn}
                    />
                )}
                {page === 'order' && (
                    <OrderDetail
                        order={orderStore.orders.find((o) => String(o.id) === String(orderId))}
                        onBack={() => go('orders')}
                        onPay={orderStore.payOrder}
                        onDelete={orderStore.deleteOrder}
                        onEdit={(order) => setOrderModal({ order })}
                        notify={notify}
                    />
                )}
                {page === 'profile' && (
                    <Profile
                        profile={profile}
                        user={auth.user}
                        isLoggedIn={auth.isLoggedIn}
                        onLogin={auth.login}
                        onRegister={auth.register}
                        onLogout={auth.logout}
                        onSave={saveProfile}
                        notify={notify}
                        onNavigate={go}
                        packages={store.packages}
                        favorites={cartStore.favorites}
                        onToggleFavorite={cartStore.toggleFavorite}
                        onAddToCart={cartStore.addToCart}
                        onOpen={openPackage}
                    />
                )}
            </main>

            <Footer />

            {/* Modal Keranjang Belanja */}
            {showCart && (
                <CartModal
                    cart={cartStore.cart}
                    onRemove={cartStore.removeFromCart}
                    onClear={cartStore.clearCart}
                    onUpdateQuantity={cartStore.updateQuantity}
                    onCheckout={(pack, selectedItems) => {
                        if (!checkOnlineForOrder('checkout keranjang')) return
                        setShowCart(false)
                        setOrderModal({ pack, selectedItems })
                    }}
                    onClose={() => setShowCart(false)}
                />
            )}

            {/* Modal Form Pemesanan dengan Pilihan Menu Makanan */}
            {orderModal && (
                <OrderForm
                    pack={orderModal.pack}
                    order={orderModal.order}
                    selectedItems={orderModal.selectedItems}
                    packages={store.packages}
                    profile={profile}
                    onSubmit={submitOrder}
                    onClose={() => setOrderModal(null)}
                />
            )}

            {toast && (
                <div
                    className="fade-up fixed bottom-24 left-1/2 z-[60] -translate-x-1/2 bg-ink px-5 py-3 text-sm font-bold text-paper md:bottom-8 shadow-[4px_4px_0_var(--color-leaf)]"
                    style={{ borderRadius: 4 }}
                >
                    {toast}
                </div>
            )}
        </div>
    )
}
