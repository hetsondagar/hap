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
import { useState } from "react";
import { useParams } from "react-router-dom";
import { useFlashcards } from "@/context/FlashcardsContext";
import { Button } from "@/components/ui/button";
import { departmentMap, yearMap, phaseMap } from "@/utils/flashcardMapping";

const DeptFlashcardsPage = () => {
  const { deptId, yearId, phaseId } = useParams();
  const { cards } = useFlashcards();
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
    </div>
  );
};

export default DeptFlashcardsPage;
