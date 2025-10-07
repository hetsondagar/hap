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
import { Pencil, Plus, Sparkles } from "lucide-react";
import { departmentMap, yearMap, phaseMap } from "@/utils/flashcardMapping";
import { authAPI, flashcardAPI } from "@/lib/api";
import FlashcardGrid from "@/components/FlashcardGrid";
import { Badge } from "@/components/ui/badge";

const DeptFlashcardsPage = () => {
  const { deptId, yearId, phaseId } = useParams();
  const navigate = useNavigate();
  const { cards, addCard } = useFlashcards();
  const [flippedCards, setFlippedCards] = useState<number[]>([]); // store flipped card ids
  const [favorites, setFavorites] = useState<Set<string | number>>(new Set());

  const toggleFlip = (id: number) => {
    setFlippedCards((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
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
    console.log('Edit card:', id);
  };

  const departmentName = deptId ? departmentMap[deptId] : "";
  const yearName = yearId ? yearMap[yearId] : "";
  const phaseName = phaseId ? phaseMap[phaseId] : "";

  // Map UI department to backend enum
  const backendDepartment = (() => {
    if (!departmentName) return "Engineering";
    if (departmentName.toLowerCase().includes("computer")) return "Computer Science";
    if (departmentName.toLowerCase().includes("electrical")) return "Engineering";
    if (departmentName.toLowerCase().includes("mechanical")) return "Engineering";
    if (departmentName.toLowerCase().includes("civil")) return "Engineering";
    if (departmentName.toLowerCase().includes("chemical")) return "Engineering";
    return "Engineering";
  })();

  // Server-side list
  const [serverCards, setServerCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshFromServer = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await flashcardAPI.getByDepartment(backendDepartment);
      const items = res?.data?.flashcards || res?.flashcards || [];
      // Filter by year/phase tags
      const yr = yearName?.toLowerCase();
      const ph = phaseName?.toLowerCase();
      const filtered = items.filter((fc: any) => {
        const tags: string[] = fc?.tags || [];
        const t = tags.map((x) => String(x).toLowerCase());
        return (!yr || t.includes(yr)) && (!ph || t.includes(ph));
      });
      setServerCards(filtered);
    } catch (e: any) {
      setError(e?.message || "Failed to load flashcards");
    } finally {
      setLoading(false);
    }
  };

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
        await refreshFromServer();
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

  const [creating, setCreating] = useState(false);
  const handleCreate = async () => {
    if (!front.trim() || !back.trim()) return;
    if (!backendDepartment || !yearName || !phaseName) return;
    try {
      setCreating(true);
      await flashcardAPI.create({
        front,
        back,
        department: backendDepartment,
        tags: [yearName, phaseName],
      } as any);
      await refreshFromServer();
      // also add to local context for immediate UI consistency
      addCard({ front, back, department: departmentName, year: yearName, phase: phaseName });
      setFront("");
      setBack("");
      setOpen(false);
    } finally {
      setCreating(false);
    }
  };

  if (!authChecked) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Enhanced Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Sparkles className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {departmentName} Study Materials
      </h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {yearName}
                </Badge>
                <Badge variant="outline" className="border-gray-300">
                  {phaseName}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading flashcards...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
        </div>
      )}

        {!loading && serverCards.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No flashcards yet</h3>
            <p className="text-gray-500 mb-6">Start creating flashcards for this subject</p>
            <Button 
              onClick={() => setOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Flashcard
            </Button>
          </div>
        ) : (
          <FlashcardGrid
            flashcards={serverCards.map(card => ({
              id: card._id || card.id,
              front: card.front,
              back: card.back,
              department: departmentName,
              year: yearName,
              phase: phaseName,
              difficulty: 'medium' as const,
              isFavorite: favorites.has(card._id || card.id)
            }))}
            onFlip={(id) => toggleFlip(Number(id))}
            onDelete={(id) => console.log('Delete card:', id)}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>

      {/* Enhanced Floating Create Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative group">
          <button
            className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
            aria-label="Create flashcard"
            onClick={() => setOpen(true)}
          >
            <Plus className="w-6 h-6" />
          </button>
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Create New Flashcard
            <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>

      {/* Enhanced Create Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <DialogTitle className="text-xl">Create New Flashcard</DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {departmentName} • {yearName} • {phaseName}
                </p>
              </div>
            </div>
          </DialogHeader>
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
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button 
                disabled={creating || !front.trim() || !back.trim()} 
                onClick={handleCreate} 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
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
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeptFlashcardsPage;
