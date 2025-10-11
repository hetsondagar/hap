import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { flashcardAPI, communityAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { toast } from "@/components/ui/sonner";

type FC = { _id: string; front: string; back: string; department?: string; difficulty?: string };

const CreateDeckDialog: React.FC<{ onCreated?: (id: string) => void } > = ({ onCreated }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<string>("cse");
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [selected, setSelected] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [mine, setMine] = useState<FC[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);

  const loadMine = async () => {
    try {
      setLoading(true);
      const res = await flashcardAPI.getUserFlashcards();
      const items: any[] = res?.data?.flashcards || res?.flashcards || [];
      setMine(items.map((x) => ({ _id: x._id || x.id, front: x.front, back: x.back, department: x.department, difficulty: x.difficulty })));
    } catch (error: any) {
      console.error('Error loading flashcards:', error);
      toast.error('Failed to load your flashcards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load user info on mount
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      let normalizedYear = user.year;
      if (!normalizedYear.includes('-year')) {
        normalizedYear = `${user.year}-year`;
      }
      setUserInfo({ department: user.department, year: normalizedYear });
      setDepartment(user.department); // Auto-fill from user's department
    }
  }, []);

  useEffect(() => {
    if (open) loadMine();
  }, [open]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const create = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to create a deck');
      navigate('/login');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a deck title');
      return;
    }
    
    if (!description.trim()) {
      toast.error('Please enter a description');
      return;
    }
    
    if (selected.length === 0) {
      toast.error('Please select at least one flashcard');
      return;
    }
    
    try {
      setLoading(true);
      
      // Prepare deck data with user info
      const deckData = { 
        title: title.trim(), 
        description: description.trim(), 
        flashcards: selected, 
        department: userInfo?.department || department,
        year: userInfo?.year,
        difficulty, 
        public: isPublic 
      };
      
      console.log('Creating deck with data:', deckData);
      
      const res = await communityAPI.createDeck(deckData);
      const id = res?.data?.deck?._id || res?.deck?._id;
      
      toast.success('Deck created successfully!');
      
      // Reset form
      setOpen(false);
      setTitle("");
      setDescription("");
      setSelected([]);
      
      // Callback to parent
      if (onCreated && id) {
        onCreated(id);
      }
    } catch (error: any) {
      console.error('Error creating deck:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create deck';
      const errors = error?.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        // Show first validation error
        toast.error(errors[0]?.msg || errorMessage);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={(e) => {
          const token = localStorage.getItem('token');
          if (!token) {
            e.preventDefault();
            navigate('/login');
            return;
          }
          setOpen(true);
        }}>Create Deck</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a Community Deck</DialogTitle>
        </DialogHeader>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Title *</label>
              <Input placeholder="Deck title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Description *</label>
              <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-[80px]" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Department {userInfo && <Badge variant="secondary" className="ml-1 text-xs">Auto-filled</Badge>}</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                  <SelectItem value="mechanical">Mechanical Engineering</SelectItem>
                  <SelectItem value="electrical">Electrical Engineering</SelectItem>
                  <SelectItem value="chemical">Chemical Engineering</SelectItem>
                  <SelectItem value="civil">Civil Engineering</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Difficulty</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 py-1">
              <input id="deck-public" type="checkbox" className="accent-primary" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />
              <label htmlFor="deck-public" className="text-sm">Public deck</label>
            </div>
            <Button onClick={create} disabled={loading || !title.trim() || selected.length === 0}>
              {loading ? 'Creating…' : 'Create Deck'}
            </Button>
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-auto">
            <div className="text-sm font-medium">
              Select flashcards ({selected.length} selected)
            </div>
            {loading ? (
              <div className="text-xs text-muted-foreground">Loading your flashcards...</div>
            ) : mine.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <p className="mb-2">No flashcards found.</p>
                <p className="text-xs">Create some flashcards first to add them to a deck.</p>
              </div>
            ) : (
              mine.map((fc) => (
                <div 
                  key={fc._id} 
                  className={`p-3 rounded-md border hover:shadow-sm transition cursor-pointer ${
                    selected.includes(fc._id) ? 'border-primary bg-primary/5' : 'border-border'
                  }`} 
                  onClick={() => toggleSelect(fc._id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium line-clamp-1">{fc.front}</div>
                    <div className="flex gap-2">
                      {fc.difficulty && <Badge variant="secondary">{fc.difficulty}</Badge>}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground line-clamp-1">{fc.back}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeckDialog;


