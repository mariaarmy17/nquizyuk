// API Helper untuk komunikasi dengan backend

// Auto-detect API URL (lokal atau production)
const API_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api'
  : `${window.location.origin}/api`;

// ===== QUIZ ENDPOINTS =====

// Ambil semua quiz
async function getAllQuiz() {
  try {
    const response = await fetch(`${API_URL}/quiz`);
    if (!response.ok) throw new Error('Gagal mengambil data quiz');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Ambil quiz by ID
async function getQuizById(quizId) {
  try {
    const response = await fetch(`${API_URL}/quiz/${quizId}`);
    if (!response.ok) throw new Error('Quiz tidak ditemukan');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// Buat quiz baru
async function createQuiz(title, description, createdBy) {
  try {
    const response = await fetch(`${API_URL}/quiz`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, created_by: createdBy })
    });
    if (!response.ok) throw new Error('Gagal membuat quiz');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// ===== QUESTIONS ENDPOINTS =====

// Ambil soal quiz
async function getQuestions(quizId) {
  try {
    const response = await fetch(`${API_URL}/questions/${quizId}`);
    if (!response.ok) throw new Error('Gagal mengambil soal');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// ===== ANSWERS ENDPOINTS =====

// Simpan jawaban
async function saveAnswer(studentId, questionId, answer) {
  try {
    const response = await fetch(`${API_URL}/answers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        student_id: studentId, 
        question_id: questionId, 
        answer: answer 
      })
    });
    if (!response.ok) throw new Error('Gagal menyimpan jawaban');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

// ===== ROOM CODE ENDPOINTS =====
async function createRoomCode(roomCode) {
  try {
    const response = await fetch(`${API_URL}/room-codes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ room_code: roomCode })
    });
    if (!response.ok) throw new Error('Gagal membuat room code');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function checkRoomCode(roomCode) {
  try {
    const response = await fetch(`${API_URL}/room-codes/${roomCode}`);
    if (!response.ok) return false;
    const result = await response.json();
    return result && result.room_code === roomCode;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

async function savePlayerScore(username, mode, score, roomCode) {
  try {
    const response = await fetch(`${API_URL}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, mode, score, room_code: roomCode })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Gagal menyimpan skor');
    }
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}

async function getLeaderboard(mode) {
  try {
    const response = await fetch(`${API_URL}/leaderboard/${mode}`);
    if (!response.ok) throw new Error('Gagal mengambil leaderboard');
    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    return [];
  }
}

// Export untuk digunakan di file lain
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAllQuiz,
    getQuizById,
    createQuiz,
    getQuestions,
    saveAnswer,
    createRoomCode,
    checkRoomCode,
    savePlayerScore,
    getLeaderboard
  };
}
