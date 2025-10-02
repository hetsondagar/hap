# HAP FlashCard App

A comprehensive flashcard application built with React, TypeScript, and modern web technologies.

## 🚀 Features

- **Flashcard Management**: Create, edit, and organize flashcards by department
- **Quiz System**: Take quizzes and track your progress
- **Community Features**: Share decks, like and comment on others' content
- **Analytics**: Track your learning progress with detailed analytics
- **Gamification**: Earn badges, streaks, and compete on leaderboards
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Backend**: Node.js + Express + MongoDB/PostgreSQL
- **Authentication**: JWT-based auth
- **Deployment**: Vercel (Frontend) + Render (Backend)

## 📁 Project Structure

```
hap/
├── src/
│   ├── components/          # React components
│   ├── pages/              # Page components
│   ├── context/            # React context providers
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── assets/             # Static assets
├── hap-backend/            # Backend API
└── public/                 # Public assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (for backend)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd hap
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in root directory
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Set up backend** (see hap-backend/README.md)

## 📚 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Render)
1. Push hap-backend/ to GitHub
2. Connect to Render
3. Set environment variables
4. Deploy automatically

See `COMPLETE_DEPLOYMENT_GUIDE.md` for detailed instructions.

## 🎯 Features Overview

### Authentication
- User registration and login
- JWT-based authentication
- Profile management

### Flashcards
- Create flashcards with front/back content
- Organize by department
- Add tags and difficulty levels
- Search and filter functionality

### Quizzes
- Generate quizzes from flashcards
- Multiple choice questions
- Track scores and time
- Review quiz history

### Community
- Share public decks
- Like and comment on decks
- Follow other users
- Browse community content

### Analytics
- Track learning progress
- View department statistics
- Compete on leaderboards
- Set and track goals

## 🔧 Development

### Code Structure
- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Context**: Global state management
- **Hooks**: Custom React hooks
- **Utils**: Helper functions

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Pre-built component library
- **Responsive**: Mobile-first design

## 📖 Documentation

- [Complete Deployment Guide](COMPLETE_DEPLOYMENT_GUIDE.md)
- [Deployment Checklist](DEPLOYMENT_CHECKLIST.md)
- [Render Development Guide](RENDER_DEVELOPMENT_GUIDE.md)
- [Backend API Documentation](hap-backend/README.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, create an issue in the repository or contact the development team.
