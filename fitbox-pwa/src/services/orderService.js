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

    // Simpan pesanan baru melalui API Express (harga & total dihitung di backend)
    createOrder: (orderData) => {
        const payload = {
            items: Array.isArray(orderData.items)
                ? orderData.items.map((item) => ({
                    package_id: item.package_id,
                    qty: Number(item.qty),
                }))
                : [],
            customer_name: orderData.customer_name,
            phone: orderData.phone,
            address: orderData.address,
            duration_days: Number(orderData.duration_days) || 1,
            start_date: orderData.start_date,
            notes: orderData.notes || '',
            payment_method: orderData.payment_method || 'transfer_bank',
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
