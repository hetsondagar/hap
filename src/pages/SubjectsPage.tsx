// src/pages/SubjectsPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { BookOpen, Plus, Users, Star, Home } from "lucide-react";

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
        setUserInfo({ department: user.department, year: user.year });
        setSubjects(getSubjectsByDeptYear(user.department, user.year));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Your Subjects
          </h1>
          <p className="text-muted-foreground">
            {userInfo.department.toUpperCase()} - {userInfo.year} Year
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button 
            onClick={handleDashboard}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Button>
          <Button onClick={handleCreateFlashcard} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Flashcard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleCommunityDecks}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Community Decks
          </Button>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <Card 
              key={subject.id} 
              className="p-6 hero-card cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleSubjectClick(subject)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{subject.name}</h3>
                    <p className="text-sm text-muted-foreground">{subject.code}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {subject.code}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Click to view flashcards</span>
                <Star className="h-4 w-4" />
              </div>
            </Card>
          ))}
        </div>

        {subjects.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
            <p className="text-muted-foreground">
              No subjects are available for your department and year combination.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
