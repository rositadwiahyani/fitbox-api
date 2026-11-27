# FitBox API Service

RESTful API backend untuk aplikasi katering dan diet sehat FitBox. Dibangun menggunakan Express.js 5 dan terhubung dengan database Supabase PostgreSQL.

## Fitur & Kemampuan

- **Katalog Menu Katering**: Endpoint CRUD untuk daftar paket makanan, informasi gizi lengkap, dan sampel menu harian.
- **Manajemen Pesanan**: Pembuatan dan pelacakan pesanan langganan harian (1-30 hari) dengan validasi tanggal pengiriman H-1 WIB.
- **Otentikasi & Kepemilikan**: Dukungan identitas berbasis perangkat (`device_id`) dan akun Supabase (`user_id`).
- **Simulasi Pembayaran**: Endpoint untuk simulasi status pelunasan transaksi pesanan.
- **Seeder Otomatis**: Skrip otomatis untuk mengisi data 22 varian menu sehat langsung ke database Supabase.

## Kebutuhan Sistem

- Node.js versi 18 atau lebih baru
- Database Supabase (PostgreSQL)

## Konfigurasi Lingkungan (.env)

Buat file `.env` di dalam direktori `fitbox-api`:

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
```

Salin dari contoh template yang sudah disediakan:

```bash
cp .env.example .env
```

## Menjalankan Server

1. **Instalasi Paket**:
   ```bash
   npm install
   ```

2. **Seeding Katalog Paket**:
   ```bash
   npm run seed
   ```

3. **Jalankan Mode Pengembangan (Dev)**:
   ```bash
   npm run dev
   ```

4. **Jalankan Mode Produksi**:
   ```bash
   npm start
   ```

Server akan aktif secara default di `http://localhost:3000`.

## Ringkasan Endpoint

### Paket (`/api/packages`)
- `GET /api/packages` — Daftar seluruh paket makanan
- `GET /api/packages/:id` — Detail spesifik paket
- `POST /api/packages` — Tambah paket baru
- `PUT /api/packages/:id` — Perbarui data paket
- `DELETE /api/packages/:id` — Hapus paket

### Pesanan (`/api/orders`)
- `GET /api/orders?device_id=...` — Ambil riwayat pesanan berdasarkan perangkat
- `GET /api/orders?user_id=...` — Ambil riwayat pesanan berdasarkan ID pengguna
- `POST /api/orders` — Buat pesanan baru (kirim `items: [{ package_id, qty }]`; harga harian, total, `package_name`, dan status `menunggu` dihitung di backend)
- `PUT /api/orders/:id` — Ubah data pesanan (status `menunggu`, `total` dihitung ulang di backend)
- `POST /api/orders/:id/pay` — Simulasi pembayaran pesanan
- `DELETE /api/orders/:id` — Batalkan pesanan

#### Contoh Payload `POST /api/orders`
```json
{
  "device_id": "device-123",
  "user_id": null,
  "items": [
    { "package_id": 1, "qty": 1 },
    { "package_id": 2, "qty": 2 }
  ],
  "customer_name": "Budi Santoso",
  "phone": "081234567890",
  "address": "Jl. Sudirman No. 45, Jakarta",
  "duration_days": 7,
  "start_date": "2026-11-29",
  "notes": "Tanpa sambal",
  "payment_method": "transfer_bank"
}
```
