require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./database/db');
const authRoutes = require('./routes/authRoutes');
const paperRoutes = require('./routes/paperRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize Database
initDB().then(() => {
  console.log('Database initialized.');
}).catch(err => {
  console.error('Failed to initialize database', err);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/papers', paperRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
