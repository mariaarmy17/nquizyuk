# 🔐 SISTEM LOGIN GURU - DOKUMENTASI

## ✅ PERBAIKAN YANG DILAKUKAN

Sistem login telah diperbaiki dengan fitur keamanan yang proper. Kini **hanya guru (guru) yang dapat login**, siswa akan ditolak dengan pesan error yang jelas.

---

## 📋 FITUR UTAMA

### 1. **Validasi Role (Guru vs Siswa)**
- ✅ Endpoint `/api/login` memvalidasi bahwa user adalah guru
- ✅ Siswa yang mencoba login akan ditolak dengan error **403 Forbidden**
- ✅ Pesan error jelas: "Hanya guru yang dapat login di sini. Anda adalah siswa"

### 2. **Keamanan Password**
- ✅ Password di-hash menggunakan **bcrypt** (10 rounds)
- ✅ Password tidak pernah disimpan dalam plaintext
- ✅ Validasi password menggunakan bcrypt.compare()

### 3. **Endpoint Authentication**

#### POST `/api/login`
Melakukan login dengan validasi guru
```
Request:
{
  "username": "guru1",
  "password": "password123"
}

Success Response (200):
{
  "success": true,
  "user": {
    "id": 1,
    "username": "guru1",
    "email": "guru1@example.com",
    "role": "guru"
  },
  "message": "Login berhasil"
}

Error Response (403):
{
  "error": "Hanya guru yang dapat login di sini. Anda adalah siswa"
}
```

#### POST `/api/signup`
Membuat akun guru baru
```
Request:
{
  "username": "guru3",
  "email": "guru3@example.com",
  "password": "password789",
  "confirm_password": "password789"
}

Success Response (200):
{
  "success": true,
  "user": {
    "id": 3,
    "username": "guru3",
    "email": "guru3@example.com",
    "role": "guru"
  },
  "message": "Akun guru berhasil dibuat. Silakan login"
}
```

---

## 🧪 AKUN TEST (SUDAH DIBUAT)

### GURU (Bisa Login) ✅
```
Username: guru1
Password: password123
Email: guru1@example.com
```

```
Username: guru2
Password: password456
Email: guru2@example.com
```

### SISWA (TIDAK BISA LOGIN) ❌
```
Username: siswa1
Password: siswa123
Email: siswa1@example.com
Status: Login akan DITOLAK dengan pesan error
```

---

## 🔧 FILE YANG DIUBAH

### 1. **Backend Changes**

#### `server.js`
- ✅ Added `const bcrypt = require('bcrypt');`
- ✅ Added `POST /api/login` endpoint dengan validasi guru
- ✅ Added `POST /api/signup` endpoint untuk registrasi guru
- ✅ Validasi role='guru' sebelum allow login

#### `package.json`
- ✅ Added dependency: `"bcrypt": "^5.1.0"`

#### `backend/seed-users.js` (FILE BARU)
- ✅ Script untuk membuat test user (guru dan siswa)
- ✅ Password di-hash otomatis dengan bcrypt
- ✅ Contoh penggunaan: `node backend/seed-users.js`

### 2. **Frontend Changes**

#### `public/script.js`
- ✅ Login form sekarang memanggil endpoint `/api/login`
- ✅ Validasi response untuk memastikan role='guru'
- ✅ Error handling dengan pesan user-friendly
- ✅ Signup form memanggil endpoint `/api/signup`
- ✅ Validasi email dan password requirement

#### `public/api-helper.js`
- ✅ Added `loginGuru()` function
- ✅ Added `signupGuru()` function
- ✅ Export kedua fungsi untuk digunakan di file lain

---

## 🧪 TESTING YANG SUDAH DILAKUKAN

### Test 1: Login Guru ✅ BERHASIL
```
- Masuk dengan guru1 / password123
- Sistem berhasil authenticate dan redirect ke dashboard guru
- Session storage menyimpan: id, username, email, role
```

### Test 2: Login Siswa ❌ DITOLAK
```
- Coba masuk dengan siswa1 / siswa123
- Sistem menolak dengan HTTP 403 Forbidden
- Pesan: "Hanya guru yang dapat login di sini. Anda adalah siswa"
```

---

## 📊 DATABASE SCHEMA

### Tabel `users`
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,         -- hashed dengan bcrypt
  role TEXT DEFAULT 'siswa',      -- 'guru' atau 'siswa'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🚀 CARA MENGGUNAKAN

### 1. **Start Server**
```bash
cd d:\Pyhton\nlp
npm start
```

### 2. **Buat Test User (Jika Belum Ada)**
```bash
node backend/seed-users.js
```

### 3. **Test Login via Browser**
- Buka `http://localhost:3000`
- Klik tombol "Guru"
- Masukkan username: `guru1`
- Masukkan password: `password123`
- Klik "Masuk"
- ✅ Akan redirect ke dashboard guru

### 4. **Membuat Akun Guru Baru**
- Buka login modal
- Klik "Sign in" untuk signup
- Isi form: username, email, password
- Sistem akan hash password dan menyimpan dengan role='guru'
- Setelah sukses, bisa login dengan akun baru tersebut

---

## 🔒 KEAMANAN

### Yang Sudah Diimplementasi:
✅ Password hashing dengan bcrypt (10 rounds)
✅ Role-based access control (hanya guru dapat login)
✅ Input validation di backend
✅ Error messages yang informatif
✅ Database schema dengan unique constraints

### Rekomendasi Tambahan (Untuk Future):
⚠️ Implementasi JWT tokens untuk session management
⚠️ Rate limiting untuk prevent brute force attacks
⚠️ Email verification untuk signup
⚠️ Password reset functionality
⚠️ Audit logging untuk semua login attempts

---

## 📝 CATATAN PENTING

1. **Hanya Guru yang Bisa Login**
   - Sistem sekarang menolak SEMUA siswa
   - Validasi dilakukan di backend dengan cek role='guru'
   - Tidak perlu ada hidden parameter atau bypass

2. **Password Security**
   - Password tidak pernah tersimpan plaintext
   - Setiap password di-hash dengan bcrypt sebelum disimpan
   - Perbandingan password menggunakan bcrypt.compare()

3. **Error Handling**
   - User yang bukan guru mendapat error jelas
   - Password salah mendapat error jelas
   - Username tidak ada mendapat error jelas

4. **Session Management**
   - User info disimpan di sessionStorage
   - Bisa diakses via: `JSON.parse(sessionStorage.getItem('userInfo'))`
   - Logout: `sessionStorage.clear()`

---

## ✨ HASIL AKHIR

Sistem login sekarang benar-benar aman dan hanya memungkinkan guru untuk login. Siswa akan mendapatkan error message yang jelas ketika mencoba login dengan akun siswa mereka.

**Status: ✅ SELESAI & TESTED**
