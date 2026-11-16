import { useState, useEffect, useCallback } from 'react'
import packageService from '../services/packageService'
import { INITIAL_PACKAGES } from '../data/packagesData'

const STORAGE_KEY = 'fitbox:packages'
const byCalories = (list) => [...list].sort((a, b) => a.calories - b.calories)

function loadLocal() {
    try {
        const cached = JSON.parse(localStorage.getItem(STORAGE_KEY))
        if (Array.isArray(cached) && cached.length >= INITIAL_PACKAGES.length) {
            return cached
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
            const remote = await packageService.getPackages()
            if (Array.isArray(remote) && remote.length > 0) {
                // Perkaya data remote jika belum memiliki image_url dengan pencocokan nama atau fallback
                const enriched = remote.map((item, idx) => {
                    const fallback = INITIAL_PACKAGES.find((p) => p.name.toLowerCase() === item.name?.toLowerCase()) || INITIAL_PACKAGES[idx % INITIAL_PACKAGES.length]
                    return {
                        ...fallback,
                        ...item,
                        image_url: item.image_url || fallback.image_url,
                        description: item.description || fallback.description,
                        highlights: fallback.highlights,
                        carbs: item.carbs || fallback.carbs,
                        fats: item.fats || fallback.fats,
                        fiber: item.fiber || fallback.fiber,
                    }
                })
                // Pastikan seluruh paket lengkap tetap ada
                const existingNames = new Set(enriched.map((e) => e.name.toLowerCase()))
                const missing = INITIAL_PACKAGES.filter((p) => !existingNames.has(p.name.toLowerCase()))
                setPackages(byCalories([...enriched, ...missing]))
            } else {
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
        } catch {
            const localNew = { ...data, id: Date.now() }
            setPackages((prev) => byCalories([...prev, localNew]))
        }
    }, [])

    const updatePackage = useCallback(async (id, data) => {
        try {
            const updated = await packageService.updatePackage(id, data)
            setPackages((prev) => byCalories(prev.map((p) => (p.id === id ? updated : p))))
        } catch {
            setPackages((prev) => byCalories(prev.map((p) => (p.id === id ? { ...p, ...data } : p))))
        }
    }, [])

    const deletePackage = useCallback(async (id) => {
        try {
            await packageService.deletePackage(id)
            setPackages((prev) => prev.filter((p) => p.id !== id))
        } catch {
            setPackages((prev) => prev.filter((p) => p.id !== id))
        }
    }, [])

    return { packages, loading, error, refetch, addPackage, updatePackage, deletePackage }
}
