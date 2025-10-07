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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useFlashcards } from "@/context/FlashcardsContext";
import { departmentMap } from "@/utils/flashcardMapping"; // ✅ mapping
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil, Plus, Sparkles } from "lucide-react";
import { authAPI, flashcardAPI } from "@/lib/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import FlashcardGrid from "@/components/FlashcardGrid";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

// Use the full department names from mapping
const departments = Object.values(departmentMap);

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const phases = ["Mid-Semester", "End-Semester"];

const FlashcardsPage = () => {
  const { cards, addCard, deleteCard } = useFlashcards();
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [department, setDepartment] = useState("");
  const [year, setYear] = useState("");
  const [phase, setPhase] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [creating, setCreating] = useState(false);
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());
  const [searchParams] = useSearchParams();

  // Helpers to convert human labels to URL ids
  const nameToDeptId = (name: string): string | null => {
    const entry = Object.entries(departmentMap).find(([, v]) => v === name);
    return entry ? entry[0] : null;
  };
  const yearNameToId = (name: string): string | null => {
    const map: Record<string, string> = { '1st Year': '1st-year', '2nd Year': '2nd-year', '3rd Year': '3rd-year', '4th Year': '4th-year' };
    return map[name] || null;
  };
  const phaseNameToId = (name: string): string | null => {
    const map: Record<string, string> = { 'Mid-Semester': 'mid-sem', 'End-Semester': 'end-sem' };
    return map[name] || null;
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('no token');
        await authAPI.getProfile();
        if (!mounted) return;
        setAuthChecked(true);
      } catch {
        if (!mounted) return;
        navigate('/login');
      }
    })();
    return () => { mounted = false; };
  }, [navigate]);

  // Prefill selections if coming from Features/Department flow
  useEffect(() => {
    const deptId = searchParams.get('deptId');
    const yearId = searchParams.get('yearId');
    const phaseId = searchParams.get('phaseId');

    if (deptId) {
      // Map deptId like 'cse' -> full department name from mapping values
      const fullDept = Object.values(departmentMap).find((v) => v.toLowerCase().includes('computer'));
      // If explicit ids provided, prefer mapping tables
      const deptFromId = ((): string | undefined => {
        const entry = Object.entries(departmentMap).find(([k]) => k === deptId);
        return entry?.[1];
      })();
      setDepartment(deptFromId || fullDept || "");
    }
    if (yearId) {
      const map: Record<string, string> = { '1st-year': '1st Year', '2nd-year': '2nd Year', '3rd-year': '3rd Year', '4th-year': '4th Year' };
      setYear(map[yearId] || "");
    }
    if (phaseId) {
      const map: Record<string, string> = { 'mid-sem': 'Mid-Semester', 'end-sem': 'End-Semester' };
      setPhase(map[phaseId] || "");
    }
  }, [searchParams]);

  const handleAddCard = () => {
    (async () => {
      if (front.trim() && back.trim() && department && year && phase) {
        try {
          setCreating(true);
          // Map UI department name to backend enum
          const backendDept = department.toLowerCase().includes('computer') ? 'Computer Science' : 'Engineering';
          await flashcardAPI.create({
            front,
            back,
            department: backendDept,
            tags: [year, phase],
          } as any);
          addCard({ front, back, department, year, phase, difficulty });
          // Success toast with quick link to department view
          const deptIdFromName = nameToDeptId(department);
          const yearIdFromName = yearNameToId(year);
          const phaseIdFromName = phaseNameToId(phase);
          toast.success("Flashcard created", {
            description: `${department} • ${year} • ${phase}`,
            action: deptIdFromName && yearIdFromName && phaseIdFromName ? {
              label: "View in Department",
              onClick: () => navigate(`/departments/${deptIdFromName}/${yearIdFromName}/${phaseIdFromName}`)
            } : undefined
          });
          setFront("");
          setBack("");
          setDepartment("");
          setYear("");
          setPhase("");
          setDifficulty("medium");
        } finally {
          setCreating(false);
        }
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
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <section className="pt-32 pb-16 container mx-auto px-4">
        <h1 className="text-4xl font-display font-bold mb-6 text-center">
          Smart Flashcard Creation
        </h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-2xl mx-auto">
          Create custom flashcards with questions and answers. Categorize them by
          department, year, and exam phase for structured study.
        </p>

        {/* Enhanced Add Flashcard Form */}
        <Card className="p-8 max-w-4xl mx-auto mb-12 bg-gradient-to-br from-white to-blue-50 border-2 border-blue-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Create Smart Flashcard</h2>
              <p className="text-gray-600">Add difficulty level and organize your study materials</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Question</label>
                <Input
                  placeholder="What is the question?"
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  className="h-12"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Answer</label>
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
                <label className="text-sm font-medium text-gray-700 mb-2 block">Department</label>
                <Select onValueChange={setDepartment} value={department}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Year</label>
                  <Select onValueChange={setYear} value={year}>
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>
                          {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phase</label>
                  <Select onValueChange={setPhase} value={phase}>
                    <SelectTrigger>
                      <SelectValue placeholder="Phase" />
                    </SelectTrigger>
                    <SelectContent>
                      {phases.map((p) => (
                        <SelectItem key={p} value={p}>
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Difficulty</label>
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
                        <span className="text-red-500">🔴</span>
                        <span>Hard</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleAddCard} 
                disabled={creating || !front.trim() || !back.trim() || !department || !year || !phase} 
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
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Study Collection</h2>
            <p className="text-gray-600">Organize, search, and study your flashcards with advanced features</p>
          </div>
          
          <FlashcardGrid
            flashcards={cards.map(card => ({
              id: card.id,
              front: card.front,
              back: card.back,
              department: card.department,
              year: card.year,
              phase: card.phase,
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
