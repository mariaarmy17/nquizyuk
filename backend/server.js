const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== API ENDPOINTS =====

// GET - Ambil semua quiz
app.get('/api/quiz', (req, res) => {
  db.all('SELECT * FROM quiz', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// GET - Ambil quiz by ID
app.get('/api/quiz/:id', (req, res) => {
  db.get('SELECT * FROM quiz WHERE id = ?', [req.params.id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(row);
  });
});

// POST - Buat quiz baru
app.post('/api/quiz', (req, res) => {
  const { title, description, created_by } = req.body;
  db.run('INSERT INTO quiz (title, description, created_by) VALUES (?, ?, ?)', 
    [title, description, created_by], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Quiz berhasil dibuat' });
    });
});

// GET - Ambil soal quiz
app.get('/api/questions/:quiz_id', (req, res) => {
  db.all('SELECT * FROM questions WHERE quiz_id = ?', [req.params.quiz_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows || []);
  });
});

// POST - Simpan jawaban siswa
app.post('/api/answers', (req, res) => {
  const { student_id, question_id, answer } = req.body;
  db.run('INSERT INTO answers (student_id, question_id, answer) VALUES (?, ?, ?)', 
    [student_id, question_id, answer], 
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Jawaban tersimpan' });
    });
});

// ===== ERROR HANDLING =====
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint tidak ditemukan' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
