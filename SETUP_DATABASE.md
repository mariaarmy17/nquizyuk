# Setup Database & Backend NQUIZYUK

## 📋 Persyaratan
- **Node.js** v14+ (install dari https://nodejs.org)
- **MySQL** (install dari https://dev.mysql.com/downloads/mysql/)

---

## 🚀 Langkah-Langkah Setup

### 1. Setup MySQL Database

**Di komputer Anda:**
- Install MySQL dan pastikan service MySQL berjalan
- Buka MySQL Command Line atau MySQL Workbench
- Copy paste kode dari file `backend/setup.sql` ke MySQL

Atau gunakan command:
```bash
mysql -u root -p < backend/setup.sql
```

### 2. Konfigurasi Backend

Edit file `backend/.env` sesuai dengan konfigurasi MySQL Anda:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=nquizyuk
PORT=3000
```

### 3. Jalankan Backend Server

```bash
cd backend
npm start
```

Server akan berjalan di: **http://localhost:3000**

---

## 📡 Cara Menggunakan API di Frontend

### Tambahkan script di HTML:
```html
<script src="public/api-helper.js"></script>
```

### Contoh Penggunaan:

**Ambil semua quiz:**
```javascript
const quizzes = await getAllQuiz();
console.log(quizzes);
```

**Ambil soal quiz:**
```javascript
const questions = await getQuestions(1); // ID quiz = 1
console.log(questions);
```

**Simpan jawaban siswa:**
```javascript
await saveAnswer(studentId, questionId, userAnswer);
```

**Buat quiz baru:**
```javascript
const result = await createQuiz('Judul Quiz', 'Deskripsi', 1); // 1 = ID guru
console.log(result);
```

---

## 🔗 API Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/api/quiz` | Ambil semua quiz |
| GET | `/api/quiz/:id` | Ambil quiz by ID |
| POST | `/api/quiz` | Buat quiz baru |
| GET | `/api/questions/:quiz_id` | Ambil soal quiz |
| POST | `/api/answers` | Simpan jawaban siswa |

---

## 🐛 Troubleshooting

**Error: "connect ECONNREFUSED"**
- MySQL belum berjalan, nyalakan MySQL service
- Check konfigurasi di `.env` sudah benar

**Error: "CORS error"**
- Backend belum berjalan
- Pastikan server jalan di port 3000

**Error: "Unknown database"**
- Database belum dibuat, jalankan file `setup.sql` di MySQL

---

## 💡 Langkah Selanjutnya

1. Update file HTML di `src/pages/` untuk menggunakan API
2. Implement login/register dengan API
3. Tambah authentication dengan JWT token
4. Deploy ke server (Heroku, Vercel, etc.)

---

**Butuh bantuan? Tanya saya lagi!** 😊
