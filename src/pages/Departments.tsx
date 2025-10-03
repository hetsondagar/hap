import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, BookOpen, RotateCcw, Users } from "lucide-react";
import engineeringDepartments from "@/assets/engineering-departments.jpg";
import { useFlashcards } from "@/context/FlashcardsContext"; // ✅ import context

const Departments = () => {
  const [activeDept, setActiveDept] = useState<string | null>(null);
  const [activeYear, setActiveYear] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);

  const { cards } = useFlashcards(); // ✅ global cards

  const departments = [
    {
      id: "Computer Science",
      name: "Computer Science & Engineering",
      image: "/assets/departments/cse.jpg",
      subjects: ["Data Structures", "Algorithms", "DBMS"],
      stats: { decks: 2450, students: 15600, avgRating: 4.8 },
      popular: ["C++ Programming", "System Design", "Web Development"],
    },
    {
      id: "Mechanical",
      name: "Mechanical Engineering",
      image: "/assets/departments/mech.jpg",
      subjects: ["Thermodynamics", "Fluid Mechanics", "Machine Design"],
      stats: { decks: 1850, students: 12400, avgRating: 4.7 },
      popular: ["Heat Transfer", "Machine Design", "Manufacturing Processes"],
    },
    {
      id: "Electrical",
      name: "Electrical Engineering",
      image: "/assets/departments/elec.jpg",
      subjects: ["Circuit Analysis", "Power Systems", "Control Systems"],
      stats: { decks: 1650, students: 11200, avgRating: 4.6 },
      popular: ["Circuit Analysis", "Power Electronics", "Control Systems"],
    },
    {
      id: "Chemical",
      name: "Chemical Engineering",
      image: "/assets/departments/chem.jpg",
      subjects: ["Process Design", "Chemical Thermodynamics", "Reaction Engg"],
      stats: { decks: 980, students: 6800, avgRating: 4.5 },
      popular: ["Process Design", "Chemical Reactions", "Thermodynamics"],
    },
    {
      id: "Civil",
      name: "Civil Engineering",
      image: "/assets/departments/civil.jpg",
      subjects: ["Structural Analysis", "Construction", "Geotech"],
      stats: { decks: 1320, students: 8900, avgRating: 4.4 },
      popular: ["Structural Design", "Construction Methods", "Soil Mechanics"],
    },
    {
      id: "Other",
      name: "Other Engineering",
      image: "/assets/departments/other.jpg",
      subjects: ["Materials", "Engineering Maths", "Physics"],
      stats: { decks: 760, students: 5200, avgRating: 4.3 },
      popular: ["Engineering Physics", "Mathematics", "Materials Science"],
    },
  ];

  const years = [
    { id: "1st Year", name: "1st Year", icon: "📘" },
    { id: "2nd Year", name: "2nd Year", icon: "📗" },
    { id: "3rd Year", name: "3rd Year", icon: "📙" },
    { id: "4th Year", name: "4th Year", icon: "📕" },
  ];

  const examPhases = [
    {
      id: "Mid-Semester",
      name: "Mid-Semester",
      description: "Focused study materials covering first half",
      icon: "📚",
    },
    {
      id: "End-Semester",
      name: "End-Semester",
      description: "Comprehensive materials for full syllabus",
      icon: "🎯",
    },
  ];

  const handleFlip = (i: number) => {
    setFlippedIndex((prev) => (prev === i ? null : i));
  };

  // ✅ filter cards by selection
  const filteredCards = cards.filter(
    (c) =>
      (!activeDept || c.department === activeDept) &&
      (!activeYear || c.year === activeYear) &&
      (!activePhase || c.phase === activePhase)
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 text-center">
        <h1 className="text-5xl font-bold mb-6">Engineering Departments</h1>
        <p className="text-lg text-muted-foreground">
          Choose your department, year, and exam phase to access flashcards.
        </p>
        <img
          src={engineeringDepartments}
          alt="Engineering"
          className="max-w-3xl mx-auto mt-8 rounded-2xl shadow"
        />
      </section>

      {/* Departments */}
      <section className="py-16 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Card
              key={dept.id}
              className="department-card overflow-hidden text-white"
              style={{
                backgroundImage: `url(${dept.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50"></div>

              {/* Card Header */}
              <div className="dept-card-header relative z-10 p-6">
                <div className="flex justify-between items-center mb-2">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-medium">{dept.stats.avgRating}</span>
                </div>
                <h3 className="font-bold text-xl mb-1">{dept.name}</h3>
              </div>

              {/* Card Content */}
              <CardContent className="relative z-10 p-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{dept.stats.decks} Decks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{dept.stats.students} Students</span>
                  </div>
                </div>

                {/* Subjects */}
                <div className="mb-4">
                  <h4 className="font-medium text-sm uppercase text-muted-foreground mb-2">
                    Subjects
                  </h4>
                  {dept.subjects.map((s, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm">
                      <BookOpen className="w-3 h-3 text-primary" /> <span>{s}</span>
                    </div>
                  ))}
                </div>

                {/* Popular Topics */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {dept.popular.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {topic}
                    </Badge>
                  ))}
                </div>

                {/* Explore Flow */}
                <Button
                  className="w-full mb-4"
                  onClick={() => {
                    setActiveDept(activeDept === dept.id ? null : dept.id);
                    setActiveYear(null);
                    setActivePhase(null);
                    setFlippedIndex(null);
                  }}
                >
                  Explore Decks
                </Button>

                {/* Years */}
                {activeDept === dept.id && !activeYear && (
                  <div className="grid grid-cols-2 gap-4">
                    {years.map((year) => (
                      <Card
                        key={year.id}
                        className="p-4 text-center hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setActiveYear(year.id);
                          setActivePhase(null);
                          setFlippedIndex(null);
                        }}
                      >
                        <div className="text-2xl">{year.icon}</div>
                        <h4 className="font-bold">{year.name}</h4>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Exam Phases */}
                {activeDept === dept.id && activeYear && !activePhase && (
                  <div className="grid gap-4">
                    {examPhases.map((phase) => (
                      <Card
                        key={phase.id}
                        className="p-4 hover:bg-muted cursor-pointer"
                        onClick={() => {
                          setActivePhase(phase.id);
                          setFlippedIndex(null);
                        }}
                      >
                        <div className="text-2xl">{phase.icon}</div>
                        <h4 className="font-bold">{phase.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {phase.description}
                        </p>
                      </Card>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        setActiveYear(null);
                        setFlippedIndex(null);
                      }}
                    >
                      ← Back to Years
                    </Button>
                  </div>
                )}

                {/* Flashcards */}
                {activeDept === dept.id && activeYear && activePhase && (
                  <div>
                    <h4 className="font-bold mb-4">
                      {activeYear} - {activePhase} Flashcards
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {filteredCards.length === 0 ? (
                        <p>No cards yet. Add some in Flashcards Page!</p>
                      ) : (
                        filteredCards.map((card, i) => (
                          <div key={card.id} className="flex flex-col items-center">
                            <div className="card-perspective w-full h-40">
                              <div
                                className={`card-3d ${
                                  flippedIndex === i ? "is-flipped" : ""
                                }`}
                              >
                                {/* Front */}
                                <div className="card-face front bg-primary text-white flex items-center justify-center rounded-xl p-4">
                                  {card.front}
                                </div>
                                {/* Back */}
                                <div className="card-face back bg-secondary text-white flex items-center justify-center rounded-xl p-4">
                                  {card.back}
                                </div>
                              </div>
                            </div>

                            {/* Flip Button */}
                            <Button
                              variant="outline"
                              className="mt-2"
                              onClick={() => handleFlip(i)}
                            >
                              {flippedIndex === i ? "Show Front" : "Flip Card"}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => {
                        setActivePhase(null);
                        setFlippedIndex(null);
                      }}
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> Back to Phases
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Departments;