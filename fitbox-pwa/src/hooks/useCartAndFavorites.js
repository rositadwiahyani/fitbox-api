import { useState, useEffect, useCallback } from 'react'

const CART_KEY = 'fitbox:cart'
const FAV_KEY = 'fitbox:favorites'

function getSavedCart() {
    try {
        return JSON.parse(localStorage.getItem(CART_KEY)) || []
    } catch {
        return []
    }
}

function getSavedFavs() {
    try {
        return JSON.parse(localStorage.getItem(FAV_KEY)) || []
    } catch {
        return []
    }
}

export function useCartAndFavorites(notify) {
    const [cart, setCart] = useState(getSavedCart)
    const [favorites, setFavorites] = useState(getSavedFavs)

    useEffect(() => {
        try {
            localStorage.setItem(CART_KEY, JSON.stringify(cart))
        } catch {}
    }, [cart])

    useEffect(() => {
        try {
            localStorage.setItem(FAV_KEY, JSON.stringify(favorites))
        } catch {}
    }, [favorites])

    const isFavorite = useCallback(
        (packId) => favorites.includes(packId),
        [favorites],
    )

    const toggleFavorite = useCallback(
        (pack) => {
            const exists = favorites.includes(pack.id)
            if (exists) {
                setFavorites((prev) => prev.filter((id) => id !== pack.id))
                if (notify) notify(`"${pack.name}" dihapus dari favorit`)
            } else {
                setFavorites((prev) => [...prev, pack.id])
                if (notify) notify(`"${pack.name}" ditambahkan ke favorit ❤️`)
            }
        },
        [favorites, notify],
    )

    const addToCart = useCallback(
        (pack, duration_days = 7) => {
            setCart((prev) => {
                const existingIndex = prev.findIndex((item) => item.package.id === pack.id)
                if (existingIndex > -1) {
                    const copy = [...prev]
                    copy[existingIndex].quantity = (copy[existingIndex].quantity || 1) + 1
                    return copy
                }
                return [...prev, { id: `${pack.id}-${Date.now()}`, package: pack, duration_days, quantity: 1, addedAt: new Date().toISOString() }]
            })
            if (notify) notify(`"${pack.name}" berhasil masuk ke keranjang 🛒`)
        },
        [notify],
    )

    const removeFromCart = useCallback(
        (packId) => {
            setCart((prev) => prev.filter((item) => item.package.id !== packId))
            if (notify) notify('Item dihapus dari keranjang')
        },
        [notify],
    )

    const clearCart = useCallback(() => {
        setCart([])
    }, [])

    return {
        cart,
        cartCount: cart.reduce((acc, curr) => acc + (curr.quantity || 1), 0),
        addToCart,
        removeFromCart,
        clearCart,
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
    }
}
