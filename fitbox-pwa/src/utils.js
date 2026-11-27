export const rupiah = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

// randomUUID hanya ada di HTTPS/localhost, jadi siapkan cadangan
export const uid = () =>
    crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`

// Rumus Mifflin-St Jeor: BMR x faktor aktivitas = kebutuhan kalori harian (TDEE)
export function calcTDEE({ gender, weight, height, age, activity }) {
    const bmr = 10 * Number(weight) + 6.25 * Number(height) - 5 * Number(age) + (gender === 'male' ? 5 : -161)
    return Math.round(bmr * Number(activity))
}

const wibDateFormatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
})

// Tanggal besok (H-1) menurut zona waktu Asia/Jakarta (WIB) dalam format YYYY-MM-DD
export function getTomorrowWIB() {
    return wibDateFormatter.format(new Date(Date.now() + 24 * 60 * 60 * 1000))
}