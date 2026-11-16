import { apiClient } from '../config/api'

// Service CRUD ke endpoint /orders. device_id menandai pemilik pesanan.
const orderService = {
    getOrders: (deviceId) => apiClient.get('/orders', { params: { device_id: deviceId } }),
    createOrder: (payload) => apiClient.post('/orders', payload),
    updateOrder: (id, payload) => apiClient.put(`/orders/${id}`, payload),
    payOrder: (id, deviceId) => apiClient.post(`/orders/${id}/pay`, { device_id: deviceId }),
    deleteOrder: (id, deviceId) => apiClient.delete(`/orders/${id}`, { params: { device_id: deviceId } }),
}

export default orderService