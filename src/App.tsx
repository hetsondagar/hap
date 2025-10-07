// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { FlashcardsProvider } from "@/context/FlashcardsContext";

import Index from "./pages/Index";
import Features from "./pages/Features";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";
import FlashcardsPage from "./pages/FlashcardsPage"; // global flashcards
import QuizPage from "./pages/QuizPage";
import CommunityPage from "./pages/CommunityPage";
import DeckDetail from "./pages/community/DeckDetail";
import AnalyticsPage from "./pages/AnalyticsPage";

import SubjectsPage from "./pages/SubjectsPage";
import SubjectFlashcardsPage from "./pages/SubjectFlashcardsPage";
import CreateFlashcardPage from "./pages/CreateFlashcardPage";

// Auth pages
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";

const queryClient = new QueryClient();

const App = () => (
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
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/community/:id" element={<DeckDetail />} />
            <Route path="/analytics" element={<AnalyticsPage />} />

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
        </Router>
      </FlashcardsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
