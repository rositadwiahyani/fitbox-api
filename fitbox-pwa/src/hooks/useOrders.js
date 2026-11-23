import { useState, useEffect, useCallback } from 'react'
import orderService from '../services/orderService'

const STORAGE_KEY = 'fitbox:orders'

function loadLocalOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

    export function useOrders(deviceId, user) {
        const [orders, setOrders] = useState(loadLocalOrders)
        const [loading, setLoading] = useState(false)
        const [error, setError] = useState(null)

        const userId = user?.id || null

        const refetch = useCallback(async () => {
            setLoading(true)
            setError(null)
            try {
                    const remote = await orderService.getOrders(deviceId, userId)
                    if (Array.isArray(remote)) {
                        setOrders(remote)
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(remote))
                    }
                } catch (err) {
                    console.warn('Gagal memuat pesanan dari server/Supabase:', err?.message)
                    // Tetap gunakan data cache lokal
                } finally {
                    setLoading(false)
                }
    }, [deviceId, userId])

    useEffect(() => {
        refetch()
    }, [refetch])

    const saveOrders = (newList) => {
        setOrders(newList)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
        } catch { }
    }

    const addOrder = useCallback(
        async (data) => {
            const tempOrderId = `ord-${Date.now().toString().slice(-6)}`
            const newOrder = {
                id: tempOrderId,
                package_id: data.package_id || 1,
                package_name: data.package_name || 'Paket Menu Sehat FitBox',
                price_per_day: Number(data.price_per_day) || 45000,
                customer_name: data.customer_name,
                phone: data.phone,
                address: data.address,
                duration_days: Number(data.duration_days) || 1,
                start_date: data.start_date,
                notes: data.notes || '',
                payment_method: data.payment_method || 'transfer_bank',
                status: 'menunggu',
                total: Number(data.total) || ((Number(data.price_per_day) || 45000) * (Number(data.duration_days) || 1)),
                created_at: new Date().toISOString(),
                device_id: deviceId,
                user_id: userId || data.user_id || null,
            }

            // Simpan langsung secara lokal terlebih dahulu
            setOrders((prev) => {
                const next = [newOrder, ...prev]
                localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
                return next
            })

            // Kirim ke database Supabase via orderService
            try {
                const remote = await orderService.createOrder(newOrder)
                if (remote && remote.id) {
                    setOrders((prev) => {
                        const merged = prev.map((o) => (o.id === tempOrderId ? remote : o))
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
                        return merged
                    })
                    return remote
                }
            } catch (err) {
                console.error('Gagal mengirim pesanan ke database Supabase:', err)
            }

            return newOrder
        },
        [deviceId, userId],
    )

    const updateOrder = useCallback(
        async (id, data) => {
            setOrders((prev) => {
                const updatedList = prev.map((o) => (String(o.id) === String(id) ? { ...o, ...data } : o))
                localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
                return updatedList
            })

            try {
            await orderService.updateOrder(id, data, deviceId)
        } catch (err) {
            console.error('Gagal update pesanan di Supabase:', err)
        }
},
[deviceId],
    )

const payOrder = useCallback(
    async (id) => {
        setOrders((prev) => {
            const updatedList = prev.map((o) => (String(o.id) === String(id) ? { ...o, status: 'dibayar' } : o))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
            return updatedList
        })

        try {
            await orderService.payOrder(id, deviceId)
    } catch (err) {
        console.error('Gagal verifikasi bayar di Supabase:', err)
    }
        },
[deviceId],
    )

const deleteOrder = useCallback(
    async (id) => {
        setOrders((prev) => {
            const updatedList = prev.filter((o) => String(o.id) !== String(id))
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList))
            return updatedList
        })

        try {
            await orderService.deleteOrder(id, deviceId)
    } catch (err) {
        console.error('Gagal hapus pesanan di Supabase:', err)
    }
        },
[deviceId],
    )

return { orders, loading, error, refetch, addOrder, updateOrder, payOrder, deleteOrder }
}
