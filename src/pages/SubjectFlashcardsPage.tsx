// src/pages/SubjectFlashcardsPage.tsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { ArrowLeft, Plus, BookOpen, Star, Users, Loader2 } from "lucide-react";
import { flashcardAPI, dashboardAPI } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import EnhancedFlashcard from "@/components/EnhancedFlashcard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SubjectFlashcardsPage = () => {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  const [subject, setSubject] = useState<any>(null);
  const [flashcards, setFlashcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [likedFlashcards, setLikedFlashcards] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [editingFlashcard, setEditingFlashcard] = useState<any>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

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
      const flashcardsData = response.data?.flashcards || response.flashcards || response.data || response || [];
      setFlashcards(flashcardsData);
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

  const handleFlipCard = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleLike = async (id: string | number) => {
    try {
      const flashcardId = id.toString();
      await dashboardAPI.toggleLikeFlashcard(flashcardId);
      
      setLikedFlashcards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(flashcardId)) {
          newSet.delete(flashcardId);
          toast.success('Removed from favorites');
        } else {
          newSet.add(flashcardId);
          toast.success('Added to favorites');
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update favorite');
    }
  };

  const handleEditFlashcard = (id: string | number) => {
    const flashcard = flashcards.find(f => (f._id || f.id) === id);
    if (flashcard) {
      setEditingFlashcard(flashcard);
      setEditFront(flashcard.front);
      setEditBack(flashcard.back);
      setEditDifficulty(flashcard.difficulty || 'medium');
    }
  };

  const handleSaveEdit = async () => {
    if (!editingFlashcard || !editFront.trim() || !editBack.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await flashcardAPI.update(editingFlashcard._id || editingFlashcard.id, {
        front: editFront,
        back: editBack,
        difficulty: editDifficulty
      });

      setFlashcards(flashcards.map(f => 
        (f._id || f.id) === (editingFlashcard._id || editingFlashcard.id)
          ? { ...f, front: editFront, back: editBack, difficulty: editDifficulty }
          : f
      ));

      setEditingFlashcard(null);
      setEditFront('');
      setEditBack('');
      toast.success('Flashcard updated successfully!');
    } catch (error) {
      console.error('Error updating flashcard:', error);
      toast.error('Failed to update flashcard');
    }
  };

  const handleDeleteFlashcard = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) return;

    try {
      await flashcardAPI.delete(id.toString());
      setFlashcards(flashcards.filter(f => (f._id || f.id) !== id));
      toast.success('Flashcard deleted successfully!');
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast.error('Failed to delete flashcard');
    }
  };

  if (!userInfo || !subject) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-24 pb-16 px-8">
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

        {/* Flashcards Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Flashcards</h2>
            <Badge variant="secondary" className="text-sm">{flashcards.length} cards</Badge>
          </div>
          
          {loading ? (
            <Card className="p-12 text-center glass-effect circuit-pattern feature-card-hover border-2 border-white/10 dark:border-white/20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading flashcards...</p>
            </Card>
          ) : flashcards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {flashcards.map((flashcard: any) => {
                const flashcardOwnerId = flashcard.ownerId?._id || flashcard.ownerId || flashcard.owner?._id || flashcard.owner;
                const isOwner = currentUserId && flashcardOwnerId && flashcardOwnerId.toString() === currentUserId;
                
                return (
                  <EnhancedFlashcard
                    key={flashcard._id || flashcard.id}
                    id={flashcard._id || flashcard.id}
                    front={flashcard.front}
                    back={flashcard.back}
                    difficulty={flashcard.difficulty || 'medium'}
                    department={flashcard.department}
                    year={flashcard.year}
                    isFlipped={flippedCards.has(flashcard._id || flashcard.id)}
                    onFlip={handleFlipCard}
                    isFavorite={likedFlashcards.has(flashcard._id || flashcard.id)}
                    onToggleFavorite={handleToggleLike}
                    onEdit={isOwner ? handleEditFlashcard : undefined}
                    onDelete={isOwner ? handleDeleteFlashcard : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="p-12 text-center glass-effect circuit-pattern feature-card-hover border-2 border-white/10 dark:border-white/20">
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

      {/* Edit Flashcard Dialog */}
      <Dialog open={!!editingFlashcard} onOpenChange={(open) => !open && setEditingFlashcard(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Flashcard</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-front">Question (Front)</Label>
              <Textarea
                id="edit-front"
                placeholder="Enter the question or term..."
                value={editFront}
                onChange={(e) => setEditFront(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-back">Answer (Back)</Label>
              <Textarea
                id="edit-back"
                placeholder="Enter the answer or definition..."
                value={editBack}
                onChange={(e) => setEditBack(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-difficulty">Difficulty</Label>
              <Select value={editDifficulty} onValueChange={(value: any) => setEditDifficulty(value)}>
                <SelectTrigger id="edit-difficulty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingFlashcard(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-gradient-primary">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectFlashcardsPage;
