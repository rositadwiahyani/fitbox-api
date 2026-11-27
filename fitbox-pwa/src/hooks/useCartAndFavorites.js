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
        (pack, duration_days = 1) => {
            setCart((prev) => {
                const exists = prev.some((item) => item.package.id === pack.id)
                if (exists) {
                    return prev.map((item) =>
                        item.package.id === pack.id
                            ? { ...item, quantity: (item.quantity || 1) + 1 }
                            : item,
                    )
                }
                return [
                    ...prev,
                    {
                        id: `${pack.id}-${Date.now()}`,
                        package: pack,
                        duration_days,
                        quantity: 1,
                        addedAt: new Date().toISOString(),
                    },
                ]
            })
            if (notify) notify(`"${pack.name}" berhasil masuk ke keranjang 🛒`)
        },
        [notify],
    )

    const updateQuantity = useCallback((cartItemId, delta) => {
        setCart((prev) => {
            return prev
                .map((item) => {
                    if (item.id === cartItemId) {
                        const newQty = (item.quantity || 1) + delta
                        return newQty > 0 ? { ...item, quantity: newQty } : null
                    }
                    return item
                })
                .filter(Boolean)
        })
    }, [])

    const removeFromCart = useCallback(
        (cartItemId) => {
            setCart((prev) => prev.filter((item) => item.id !== cartItemId))
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
        updateQuantity,
        removeFromCart,
        clearCart,
        favorites,
        favoritesCount: favorites.length,
        isFavorite,
        toggleFavorite,
    }
}
