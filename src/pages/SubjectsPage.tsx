// src/pages/SubjectsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PremiumButton } from "@/components/ui/premium-button";
import { PremiumLoading } from "@/components/ui/premium-loading";
import { Badge } from "@/components/ui/badge";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { BookOpen, Plus, Users, Star, Home, LayoutDashboard, Sparkles, ArrowRight } from "lucide-react";
import Header from "@/components/Header";

const SubjectsPage = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);

  useEffect(() => {
    // Get user info from localStorage or API
    const token = localStorage.getItem("token");
    if (token) {
      // In a real app, you'd fetch user info from API
      // For now, we'll get it from localStorage or use default values
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const user = JSON.parse(storedUserInfo);
        
        // Normalize year format (handle both '1st' and '1st-year' formats)
        let normalizedYear = user.year;
        if (!normalizedYear.includes('-year')) {
          normalizedYear = `${user.year}-year`;
        }
        
        setUserInfo({ department: user.department, year: normalizedYear });
        
        // Get subjects for this department and year
        const subjectsList = getSubjectsByDeptYear(user.department, normalizedYear);
        console.log('User department:', user.department, 'Year:', normalizedYear);
        console.log('Subjects found:', subjectsList);
        setSubjects(subjectsList);
      } else {
        // Redirect to login if no user info
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubjectClick = (subject: any) => {
    navigate(`/subjects/${subject.id}/flashcards`);
  };

  const handleCreateFlashcard = () => {
    navigate("/flashcards/create");
  };

  const handleCommunityDecks = () => {
    navigate("/community");
  };

  const handleDashboard = () => {
    navigate("/");
  };

  if (!userInfo) {
    return (
      <PremiumLoading fullScreen />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center animate-fade-in">
            <Badge className="mb-4 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Your Learning Dashboard
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Your Subjects
            </h1>
            <p className="text-xl text-muted-foreground">
              {userInfo.department.toUpperCase()} • {userInfo.year} Year
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12 justify-center animate-scale-in">
            <PremiumButton 
              onClick={handleDashboard}
              variant="glass"
              size="lg"
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="h-5 w-5" />
              Dashboard
            </PremiumButton>
            <PremiumButton 
              onClick={handleCreateFlashcard} 
              variant="premium"
              size="lg"
              className="flex items-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Create Flashcard
            </PremiumButton>
            <PremiumButton 
              variant="outline" 
              onClick={handleCommunityDecks}
              size="lg"
              className="flex items-center gap-2"
            >
              <Users className="h-5 w-5" />
              Community Decks
            </PremiumButton>
          </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <Card 
              key={subject.id} 
              className="glass-effect p-8 cursor-pointer hover-lift border-2 border-white/10 group animate-scale-in"
              onClick={() => handleSubjectClick(subject)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                      <BookOpen className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl group-hover:gradient-text transition-all duration-300">
                        {subject.name}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium mt-1">
                        {subject.code}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className="text-sm text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    View Flashcards
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {subjects.length === 0 && (
          <Card className="glass-effect p-16 text-center border-2 border-white/10 animate-fade-in">
            <div className="max-w-md mx-auto">
              <div className="mb-6 inline-block p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl">
                <BookOpen className="h-16 w-16 text-primary mx-auto" />
              </div>
              <h3 className="text-2xl font-bold mb-4 gradient-text">No Subjects Found</h3>
              <p className="text-muted-foreground text-lg mb-6">
                No subjects are available for your department and year combination.
              </p>
              <PremiumButton variant="premium" size="lg" onClick={handleDashboard}>
                <Home className="h-5 w-5 mr-2" />
                Go to Dashboard
              </PremiumButton>
            </div>
          </Card>
        )}
        </div>
      </div>
    </div>
  );
};

export default SubjectsPage;
