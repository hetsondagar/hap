// src/pages/departments/DepartmentPage.tsx
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { yearMap } from "@/utils/flashcardMapping";

const DepartmentPage = () => {
  const { deptId } = useParams();
  const navigate = useNavigate();

  const years = Object.entries(yearMap).map(([id, name]) => ({
    id,
    name,
    icon: "📘", // can customize per year
  }));

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">{deptId?.toUpperCase()} Department</h1>
      <div className="grid grid-cols-2 gap-4">
        {years.map((year) => (
          <Card
            key={year.id}
            className="p-4 text-center hover:bg-gray-800 text-white rounded-lg transition duration-200 cursor-pointer"
            onClick={() => navigate(`/departments/${deptId}/${year.id}`)}
          >
            <div className="text-2xl">{year.icon}</div>
            <h4 className="font-bold">{year.name}</h4>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DepartmentPage;
