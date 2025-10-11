import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFlashcards } from "@/context/FlashcardsContext";
import { Plus, Sparkles } from "lucide-react";
import { authAPI, flashcardAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import FlashcardGrid from "@/components/FlashcardGrid";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { getSubjectsByDeptYear } from "@/data/subjects";

const FlashcardsPage = () => {
  const { cards, addCard, deleteCard } = useFlashcards();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [creating, setCreating] = useState(false);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("");


  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('no token');
        await authAPI.getProfile();
        
        // Get user info from localStorage to auto-fill department and year
        const storedUserInfo = localStorage.getItem("userInfo");
        if (storedUserInfo) {
          const user = JSON.parse(storedUserInfo);
          
          // Normalize year format
          let normalizedYear = user.year;
          if (!normalizedYear.includes('-year')) {
            normalizedYear = `${user.year}-year`;
          }
          
          setUserInfo({ department: user.department, year: normalizedYear });
          
          // Load subjects for this department and year
          const userSubjects = getSubjectsByDeptYear(user.department, normalizedYear);
          setSubjects(userSubjects);
          
          // Map stored department/year to display format
          const deptMap: Record<string, string> = {
            'cse': 'Computer Science',
            'civil': 'Civil Engineering',
            'mech': 'Mechanical Engineering',
            'elec': 'Electrical Engineering',
            'other': 'Other Engineering'
          };
          const yearMap: Record<string, string> = {
            '1st-year': '1st Year',
            '2nd-year': '2nd Year',
            '3rd-year': '3rd Year',
            '4th-year': '4th Year'
          };
          
          setDepartment(deptMap[user.department] || user.department);
          setYear(yearMap[user.year] || user.year);
        }
        
        if (!mounted) return;
        setAuthChecked(true);
      } catch {
        if (!mounted) return;
        navigate('/login');
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);


  const handleAddCard = () => {
    (async () => {
      // Department, year, and subject are required
      if (front.trim() && back.trim() && selectedSubject && userInfo) {
        try {
          setCreating(true);
          
          const tagArray = [];
          
          const flashcardData = {
            front: front.trim(),
            back: back.trim(),
            department: userInfo.department,
            year: userInfo.year,
            subjectId: selectedSubject,
            difficulty,
            tags: tagArray,
            public: true
          };
          
          console.log('Creating flashcard with data:', flashcardData);
          
          const response = await flashcardAPI.create(flashcardData as any);
          console.log('Flashcard created:', response);
          
          const selectedSubjectData = subjects.find(s => s.id === selectedSubject);
          
          addCard({ front, back, department, year: userInfo.year, difficulty, subjectId: selectedSubject } as any);
          
          toast.success("Flashcard created successfully!", {
            description: `${selectedSubjectData?.name || 'Subject'} • ${userInfo.department?.toUpperCase() || 'N/A'}`
          });
          
          setFront("");
          setBack("");
          setSelectedSubject("");
          setDifficulty("medium");
        } catch (error: any) {
          console.error("Error creating flashcard:", error);
          console.error("Error response:", error?.response?.data);
          
          const errorMessage = error?.response?.data?.message || error?.message || "Failed to create flashcard";
          const errors = error?.response?.data?.errors;
          
          if (errors && Array.isArray(errors)) {
            const errorMessages = errors.map((e: any) => `${e.path || e.param}: ${e.msg || e.message}`).join(', ');
            toast.error(`Validation errors: ${errorMessages}`);
          } else {
            toast.error(errorMessage);
          }
        } finally {
          setCreating(false);
        }
      } else {
        toast.error("Please fill in all fields including subject");
      }
    })();
  };

  const handleToggleFavorite = (id: string | number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleEdit = (id: string | number) => {
    // TODO: Implement edit functionality
    console.log('Edit card:', id);
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen">
      <Header />

      <section className="pt-32 pb-16 container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-6 text-center">
          Smart Flashcard Creation
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Create custom flashcards with questions and answers. Your department and year
          are automatically set from your profile.
        </p>

        {/* Enhanced Add Flashcard Form */}
        <Card className="p-8 max-w-4xl mx-auto mb-12 glass-effect circuit-pattern feature-card-hover border-2 border-white/10 dark:border-white/20 bg-card dark:bg-card/90">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Create Smart Flashcard</h2>
              <p className="text-muted-foreground">Add difficulty level and organize your study materials</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Question</label>
            <Input
                  placeholder="What is the question?"
              value={front}
              onChange={(e) => setFront(e.target.value)}
                  className="h-12"
            />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Answer</label>
            <Textarea
                  placeholder="What is the answer?"
              value={back}
              onChange={(e) => setBack(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Subject *
                </label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="h-12">
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
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Department {userInfo && <Badge variant="secondary" className="ml-2">Auto-filled</Badge>}
                </label>
                <Input
                  value={department}
                  disabled
                  className="h-12 bg-muted/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Year {userInfo && <Badge variant="secondary" className="ml-2">Auto-filled</Badge>}
                </label>
                <Input
                  value={year}
                  disabled
                  className="h-12 bg-muted/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Difficulty</label>
                <Select onValueChange={(value: "easy" | "medium" | "hard") => setDifficulty(value)} value={difficulty}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      <div className="flex items-center gap-2">
                        <span className="text-green-500">🟢</span>
                        <span>Easy</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-500">🟡</span>
                        <span>Medium</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="hard">
                      <div className="flex items-center gap-2">
                        <span className="text-destructive">🔴</span>
                        <span>Hard</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddCard} 
                disabled={creating || !front.trim() || !back.trim() || !selectedSubject} 
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                {creating ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Create Flashcard
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Enhanced Flashcard Grid */}
        <div className="w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Your Study Collection</h2>
            <p className="text-muted-foreground">Organize, search, and study your flashcards with advanced features</p>
          </div>
          
          <FlashcardGrid
            flashcards={cards.map(card => ({
              id: card.id,
              front: card.front,
              back: card.back,
              department: card.department,
              year: card.year,
              difficulty: (card as any).difficulty || 'medium',
              isFavorite: favorites.has(card.id)
            }))}
            onFlip={(id) => console.log('Flip card:', id)}
            onDelete={deleteCard}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
          />
              </div>
      </section>

      {/* Floating Create Button removed: page is dedicated to creation */}
    </div>
  );
};

export default FlashcardsPage;
