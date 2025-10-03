// src/pages/Departments.tsx
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { departmentMap } from "@/utils/flashcardMapping";

const Departments = () => {
  const navigate = useNavigate();

  const departments = Object.entries(departmentMap).map(([id, name]) => ({
    id,
    name,
    gradient: "from-blue-500 to-purple-600", // simple gradient, can customize per dept
  }));

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Engineering Departments</h1>
        <p className="text-lg text-gray-500">
          Choose your department to explore years and exams.
        </p>
      </section>

      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Card key={dept.id} className="overflow-hidden rounded-xl shadow-lg">
              <div className={`bg-gradient-to-r ${dept.gradient} p-6 text-white`}>
                <h3 className="font-bold text-xl mb-1">{dept.name}</h3>
              </div>
              <div className="p-6">
                <Button
                  className="w-full"
                  onClick={() => navigate(`/departments/${dept.id}`)}
                >
                  Explore Decks
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Departments;
