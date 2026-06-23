![Status](https://img.shields.io/badge/status-development-yellow)
<p align="center">
  <img src="frontend/public/assets/logo-app.png" width="350" alt="LaundryKu Logo">
</p>
<p align="center">
  <b>Sistem Manajemen Laundry Digital</b><br>
  Aplikasi untuk membantu usaha laundry mengelola pelanggan, transaksi, status cucian, nota, dan riwayat transaksi secara lebih mudah.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React.js-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" />
  <img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white" />
  <img src="https://img.shields.io/badge/Sonner-000000?style=for-the-badge&logo=sonner&logoColor=white" />

  <br/>

  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/bcryptjs-338833?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" />
  <img src="https://img.shields.io/badge/Nodemon-76D04B?style=for-the-badge&logo=nodemon&logoColor=white" />
  <img src="https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=dotenv&logoColor=black" />
</p>

---

## 📌 Tentang Project

**LaundryKu** adalah aplikasi manajemen laundry berbasis web yang dibuat untuk membantu pemilik usaha laundry dan karyawan dalam melakukan operasional harian.

Dengan LaundryKu, proses pencatatan laundry yang sebelumnya manual dapat dilakukan secara digital — mulai dari pelanggan masuk hingga transaksi selesai — dengan tampilan yang modern dan mudah digunakan.

---

## 📸 Screenshot

<div align="center">

| Login | Dashboard |
|:---:|:---:|
| ![Login](frontend/public/docs/login.png) | ![Dashboard](frontend/public/docs/Dashboard.png) |

| Data Member | Transaksi |
|:---:|:---:|
| ![Member](frontend/public/docs/Member.png) | ![Transaksi](frontend/public/docs/transaksi.png) |

</div>

---

## ✨ Fitur

### 🔐 Authentication
| Fitur | Keterangan |
|-------|-----------|
| Login Owner | Akses penuh ke seluruh fitur |
| Login Karyawan | Akses terbatas sesuai role |
| Role Based Access | Keamanan data terjaga |

### 👤 Customer Management
- ➕ Tambah pelanggan baru
- ✏️ Edit data pelanggan
- 🗑️ Hapus pelanggan
- 📋 Riwayat transaksi per pelanggan

### 🧺 Transaction Management
- 📝 Membuat transaksi laundry
- 💰 Menghitung total harga otomatis
- 📦 Menyimpan detail cucian
- 🔍 Melihat detail transaksi

### 🔄 Status Cucian

```mermaid
graph LR
    A[📥 Received] --> B[⚙️ Processing]
    B --> C[✅ Finished]
    C --> D[📤 Picked Up]
```

### 🧾 Invoice / Nota
- 🖨️ Generate nota transaksi
- 💵 Detail pembayaran
- 🖨️ Cetak nota (print-ready)

### 📜 Riwayat Transaksi
- 📋 Seluruh riwayat transaksi
- 🔎 Filter berdasarkan tanggal
- 🔍 Pencarian data pelanggan

---

## 🏗️ Arsitektur Sistem

```mermaid
graph TB
    subgraph Frontend
        A[React + Vite] --> B[shadcn/ui]
        A --> C[Axios]
        A --> D[React Router]
    end
    
    subgraph Backend
        E[Laravel / Node.js API]
    end
    
    subgraph Database
        F[MySQL]
    end
    
    A <-->|REST API| E
    E <--> F
```

---

## 🛠️ Tech Stack

### Frontend
| Teknologi | Kegunaan |
|-----------|----------|
| **React.js** | Library UI utama |
| **Vite** | Build tool cepat |
| **shadcn/ui** | Komponen UI modern |
| **Tailwind CSS** | Styling utility-first |
| **Axios** | HTTP client |
| **React Router** | Routing SPA |
| **Lucide React** | Icons |

### Backend
| Teknologi | Kegunaan |
|-----------|----------|
| Laravel / Node.js | API server |
| JWT Authentication | Sistem login |
| REST API | Komunikasi data |

### Database
| Teknologi | Kegunaan |
|-----------|----------|
| MySQL | Database utama |

---

## 📂 Struktur Repository

```
LaundryKu
│
├── 📁 frontend
│   ├── 📁 src
│   │   ├── 📁 components/ui    # Komponen shadcn/ui
│   │   ├── 📁 pages            # Halaman aplikasi
│   │   ├── 📁 layouts          # Layout dashboard
│   │   ├── 📁 routes           # Konfigurasi routing
│   │   └── 📁 services         # API service (Axios)
│   ├── package.json
│   └── vite.config.js
│
├── 📁 backend
│   ├── 📁 controllers
│   ├── 📁 routes
│   ├── 📁 models
│   └── 📁 database
│
└── README.md
```

---

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/Alif-Kopling/LaundryKu.git
cd LaundryKu
```

---

## 🎨 Frontend Setup

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan frontend:

```bash
npm run dev
```

Frontend berjalan pada:

```bash
http://localhost:5173
```

---

## ⚙️ Backend Setup

Buka terminal baru, lalu masuk ke folder backend:

```bash
cd backend
```

Install dependency:

```bash
npm install
```

Buat file environment:

```bash
cp .env.example .env
```

Konfigurasi database pada file `.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=laundryku

JWT_SECRET=your_secret_key
```

---

## 🗄️ Database Setup

Pastikan MySQL sudah berjalan.

Buat database:

```sql
CREATE DATABASE laundryku;
```

Import database:

```bash
mysql -u root -p laundryku < database.sql
```

---

## ▶️ Menjalankan Backend

Jalankan server backend:

```bash
npm run dev
```

Backend berjalan pada:

```bash
http://localhost:5000
```

---

## 💻 Menjalankan Full Project

Buka 2 terminal:

Terminal 1 (Frontend):

```bash
cd frontend
npm run dev
```

Terminal 2 (Backend):

```bash
cd backend
npm run dev
```

Aplikasi siap digunakan 🚀

---

## 🔗 API Endpoint

| Method | Endpoint | Keterangan |
|--------|----------|-----------|
| `POST` | `/api/v1/auth/login` | Login user |
| `GET` | `/api/v1/customers` | Data pelanggan |
| `POST` | `/api/v1/customers` | Tambah pelanggan |
| `PUT` | `/api/v1/customers/{id}` | Edit pelanggan |
| `DELETE` | `/api/v1/customers/{id}` | Hapus pelanggan |
| `GET` | `/api/v1/transactions` | Data transaksi |
| `POST` | `/api/v1/transactions` | Buat transaksi |
| `PATCH` | `/api/v1/transactions/{id}/status` | Update status |
| `GET` | `/api/v1/transactions/{id}/invoice` | Detail nota |
| `GET` | `/api/v1/history` | Riwayat transaksi |

---

## 🌿 Git Branch Strategy

```
🌳 main (production)
  └── 🌱 develop (integration)
        ├── 🌿 feature/auth
        ├── 🌿 feature/dashboard
        ├── 🌿 feature/customer-page
        ├── 🌿 feature/transaction-page
        ├── 🌿 feature/invoice-page
        └── 🌿 feature/history-page
```

**Alur kerja:**
```
feature/*  →  develop  →  main
```

---

## 📝 Commit Convention

```
feat:       ✨ Fitur baru
fix:        🐛 Perbaikan bug
style:      💄 Perbaikan UI/styling
refactor:   ♻️ Refactor kode
docs:       📝 Dokumentasi
chore:      🔧 Tugas maintenance
```

**Contoh:**
```
feat: add login page with JWT auth
feat: create customer CRUD
fix: fix transaction validation
style: update dashboard layout
docs: add API documentation
```

---

## 👥 Tim Pengembang

| Role | Nama |
|------|------|
| **Frontend Developer** | Alif Kopling |
| **Backend Developer** | Todzxx |

---

## 🎯 Rencana Pengembangan

- [ ] 📱 Notifikasi WhatsApp untuk pelanggan
- [ ] 📱 QR Code tiap transaksi
- [ ] 📊 Dashboard analytics real-time
- [ ] 📑 Export laporan ke Excel
- [ ] 📱 Aplikasi Mobile

---

<p align="center">
  <img src="https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3RvdXl1dnhjN3BnMjF6dDIzYTVweXNzOHdvbWI2dDJ2NDRvbjVzNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9cw/3o7TKSha7CwIeRvIqY/giphy.gif" width="40">
  <br>
  Made with ❤️ by <b>LaundryKu Team</b>
  <br>
  <sub>Version 1.0.0</sub>
</p>
