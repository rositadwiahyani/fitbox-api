import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../config/supabaseClient'
import { uid } from '../utils'

const PROFILE_KEY = 'fitbox:profile'
const USER_KEY = 'fitbox:auth_user'
const ADMIN_EMAIL = 'admin@gmail.com'
const ADMIN_PASS = 'admin1234'

function checkIsAdmin(userObj) {
    return (
        userObj?.role === 'admin' ||
        userObj?.email?.trim().toLowerCase() === ADMIN_EMAIL
    )
}

function loadSavedUser() {
    try {
        const raw = localStorage.getItem(USER_KEY)
        if (!raw) return null
        return JSON.parse(raw)
    } catch {
        return null
    }
}

function loadSavedProfile(user) {
    try {
        const raw = localStorage.getItem(PROFILE_KEY)
        if (raw) {
            const parsed = JSON.parse(raw)
            if (user) {
                parsed.name = user.name || parsed.name || 'User FitBox'
                parsed.email = user.email || parsed.email || ''
                parsed.phone = user.phone || parsed.phone || '081234567890'
                parsed.address = user.address || parsed.address || 'Jl. Sehat Bugar No. 10, Jakarta'
                localStorage.setItem(PROFILE_KEY, JSON.stringify(parsed))
            }
            return parsed
        }
    } catch { }

    const fresh = {
        deviceId: uid(),
        name: user?.name || 'User FitBox',
        email: user?.email || '',
        phone: user?.phone || '081234567890',
        address: user?.address || 'Jl. Sehat Bugar No. 10, Jakarta',
    }
    localStorage.setItem(PROFILE_KEY, JSON.stringify(fresh))
    return fresh
}

export function useProfile() {
    const [user, setUser] = useState(loadSavedUser)
    const [profile, setProfile] = useState(() => loadSavedProfile(user))
    const [loading, setLoading] = useState(false)

    // Helper untuk sinkronisasi data user dari Supabase Auth + Tabel profiles
    const syncUser = useCallback(async (authUser) => {
        if (!authUser) {
            setUser(null)
            localStorage.removeItem(USER_KEY)
            return null
        }

        let name = authUser.user_metadata?.name || ''
        let phone = authUser.user_metadata?.phone || ''
        let address = authUser.user_metadata?.address || ''

        // Jika metadata kosong, coba ambil dari tabel profiles di Supabase
        try {
            const { data: row } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', authUser.id)
                .maybeSingle()

            if (row) {
                name = row.name || name
                phone = row.phone || phone
                address = row.address || address
            }
        } catch (err) {
            console.warn('Gagal memuat baris tabel profiles:', err)
        }

        if (!name) {
            const prefix = authUser.email ? authUser.email.split('@')[0] : 'User'
            name = prefix.charAt(0).toUpperCase() + prefix.slice(1)
        }

        const formatted = {
            id: authUser.id,
            email: authUser.email,
            name: name || 'User FitBox',
            phone: phone || '081234567890',
            address: address || 'Jl. Sehat Bugar No. 10, Jakarta',
        }

        setUser(formatted)
        localStorage.setItem(USER_KEY, JSON.stringify(formatted))

        setProfile((prev) => {
            const next = {
                ...prev,
                name: formatted.name,
                email: formatted.email,
                phone: formatted.phone,
                address: formatted.address,
            }
            localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
            return next
        })

        return formatted
    }, [])

    // Periksa sesi aktif Supabase saat aplikasi dimuat & dengarkan perubahan sesi
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                syncUser(session.user)
            }
        }).catch((err) => {
            console.warn('Cek sesi Supabase gagal:', err)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                await syncUser(session.user)
            } else if (_event === 'SIGNED_OUT') {
                setUser(null)
                localStorage.removeItem(USER_KEY)
            }
        })

        return () => subscription.unsubscribe()
    }, [syncUser])

    // Update profil di local state dan sinkronkan ke tabel profiles Supabase
    const saveProfile = useCallback(
        async (data) => {
            setProfile((prev) => {
                const next = { ...prev, ...data }
                localStorage.setItem(PROFILE_KEY, JSON.stringify(next))
                return next
            })

            if (user) {
                const nextUser = { ...user, ...data }
                setUser(nextUser)
                localStorage.setItem(USER_KEY, JSON.stringify(nextUser))

                try {
                    // Update ke tabel profiles di Supabase
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        name: data.name || nextUser.name,
                        phone: data.phone || nextUser.phone,
                        address: data.address || nextUser.address,
                    })

                    // Update metadata auth
                    await supabase.auth.updateUser({
                        data: {
                            name: data.name || nextUser.name,
                            phone: data.phone || nextUser.phone,
                            address: data.address || nextUser.address,
                        },
                    })
                } catch (err) {
                    console.warn('Gagal menyimpan profil ke Supabase:', err)
                }
            }
        },
        [user],
    )

    // Login dengan akun Admin atau Supabase Auth
    const login = useCallback(
        async (email, password) => {
            const normalizedEmail = email.trim().toLowerCase()

            if (normalizedEmail === ADMIN_EMAIL) {
                if (password !== ADMIN_PASS) {
                    return { success: false, error: 'Email atau password admin salah.' }
                }
                const adminUser = {
                    id: 'admin-fitbox',
                    email: ADMIN_EMAIL,
                    name: 'Admin FitBox',
                    phone: '081234567890',
                    address: 'Dapur Pusat FitBox',
                    role: 'admin',
                }
                setUser(adminUser)
                localStorage.setItem(USER_KEY, JSON.stringify(adminUser))
                return { success: true, user: adminUser }
            }

            setLoading(true)
            try {
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: email.trim(),
                    password,
                })

                if (error) {
                    setLoading(false)
                    return { success: false, error: error.message }
                }

                if (data?.user) {
                    const synced = await syncUser(data.user)
                    setLoading(false)
                    return { success: true, user: synced }
                }

                setLoading(false)
                return { success: false, error: 'User tidak ditemukan' }
            } catch (err) {
                setLoading(false)
                return { success: false, error: err.message || 'Gagal login ke server' }
            }
        },
        [syncUser],
    )

    // Register akun baru di Supabase Auth + Simpan ke tabel profiles
    const register = useCallback(
        async (formData) => {
            const trimmedName = formData.name?.trim() || ''
            const trimmedPhone = formData.phone?.trim() || ''

            if (!formData.email || !formData.password || !trimmedName) {
                return { success: false, error: 'Nama lengkap, email, dan password wajib diisi.' }
            }
            if (formData.email.trim().toLowerCase() === ADMIN_EMAIL) {
                return { success: false, error: 'Email tersebut khusus untuk akun Admin.' }
            }
            if (!/^[a-zA-Z ]+$/.test(trimmedName)) {
                return { success: false, error: 'Nama lengkap hanya boleh berisi huruf (tidak boleh angka atau karakter khusus).' }
            }
            if (!/^08\d{8,13}$/.test(trimmedPhone)) {
                return {
                    success: false,
                    error: !trimmedPhone.startsWith('08')
                        ? 'Nomor telepon harus diawali 08 (bukan +62 atau format lainnya).'
                        : 'Nomor telepon harus terdiri dari 10–15 digit angka yang diawali 08.',
                }
            }
            if (formData.password.length < 6) {
                return { success: false, error: 'Password minimal 6 karakter.' }
            }

            setLoading(true)
            try {
                // 1. Daftarkan akun ke Supabase Auth
                const { data, error } = await supabase.auth.signUp({
                    email: formData.email.trim(),
                    password: formData.password,
                    options: {
                        data: {
                            name: formData.name.trim(),
                            phone: formData.phone?.trim() || '',
                            address: formData.address?.trim() || '',
                        },
                    },
                })

                if (error) {
                    setLoading(false)
                    return { success: false, error: error.message }
                }

                const authUser = data?.user
                if (!authUser) {
                    setLoading(false)
                    return { success: false, error: 'Gagal membuat user Supabase' }
                }

                // 2. Simpan data detail pengguna ke tabel `profiles` di Supabase
                try {
                    const { error: profileError } = await supabase.from('profiles').upsert({
                        id: authUser.id,
                        name: formData.name.trim(),
                        phone: formData.phone?.trim() || '',
                        address: formData.address?.trim() || '',
                    })

                    if (profileError) {
                        console.warn('Upsert ke tabel profiles gagal:', profileError.message)
                    }
                } catch (pe) {
                    console.warn('Error query profiles:', pe)
                }

                const newUser = {
                    id: authUser.id,
                    email: authUser.email,
                    name: formData.name.trim(),
                    phone: formData.phone?.trim() || '081234567890',
                    address: formData.address?.trim() || 'Jl. Sehat Bugar No. 10, Jakarta',
                }

                setUser(newUser)
                localStorage.setItem(USER_KEY, JSON.stringify(newUser))
                saveProfile(newUser)

                setLoading(false)
                return { success: true, user: newUser }
            } catch (err) {
                setLoading(false)
                return { success: false, error: err.message || 'Gagal mendaftar ke server' }
            }
        },
        [saveProfile],
    )

    // Logout
    const logout = useCallback(async () => {
        try {
            await supabase.auth.signOut()
        } catch { }
        setUser(null)
        localStorage.removeItem(USER_KEY)
    }, [])

    return {
        user,
        isLoggedIn: !!user,
        isAdmin: checkIsAdmin(user),
        profile,
        loading,
        saveProfile,
        login,
        register,
        logout,
    }
}
