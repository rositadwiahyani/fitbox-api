import { apiClient } from '../config/api'

// Service CRUD ke REST API Express (/packages) melalui apiClient
const packageService = {
    // Ambil semua paket dari API Express
    getPackages: () => apiClient.get('/packages'),

    // Ambil paket berdasarkan ID dari API Express
    getPackageById: (id) => apiClient.get(`/packages/${id}`),

    // Tambah paket baru melalui API Express
    createPackage: (payload) => {
        const { emoji, ...cleanPayload } = payload
        return apiClient.post('/packages', cleanPayload)
    },

    // Update paket melalui API Express
    updatePackage: (id, payload) => {
        const { emoji, ...cleanPayload } = payload
        return apiClient.put(`/packages/${id}`, cleanPayload)
    },

    // Hapus paket melalui API Express
    deletePackage: (id) => apiClient.delete(`/packages/${id}`),

    // Sinkronisasi data katalog agar setiap data katalog tersimpan di database melalui API Express
    syncCatalogToDatabase: async (catalogItems) => {
        try {
            const existing = await apiClient.get('/packages')
            if (!Array.isArray(existing)) {
                return null
            }

            const existingNames = new Set(existing.map((p) => p.name?.toLowerCase()))
            const missing = catalogItems.filter((p) => !existingNames.has(p.name?.toLowerCase()))

            if (missing.length === 0) {
                return []
            }

            const inserted = []
            for (const p of missing) {
                const { emoji, id, ...cleanPayload } = p
                try {
                    const created = await apiClient.post('/packages', cleanPayload)
                    if (created) {
                        inserted.push(created)
                    }
                } catch (err) {
                    console.warn(`Gagal sinkronisasi paket "${p.name}":`, err?.message || err)
                }
            }
            return inserted
        } catch (err) {
            console.warn('Sync catalog error:', err?.message || err)
            return null
        }
    },
}

export default packageService
