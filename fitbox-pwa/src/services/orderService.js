import { apiClient } from '../config/api'

// Service pemesanan FitBox melalui REST API Express (/orders)
const orderService = {
    // Ambil daftar pesanan berdasarkan user_id (jika login) atau device_id
    getOrders: (deviceId, userId) => {
        const params = {}
        if (userId) params.user_id = userId
        if (deviceId) params.device_id = deviceId
        return apiClient.get('/orders', { params })
    },

    // Simpan pesanan baru melalui API Express
    createOrder: (orderData) => {
        const payload = {
            package_id: (Number.isInteger(Number(orderData.package_id)) && Number(orderData.package_id) > 0)
                ? Number(orderData.package_id)
                : 1,
            package_name: orderData.package_name || 'Paket Menu Sehat FitBox',
            price_per_day: Number(orderData.price_per_day) || 45000,
            customer_name: orderData.customer_name,
            phone: orderData.phone,
            address: orderData.address,
            duration_days: Number(orderData.duration_days) || 1,
            start_date: orderData.start_date,
            notes: orderData.notes || '',
            payment_method: orderData.payment_method || 'transfer_bank',
            status: orderData.status || 'menunggu',
            total: Number(orderData.total) || (Number(orderData.price_per_day) * Number(orderData.duration_days)),
            device_id: orderData.device_id || null,
            user_id: orderData.user_id || null,
        }

        return apiClient.post('/orders', payload)
    },

    // Perbarui data pesanan melalui API Express
    updateOrder: (id, payload, deviceId) =>
        apiClient.put(`/orders/${id}`, { ...payload, device_id: deviceId }),

    // Konfirmasi status pembayaran melalui API Express
    payOrder: (id, deviceId) =>
        apiClient.post(`/orders/${id}/pay`, { device_id: deviceId }),

    // Hapus / batalkan pesanan melalui API Express
    deleteOrder: (id, deviceId) =>
        apiClient.delete(`/orders/${id}`, { params: { device_id: deviceId } }),
}

export default orderService
