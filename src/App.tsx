import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import EventDetail from "./pages/EventDetail";
import AdminDashboard from "./pages/AdminDashboard";
import Leaderboard from "./pages/Leaderboard";
import Rewards from "./pages/Rewards";
import Community from "./pages/Community";
import About from "./pages/About";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import EventDiscoveryMap from "./pages/EventDiscoveryMap";
import GamifiedProfile from "./pages/GamifiedProfile";
import LiveEventFeed from "./pages/LiveEventFeed";
import GroupHangouts from "./pages/GroupHangouts";
import AISuggestions from "./pages/AISuggestions";
import VirtualWallet from "./pages/VirtualWallet";
import EventCreationWizard from "./pages/EventCreationWizard";
import FestivalMode from "./pages/FestivalMode";
import FriendsSocialGraph from "./pages/FriendsSocialGraph";
import CheckinQRScan from "./pages/CheckinQRScan";
import NotificationsAchievements from "./pages/NotificationsAchievements";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/event/:id" element={
              <ProtectedRoute>
                <EventDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/leaderboard" element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            } />
            <Route path="/rewards" element={
              <ProtectedRoute>
                <Rewards />
              </ProtectedRoute>
            } />
            <Route path="/community" element={
              <ProtectedRoute>
                <Community />
              </ProtectedRoute>
            } />
            <Route path="/map" element={
              <ProtectedRoute>
                <EventDiscoveryMap />
              </ProtectedRoute>
            } />
            <Route path="/profile" element={
              <ProtectedRoute>
                <GamifiedProfile />
              </ProtectedRoute>
            } />
            <Route path="/feed" element={
              <ProtectedRoute>
                <LiveEventFeed />
              </ProtectedRoute>
            } />
            <Route path="/hangouts" element={
              <ProtectedRoute>
                <GroupHangouts />
              </ProtectedRoute>
            } />
            <Route path="/suggestions" element={
              <ProtectedRoute>
                <AISuggestions />
              </ProtectedRoute>
            } />
            <Route path="/wallet" element={
              <ProtectedRoute>
                <VirtualWallet />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute requireRole="organizer">
                <EventCreationWizard />
              </ProtectedRoute>
            } />
            <Route path="/festival" element={
              <ProtectedRoute>
                <FestivalMode />
              </ProtectedRoute>
            } />
            <Route path="/social" element={
              <ProtectedRoute>
                <FriendsSocialGraph />
              </ProtectedRoute>
            } />
            <Route path="/checkin" element={
              <ProtectedRoute>
                <CheckinQRScan />
              </ProtectedRoute>
            } />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <NotificationsAchievements />
              </ProtectedRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
