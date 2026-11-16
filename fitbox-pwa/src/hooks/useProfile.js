import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../config/supabaseClient'
import { uid } from '../utils'

const PROFILE_KEY = 'fitbox:profile'
const USER_KEY = 'fitbox:auth_user'

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

    // Login dengan Supabase Auth
    const login = useCallback(
        async (email, password) => {
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
            if (!formData.email || !formData.password || !formData.name) {
                return { success: false, error: 'Nama lengkap, email, dan password wajib diisi.' }
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
        } catch {}
        setUser(null)
        localStorage.removeItem(USER_KEY)
    }, [])

    return {
        user,
        isLoggedIn: !!user,
        profile,
        loading,
        saveProfile,
        login,
        register,
        logout,
    }
}
