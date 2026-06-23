# 🧺 Sistem Manajemen Laundry - Frontend

Frontend aplikasi manajemen laundry yang digunakan oleh owner dan karyawan untuk mengelola data pelanggan, transaksi, status cucian, nota, dan riwayat transaksi.

---

# 📌 Features

- Login Owner/Karyawan
- Dashboard Laundry
- Data Pelanggan
- Transaksi Laundry
- Update Status Cucian
- Detail & Cetak Nota
- Riwayat Transaksi

---

# 🛠️ Tech Stack

Frontend:

- React.js
- Vite
- Tailwind CSS / Bootstrap
- Axios
- React Router

Backend API:

```
http://localhost:8000/api/v1
```

---

# 📁 Project Structure

```
src/
│
├── assets/
│
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── Table.jsx
│   └── Button.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Customers.jsx
│   ├── Transactions.jsx
│   ├── Invoice.jsx
│   └── History.jsx
│
├── services/
│   └── api.js
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
└── main.jsx
```

---

# 🚀 Installation

Clone repository:

```bash
git clone <repository-url>
```

Masuk folder:

```bash
cd frontend
```

Install dependency:

```bash
npm install
```

Jalankan project:

```bash
npm run dev
```

Frontend berjalan:

```
http://localhost:5173
```

---

# 🔐 Authentication Flow

Login user:

```
POST /api/v1/auth/login
```

Request:

```json
{
  "email": "admin@laundry.com",
  "password": "password"
}
```

Response:

```json
{
  "token": "jwt_token",
  "user": {
    "name": "Admin",
    "role": "owner"
  }
}
```

Token disimpan di:

```
localStorage
```

dan digunakan untuk request API.

---

# 👤 Customer Page

Endpoint:

```
GET /api/v1/customers
```

Fitur:

- Menampilkan pelanggan
- Tambah pelanggan
- Edit pelanggan
- Hapus pelanggan

---

# 🧺 Transaction Page

Endpoint:

```
GET /api/v1/transactions
```

Fitur:

- Melihat transaksi
- Membuat transaksi baru
- Melihat detail transaksi
- Update status laundry

Status:

```
received
processing
finished
picked_up
```

---

# 🔄 Update Status

Endpoint:

```
PATCH /api/v1/transactions/{id}/status
```

Request:

```json
{
  "status": "finished"
}
```

---

# 🧾 Invoice Page

Menampilkan nota transaksi.

Endpoint:

```
GET /api/v1/transactions/{id}/invoice
```

Fitur:

- Detail pelanggan
- Detail cucian
- Total harga
- Print nota

---

# 📜 History Page

Endpoint:

```
GET /api/v1/history
```

Fitur:

- Riwayat transaksi
- Filter tanggal
- Cari pelanggan

---

# 🔗 API Configuration

File:

```
src/services/api.js
```

Contoh:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL:
  "http://localhost:8000/api/v1"
});

api.interceptors.request.use(
(config)=>{
 const token =
 localStorage.getItem("token");

 if(token){
  config.headers.Authorization =
  `Bearer ${token}`;
 }

 return config;
});

export default api;
```

---

# 🌿 Git Workflow

Branch:

```
main
develop
feature/login
feature/dashboard
feature/customer-page
feature/transaction-page
feature/invoice-page
```

Flow:

```
feature/*
      |
      v
   develop
      |
      v
    main
```

---

# 📝 Commit Convention

Format:

```
type: message
```

Contoh:

```
feat: create login page
feat: add customer table
fix: fix api connection
style: update dashboard ui
docs: update readme
```

---

# 👥 Team

Project:

**Sistem Manajemen Laundry**

Frontend Version:

1.0.0