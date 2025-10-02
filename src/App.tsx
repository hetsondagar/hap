
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Index from "./pages/Index";
import Features from "./pages/Features";
import Departments from "./pages/Departments";
import Gamification from "./pages/Gamification";
import NotFound from "./pages/NotFound";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";
import CommunityPage from "./pages/CommunityPage";
import AnalyticsPage from "./pages/AnalyticsPage";

// Auth pages
import Login from "@/pages/Auth/Login";
import Signup from "@/pages/Auth/Signup";
// optional landing/home page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <Routes>
          {/* Core pages */}
          
          <Route path="/" element={<Index />} />
          <Route path="/features" element={<Features />} />
          <Route path="/departments" element={<Departments />} />
          <Route path="/gamification" element={<Gamification />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />

          {/* Auth pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

