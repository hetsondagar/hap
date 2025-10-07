// src/pages/departments/DepartmentPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { yearMap, phaseMap } from "@/utils/flashcardMapping";
import { useMemo, useState } from "react";

const DepartmentPage = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();

  const years = useMemo(
    () => Object.entries(yearMap).map(([id, name]) => ({ id, name })),
    []
  );
  const phases = useMemo(
    () => Object.entries(phaseMap).map(([id, name]) => ({ id, name })),
    []
  );

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const canContinue = Boolean(selectedYear && selectedPhase && deptId);

  const goNext = () => {
    if (!canContinue) return;
    navigate(`/departments/${deptId}/${selectedYear}/${selectedPhase}`);
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-subtle">
      <h1 className="text-3xl font-bold mb-2 text-foreground">{decodeURIComponent(deptId || '').toUpperCase()} Department</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Select your year and exam phase to view relevant decks.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4 hero-card">
          <h3 className="text-xl font-semibold mb-3">Choose Year</h3>
          <div className="grid grid-cols-2 gap-3">
            {years.map((year) => (
              <button
                key={year.id}
                className={`px-3 py-2 rounded-md border text-left transition ${
                  selectedYear === year.id
                    ? "bg-primary text-white border-primary"
                    : "border-border hover:bg-primary/10 text-foreground"
                }`}
                onClick={() => setSelectedYear(year.id)}
              >
                {year.name}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4 hero-card">
          <h3 className="text-xl font-semibold mb-3">Choose Exam Phase</h3>
          <div className="grid grid-cols-2 gap-3">
            {phases.map((phase) => (
              <button
                key={phase.id}
                className={`px-3 py-2 rounded-md border text-left transition ${
                  selectedPhase === phase.id
                    ? "bg-primary text-white border-primary"
                    : "border-border hover:bg-primary/10 text-foreground"
                }`}
                onClick={() => setSelectedPhase(phase.id)}
              >
                {phase.name}
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 flex gap-3">
        <Button disabled={!canContinue} onClick={goNext}>
          Continue
        </Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default DepartmentPage;
