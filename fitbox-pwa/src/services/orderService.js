import { supabase } from '../config/supabaseClient'
import { apiClient } from '../config/api'

// Service pemesanan FitBox langsung ke tabel 'orders' di database Supabase
const orderService = {
    // Ambil daftar pesanan berdasarkan user_id (jika login) atau device_id
    getOrders: async (deviceId, userId) => {
        try {
            let query = supabase.from('orders').select('*')

            if (userId && deviceId) {
                query = query.or(`user_id.eq.${userId},device_id.eq.${deviceId}`)
            } else if (userId) {
                query = query.eq('user_id', userId)
            } else if (deviceId) {
                query = query.eq('device_id', deviceId)
            }

            query = query.order('created_at', { ascending: false })
            const { data, error } = await query

            if (error) {
                console.warn('Supabase getOrders warn/error:', error)
                // Fallback: coba query sederhana berdasarkan device_id saja jika filter OR gagal
                if (deviceId) {
                    const fallback = await supabase
                        .from('orders')
                        .select('*')
                        .eq('device_id', deviceId)
                        .order('created_at', { ascending: false })
                    if (!fallback.error && Array.isArray(fallback.data)) {
                        return fallback.data
                    }
                }
                throw error
            }

            return data || []
        } catch (supabaseErr) {
            console.warn('Gagal ambil pesanan dari Supabase, mencoba backend API...', supabaseErr?.message)
            // Fallback ke REST API jika backend server aktif
            try {
                return await apiClient.get('/orders', { params: { device_id: deviceId } })
            } catch {
                throw supabaseErr
            }
        }
    },

    // Simpan pesanan baru ke tabel 'orders' di Supabase
    createOrder: async (orderData) => {
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

        try {
            const { data, error } = await supabase
                .from('orders')
                .insert([payload])
                .select()
                .single()

            if (error) {
                console.error('Supabase createOrder error:', error)
                throw error
            }

            console.log('Pesanan berhasil disimpan ke Supabase:', data)
            return data
        } catch (supabaseErr) {
            console.warn('Gagal kirim ke Supabase langsung, mencoba API backend...', supabaseErr?.message)
            // Fallback ke REST API jika ada
            try {
                return await apiClient.post('/orders', payload)
            } catch {
                throw supabaseErr
            }
        }
    },

    // Perbarui data pesanan di Supabase
    updateOrder: async (id, payload, deviceId) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update(payload)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (supabaseErr) {
            try {
                return await apiClient.put(`/orders/${id}`, { ...payload, device_id: deviceId })
            } catch {
                throw supabaseErr
            }
        }
    },

    // Konfirmasi status pembayaran di Supabase
    payOrder: async (id, deviceId) => {
        try {
            const { data, error } = await supabase
                .from('orders')
                .update({ status: 'dibayar' })
                .eq('id', id)
                .select()
                .single()

            if (error) throw error
            return data
        } catch (supabaseErr) {
            try {
                return await apiClient.post(`/orders/${id}/pay`, { device_id: deviceId })
            } catch {
                throw supabaseErr
            }
        }
    },

    // Hapus / batalkan pesanan di Supabase
    deleteOrder: async (id, deviceId) => {
        try {
            const { error } = await supabase
                .from('orders')
                .delete()
                .eq('id', id)

            if (error) throw error
            return { message: 'Pesanan dibatalkan' }
        } catch (supabaseErr) {
            try {
                return await apiClient.delete(`/orders/${id}`, { params: { device_id: deviceId } })
            } catch {
                throw supabaseErr
            }
        }
    },
}

export default orderService
