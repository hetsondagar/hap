import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { flashcardAPI, communityAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";

type FC = { _id: string; front: string; back: string; department?: string; difficulty?: string };

const CreateDeckDialog: React.FC<{ onCreated?: (id: string) => void } > = ({ onCreated }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<string>("Computer Science");
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [selected, setSelected] = useState<string[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);
  const [mine, setMine] = useState<FC[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMine = async () => {
    try {
      setLoading(true);
      const res = await flashcardAPI.getUserFlashcards();
      const items: any[] = res?.data?.flashcards || res?.flashcards || [];
      setMine(items.map((x) => ({ _id: x._id || x.id, front: x.front, back: x.back, department: x.department, difficulty: x.difficulty })));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) loadMine();
  }, [open]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const create = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (!title.trim() || selected.length === 0) return;
    try {
      setLoading(true);
      const res = await communityAPI.createDeck({ title, description, flashcards: selected, department, difficulty, public: isPublic });
      const id = res?.data?.deck?._id || res?.deck?._id;
      setOpen(false);
      setTitle("");
      setDescription("");
      setSelected([]);
      if (onCreated && id) onCreated(id);
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
            <Input placeholder="Deck title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea placeholder="Short description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <div>
              <label className="text-xs text-muted-foreground">Department</label>
              <Select value={department} onValueChange={setDepartment}>
                <SelectTrigger>
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  {['Computer Science','Engineering','Mathematics','Physics','Chemistry','Biology','Business','Other'].map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
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
            <div className="text-sm text-muted-foreground">Select your flashcards</div>
            {mine.length === 0 && (
              <div className="text-xs text-muted-foreground">No flashcards found. Create some first.</div>
            )}
            {mine.map((fc) => (
              <div key={fc._id} className={`p-3 rounded-md border hover:shadow-sm transition cursor-pointer ${selected.includes(fc._id) ? 'border-primary' : ''}`} onClick={() => toggleSelect(fc._id)}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-sm font-medium line-clamp-1">{fc.front}</div>
                  <div className="flex gap-2">
                    {fc.department && <Badge variant="secondary">{fc.department}</Badge>}
                    {fc.difficulty && <Badge>{fc.difficulty}</Badge>}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground line-clamp-1">{fc.back}</div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDeckDialog;


