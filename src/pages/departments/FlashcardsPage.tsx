import { useParams } from "react-router-dom";
import { useFlashcards } from "@/context/FlashcardsContext";
import { Button } from "@/components/ui/button";

const FlashcardsPage = () => {
  const { deptId, yearId, phaseId } = useParams();
  const { cards } = useFlashcards();

  const filteredCards = cards.filter(
    (c) =>
      c.department.toLowerCase() === deptId &&
      c.year.toLowerCase().replace(" ", "-") === yearId &&
      c.phase.toLowerCase().replace(" ", "-") === phaseId
  );

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-6">
        {deptId} - {yearId} - {phaseId}
      </h1>

      {filteredCards.length === 0 ? (
        <p>No flashcards available yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredCards.map((card) => (
            <div key={card.id} className="p-4 border rounded-xl bg-primary text-white">
              <p>{card.front}</p>
              <Button variant="outline" className="mt-2">Flip</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardsPage;
