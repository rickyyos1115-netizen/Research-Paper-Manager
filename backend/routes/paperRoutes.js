const express = require('express');
const authenticate = require('../middleware/auth');
const { dbPromise } = require('../database/db');

const router = express.Router();

// Get all papers for the logged-in user
router.get('/', authenticate, async (req, res) => {
  try {
    const db = await dbPromise;
    const papers = await db.all('SELECT * FROM Papers WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
    res.json(papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get single paper
router.get('/:id', authenticate, async (req, res) => {
  try {
    const db = await dbPromise;
    const paper = await db.get('SELECT * FROM Papers WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }
    res.json(paper);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create paper
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, authors, year, category, status, priority, notes } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO Papers (user_id, title, authors, year, category, status, priority, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [req.user.id, title, authors, year, category, status, priority, notes]
    );
    
    res.status(201).json({ id: result.lastID, title, authors, year, category, status, priority, notes });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update paper
router.put('/:id', authenticate, async (req, res) => {
  try {
    const { title, authors, year, category, status, priority, notes } = req.body;
    const db = await dbPromise;
    
    const paper = await db.get('SELECT * FROM Papers WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    await db.run(
      'UPDATE Papers SET title = ?, authors = ?, year = ?, category = ?, status = ?, priority = ?, notes = ? WHERE id = ? AND user_id = ?',
      [title, authors, year, category, status, priority, notes, req.params.id, req.user.id]
    );

    res.json({ message: 'Paper updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete paper
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const db = await dbPromise;
    const paper = await db.get('SELECT * FROM Papers WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!paper) {
      return res.status(404).json({ error: 'Paper not found' });
    }

    await db.run('DELETE FROM Papers WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    res.json({ message: 'Paper deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
