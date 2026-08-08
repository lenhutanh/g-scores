# G-Scores

## Features
- **Search Scores:** Look up candidates' exam scores using their 8-digit registration number.
- **Reports:** Score distributions of exam subjects by performance levels (`>=8`, `[6, 8)`, `[4, 6)`, `<4`) using interactive charts.
- **Leaderboard:** Top 10 candidates with the highest Group A (Mathematics, Physics, Chemistry) scores.
- **Auto-Seeding:** Raw CSV data is automatically imported into the PostgreSQL database.

## Live Demo
- **Frontend (Netlify):** `[Your Deployed Frontend Link here]`
- **Backend (Render):** `[Your Deployed Backend Link here]`

---

## How to Run Locally

### Prerequisites
- Node.js (v20+) & pnpm (v8+)
- PostgreSQL running locally (create a database named `g_scores`)

### Environment Variables

Copy the example environment files and update the values:

- **Backend**:
  ```bash
  cp backend/.env.example backend/.env
  ```
  *(Configure the `DATABASE_URL` and `PORT` inside `backend/.env`)*

- **Frontend**:
  ```bash
  cp frontend/.env.example frontend/.env
  ```
  *(Configure the `VITE_API_URL` inside `frontend/.env` if pointing to a non-default API)*

### How to Run

1. Run Backend:
   ```bash
   cd backend
   pnpm install
   pnpm db:migrate
   pnpm db:seed
   pnpm run start:dev
   ```

2. Run Frontend:
   ```bash
   cd ../frontend
   pnpm install
   pnpm run dev
   ```

---

## How to Run with Docker

1. Run the entire stack (Database, Backend migrations/seed, Frontend):
   ```bash
   docker-compose up --build
   ```
2. Open your browser:
   - **Frontend:** `http://localhost`
   - **Backend API:** `http://localhost:3000`
