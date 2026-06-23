# 🧺 Sistem Manajemen Laundry API

REST API untuk sistem manajemen laundry yang digunakan oleh owner dan karyawan.

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MySQL
- **Authentication:** JWT
- **Documentation:** Swagger

## Cara Menjalankan

1. Clone repositori
2. Copy `.env.example` menjadi `.env` dan sesuaikan konfigurasi database
3. Jalankan `database/schema.sql` ke MySQL
4. Install dependencies:
   ```bash
   npm install
   ```
5. Jalankan server:
   ```bash
   npm run dev
   ```
6. Buka dokumentasi Swagger di `http://localhost:3000/api-docs`

## Branch Strategy

```
main        → production
  develop   → integrasi fitur
    feature/* → pengembangan fitur
```

## Commit Convention

```
feat: menambahkan fitur baru
fix: memperbaiki bug
docs: perubahan dokumentasi
chore: perubahan konfigurasi
```

## Tim

Project Version: 1.0.0
