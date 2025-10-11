// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FlashcardsProvider } from "@/context/FlashcardsContext";
import BadgeNotification from "@/components/BadgeNotification";
import { useBadgeNotifications } from "@/hooks/useBadgeNotifications";

import Index from "./pages/Index";
import Features from "./pages/Features";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";
import FlashcardsPage from "./pages/FlashcardsPage"; // global flashcards
import QuizPage from "./pages/QuizPage";
import CommunityDoubtsPage from "./pages/CommunityDoubtsPage";
import FlashcardDecksPage from "./pages/FlashcardDecksPage";
import DeckDetailPage from "./pages/DeckDetailPage";
import DashboardPage from "./pages/DashboardPage";

import SubjectsPage from "./pages/SubjectsPage";
import SubjectFlashcardsPage from "./pages/SubjectFlashcardsPage";
import CreateFlashcardPage from "./pages/CreateFlashcardPage";

// Auth pages
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";

const queryClient = new QueryClient();

const App = () => {
  const { 
    notifications, 
    removeNotification, 
    initializeBadgeCount 
  } = useBadgeNotifications();

  useEffect(() => {
    // Initialize badge count when app loads
    const token = localStorage.getItem('token');
    if (token) {
      initializeBadgeCount();
    }
  }, [initializeBadgeCount]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FlashcardsProvider>
          <Router>
            <Routes>
              {/* Core pages */}
              <Route path="/" element={<Index />} />
              <Route path="/features" element={<Features />} />
              <Route path="/gamification" element={<Gamification />} />
              <Route path="/flashcards" element={<FlashcardsPage />} /> {/* global */}
              <Route path="/quiz" element={<QuizPage />} />
              <Route path="/community" element={<CommunityDoubtsPage />} />
              <Route path="/decks" element={<FlashcardDecksPage />} />
              <Route path="/decks/:id" element={<DeckDetailPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />

              {/* Subjects flow */}
              <Route path="/subjects" element={<SubjectsPage />} />
              <Route path="/subjects/:subjectId/flashcards" element={<SubjectFlashcardsPage />} />
              <Route path="/flashcards/create" element={<CreateFlashcardPage />} />

              {/* Auth pages */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* Badge Notifications */}
            {notifications.map((notification) => (
              <BadgeNotification
                key={notification.id}
                achievement={notification.achievement}
                isVisible={true}
                onClose={() => removeNotification(notification.id)}
              />
            ))}
          </Router>
        </FlashcardsProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
