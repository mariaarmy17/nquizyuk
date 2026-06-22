const db = require('./database');

console.log('🗑️  Menghapus semua data dummy...\n');

// Delete data dari semua tabel
const queries = [
  'DELETE FROM answers',
  'DELETE FROM options',
  'DELETE FROM questions',
  'DELETE FROM room_codes',
  'DELETE FROM quiz',
  'DELETE FROM users'
];

let completed = 0;

queries.forEach((query, index) => {
  db.run(query, (err) => {
    if (err) {
      console.error(`❌ Error: ${query}`, err);
    } else {
      console.log(`✓ Tabel ${index + 1}/${queries.length} dihapus`);
    }
    
    completed++;
    
    // Jika semua selesai
    if (completed === queries.length) {
      console.log('\n✅ Semua data dummy berhasil dihapus!');
      console.log('📊 Database sudah kosong, siap untuk data baru.\n');
      process.exit(0);
    }
  });
});
