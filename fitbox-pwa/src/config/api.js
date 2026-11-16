import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000,
})

// Ambil isi response dan rapikan pesan error
apiClient.interceptors.response.use(
    (response) => response.data,
    (error) => {
        let message = 'Terjadi kesalahan yang tidak terduga'
        if (error.response) {
            message = error.response.data?.error || `Server error (${error.response.status})`
        } else if (error.request) {
            message = 'Tidak dapat terhubung ke server. Periksa koneksi internet Anda.'
        } else {
            message = error.message || message
        }
        return Promise.reject({ message, status: error.response?.status ?? null })
    },
)

export { apiClient, BASE_URL }