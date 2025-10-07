// src/pages/CreateFlashcardPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, Save } from "lucide-react";
import { getSubjectsByDeptYear } from "@/data/subjects";
import { toast } from "@/components/ui/sonner";
import { flashcardAPI } from "@/lib/api";

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

  useEffect(() => {
    // Get user info from localStorage
    const token = localStorage.getItem("token");
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
    } else {
      navigate("/login");
    }
  }, [navigate, searchParams]);

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
      
      await flashcardAPI.create({
        front: front.trim(),
        back: back.trim(),
        department: userInfo.department,
        year: userInfo.year,
        subjectId: selectedSubject,
        difficulty,
        tags: tagArray,
        public: true // Make flashcards public so others can view them
      } as any);
      
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
      
      // Navigate back to the specific subject page if we came from there
      if (subjectParam) {
        navigate(`/subjects/${subjectParam}/flashcards`);
      }
    } catch (error: any) {
      // Handle validation errors from backend
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to create flashcard";
      const errors = error?.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        // Show first validation error with field name
        const firstError = errors[0];
        const fieldName = firstError.path || firstError.param || 'field';
        toast.error(`${fieldName}: ${firstError.msg || firstError.message}`);
      } else {
        toast.error(errorMessage);
      }
      
      console.error("Error creating flashcard:", error);
    } finally {
      setCreating(false);
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
    <div className="min-h-screen p-8 bg-gradient-subtle">
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
            {userInfo.department.toUpperCase()} - {userInfo.year} Year
          </p>
        </div>

        {/* Form */}
        <Card className="p-6 hero-card">
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
      </div>
    </div>
  );
};

export default CreateFlashcardPage;
