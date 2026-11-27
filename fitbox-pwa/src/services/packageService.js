import { supabase } from '../config/supabaseClient'
import { apiClient } from '../config/api'

// Service CRUD ke tabel 'packages' Supabase dengan fallback ke REST API /packages
const packageService = {
    // Ambil semua paket dari database packages
    getPackages: async () => {
        try {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .order('calories')

            if (!error && Array.isArray(data) && data.length > 0) {
                return data
            }
            if (error) console.warn('Supabase getPackages warn:', error.message)
            return await apiClient.get('/packages')
        } catch {
            return await apiClient.get('/packages')
        }
    },

    // Ambil paket berdasarkan ID
    getPackageById: async (id) => {
        try {
            const { data, error } = await supabase
                .from('packages')
                .select('*')
                .eq('id', id)
                .single()

            if (!error && data) return data
            return await apiClient.get(`/packages/${id}`)
        } catch {
            return await apiClient.get(`/packages/${id}`)
        }
    },

    // Tambah paket baru ke database packages
    createPackage: async (payload) => {
        const { emoji, ...cleanPayload } = payload
        try {
            const { data, error } = await supabase
                .from('packages')
                .insert([cleanPayload])
                .select()
                .single()

            if (!error && data) return data
            return await apiClient.post('/packages', payload)
        } catch {
            return await apiClient.post('/packages', payload)
        }
    },

    // Update paket di database packages
    updatePackage: async (id, payload) => {
        const { emoji, ...cleanPayload } = payload
        try {
            const { data, error } = await supabase
                .from('packages')
                .update(cleanPayload)
                .eq('id', id)
                .select()
                .single()

            if (!error && data) return data
            return await apiClient.put(`/packages/${id}`, payload)
        } catch {
            return await apiClient.put(`/packages/${id}`, payload)
        }
    },

    // Hapus paket dari database packages
    deletePackage: async (id) => {
        try {
            const { error } = await supabase.from('packages').delete().eq('id', id)
            if (!error) return { message: 'Paket dihapus' }
            return await apiClient.delete(`/packages/${id}`)
        } catch {
            return await apiClient.delete(`/packages/${id}`)
        }
    },

    // Sinkronisasi data katalog agar setiap data katalog tersimpan di database packages
    syncCatalogToDatabase: async (catalogItems) => {
        try {
            const { data: existing, error: fetchErr } = await supabase
                .from('packages')
                .select('name')

            if (fetchErr) {
                console.warn('Gagal cek paket di Supabase:', fetchErr.message)
                return null
            }

            const existingNames = new Set((existing || []).map((p) => p.name.toLowerCase()))
            const missing = catalogItems.filter((p) => !existingNames.has(p.name.toLowerCase()))

            if (missing.length > 0) {
                const toInsert = missing.map((p) => ({
                    name: p.name,
                    goal: p.goal,
                    calories: p.calories,
                    protein: p.protein,
                    carbs: p.carbs,
                    fats: p.fats,
                    fiber: p.fiber,
                    price_per_day: p.price_per_day,
                    image_url: p.image_url,
                    description: p.description,
                    highlights: p.highlights,
                    menu_sample: p.menu_sample,
                }))

                const { data: inserted, error: insertErr } = await supabase
                    .from('packages')
                    .insert(toInsert)
                    .select()

                if (!insertErr && inserted) {
                    return inserted
                }
            }
            return []
        } catch (err) {
            console.warn('Sync catalog error:', err)
            return null
        }
    },
}

export default packageService
