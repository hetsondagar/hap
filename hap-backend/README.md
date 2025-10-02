# HAP FlashCard Backend API

A comprehensive backend API for the HAP FlashCard application built with Node.js, Express, MongoDB, and TypeScript.

## 🚀 Features

- **Authentication**: JWT-based authentication with bcrypt password hashing
- **Flashcards**: Create, read, update, delete flashcards with department categorization
- **Quizzes**: Generate and submit quizzes with scoring and analytics
- **Community**: Public decks, likes, comments, and user following system
- **Analytics**: User progress tracking, leaderboards, and department statistics
- **Security**: Rate limiting, CORS, helmet security headers
- **Validation**: Input validation with express-validator

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken) + bcryptjs
- **Language**: TypeScript
- **Security**: Helmet, CORS, express-rate-limit
- **Validation**: express-validator

## 📁 Project Structure

```
hap-backend/
├── src/
│   ├── config/
│   │   └── db.ts                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.ts    # Authentication logic
│   │   ├── flashcardController.ts
│   │   ├── quizController.ts
│   │   ├── communityController.ts
│   │   └── analyticsController.ts
│   ├── middleware/
│   │   └── authMiddleware.ts     # JWT authentication middleware
│   ├── models/
│   │   ├── User.ts              # User schema
│   │   ├── Flashcard.ts         # Flashcard schema
│   │   ├── Deck.ts              # Deck schema
│   │   ├── Quiz.ts              # Quiz schema
│   │   └── Analytics.ts         # Analytics schema
│   ├── routes/
│   │   ├── authRoutes.ts        # Authentication routes
│   │   ├── flashcardRoutes.ts
│   │   ├── quizRoutes.ts
│   │   ├── communityRoutes.ts
│   │   └── analyticsRoutes.ts
│   ├── utils/
│   │   └── generateToken.ts     # JWT utilities
│   ├── app.ts                   # Express app configuration
│   └── server.ts                # Server startup
├── package.json
├── tsconfig.json
├── .gitignore
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hap-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## 📚 API Documentation

### Base URL
- Development: `http://localhost:5000`
- Production: `https://your-railway-app.railway.app`

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### GET `/api/auth/profile`
Get user profile (requires authentication)

### Flashcard Endpoints

#### POST `/api/flashcards`
Create a new flashcard (requires authentication)

#### GET `/api/flashcards/department/:dept`
Get flashcards by department

#### GET `/api/flashcards/user`
Get user's flashcards (requires authentication)

#### GET `/api/flashcards/search`
Search flashcards with filters

### Quiz Endpoints

#### GET `/api/quizzes/generate`
Generate a quiz from flashcards

#### POST `/api/quizzes/submit`
Submit quiz attempt

#### GET `/api/quizzes/results/:userId`
Get user's quiz history

### Community Endpoints

#### GET `/api/community/decks`
Browse public decks

#### POST `/api/community/decks`
Create a new deck (requires authentication)

#### PUT `/api/community/decks/:id/like`
Like/unlike a deck (requires authentication)

#### POST `/api/community/decks/:id/comment`
Add comment to deck (requires authentication)

### Analytics Endpoints

#### GET `/api/analytics/:userId`
Get user analytics (requires authentication)

#### GET `/api/analytics/leaderboard`
Get leaderboard

#### GET `/api/analytics/departments/:department`
Get department statistics

## 🚀 Deployment

### Railway Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Create Railway Project**
   - Go to [Railway](https://railway.app)
   - Connect your GitHub repository
   - Select the backend repository

3. **Set Environment Variables**
   In Railway dashboard, add these environment variables:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/hap-flashcard
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=7d
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```

4. **Deploy**
   Railway will automatically deploy your application.

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster

2. **Configure Database Access**
   - Create a database user
   - Set up IP whitelist (0.0.0.0/0 for Railway)

3. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm test` - Run tests (when implemented)

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment | `development` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:5173` |

## 🔒 Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configured for frontend domain
- **Helmet**: Security headers
- **Input Validation**: express-validator for all inputs
- **Error Handling**: Comprehensive error handling

## 📊 Database Models

### User
- username, email, passwordHash
- bio, followers, following, badges
- Timestamps

### Flashcard
- front, back, department
- ownerId, difficulty, tags
- Timestamps

### Deck
- title, description, flashcards[]
- public, likes, comments[]
- creatorId, department, tags
- Timestamps

### Quiz
- questions[], score, percentage
- userId, deckId, department
- timeSpent, completedAt
- Timestamps

### Analytics
- userId, studiedCount, quizAccuracy
- timeSpent, streaks, achievements
- departmentStats[], weeklyGoal
- Timestamps

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@hap-flashcard.com or create an issue in the repository.
