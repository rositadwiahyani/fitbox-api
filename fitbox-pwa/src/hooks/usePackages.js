import { useState, useEffect, useCallback } from 'react'
import packageService from '../services/packageService'
import { INITIAL_PACKAGES } from '../data/packagesData'

const STORAGE_KEY = 'fitbox:packages'
const byCalories = (list) => [...list].sort((a, b) => a.calories - b.calories)

function loadLocal() {
    try {
        const cached = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (Array.isArray(cached) && cached.length >= INITIAL_PACKAGES.length) {
            // Hindari cache usang yang memuat data placeholder lama
            const hasLegacy = cached.some((p) => p.name === 'Lean 1200' || p.name === 'Slim 1500')
            const valid = cached.every((p) => p.image_url && p.image_url.trim() !== '')
            if (valid && !hasLegacy) return cached
        }
        return INITIAL_PACKAGES
    } catch {
        return INITIAL_PACKAGES
    }
}

export function usePackages() {
    const [packages, setPackages] = useState(loadLocal)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const refetch = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            let remote = await packageService.getPackages()

            // Pastikan setiap katalog dari INITIAL_PACKAGES tersimpan ke dalam database packages
            if (Array.isArray(remote)) {
                const existingNames = new Set(remote.map((e) => e.name?.toLowerCase()))
                const missing = INITIAL_PACKAGES.filter((p) => !existingNames.has(p.name?.toLowerCase()))
                if (missing.length > 0) {
                    const synced = await packageService.syncCatalogToDatabase(missing)
                    if (Array.isArray(synced) && synced.length > 0) {
                        remote = [...remote, ...synced]
                    }
                }
            }

            if (Array.isArray(remote) && remote.length > 0) {
                // Perkaya data dari database dengan emoji untuk tampilan UI
                const enriched = remote.map((item, idx) => {
                    const fallback = INITIAL_PACKAGES.find((p) => p.name.toLowerCase() === item.name?.toLowerCase()) || INITIAL_PACKAGES[idx % INITIAL_PACKAGES.length]
                    return {
                        ...fallback,
                        ...item,
                        emoji: item.emoji || fallback?.emoji || '🥗',
                        image_url: (item.image_url && item.image_url.trim() !== '') ? item.image_url : fallback?.image_url,
                        price_per_day: Number(item.price_per_day) || fallback?.price_per_day,
                        description: item.description || fallback?.description,
                        highlights: item.highlights || fallback?.highlights,
                        carbs: item.carbs || fallback?.carbs,
                        fats: item.fats || fallback?.fats,
                        fiber: item.fiber || fallback?.fiber,
                    }
                })
                setPackages(byCalories(enriched))
            } else {
                // Jika database belum terisi sama sekali, lakukan sinkronisasi katalog
                packageService.syncCatalogToDatabase(INITIAL_PACKAGES)
                setPackages(byCalories(INITIAL_PACKAGES))
            }
        } catch (err) {
            setError(err.message) // Tetap tampilkan data lokal / initial
            if (packages.length === 0) {
                setPackages(byCalories(INITIAL_PACKAGES))
            }
        } finally {
            setLoading(false)
        }
    }, [packages.length])

    useEffect(() => {
        refetch()
    }, [refetch])

    // Simpan cache setiap kali data berubah
    useEffect(() => {
        if (packages.length > 0) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(packages))
        }
    }, [packages])

    // CREATE, UPDATE, DELETE: error dilempar ke pemanggil agar tampil sebagai toast
    const addPackage = useCallback(async (data) => {
        try {
            const created = await packageService.createPackage(data)
            setPackages((prev) => byCalories([...prev, created]))
            return created
        } catch (err) {
            const localNew = { ...data, id: Date.now() }
            setPackages((prev) => byCalories([...prev, localNew]))
            throw err
        }
    }, [])

    const updatePackage = useCallback(async (id, data) => {
        try {
            const updated = await packageService.updatePackage(id, data)
            setPackages((prev) => byCalories(prev.map((p) => (p.id === id ? updated : p))))
            return updated
        } catch (err) {
            setPackages((prev) => byCalories(prev.map((p) => (p.id === id ? { ...p, ...data } : p))))
            throw err
        }
    }, [])

    const deletePackage = useCallback(async (id) => {
        try {
            await packageService.deletePackage(id)
            setPackages((prev) => prev.filter((p) => p.id !== id))
        } catch (err) {
            setPackages((prev) => prev.filter((p) => p.id !== id))
            throw err
        }
    }, [])

    return { packages, loading, error, refetch, addPackage, updatePackage, deletePackage }
}
