// src/pages/departments/YearsPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { phaseMap } from "@/utils/flashcardMapping";

const YearsPage = () => {
  const { deptId, yearId } = useParams();
  const navigate = useNavigate();

  const phases = Object.entries(phaseMap).map(([id, name]) => ({
    id,
    name,
    icon: id === "mid-sem" ? "📚" : "🎯",
  }));

  return (
    <div className="min-h-screen p-8 bg-gradient-subtle">
      <h1 className="text-2xl font-bold mb-6 text-foreground">{yearId} - {deptId}</h1>
      <div className="grid gap-4">
        {phases.map((phase) => (
          <Card
            key={phase.id}
            className="p-4 text-center hero-card rounded-lg transition duration-200 cursor-pointer"
            onClick={() => navigate(`/departments/${deptId}/${yearId}/${phase.id}`)}
          >
            <div className="text-2xl">{phase.icon}</div>
            <h4 className="font-bold text-foreground">{phase.name}</h4>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default YearsPage;
