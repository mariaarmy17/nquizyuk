const db = require('./database');
const bcrypt = require('bcrypt');

// Sample users - Teachers (guru)
const sampleTeachers = [
  {
    username: 'guru1',
    email: 'guru1@example.com',
    password: 'password123', // akan di-hash
    role: 'guru'
  },
  {
    username: 'guru2',
    email: 'guru2@example.com',
    password: 'password456',
    role: 'guru'
  }
];

// Sample users - Students (siswa) - untuk testing bahwa mereka tidak bisa login
const sampleStudents = [
  {
    username: 'siswa1',
    email: 'siswa1@example.com',
    password: 'siswa123',
    role: 'siswa'
  }
];

async function seedUsers() {
  console.log('📝 Inserting sample users...\n');
  
  // Insert teachers
  for (let i = 0; i < sampleTeachers.length; i++) {
    const teacher = sampleTeachers[i];
    try {
      const hashedPassword = await bcrypt.hash(teacher.password, 10);
      
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [teacher.username, teacher.email, hashedPassword, teacher.role],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              console.log(`⚠️  Username "${teacher.username}" sudah ada`);
            } else {
              console.error(`❌ Error inserting teacher ${teacher.username}:`, err.message);
            }
          } else {
            console.log(`✓ Guru "${teacher.username}" berhasil dibuat`);
            console.log(`  Email: ${teacher.email}`);
            console.log(`  Password: ${teacher.password}`);
          }
        }
      );
    } catch (err) {
      console.error(`Error hashing password untuk ${teacher.username}:`, err);
    }
  }
  
  // Insert students
  for (let i = 0; i < sampleStudents.length; i++) {
    const student = sampleStudents[i];
    try {
      const hashedPassword = await bcrypt.hash(student.password, 10);
      
      db.run(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        [student.username, student.email, hashedPassword, student.role],
        function(err) {
          if (err) {
            if (err.message.includes('UNIQUE')) {
              console.log(`⚠️  Username "${student.username}" sudah ada`);
            } else {
              console.error(`❌ Error inserting student ${student.username}:`, err.message);
            }
          } else {
            console.log(`✓ Siswa "${student.username}" berhasil dibuat (untuk testing)`);
            console.log(`  Email: ${student.email}`);
            console.log(`  Password: ${student.password}`);
          }
        }
      );
    } catch (err) {
      console.error(`Error hashing password untuk ${student.username}:`, err);
    }
  }
  
  // Exit after delay
  setTimeout(() => {
    console.log('\n✅ User seeding completed!');
    console.log('\n📋 AKUN UNTUK TESTING:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✓ GURU (Bisa Login):');
    sampleTeachers.forEach(t => {
      console.log(`  - Username: ${t.username}, Password: ${t.password}`);
    });
    console.log('\n✗ SISWA (TIDAK BISA LOGIN):');
    sampleStudents.forEach(s => {
      console.log(`  - Username: ${s.username}, Password: ${s.password} (akan ditolak)`);
    });
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  }, 2000);
}

seedUsers();
