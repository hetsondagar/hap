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
      setUserInfo({ department: user.department, year: user.year });
      setSubjects(getSubjectsByDeptYear(user.department, user.year));
      
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
    
    if (!front.trim() || !back.trim() || !selectedSubject) {
      toast.error("Please fill in all required fields");
      return;
    }

    setCreating(true);
    try {
      // In a real app, you'd call the API to create the flashcard
      // For now, we'll just show a success message
      toast.success("Flashcard created successfully!");
      
      // Reset form
      setFront("");
      setBack("");
      setSelectedSubject("");
      setDifficulty("medium");
      setTags("");
      
      // Navigate back to subjects or the specific subject page
      if (selectedSubject) {
        navigate(`/subjects/${selectedSubject}/flashcards`);
      } else {
        navigate("/subjects");
      }
    } catch (error) {
      toast.error("Failed to create flashcard");
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
              <label className="text-sm font-medium text-foreground">
                Subject *
              </label>
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
