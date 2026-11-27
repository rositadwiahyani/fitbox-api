# 🥗 FitBox — Healthy & Diet Catering Subscription PWA

## 📖 Tentang Aplikasi FitBox

**FitBox** adalah platform langganan makanan diet dan katering sehat harian yang dirancang dengan pendekatan modern **Progressive Web App (PWA)** dan arsitektur decoupled (SPA Frontend + REST API Backend). 

Aplikasi ini memudahkan siapa pun untuk mencapai target kebugaran fisik mereka—baik untuk **penurunan berat badan (fat loss)**, **menjaga berat badan ideal (maintenance)**, maupun **peningkatan massa otot (muscle gain/surplus)**—melalui perhitungan nutrisi presisi berdasarkan formula ilmiah *Mifflin-St Jeor*, pemesanan paket makanan segar dengan durasi fleksibel (1–30 hari), serta pengalaman pemesanan yang cepat tanpa hambatan.

### 🌟 Keunggulan Utama:
- **Diantar Segar Subuh**: Makanan diolah segar tanpa minyak trans jenuh berlebih, bebas pengawet buatan, dan siap diantar hangat sebelum jam makan tiba.
- **Transparansi Makronutrisi**: Setiap menu dilengkapi detail kalori (kkal), protein, karbohidrat, lemak, serta serat alami.
- **PWA Offline-First**: Dapat dipasang ke layar utama ponsel/desktop (*Installable App*) dan tetap dapat diakses meski koneksi internet terputus atau lambat.
- **Akses Fleksibel (Guest & Member)**: Pengguna dapat memesan langsung menggunakan identitas perangkat (*Anonymous Device ID*) atau masuk menggunakan akun *Supabase Auth* untuk riwayat tersinkronisasi lintas perangkat.

---

## ✨ Fitur Utama

### 1. 🧮 Kalkulator Kalori & Makronutrisi Cerdas (TDEE & BMR)
- Menggunakan formula standar emas **Mifflin-St Jeor** untuk menghitung *Basal Metabolic Rate* (BMR).
- Mengintegrasikan faktor aktivitas fisik (sedentari, ringan, moderat, sangat aktif) untuk menghasilkan *Total Daily Energy Expenditure* (TDEE).
- Memberikan target kalori harian yang disesuaikan secara otomatis:
  - **Defisit Kalori**: $-500\text{ kkal/hari}$ (Penurunan lemak sehat $\approx 0.5\text{ kg/minggu}$)
  - **Keseimbangan Kalori**: $0\text{ kkal}$ (Mempertahankan berat badan)
  - **Surplus Kalori**: $+350\text{ kkal/hari}$ (Menaikkan massa otot kering)
- Memberikan rekomendasi paket menu langsung dari hasil hitungan kalori dengan satu klik.

### 2. 🥗 Katalog Menu & Paket Katering Sehat Interaktif
- Katalog menu lengkap dengan filter kategori target: **Semua**, **Turun Lemak**, **Jaga Berat Badan**, dan **Tambah Massa Otot**.
- Pencarian menu interaktif *real-time*.
- Rincian komprehensif pada halaman detail paket: foto resolusi tinggi, keunggulan gizi (*highlights*), komposisi makronutrisi, serta contoh jadwal menu harian (Pagi, Siang, Malam).

### 3. 🛒 Keranjang Belanja & Favorit (Wishlist)
- Simpan menu favorit untuk akses cepat.
- Modal keranjang belanja yang intuitif dengan informasi rincian harga, kuantitas, dan kemudahan langsung lanjut ke formulir pemesanan langganan.

### 4. 📦 Sistem Pemesanan Langganan Fleksibel
- Pengaturan durasi langganan fleksibel antara **1 hingga 30 hari**.
- Kalkulasi total biaya otomatis berdasarkan durasi langganan.
- Validasi tanggal mulai langganan minimal **H-1 WIB (besok hari)** untuk memastikan dapur katering dapat menyiapkan bahan segar.
- Dukungan catatan preferensi khusus (misal: alergi makanan, tingkat kepedasan, instruksi pengantaran).
- Pelacakan status pemesanan: `menunggu`, `dibayar`, `diproses`, `dikirim`, `selesai`, atau `dibatalkan`.
- Fitur simulasi pembayaran instan dan pembatalan pesanan sebelum pesanan diproses.

### 5. 📱 Progressive Web App (PWA) Offline-First
- Terintegrasi dengan **Workbox** dan Service Worker otomatis (`autoUpdate`).
- Dukungan caching aset statis dan Google Fonts (*StaleWhileRevalidate* & *CacheFirst*).
- Indikator status jaringan waktu nyata (*Online/Offline Status Bar*).
- Dialog alert offline cerdas dengan umpan balik getaran haptik (*haptic vibration*) jika pengguna mencoba melakukan transaksi saat offline.
- Tampilan splash screen responsif dan prompt instalasi aplikasi langsung di browser (*Add to Home Screen*).

### 6. 🔐 Dual-Mode Autentikasi & Profil Pengguna
- **Guest Mode**: Pengguna langsung dapat menggunakan seluruh fitur aplikasi dan melihat pesanan mereka yang diikat dengan `device_id` unik perangkat.
- **Member Mode**: Dukungan otentikasi penuh dengan **Supabase Auth** (Login / Registrasi email & password), terhubung ke tabel relasional `profiles` untuk menyimpan nama, nomor telepon, dan alamat pengiriman tetap.

### 7. 🎨 Desain Editorial Modern (Neo-Brutalist Organic)
- Estetika unik bernuansa hangat dan alami: warna hijau daun (*Leaf Green* `#2f6b3a`), teks tinta (*Ink*), aksen bata terakota (*Brick*), dan kertas krem (*Paper*).
- Tampilan kartu berlapis animasi (*Hero Card Stack*) di halaman beranda.
- Navigasi responsif: Desktop Header yang rapi dan Mobile Sticky Bottom Navigation Bar yang ramah jempol.

---

## 🛠️ Ekosistem & Arsitektur Teknologi

FitBox dibangun dengan memisahkan sisi antarmuka klien (Frontend PWA) dan sisi server logika bisnis (Backend API) untuk menjaga skalabilitas, kecepatan render, dan keandalan data.

```
┌────────────────────────────────────────────────────────────────┐
│                       FITBOX ECOSYSTEM                         │
└────────────────────────────────────────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌────────────────────────┐            ┌────────────────────────┐
│   fitbox-pwa           │            │   fitbox-api           │
│   (Frontend PWA)       │            │   (Backend REST API)   │
├────────────────────────┤            ├────────────────────────┤
│ • React 18 (SPA)       │   HTTP     │ • Node.js (ES Modules) │
│ • Vite 5               │  (Axios)   │ • Express.js v5        │
│ • Tailwind CSS v4      ├───────────►│ • CORS & Dotenv        │
│ • Vite PWA (Workbox)   │            │ • Vercel Serverless    │
│ • Lucide React Icons   │            └───────────┬────────────┘
│ • Supabase Auth Client │                        │
└────────────────────────┘                        │ Supabase JS
            │                                     │ SDK
            ▼                                     ▼
┌──────────────────────────────────────────────────────────────┐
│                    SUPABASE (BaaS / Cloud)                   │
├──────────────────────────────────────────────────────────────┤
│ • PostgreSQL 15 Database (Tabel: packages, orders, profiles) │
│ • Supabase Auth (Manajemen Token & Sesi Pengguna)            │
│ • Row Level Security (RLS) & Triggers                        │
└──────────────────────────────────────────────────────────────┘
```

### Rincian Teknologi yang Digunakan:

| Kategori | Teknologi | Deskripsi / Peran |
|---|---|---|
| **Frontend Framework** | **React 18.3** | Library deklaratif berbasis komponen untuk antarmuka yang cepat dan reaktif. |
| **Build Tool & Bundler**| **Vite 5.3** | Development server instan dengan Hot Module Replacement (HMR) berkecepatan tinggi. |
| **Styling Engine** | **Tailwind CSS v4** | Framework utilitas CSS generasi terbaru menggunakan engine `@tailwindcss/vite`. |
| **PWA & Offline** | **vite-plugin-pwa / Workbox** | Mengelola Service Worker, precaching aset, Web App Manifest, dan strategi offline. |
| **Icons Pack** | **Lucide React** | Ikon modern, ringan, dan konsisten di seluruh elemen UI. |
| **HTTP Client** | **Axios 1.21** | Klien HTTP berbasis Promise dengan custom timeout dan response interceptors. |
| **Backend Runtime** | **Node.js (ESM)** | Ekosistem JavaScript modern dengan sintaks modul ES native (`import`/`export`). |
| **Backend Framework** | **Express.js 5.3** | Framework web minimalis untuk routing RESTful API, middleware, dan pengolahan request. |
| **Database & Auth** | **Supabase (PostgreSQL)** | Layanan Database Relasional berbasis PostgreSQL, Supabase Auth, dan API SDK. |
| **Deploy Target** | **Vercel** | Konfigurasi serverless function siap pakai melalui `fitbox-api/vercel.json`. |

---

## 📁 Struktur Direktori Proyek

Proyek ini menggunakan struktur monorepo terorganisir yang memisahkan aplikasi frontend dan backend:

```text
fitbox/
├── fitbox-api/                     # 🚀 Backend RESTful API (Express + Supabase)
│   ├── src/
│   │   ├── config/
│   │   │   └── supabaseClient.js   # Inisialisasi client Supabase dengan kredensial env
│   │   ├── controllers/
│   │   │   ├── packageController.js # Logika CRUD paket menu makanan
│   │   │   └── orderController.js   # Logika pemesanan, validasi H-1, update, & pembayaran
│   │   ├── data/
│   │   │   └── packagesData.js     # Data katalog awal 22 menu diet lengkap
│   │   ├── models/
│   │   │   ├── packageModel.js     # Interaksi query database tabel packages
│   │   │   └── orderModel.js       # Interaksi query database tabel orders
│   │   ├── routes/
│   │   │   ├── packageRoutes.js    # Routing endpoint /api/packages
│   │   │   └── orderRoutes.js      # Routing endpoint /api/orders
│   │   └── index.js                # Entry point server Express & konfigurasi CORS
│   ├── .env.example                # Template konfigurasi environment backend
│   ├── package.json                # Dependencies & scripts backend
│   ├── seed_packages.js            # Skrip seeder otomatis untuk populasi database
│   └── vercel.json                 # Konfigurasi deployment serverless ke Vercel
│
├── fitbox-pwa/                     # 💻 Frontend Progressive Web App (React + Vite)
│   ├── public/                     # Aset publik, favicon, dan ikon PWA
│   │   ├── favicon.svg
│   │   └── icons/                  # Ikon aplikasi 192x192, 512x512, maskable
│   ├── scripts/
│   │   └── generate-icons.mjs      # Otomatisasi generate icon multi-resolusi via Sharp
│   ├── src/
│   │   ├── components/             # Komponen UI modular
│   │   │   ├── Navbar.jsx          # Header desktop & sticky bottom navigation bar
│   │   │   ├── HeroCardStack.jsx   # Animasi tumpukan kartu menu pada hero section
│   │   │   ├── PackageCard.jsx     # Kartu tampilan paket menu & nutrisi
│   │   │   ├── CartModal.jsx       # Modal drawer keranjang belanja
│   │   │   ├── OrderForm.jsx       # Modal formulir pemesanan langganan
│   │   │   ├── OfflineAlertModal.jsx # Alert modal penanganan koneksi offline
│   │   │   ├── SplashScreen.jsx    # Layar pembuka (splash screen) PWA
│   │   │   ├── StatusBar.jsx       # Status bar notifikasi online/offline
│   │   │   └── Footer.jsx          # Informasi footer & brand
│   │   ├── config/
│   │   │   ├── api.js              # Klien Axios & konfigurasi URL backend
│   │   │   └── supabaseClient.js   # Klien Supabase Auth untuk frontend
│   │   ├── hooks/                  # Custom React Hooks
│   │   │   ├── usePackages.js      # Fetching data menu & caching lokal
│   │   │   ├── useOrders.js        # Operasi CRUD pesanan pengguna
│   │   │   ├── useProfile.js       # Sinkronisasi status login Supabase Auth & profil
│   │   │   ├── useCartAndFavorites.js # Manajemen state keranjang & wishlist
│   │   │   ├── useOnlineStatus.js  # Detektor koneksi internet real-time
│   │   │   └── useInstallPrompt.js # Handler instalasi PWA ke homescreen
│   │   ├── pages/                  # Halaman utama aplikasi
│   │   │   ├── Home.jsx            # Landing page beranda
│   │   │   ├── Packages.jsx        # Halaman katalog seluruh menu
│   │   │   ├── PackageDetail.jsx   # Rincian menu, makronutrisi, & jadwal makan
│   │   │   ├── Calculator.jsx      # Kalkulator kalori Mifflin-St Jeor TDEE/BMR
│   │   │   ├── Orders.jsx          # Riwayat & status pesanan langganan
│   │   │   ├── OrderDetail.jsx     # Detail spesifik pesanan & simulasi bayar
│   │   │   └── Profile.jsx         # Akun pengguna, favorit, & autentikasi
│   │   ├── App.jsx                 # Komponen root & routing state
│   │   ├── main.jsx                # Entry point React
│   │   └── utils.js                # Format rupiah, kalkulator TDEE, generator ID
│   ├── .env.example                # Template konfigurasi environment frontend
│   ├── index.html                  # Dokumen HTML utama & meta tag PWA
│   ├── package.json                # Dependencies & scripts frontend
│   └── vite.config.js              # Konfigurasi plugin Vite, Tailwind, & Workbox PWA
│
├── supabase_schema.sql             # 🗄️ Skrip SQL skema database Supabase lengkap
└── README.md                       # 📄 Dokumentasi utama proyek FitBox
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Ikuti langkah-langkah di bawah ini untuk menjalankan ekosistem FitBox secara lokal di komputer Anda.

### 📋 Prasyarat Sistem
- **Node.js**: Versi `18.x` atau lebih baru ([Unduh Node.js](https://nodejs.org/))
- **npm** (bawaan Node.js) atau **pnpm** / **yarn**
- **Git** ([Unduh Git](https://git-scm.com/))
- Akun **Supabase** gratis ([supabase.com](https://supabase.com))

---

### Langkah 1: Kloning Repositori
```bash
git clone https://github.com/username/fitbox.git
cd fitbox
```

---

### Langkah 2: Setup Database Supabase
1. Masuk ke [Supabase Dashboard](https://app.supabase.com/) dan buat proyek baru.
2. Buka menu **SQL Editor** pada navigasi sisi kiri dashboard Supabase.
3. Salin isi file [`supabase_schema.sql`](supabase_schema.sql) yang tersedia di root proyek ini, lalu tempelkan ke SQL Editor dan tekan **Run**.
4. Skrip ini akan membuat:
   - Tabel `packages` beserta index.
   - Tabel `orders` beserta relasi dan index.
   - Tabel `profiles` beserta trigger otomatis untuk akun Supabase Auth baru.
   - Konfigurasi *Row Level Security (RLS)*.
5. Buka **Project Settings** -> **API**, lalu catat:
   - `Project URL`
   - `anon / public key`
   - `service_role key` (rahasia, untuk backend)

---

### Langkah 3: Setup & Jalankan Backend API (`fitbox-api`)

1. Pindah ke direktori `fitbox-api`:
   ```bash
   cd fitbox-api
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` berdasarkan template:
   ```bash
   cp .env.example .env
   ```
   *Di Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```

4. Buka `.env` dan sesuaikan kredensial:
   ```env
   PORT=3000
   SUPABASE_URL=https://proyek-anda.supabase.co
   SUPABASE_KEY=kunci-supabase-anda
   ```

5. **Populasi Data Awal Menu (Seeding Database)**:
   Jalankan skrip seeder untuk mengisi 22 menu katering diet lengkap ke database:
   ```bash
   npm run seed
   ```

6. Jalankan server backend dalam mode pengembangan:
   ```bash
   npm run dev
   ```
   Server backend akan aktif di: `http://localhost:3000`

---

### Langkah 4: Setup & Jalankan Frontend PWA (`fitbox-pwa`)

1. Buka terminal baru dan masuk ke direktori `fitbox-pwa`:
   ```bash
   cd fitbox-pwa
   ```

2. Pasang dependensi:
   ```bash
   npm install
   ```

3. Buat file `.env` berdasarkan template:
   ```bash
   cp .env.example .env
   ```
   *Di Windows PowerShell:*
   ```powershell
   Copy-Item .env.example .env
   ```

4. Sesuaikan isi file `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_SUPABASE_URL=https://proyek-anda.supabase.co
   VITE_SUPABASE_ANON_KEY=kunci-anon-supabase-anda
   ```

5. Jalankan server frontend:
   ```bash
   npm run dev
   ```
   Buka peramban di `http://localhost:5173` (atau port yang tertera di terminal).

---

## 📡 Dokumentasi REST API

Backend FitBox mengekspos endpoint RESTful API berbasis JSON dengan *base URL*: `/api`

### 1. Endpoint Paket Menu (`/api/packages`)

| Method | Endpoint | Deskripsi | Query / Body Params |
|---|---|---|---|
| `GET` | `/api/packages` | Mengambil seluruh katalog menu paket | Tidak ada |
| `GET` | `/api/packages/:id` | Mengambil satu detail paket berdasarkan ID | `id` (param) |
| `POST` | `/api/packages` | Menambahkan paket menu baru | JSON body paket lengkap |
| `PUT` | `/api/packages/:id` | Memperbarui data paket | JSON body paket |
| `DELETE`| `/api/packages/:id` | Menghapus paket dari katalog | `id` (param) |

#### Contoh Respons `GET /api/packages`:
```json
[
  {
    "id": 1,
    "name": "Salmon Green Goddess Bowl",
    "goal": "turun",
    "calories": 480,
    "protein": 42,
    "carbs": 38,
    "fats": 14,
    "fiber": 8,
    "price_per_day": 48000,
    "image_url": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
    "description": "Fillet salmon Norwegia segar dipanggang...",
    "highlights": [
      "Tinggi Asam Lemak Omega-3",
      "Rendah Sodium & Tanpa MSG"
    ],
    "menu_sample": "Pagi: Smoothie bayam nanas... Siang: Salmon panggang..."
  }
]
```

---

### 2. Endpoint Pesanan (`/api/orders`)

| Method | Endpoint | Deskripsi | Parameter / Payload |
|---|---|---|---|
| `GET` | `/api/orders` | Mengambil daftar pesanan | `?device_id=...` atau `?user_id=...` |
| `POST` | `/api/orders` | Membuat pesanan langganan baru | JSON payload pesanan (lihat contoh) |
| `PUT` | `/api/orders/:id` | Memperbarui data pesanan (status: `menunggu`) | JSON payload pembaruan + `device_id` |
| `POST` | `/api/orders/:id/pay` | Simulasi pembayaran pesanan | `{ "device_id": "..." }` |
| `DELETE`| `/api/orders/:id` | Membatalkan pesanan (status: `menunggu`) | `?device_id=...` |

#### Contoh Payload `POST /api/orders`:
```json
{
  "device_id": "c1f7a83d-9214-4eb9-bf25-5460a169b188",
  "user_id": "optional-uuid-jika-login",
  "package_id": 1,
  "package_name": "Salmon Green Goddess Bowl",
  "price_per_day": 48000,
  "customer_name": "Budi Santoso",
  "phone": "081234567890",
  "address": "Jl. Sudirman No. 45, Jakarta Selatan",
  "duration_days": 7,
  "start_date": "2026-11-29",
  "notes": "Tidak pakai daun ketumbar, pisahkan dressing.",
  "payment_method": "transfer_bank",
  "total": 336000
}
```

---

## 🧮 Algoritma & Logika Perhitungan Kalori

Perhitungan kebutuhan energi harian pada halaman **Kalkulator Kalori** menggunakan rumus ilmiah **Mifflin-St Jeor**, yang diakui oleh para ahli gizi internasional sebagai salah satu metode estimasi BMR paling akurat.

### 1. Rumus Basal Metabolic Rate (BMR)
$$\text{BMR}_{\text{Pria}} = (10 \times \text{BB}_{\text{kg}}) + (6.25 \times \text{TB}_{\text{cm}}) - (5 \times \text{Usia}_{\text{tahun}}) + 5$$

$$\text{BMR}_{\text{Wanita}} = (10 \times \text{BB}_{\text{kg}}) + (6.25 \times \text{TB}_{\text{cm}}) - (5 \times \text{Usia}_{\text{tahun}}) - 161$$

### 2. Total Daily Energy Expenditure (TDEE)
$$\text{TDEE} = \text{BMR} \times \text{Faktor Aktivitas}$$

| Tingkat Aktivitas | Nilai Pengali | Keterangan |
|---|---|---|
| **Sedentari (Jarang Olahraga)** | `1.2` | Bekerja di depan meja, sedikit aktivitas fisik harian |
| **Ringan (1-3 hari/minggu)** | `1.375` | Jalan santai, peregangan, atau olahraga ringan |
| **Moderat (3-5 hari/minggu)** | `1.55` | Jogging, gym rutin, renang, atau bersepeda |
| **Sangat Aktif (6-7 hari/minggu)** | `1.725` | Atlet, latihan angkat beban intens, pekerjaan fisik berat |

### 3. Penyesuaian Kalori Berdasarkan Target
- **Turun Lemak**: $\text{Target} = \text{TDEE} - 500\text{ kkal}$
- **Jaga Berat Badan**: $\text{Target} = \text{TDEE}$
- **Tambah Massa Otot**: $\text{Target} = \text{TDEE} + 350\text{ kkal}$

---

## 📱 Fitur Progressive Web App (PWA)

FitBox didesain secara matang untuk memenuhi standar **Progressive Web App (PWA)** sehingga dapat berfungsi layaknya aplikasi native mobile dan desktop:

1. **Instalasi Satu Klik**:
   - Di Android (Chrome): Klik tombol **Pasang Aplikasi** yang muncul di bilah atas atau menu browser (*Add to Home Screen*).
   - Di iOS (Safari): Ketuk ikon **Share** (kotak panah ke atas) $\rightarrow$ pilih **Add to Home Screen**.
   - Di Desktop (Chrome / Edge): Klik ikon instalasi di sebelah kanan bilah alamat URL.
2. **Offline Resilience**:
   - Berkat **Workbox**, halaman yang pernah dimuat dapat dibuka kembali meski perangkat tidak memiliki koneksi internet.
   - Peringatan instan berupa popup modal ramah pengguna dan getaran haptic apabila mencoba membuat pesanan tanpa koneksi data.
3. **Penyimpanan Lokal (Local Caching)**:
   - Data profil tamu, keranjang belanja, menu favorit, dan data cadangan menu tersimpan aman di `localStorage`.

---

## 🚢 Panduan Deployment

### Deploy Backend (`fitbox-api`) ke Vercel:
1. Pastikan Anda telah menginstal Vercel CLI (`npm i -g vercel`) atau menghubungkan repositori GitHub ke dashboard Vercel.
2. File konfigurasi [`vercel.json`](fitbox-api/vercel.json) telah disediakan di dalam folder `fitbox-api`.
3. Tambahkan environment variables di dashboard proyek Vercel:
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
4. Jalankan perintah `vercel` di dalam folder `fitbox-api`.

### Deploy Frontend (`fitbox-pwa`) ke Vercel / Netlify / Cloudflare Pages:
1. Jalankan build produksi:
   ```bash
   cd fitbox-pwa
   npm run build
   ```
2. Aset hasil build berada di folder `fitbox-pwa/dist`.
3. Tentukan Environment Variables pada platform hosting:
   - `VITE_API_BASE_URL`: URL Backend API yang sudah dideploy (misal: `https://api-fitbox.vercel.app/api`)
   - `VITE_SUPABASE_URL`: URL Supabase Anda
   - `VITE_SUPABASE_ANON_KEY`: Anon Key Supabase Anda
4. Konfigurasikan Single Page Application (SPA) rewrite agar seluruh rute diarahkan ke `/index.html`.

---

## 🛡️ Lisensi & Hak Cipta

Proyek ini dirilis di bawah lisensi MIT. Anda bebas menggunakan, memodifikasi, dan mengembangkan kode ini untuk keperluan edukasi maupun komersial dengan tetap mencantumkan atribusi pengembang.

---

<div align="center">
  <p>Dibuat dengan ❤️ untuk mendukung gaya hidup sehat dan pemenuhan gizi seimbang masyarakat Indonesia.</p>
  <strong>FitBox — Fresh, Healthy, and Nourishing Every Day.</strong>
</div>
