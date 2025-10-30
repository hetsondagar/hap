## HAP — Gamified Flashcards for Engineering Students

HAP is a full-stack, gamified learning platform where engineering students create smart flashcards, generate subject-specific quizzes, track analytics, and collaborate via community decks and discussion. The app ships with a modern UI, responsive design, and a secure API.

### What HAP does (in one line)
Helps you study smarter with flashcards, quizzes, rich analytics, and gamification — by department and year.

### Core capabilities
- Flashcards: create, search, filter, organize by department/year/subject, and manage difficulty.
- Quizzes: take timed MCQ quizzes per subject; instant scoring, XP, and performance breakdown.
- Community: share decks, like/comment, browse trending/new/mine; discussion posts and comments.
- Analytics: weekly progress, quiz performance, topic coverage, goals, and leaderboards.
- Gamification: levels, XP, achievements, streaks, and department leaderboards.

## Tech Stack
- Frontend: React + TypeScript + Vite, Tailwind CSS, shadcn/ui, React Router, TanStack Query, Recharts.
- Backend: Node.js + Express, JWT auth, validation via express-validator.
- Database: MongoDB via Mongoose (current implementation).
- Deployment: Vercel (frontend) + Render/Railway (backend).

Note: The backend config includes `DATABASE_URL` for potential PostgreSQL support, but code currently connects to MongoDB using `MONGO_URI`.

## Project Structure
```
hap/
├─ src/                       # Frontend (React + Vite)
│  ├─ pages/                  # Route pages (Index, Auth, Dashboard, Flashcards, Quiz, Subjects, Community, Analytics, Gamification, etc.)
│  ├─ components/             # UI and feature components (shadcn/ui, EnhancedFlashcard, etc.)
│  ├─ lib/api.ts              # API base + SDK (auth, flashcards, quiz, analytics, gamification, dashboard, community)
│  ├─ data/subjects.ts        # Subjects by department/year
│  └─ context/, hooks/, utils/
├─ hap-backend/               # Backend (Express API)
│  ├─ src/
│  │  ├─ models/              # Mongoose models: User, Flashcard, Deck, Post, Quiz, Subject, Analytics
│  │  ├─ controllers/         # Business logic per domain
│  │  ├─ routes/              # Express routers (mounted under /api)
│  │  └─ config/db.ts         # MongoDB connection via Mongoose
└─ public/, dist/             # Static and built assets
```

## Frontend: Pages and Features
- Index (`/`): Marketing hero, feature tiles linking to Flashcards, Community, Quiz, Analytics; departments showcase, CTA.
- Auth (`/login`, `/signup`): JWT-based login/signup, saves token to `localStorage`.
- Dashboard (`/dashboard`): Profile, change password/username, my flashcards/decks, liked items, my posts; inline edit/delete card.
- Flashcards (`/flashcards`): Create Q&A cards with difficulty and subject; auto-fill department/year; grid with favorite, edit, delete.
- Subjects (`/subjects`): Lists subjects for the user’s department/year; deep-link into subject flashcards.
- Create Flashcard (`/flashcards/create`): Form-first experience with subject preselect (supports `?subject=`); shows recent flashcards.
- Quiz (`/quiz`): Pick a subject; 30-question MCQ; 20-minute timer; submit for score, XP, correctness breakdown.
- Community (`/community`): Decks (browse/search/trending/new/mine), like/comment, create deck dialog; Discussion & Doubts posts with like/comment/edit/delete.
- Deck Detail (`/community/:id`): Deck header, like/comment, and card list with per-card favorite toggle.
- Analytics (`/analytics`): Weekly study hours, streaks and goal progress, quiz scores chart, topic coverage pie, mastery radar, achievements.
- Gamification (`/gamification`): Level, XP progress, earned/available badges, department/all leaderboard, quick actions.
- Not Found (`/*`): 404 page.

## Backend: API Overview (base: `/api`)
- Auth (`/auth`): `POST /signup`, `POST /login`, `GET /profile`, `PUT /profile`.
- Flashcards (`/flashcards`): `POST /` create, `GET /user`, `GET /search`, `GET /:id`, `PUT /:id`, `DELETE /:id`, `GET /department/:dept`.
- Quiz legacy (`/quizzes`): `GET /generate`, `POST /submit`, `GET /results/:userId`, `GET /:id`.
- Quiz new (`/quiz`): `GET /generate/:subjectId`, `POST /submit`.
- Community (`/community`): Decks — `GET /decks`, `GET /decks/search`, `GET /decks/:id`, `POST /decks`, `PUT /decks/:id`, `DELETE /decks/:id`, `PUT /decks/:id/like`, `POST /decks/:id/comment`, `POST /follow/:id`. Posts — `GET /posts`, `GET /posts/search`, `GET /posts/:id`, `POST /posts`, `PUT /posts/:id/like`, `POST /posts/:id/comment`, `DELETE /posts/:id`.
- Analytics (`/analytics`): `GET /:userId`, `PUT /:userId/weekly-goal`, `GET /:userId/progress`, `GET /leaderboard`, `GET /departments/:department`.
- Dashboard (`/dashboard`): `GET /`, `POST /change-password`, `POST /change-username`, likes: `POST /like/flashcard/:flashcardId`, `POST /like/deck/:deckId`, `GET /liked/flashcards`, `GET /liked/decks`.
- Subjects (`/subjects`): `GET /`, `GET /:department/:year`, `POST /` (admin).
- Gamification (`/gamification`): `GET /achievements`, `GET /leaderboard/:department`, `GET /stats`, `POST /check-badges`.

All protected routes require `Authorization: Bearer <token>`.

## Environment Variables

Frontend (`.env` at repo root):
```
VITE_API_URL=http://localhost:8000/api
NODE_ENV=development
```

Backend (`hap-backend/.env`):
```
NODE_ENV=development
PORT=8000
JWT_SECRET=replace-with-strong-secret
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/hap-flashcard
# Optional (future): DATABASE_URL=postgres://user:pass@host:5432/db
```

## Getting Started (Dev)
1) Install deps (root + backend):
```
npm run setup
```
2) Create env files using `env.example` in root and `hap-backend/`.
3) Start backend (port 8000 default here):
```
npm run backend:dev
```
4) Start frontend (Vite on 5173):
```
npm run dev
```

Update `VITE_API_URL` if your backend port differs.

## Build & Run
- Frontend build/preview:
```
npm run build && npm run preview
```
- Backend build/start:
```
npm run backend:build && npm run backend:start
```

## Data Model (high level)
- User: auth, profile (department/year), likedFlashcards, likedDecks, stats.
- Flashcard: front, back, department, year, subjectId, difficulty, tags, ownerId, public.
- Deck: title, description, flashcards[], department, difficulty, tags, creatorId, likes[], comments[].
- Post: userId, title, content, department/year, likes[], comments[].
- Quiz: generated per subject, result with score/time/analysis.
- Analytics: aggregated study metrics, weekly progress, streaks.

## Security & Auth
- JWT-based auth; token stored in `localStorage` and sent via `Authorization: Bearer`.
- Rate limiting and Helmet enabled on backend (see backend dependencies/middleware).
- Validation via `express-validator` on sensitive endpoints.

## Deployment
- Frontend: Vercel (set `VITE_API_URL` env).
- Backend: Render/Railway (set `PORT`, `JWT_*`, `FRONTEND_URL`, `MONGO_URI`).
- See: `COMPLETE_DEPLOYMENT_GUIDE.md`, `RENDER_DEVELOPMENT_GUIDE.md`, `hap-backend/DEPLOYMENT.md`.

## Notes on PostgreSQL
The backend currently uses MongoDB via Mongoose. The config exposes `DATABASE_URL` for a future PostgreSQL move; that would require adding a SQL ORM (e.g., Prisma/TypeORM) and model/controller rewrites. Until then, use `MONGO_URI`.

## Scripts
- Root:
  - `dev` (frontend dev), `build`, `preview`, `lint`
  - `backend:dev`, `backend:build`, `backend:start`, `setup`
- Backend (`hap-backend`):
  - `dev`, `build`, `start`, `migrate`, `populate`

## License
MIT

## Support
Open an issue or consult the guides in the repo root.
