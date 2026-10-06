# Research Paper Manager

A full-stack web application designed for researchers and students to manage their literature review efficiently. 

This project was built as a demonstration of Agentic Programming and features a clean, professional "Academic Dashboard" style UI.

## Features

- **Authentication**: Secure user registration and login using JWT and bcrypt.
- **Dashboard**: Overview of reading progress, total papers, and important papers.
- **Paper Management**: Complete CRUD operations for research papers.
- **Advanced Search & Filter**: Real-time filtering by category, status, priority, and text search.
- **Data Privacy**: Users can only see and manage their own papers.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS (v3), React Router, Axios, Lucide React (Icons).
- **Backend**: Node.js, Express, SQLite, JSON Web Tokens (JWT), bcrypt.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm or yarn

## Getting Started

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd Research-Paper-Manager
\`\`\`

### 2. Setup the Backend
\`\`\`bash
cd backend
npm install
\`\`\`
*(The SQLite database and demo seed data will be automatically generated upon the first run).*

### 3. Setup the Frontend
Open a new terminal window:
\`\`\`bash
cd frontend
npm install
\`\`\`

### 4. Run the Application
**Start the Backend Server (Port 5000):**
\`\`\`bash
cd backend
npm start  # or: node server.js
\`\`\`

**Start the Frontend Server (Port 5173):**
\`\`\`bash
cd frontend
npm run dev
\`\`\`

### 5. Access the App
Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)

**Demo Credentials:**
- **Email:** \`demo@example.com\`
- **Password:** \`demo123\`

## Project Structure

\`\`\`
.
├── backend/
│   ├── database/        # SQLite setup and seed data
│   ├── middleware/      # JWT authentication middleware
│   ├── routes/          # Express routes for auth and papers
│   ├── server.js        # Entry point for backend
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/  # Reusable UI components (Navbar)
    │   ├── pages/       # Page components (Dashboard, PaperList, etc.)
    │   ├── services/    # Axios API setup
    │   ├── App.jsx      # Routing configuration
    │   └── main.jsx
    ├── tailwind.config.js
    └── package.json
\`\`\`

## License
MIT
