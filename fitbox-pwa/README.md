# FitBox PWA (Frontend)

Antarmuka web modern berbasis Progressive Web App (PWA) untuk layanan katering sehat dan pemantauan nutrisi harian FitBox.

## Teknologi Utama

- **React 18**: Komponen antarmuka pengguna yang reaktif dan modular.
- **Vite 5**: Server pengembangan cepat dan bundler aset teroptimasi.
- **Tailwind CSS v4**: Styling utilitas modern dengan performa tinggi.
- **Vite Plugin PWA & Workbox**: Service Worker, caching offline, dan kapabilitas pemasangan aplikasi.
- **Lucide React**: Paket ikon antarmuka yang ringan dan konsisten.
- **Supabase JS**: Otentikasi pengguna dan integrasi profil.

## Fitur Halaman & Komponen

1. **Beranda**: Hero editorial dengan tumpukan kartu menu animasi dan informasi keunggulan layanan.
2. **Katalog Paket**: Pencarian real-time, filter target kalori (turun, seimbang, naik), dan rincian makronutrisi.
3. **Kalkulator Kalori (TDEE/BMR)**: Perhitungan Mifflin-St Jeor dengan rekomendasi paket menu otomatis.
4. **Keranjang & Favorit**: Penyimpanan menu pilihan dan manajemen pemesanan lokal.
5. **Formulir Langganan**: Pemilihan durasi 1-30 hari, tanggal mulai H-1, alamat, dan catatan diet.
6. **Riwayat Pesanan**: Pelacakan status pesanan dan opsi simulasi pelunasan tagihan.
7. **Profil Pengguna**: Login/register Supabase Auth atau akses instan via Guest Device ID.

## Konfigurasi Lingkungan (.env)

Buat file `.env` di dalam direktori `fitbox-pwa`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Salin dari contoh template yang sudah disediakan:

```bash
cp .env.example .env
```

## Menjalankan Aplikasi

1. **Instalasi Dependensi**:
   ```bash
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```

3. **Build untuk Produksi**:
   ```bash
   npm run build
   ```

4. **Preview Hasil Build**:
   ```bash
   npm run preview
   ```

5. **Generate Ulang Ikon PWA**:
   ```bash
   npm run icons
   ```
