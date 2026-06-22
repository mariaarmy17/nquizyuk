const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database
const db = require('./backend/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));

// ===== API ENDPOINTS (Backend Routes) =====

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

// Serve index.html untuk route tidak dikenal (SPA support)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// ERROR HANDLING
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
  console.log(`📊 Akses frontend: http://localhost:${PORT}`);
  console.log(`🔌 API backend: http://localhost:${PORT}/api`);
});
