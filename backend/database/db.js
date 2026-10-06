const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const bcrypt = require('bcrypt');

const dbPromise = open({
  filename: './database.sqlite',
  driver: sqlite3.Database
});

async function initDB() {
  const db = await dbPromise;
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS Papers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      authors TEXT,
      year INTEGER,
      category TEXT,
      status TEXT,
      priority TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES Users(id)
    );
  `);

  // Seed Data for demo@example.com
  const user = await db.get('SELECT * FROM Users WHERE email = ?', ['demo@example.com']);
  if (!user) {
    const hashedPassword = await bcrypt.hash('demo123', 10);
    const result = await db.run(
      'INSERT INTO Users (name, email, password) VALUES (?, ?, ?)',
      ['Demo User', 'demo@example.com', hashedPassword]
    );
    
    const userId = result.lastID;

    // Seed Papers
    const seedPapers = [
      {
        title: 'Attention Is All You Need',
        authors: 'Ashish Vaswani et al.',
        year: 2017,
        category: 'NLP',
        status: 'Completed',
        priority: 'High',
        notes: 'The transformer model paper.'
      },
      {
        title: 'A Unified Approach to Interpreting Model Predictions',
        authors: 'Scott Lundberg, Su-In Lee',
        year: 2017,
        category: 'Explainable AI',
        status: 'Reading',
        priority: 'High',
        notes: 'SHAP values introduction.'
      },
      {
        title: 'Grad-CAM: Visual Explanations from Deep Networks',
        authors: 'Ramprasaath Selvaraju et al.',
        year: 2017,
        category: 'Explainable AI',
        status: 'To Read',
        priority: 'Medium',
        notes: 'Important for visual CNN explanation.'
      }
    ];

    for (const paper of seedPapers) {
      await db.run(
        `INSERT INTO Papers (user_id, title, authors, year, category, status, priority, notes)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, paper.title, paper.authors, paper.year, paper.category, paper.status, paper.priority, paper.notes]
      );
    }
    console.log('Seed data inserted.');
  }

  return db;
}

module.exports = { dbPromise, initDB };
