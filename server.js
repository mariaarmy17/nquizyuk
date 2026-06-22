const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import database
const db = require('./backend/database');
const nlp = require('compromise');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/src', express.static(path.join(__dirname, 'src')));
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

function createNlpAnswer(text) {
  const input = text.trim();
  const lower = input.toLowerCase();
  const doc = nlp(input);
  const sentences = doc.sentences().out('array');
  const nouns = doc.nouns().out('array');
  const verbs = doc.verbs().out('array');

  if (!input) {
    return { intent: 'empty', answer: 'Silakan ketik pertanyaan atau topik yang ingin Anda diskusikan.' };
  }

  if (lower.includes('ringkas') || lower.includes('ringkaskan') || lower.includes('summary')) {
    const summary = sentences.slice(0, 2).join(' ');
    return {
      intent: 'ringkasan',
      answer: summary || 'Maaf, saya tidak dapat membuat ringkasan dari teks tersebut.',
      details: { sentences, nouns, verbs }
    };
  }

  if (lower.includes('apa itu') || lower.includes('definisi') || lower.includes('pengertian')) {
    return {
      intent: 'definisi',
      answer: 'Literasi digital adalah kemampuan menggunakan teknologi dan informasi secara cerdas, aman, dan bertanggung jawab. NLP membantu memahami teks dan menjawab pertanyaan dalam bahasa alami.',
      details: { sentences, nouns, verbs }
    };
  }

  if (lower.includes('ai') && lower.includes('sekolah')) {
    return {
      intent: 'ai-sekolah',
      answer: 'AI di sekolah dapat membantu guru menyusun materi, memberikan umpan balik cepat kepada siswa, dan mendukung literasi digital melalui pemahaman bahasa dan rekomendasi konten.',
      details: { sentences, nouns, verbs }
    };
  }

  if (lower.includes('literasi digital')) {
    return {
      intent: 'literasi-digital',
      answer: 'Literasi digital mencakup kemampuan menilai informasi online, menggunakan teknologi dengan aman, dan membuat konten digital. NLP membantu proses ini melalui analisis bahasa dan penjelasan otomatis.',
      details: { sentences, nouns, verbs }
    };
  }

  if (lower.includes('cara') || lower.includes('bagaimana') || lower.includes('tips')) {
    return {
      intent: 'cara',
      answer: 'Coba tanyakan dengan jelas, misalnya "Bagaimana cara membuat ringkasan?" atau "Apa itu literasi digital?"',
      details: { sentences, nouns, verbs }
    };
  }

  return {
    intent: 'general',
    answer: 'Maaf, saya belum bisa menjawab secara spesifik. Coba ulang dengan kata-kata seperti "apa itu literasi digital" atau "ringkas teks berikut".',
    details: { sentences, nouns, verbs }
  };
}

// POST - NLP assistant
app.post('/api/nlp', (req, res) => {
  const { question } = req.body;
  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Pertanyaan diperlukan' });
  }
  const response = createNlpAnswer(question);
  res.json(response);
});

// POST - Buat room code baru
app.post('/api/room-codes', (req, res) => {
  let { room_code } = req.body;
  if (!room_code) {
    return res.status(400).json({ error: 'Room code diperlukan' });
  }
  room_code = room_code.toString().trim().toUpperCase();
  if (!room_code) {
    return res.status(400).json({ error: 'Room code diperlukan' });
  }

  db.run('INSERT OR IGNORE INTO room_codes (room_code, quiz_id, created_by) VALUES (?, 1, 1)', [room_code], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ room_code, message: 'Room code dibuat atau sudah ada' });
  });
});

// GET - Periksa room code
app.get('/api/room-codes/:room_code', (req, res) => {
  const room_code = req.params.room_code.toString().trim().toUpperCase();
  db.get('SELECT * FROM room_codes WHERE room_code = ?', [room_code], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ error: 'Room code tidak ditemukan' });
    }
    res.json(row);
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
