# Panduan Deploy ke Railway.app

## ✅ Langkah-langkah

### 1. Siapkan Repository Git

Jika belum punya repo, buat di GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/nquizyuk.git
git push -u origin main
```

### 2. Buat Akun Railway.app

1. Buka https://railway.app
2. Sign up dengan GitHub
3. Authorize Railway untuk akses repo

### 3. Deploy Aplikasi

1. Di Railway dashboard, klik **"New Project"**
2. Pilih **"Deploy from GitHub repo"**
3. Pilih repository `nquizyuk`
4. Railway akan auto-detect Node.js project
5. Atur variabel environment di Railway:
   - `PORT` = 3000
   - `DATABASE` = nquizyuk.db
   - `NODE_ENV` = production

### 4. Monitor Deployment

Railway akan:
- Auto-pull dari GitHub
- Jalankan `npm install`
- Jalankan `npm start`
- Generate URL publik (misal: https://nquizyuk.railway.app)

### 5. Test Aplikasi

Akses URL publik dari Railway:
- Frontend: https://nquizyuk.railway.app
- API: https://nquizyuk.railway.app/api/quiz

---

## 🔑 Poin Penting

### Database SQLite
- File `nquizyuk.db` sudah di-include dalam deploy
- Data akan tersimpan di server Railway (persistent)

### Environment Variables
Jika perlu konfigurasi custom, buat `.env.railway`:
```
PORT=3000
DATABASE=/data/nquizyuk.db
NODE_ENV=production
```

### Troubleshooting

**Error: "Cannot find module"**
- Railway akan otomatis jalankan `npm install`
- Jika masih error, cek `package.json` di root

**Database kosong setelah deploy**
- Jalankan seed-data atau insert manual via API
- Atau copy `nquizyuk.db` ke Railway storage

**API tidak bisa diakses**
- Pastikan `backend/database.js` dan `server.js` benar
- Cek console Railway untuk error log

---

## 📊 Monitoring & Logs

Di Railway dashboard:
- Klik project
- Tab **"Deployments"** = lihat history deploy
- Tab **"Logs"** = lihat error/output

---

## 🚀 Alternatif Lain

Jika ingin hosting lain:
- **Render.com**: Cukup mirip Railway, connect GitHub
- **Fly.io**: Lebih advanced, butuh CLI
- **DigitalOcean**: VPS, lebih kontrol tapi setup lebih kompleks

---

## ✨ Setelah Deploy Berhasil

1. Update frontend API URLs:
   - Ganti `localhost:3000` → URL Railway publik
   - Di file: `src/pages/*.html` & `public/api-helper.js`

2. Test fitur:
   - Login sebagai guru
   - Buat quiz
   - Login sebagai siswa
   - Join room dan test quiz

3. Share URL ke user:
   - Guru & siswa bisa akses via URL publik
   - Tidak perlu lokal lagi

---

Butuh bantuan? Tanya aja! 🎉
