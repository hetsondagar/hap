// src/pages/CreateFlashcardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Header from '@/components/Header';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save, Eye, Trash2 } from "lucide-react";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { toast } from "@/components/ui/sonner";
import { flashcardAPI, dashboardAPI } from "@/lib/api";
import EnhancedFlashcard from "@/components/EnhancedFlashcard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const CreateFlashcardPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  
  // Form state
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [tags, setTags] = useState("");
  const [creating, setCreating] = useState(false);
  
  // Recently created flashcards
  const [recentFlashcards, setRecentFlashcards] = useState<any[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [likedFlashcards, setLikedFlashcards] = useState<Set<string>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [editingFlashcard, setEditingFlashcard] = useState<any>(null);
  const [editFront, setEditFront] = useState('');
  const [editBack, setEditBack] = useState('');
  const [editDifficulty, setEditDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");
    
    if (storedUserId) {
      setCurrentUserId(storedUserId);
    }
    
    if (!token) {
      navigate("/login");
      return;
    }

    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      
      // Normalize year format
      let normalizedYear = user.year;
      if (!normalizedYear.includes('-year')) {
        normalizedYear = `${user.year}-year`;
      }
      
      setUserInfo({ department: user.department, year: normalizedYear });
      setSubjects(getSubjectsByDeptYear(user.department, normalizedYear));
      
      // Pre-select subject if provided in URL
      const subjectParam = searchParams.get("subject");
      if (subjectParam) {
        setSelectedSubject(subjectParam);
      }
      
      // Load recent flashcards
      loadRecentFlashcards(user.department, normalizedYear);
      
      // Load liked flashcards
      loadLikedFlashcards();
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

  const loadLikedFlashcards = async () => {
    try {
      const response = await dashboardAPI.getDashboardData();
      if (response.success && response.data.likedFlashcards) {
        const likedIds = new Set(response.data.likedFlashcards.map((fc: any) => fc._id));
        setLikedFlashcards(likedIds);
      }
    } catch (error) {
      console.error('Error loading liked flashcards:', error);
    }
  };

  const loadRecentFlashcards = async (department: string, year: string) => {
    try {
      setLoadingRecent(true);
      const response = await flashcardAPI.search({
        department,
        year,
        public: true,
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      } as any);
      
      console.log('Recent flashcards loaded:', response);
      const flashcards = response.data?.flashcards || response.flashcards || response.data || response || [];
      setRecentFlashcards(flashcards);
    } catch (error: any) {
      console.error("Error loading recent flashcards:", error);
      setRecentFlashcards([]);
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!front.trim() || !back.trim() || !selectedSubject || !userInfo) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      // Create flashcard via API
      const tagArray = tags.trim() ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
      
      const flashcardData = {
        front: front.trim(),
        back: back.trim(),
        department: userInfo.department,
        year: userInfo.year,
        subjectId: selectedSubject,
        difficulty,
        tags: tagArray,
        public: true // Make flashcards public so others can view them
      };
      
      console.log('Creating flashcard with data:', flashcardData);
      
      const response = await flashcardAPI.create(flashcardData as any);
      console.log('Flashcard created successfully:', response);
      
      toast.success("Flashcard created successfully!");
      
      // Keep subject selected if coming from subject page
      const subjectParam = searchParams.get("subject");
      
      // Reset form (but keep subject if it was pre-selected)
      setFront("");
      setBack("");
      if (!subjectParam) {
        setSelectedSubject("");
      }
      setDifficulty("medium");
      setTags("");
      
      // Reload recent flashcards to show the newly created one
      if (userInfo) {
        loadRecentFlashcards(userInfo.department, userInfo.year);
      }
      
      // Navigate back to the specific subject page if we came from there
      if (subjectParam) {
        // Add a small delay to ensure the flashcard is visible in the list
        setTimeout(() => {
          navigate(`/subjects/${subjectParam}/flashcards`);
        }, 500);
      }
    } catch (error: any) {
      // Handle validation errors from backend
      console.error("Full error creating flashcard:", error);
      console.error("Error response data:", error?.response?.data);
      
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create flashcard";
      const errors = error?.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        // Show all validation errors
        const errorMessages = errors.map(e => `${e.path || e.param}: ${e.msg || e.message}`).join(', ');
        toast.error(`Validation errors: ${errorMessages}`);
        console.error("Validation errors:", errors);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setCreating(false);
    }
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
    const flashcard = recentFlashcards.find(f => (f._id || f.id) === id);
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

      setRecentFlashcards(recentFlashcards.map(f => 
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
      setRecentFlashcards(recentFlashcards.filter(f => (f._id || f.id) !== id));
      toast.success('Flashcard deleted successfully!');
    } catch (error) {
      console.error('Error deleting flashcard:', error);
      toast.error('Failed to delete flashcard');
    }
  };

  if (!userInfo) {
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
      <div className="max-w-2xl mx-auto">
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
          
          <h1 className="text-3xl font-bold mb-2 text-foreground">Create Flashcard</h1>
          <p className="text-muted-foreground">
            {userInfo.department?.toUpperCase() || 'N/A'} - {userInfo.year || 'N/A'} Year
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                Subject *
                {searchParams.get("subject") && (
                  <Badge variant="secondary" className="text-xs">Auto-filled</Badge>
                )}
              </label>
              {searchParams.get("subject") ? (
                <Input
                  value={subjects.find(s => s.id === selectedSubject)?.name || selectedSubject}
                  disabled
                  className="bg-muted"
                />
              ) : (
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {/* Front Side */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Front Side *
              </label>
              <Textarea
                placeholder="Enter the question or term..."
                value={front}
                onChange={(e) => setFront(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Back Side */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Back Side *
              </label>
              <Textarea
                placeholder="Enter the answer or definition..."
                value={back}
                onChange={(e) => setBack(e.target.value)}
                className="min-h-[100px]"
                required
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Difficulty
              </label>
              <Select value={difficulty} onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">
                    <div className="flex items-center gap-2">
                      <Badge variant="default" className="bg-green-500">Easy</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="medium">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Medium</Badge>
                    </div>
                  </SelectItem>
                  <SelectItem value="hard">
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Hard</Badge>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Tags (comma-separated)
              </label>
              <Input
                placeholder="e.g., definition, concept, formula"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Add tags to help organize your flashcards
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                disabled={creating || !front.trim() || !back.trim() || !selectedSubject}
                className="flex items-center gap-2 flex-1"
              >
                {creating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Create Flashcard
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate("/subjects")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>

        {/* Recently Created Flashcards */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">Recently Created Flashcards</h2>
            <Badge variant="secondary" className="text-sm">{recentFlashcards.length} total</Badge>
          </div>
          
          {loadingRecent ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : recentFlashcards.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recentFlashcards.map((flashcard) => {
                const flashcardOwnerId = flashcard.ownerId?._id || flashcard.ownerId || flashcard.owner?._id || flashcard.owner;
                const isOwner = currentUserId && flashcardOwnerId && flashcardOwnerId.toString() === currentUserId;
                
                return (
                  <EnhancedFlashcard
                    key={flashcard._id}
                    id={flashcard._id}
                    front={flashcard.front}
                    back={flashcard.back}
                    difficulty={flashcard.difficulty || 'medium'}
                    department={flashcard.department}
                    year={flashcard.year}
                    isFlipped={flippedCards.has(flashcard._id)}
                    onFlip={handleFlipCard}
                    isFavorite={likedFlashcards.has(flashcard._id)}
                    onToggleFavorite={handleToggleLike}
                    onEdit={isOwner ? handleEditFlashcard : undefined}
                    onDelete={isOwner ? handleDeleteFlashcard : undefined}
                  />
                );
              })}
            </div>
          ) : (
            <Card className="p-8 text-center glass-effect circuit-pattern feature-card-hover border-2 border-white/10 dark:border-white/20">
              <p className="text-muted-foreground">No flashcards created yet. Create your first flashcard above!</p>
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

export default CreateFlashcardPage;
