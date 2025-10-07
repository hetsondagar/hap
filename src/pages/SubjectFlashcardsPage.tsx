// src/pages/SubjectFlashcardsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { ArrowLeft, Plus, BookOpen, Star, Users, Loader2 } from "lucide-react";
import { flashcardAPI } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

const SubjectFlashcardsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        
        // Fetch flashcards for this subject from API
        loadFlashcards(user.department, normalizedYear, subjectId);
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [subjectId, navigate]);

  const loadFlashcards = async (department: string, year: string, subjectId?: string) => {
    try {
      setLoading(true);
      // Fetch all public flashcards for this department, year, and subject
      const response = await flashcardAPI.search({
        department,
        year,
        subjectId,
        public: true,
        limit: 100
      } as any);
      
      console.log('Flashcards loaded:', response);
      setFlashcards(response.flashcards || response.data || response || []);
    } catch (error: any) {
      console.error("Error loading flashcards:", error);
      toast.error("Failed to load flashcards");
      setFlashcards([]);
    } finally {
      setLoading(false);
    }
  };

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
          <h2 className="text-xl font-semibold mb-4">All Flashcards</h2>
          
          {loading ? (
            <Card className="p-12 text-center hero-card">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading flashcards...</p>
            </Card>
          ) : flashcards.length > 0 ? (
            flashcards.map((flashcard: any) => (
              <Card key={flashcard._id || flashcard.id} className="p-6 hero-card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{flashcard.front}</h3>
                    <p className="text-muted-foreground mb-3">{flashcard.back}</p>
                    <div className="flex gap-2 flex-wrap">
                      <Badge 
                        variant={flashcard.difficulty === 'easy' ? 'default' : 
                                flashcard.difficulty === 'medium' ? 'secondary' : 'destructive'}
                      >
                        {flashcard.difficulty || 'medium'}
                      </Badge>
                      {flashcard.tags && flashcard.tags.length > 0 && flashcard.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {flashcard.public && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          Public
                        </Badge>
                      )}
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
                Your flashcards will be visible to other students too!
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
