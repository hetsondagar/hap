// // src/pages/departments/DeptFlashcardsPage.tsx
// import { useParams } from "react-router-dom";
// import { useFlashcards } from "@/context/FlashcardsContext";
// import { Button } from "@/components/ui/button";
// import { departmentMap, yearMap, phaseMap } from "@/utils/flashcardMapping";

// const DeptFlashcardsPage = () => {
//   const { deptId, yearId, phaseId } = useParams();
//   const { cards } = useFlashcards();

//   if (!deptId || !yearId || !phaseId) return null;

//   // Map IDs from URL to full names
//   const departmentName = departmentMap[deptId];
//   const yearName = yearMap[yearId];
//   const phaseName = phaseMap[phaseId];

//   if (!departmentName || !yearName || !phaseName) return <p>Invalid URL</p>;

//   // Filter flashcards
//   const filteredCards = cards.filter(
//     (card) =>
//       card.department === departmentName &&
//       card.year === yearName &&
//       card.phase === phaseName
//   );

//   return (
//     <div className="min-h-screen p-8 bg-gradient-subtle">
//       <h1 className="text-2xl font-bold mb-6">
//         {departmentName} - {yearName} - {phaseName}
//       </h1>

//       {filteredCards.length === 0 ? (
//         <p>No flashcards available yet.</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {filteredCards.map((card) => (
//             <div
//               key={card.id}
//               className="p-4 border rounded-xl bg-primary text-white"
//             >
//               <p>{card.front}</p>
//               <Button variant="outline" className="mt-2">
//                 Flip
//               </Button>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeptFlashcardsPage;
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFlashcards } from "@/context/FlashcardsContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Pencil } from "lucide-react";
import { departmentMap, yearMap, phaseMap } from "@/utils/flashcardMapping";
import { authAPI } from "@/lib/api";

const DeptFlashcardsPage = () => {
  const { deptId, yearId, phaseId } = useParams();
  const navigate = useNavigate();
  const { cards, addCard } = useFlashcards();
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // store flipped card ids

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const departmentName = deptId ? departmentMap[deptId] : "";
  const yearName = yearId ? yearMap[yearId] : "";
  const phaseName = phaseId ? phaseMap[phaseId] : "";

  const filteredCards = cards.filter(
    (card) =>
      card.department === departmentName &&
      card.year === yearName &&
      card.phase === phaseName
  );

  // auth guard
  const [authChecked, setAuthChecked] = useState(false);
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

  // Create modal state
  const [open, setOpen] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");

  const handleCreate = () => {
    if (!front.trim() || !back.trim()) return;
    if (!departmentName || !yearName || !phaseName) return;
    addCard({ front, back, department: departmentName, year: yearName, phase: phaseName });
    setFront("");
    setBack("");
    setOpen(false);
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen p-8 bg-gradient-subtle">
      <h1 className="text-2xl font-bold mb-6">
        {departmentName} - {yearName} - {phaseName}
      </h1>

      {filteredCards.length === 0 ? (
        <p>No flashcards available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCards.map((card) => {
            const isFlipped = flippedCards.includes(card.id);
            return (
              <div
                key={card.id}
                className="p-4 border rounded-xl bg-primary text-white transition-all duration-300 hover:shadow-lg cursor-pointer"
              >
                <p>{isFlipped ? card.back : card.front}</p>
                <Button
                  variant="outline"
                  className="mt-2 w-full"
                  onClick={() => toggleFlip(card.id)}
                >
                  Flip
                </Button>
              </div>
            );
          })}
        </div>
      )}

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
            <div className="text-sm text-muted-foreground">
              {departmentName} • {yearName} • {phaseName}
            </div>
            <Input placeholder="Front (Question)" value={front} onChange={(e) => setFront(e.target.value)} />
            <Textarea placeholder="Back (Answer)" value={back} onChange={(e) => setBack(e.target.value)} />
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={handleCreate} className="bg-gradient-primary text-white">Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeptFlashcardsPage;
