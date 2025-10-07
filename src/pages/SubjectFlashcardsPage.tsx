// src/pages/SubjectFlashcardsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { ArrowLeft, Plus, BookOpen, Star, Users } from "lucide-react";

const SubjectFlashcardsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);

  useEffect(() => {
    // Get user info from localStorage or API
    const token = localStorage.getItem("token");
    if (token) {
      const storedUserInfo = localStorage.getItem("userInfo");
      if (storedUserInfo) {
        const user = JSON.parse(storedUserInfo);
        
        // Normalize year format (handle both '1st' and '1st-year' formats)
        let normalizedYear = user.year;
        if (!normalizedYear.includes('-year')) {
          normalizedYear = `${user.year}-year`;
        }
        
        setUserInfo({ department: user.department, year: normalizedYear });
        
        // Find the subject
        const subjects = getSubjectsByDeptYear(user.department, normalizedYear);
        const foundSubject = subjects.find(s => s.id === subjectId);
        setSubject(foundSubject);
        
        // In a real app, you'd fetch flashcards for this subject from API
        // For now, we'll use mock data
        setFlashcards([
          {
            id: 1,
            front: "What is the definition of...",
            back: "The definition is...",
            difficulty: "medium",
            tags: ["definition", "basic"]
          },
          {
            id: 2,
            front: "Explain the concept of...",
            back: "The concept involves...",
            difficulty: "hard",
            tags: ["concept", "advanced"]
          }
        ]);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [subjectId, navigate]);

  const handleCreateFlashcard = () => {
    navigate(`/flashcards/create?subject=${subjectId}`);
  };

  const handleViewCommunity = () => {
    navigate(`/community?subject=${subjectId}`);
  };

  if (!userInfo || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gradient-subtle">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/subjects")}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Subjects
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{subject.name}</h1>
              <p className="text-muted-foreground">{subject.code}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <Button onClick={handleCreateFlashcard} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Flashcard
          </Button>
          <Button 
            variant="outline" 
            onClick={handleViewCommunity}
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Community Decks
          </Button>
        </div>

        {/* Flashcards List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Your Flashcards</h2>
          
          {flashcards.length > 0 ? (
            flashcards.map((flashcard) => (
              <Card key={flashcard.id} className="p-6 hero-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{flashcard.front}</h3>
                    <p className="text-muted-foreground mb-3">{flashcard.back}</p>
                    <div className="flex gap-2">
                      <Badge 
                        variant={flashcard.difficulty === 'easy' ? 'default' : 
                                flashcard.difficulty === 'medium' ? 'secondary' : 'destructive'}
                      >
                        {flashcard.difficulty}
                      </Badge>
                      {flashcard.tags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Star className="h-5 w-5 text-muted-foreground" />
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-12 text-center hero-card">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
              <p className="text-muted-foreground mb-4">
                Start creating flashcards for {subject.name} to begin studying.
              </p>
              <Button onClick={handleCreateFlashcard} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Flashcard
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubjectFlashcardsPage;
