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
import { Pencil } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useNavigate } from "react-router-dom";

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

  const handleAddCard = () => {
    if (front.trim() && back.trim() && department && year && phase) {
      addCard({
        front,
        back,
        department, // now matches mapping
        year,
        phase,
      });
      setFront("");
      setBack("");
      setDepartment("");
      setYear("");
      setPhase("");
    }
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

        {/* Add Flashcard Form */}
        <Card className="p-6 max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-4">Add New Flashcard</h2>
          <div className="space-y-4">
            <Input
              placeholder="Front (Question)"
              value={front}
              onChange={(e) => setFront(e.target.value)}
            />
            <Textarea
              placeholder="Back (Answer)"
              value={back}
              onChange={(e) => setBack(e.target.value)}
            />
            {/* Department */}
            <Select onValueChange={setDepartment} value={department}>
              <SelectTrigger>
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

            {/* Year */}
            <Select onValueChange={setYear} value={year}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Exam Phase */}
            <Select onValueChange={setPhase} value={phase}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleAddCard}
              className="bg-gradient-primary text-white"
            >
              Add Flashcard
            </Button>
          </div>
        </Card>

        {/* Flashcards by Department Tabs */}
        <Tabs defaultValue={departments[0]} className="w-full">
          <TabsList className="flex flex-wrap justify-center mb-8">
            {departments.map((dept) => (
              <TabsTrigger key={dept} value={dept}>
                {dept}
              </TabsTrigger>
            ))}
          </TabsList>

          {departments.map((dept) => (
            <TabsContent key={dept} value={dept}>
              <div className="grid md:grid-cols-2 gap-6">
                {cards.filter((card) => card.department === dept).length === 0 ? (
                  <p className="text-center text-muted-foreground w-full">
                    No flashcards in {dept}.
                  </p>
                ) : (
                  cards
                    .filter((card) => card.department === dept)
                    .map((card) => (
                      <Card
                        key={card.id}
                        className="p-6 flex flex-col justify-between hover:shadow-lg transition"
                      >
                        <div>
                          <h3 className="font-bold text-lg mb-2">{card.front}</h3>
                          <p className="text-muted-foreground mb-4">{card.back}</p>
                          <div className="text-sm text-muted-foreground">
                            <strong>Year:</strong> {card.year} <br />
                            <strong>Phase:</strong> {card.phase}
                          </div>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="mt-4"
                          onClick={() => deleteCard(card.id)}
                        >
                          Delete
                        </Button>
                      </Card>
                    ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Floating Create Button and Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-primary text-white shadow-lg flex items-center justify-center hover:opacity-90"
            aria-label="Create flashcard"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Create Flashcard</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Front (Question)" value={front} onChange={(e) => setFront(e.target.value)} />
            <Textarea placeholder="Back (Answer)" value={back} onChange={(e) => setBack(e.target.value)} />
            {/* Department */}
            <Select onValueChange={setDepartment} value={department}>
              <SelectTrigger>
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
            {/* Year */}
            <Select onValueChange={setYear} value={year}>
              <SelectTrigger>
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={y}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* Exam Phase */}
            <Select onValueChange={setPhase} value={phase}>
              <SelectTrigger>
                <SelectValue placeholder="Select Exam Phase" />
              </SelectTrigger>
              <SelectContent>
                {phases.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCard} className="bg-gradient-primary text-white">Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FlashcardsPage;
