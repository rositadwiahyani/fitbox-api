import { useState, useEffect, useCallback, useRef } from 'react'
import orderService from '../services/orderService'
import { supabase } from '../config/supabaseClient'

const STORAGE_KEY = 'fitbox:orders'

function loadLocalOrders() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? JSON.parse(raw) : []
    } catch {
        return []
    }
}

export function useOrders(deviceId, user, isAdmin = false) {
    const [orders, setOrders] = useState(loadLocalOrders)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const ordersRef = useRef(orders)
    ordersRef.current = orders

    const userId = user?.id || null

    const saveOrders = useCallback((newList) => {
        ordersRef.current = newList
        setOrders(newList)
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newList))
        } catch { }
    }, [])

    const refetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const remote = await orderService.getOrders(deviceId, userId, isAdmin)
            if (Array.isArray(remote)) {
                saveOrders(remote)
            }
        } catch (err) {
            if (isAdmin) {
                try {
                    const { data, error: sbErr } = await supabase
                        .from('orders')
                        .select('*')
                        .order('created_at', { ascending: false })
                    if (!sbErr && Array.isArray(data)) {
                        saveOrders(data)
                        return
                    }
                } catch { }
            }
            console.warn('Gagal memuat pesanan dari server API:', err?.message)
            // Tetap gunakan data cache lokal
        } finally {
            setLoading(false)
        }
    }, [deviceId, userId, isAdmin, saveOrders])

    useEffect(() => {
        refetch()
    }, [refetch])

    const addOrder = useCallback(
        async (data) => {
            const tempOrderId = `ord-${Date.now().toString().slice(-6)}`
            const items = Array.isArray(data.items) ? data.items : []
            const pricePerDay = Number(data.price_per_day) || 0
            const durationDays = Number(data.duration_days) || 1
            const newOrder = {
                id: tempOrderId,
                items,
                package_id: data.package_id ?? items[0]?.package_id ?? null,
                package_name: data.package_name || 'Paket Menu Sehat FitBox',
                price_per_day: pricePerDay,
                customer_name: data.customer_name,
                phone: data.phone,
                address: data.address,
                duration_days: durationDays,
                start_date: data.start_date,
                notes: data.notes || '',
                payment_method: data.payment_method || 'transfer_bank',
                status: 'menunggu',
                total: Number(data.total) || pricePerDay * durationDays,
                created_at: new Date().toISOString(),
                device_id: deviceId,
                user_id: userId || data.user_id || null,
            }

            // Simpan sementara di state lokal sebelum panggilan API
            saveOrders([newOrder, ...ordersRef.current])

            try {
                const remote = await orderService.createOrder(newOrder)
                if (remote && remote.id) {
                    saveOrders(ordersRef.current.map((o) => (o.id === tempOrderId ? remote : o)))
                    return remote
                }
                throw new Error('Respons pesanan dari server tidak valid')
            } catch (err) {
                // Hapus pesanan sementara jika API gagal, lalu lempar error
                saveOrders(ordersRef.current.filter((o) => o.id !== tempOrderId))
                throw err
            }
        },
        [deviceId, userId, saveOrders],
    )

    const updateOrder = useCallback(
        async (id, data) => {
            const previousOrders = ordersRef.current
            saveOrders(previousOrders.map((o) => (String(o.id) === String(id) ? { ...o, ...data } : o)))

            try {
                const remote = await orderService.updateOrder(id, data, deviceId)
                if (remote && remote.id) {
                    saveOrders(ordersRef.current.map((o) => (String(o.id) === String(id) ? remote : o)))
                }
                return remote
            } catch (err) {
                saveOrders(previousOrders)
                throw err
            }
        },
        [deviceId, saveOrders],
    )

    const payOrder = useCallback(
        async (id) => {
            const previousOrders = ordersRef.current
            saveOrders(previousOrders.map((o) => (String(o.id) === String(id) ? { ...o, status: 'dibayar' } : o)))

            try {
                const remote = await orderService.payOrder(id, deviceId)
                if (remote && remote.id) {
                    saveOrders(ordersRef.current.map((o) => (String(o.id) === String(id) ? remote : o)))
                }
                return remote
            } catch (err) {
                saveOrders(previousOrders)
                throw err
            }
        },
        [deviceId, saveOrders],
    )

    const deleteOrder = useCallback(
        async (id) => {
            const previousOrders = ordersRef.current
            saveOrders(previousOrders.filter((o) => String(o.id) !== String(id)))

            try {
                await orderService.deleteOrder(id, deviceId)
            } catch (err) {
                saveOrders(previousOrders)
                throw err
            }
        },
        [deviceId, saveOrders],
    )

    const updateOrderStatus = useCallback(
        async (id, status) => {
            const previousOrders = ordersRef.current
            saveOrders(previousOrders.map((o) => (String(o.id) === String(id) ? { ...o, status } : o)))

            try {
                const remote = await orderService.updateOrderStatus(id, status)
                if (remote && remote.id) {
                    saveOrders(ordersRef.current.map((o) => (String(o.id) === String(id) ? remote : o)))
                }
                return remote
            } catch (err) {
                try {
                    const { data, error: sbErr } = await supabase
                        .from('orders')
                        .update({ status })
                        .eq('id', id)
                        .select()
                        .single()
                    if (!sbErr && data) {
                        saveOrders(ordersRef.current.map((o) => (String(o.id) === String(id) ? data : o)))
                        return data
                    }
                } catch { }
                if (err?.status != null) {
                    saveOrders(previousOrders)
                    throw err
                }
                return { id, status }
            }
        },
        [saveOrders],
    )

    return { orders, loading, error, refetch, addOrder, updateOrder, payOrder, deleteOrder, updateOrderStatus }
}
