const db = require('./database');

// Sample data
const sampleQuizzes = [
  {
    title: 'Quiz Game Show - IPA',
    description: 'Quiz seru tentang IPA dengan mode multiplayer real-time',
    created_by: 1
  },
  {
    title: 'Tebak Gambar - Hewan',
    description: 'Tebak nama hewan berdasarkan gambar dalam waktu terbatas',
    created_by: 1
  },
  {
    title: 'Escape Room - Matematika',
    description: 'Selesaikan puzzle matematika untuk escape room',
    created_by: 1
  },
  {
    title: 'Wheel Spin - Bahasa Indonesia',
    description: 'Jawab pertanyaan dari kategori random di wheel spin',
    created_by: 1
  }
];

const sampleQuestions = [
  { quiz_id: 1, question: 'Berapakah jumlah planet di tata surya?', type: 'multiple_choice' },
  { quiz_id: 1, question: 'Apa nama gas yang diperlukan untuk bernafas?', type: 'multiple_choice' },
  { quiz_id: 2, question: 'Hewan apa ini?', type: 'multiple_choice' },
  { quiz_id: 2, question: 'Hewan apa yang hidup di laut?', type: 'multiple_choice' }
];

// Insert sample data
console.log('📝 Inserting sample data...');

// Insert quizzes
sampleQuizzes.forEach((quiz, index) => {
  db.run(
    'INSERT INTO quiz (title, description, created_by) VALUES (?, ?, ?)',
    [quiz.title, quiz.description, quiz.created_by],
    function(err) {
      if (err) {
        console.error(`Error inserting quiz ${index + 1}:`, err);
      } else {
        console.log(`✓ Quiz ${index + 1} inserted: ${quiz.title}`);
      }
    }
  );
});

// Insert questions after a delay
setTimeout(() => {
  sampleQuestions.forEach((question, index) => {
    db.run(
      'INSERT INTO questions (quiz_id, question, type) VALUES (?, ?, ?)',
      [question.quiz_id, question.question, question.type],
      function(err) {
        if (err) {
          console.error(`Error inserting question ${index + 1}:`, err);
        } else {
          console.log(`✓ Question ${index + 1} inserted`);
        }
      }
    );
  });
  
  setTimeout(() => {
    console.log('\n✅ Sample data inserted successfully!');
    process.exit(0);
  }, 1000);
}, 500);
