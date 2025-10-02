"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Flashcard Interface
interface Flashcard {
  id: number;
  department: string;
  front: string;
  back: string;
}

type QuizType = "flashcard" | "multipleChoice" | "trueFalse";

// Mock Flashcards (replace later with DB data)
const mockFlashcards: Flashcard[] = [
  { id: 1, department: "Computer Science", front: "What is Big O of binary search?", back: "O(log n)" },
  { id: 2, department: "Mechanical", front: "What is Bernoulli’s principle used for?", back: "Fluid dynamics" },
  { id: 3, department: "Electrical", front: "What does Ohm’s law state?", back: "V = IR" },
  { id: 4, department: "Chemical", front: "What is Avogadro’s number?", back: "6.022 × 10²³" },
  { id: 5, department: "Civil", front: "What does RCC stand for?", back: "Reinforced Cement Concrete" },
  { id: 6, department: "Other", front: "What is the SI unit of force?", back: "Newton" },
  // ✅ More multiple-choice style flashcards
  { id: 7, department: "Computer Science", front: "Which data structure uses FIFO?", back: "Queue" },
  { id: 8, department: "Computer Science", front: "Which protocol is used for web communication?", back: "HTTP" },
  { id: 9, department: "Mechanical", front: "Which engine cycle is used in cars?", back: "Otto cycle" },
  { id: 10, department: "Electrical", front: "Which component stores charge?", back: "Capacitor" },
  { id: 11, department: "Civil", front: "What is the strongest shape in construction?", back: "Triangle" },
  { id: 12, department: "Chemical", front: "pH < 7 means?", back: "Acidic" },
];

// Shuffle helper
function shuffle<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

// Generate options for multiple choice
const getOptions = (card: Flashcard): string[] => {
  const wrongs = shuffle(
    mockFlashcards.filter((c) => c.id !== card.id).map((c) => c.back)
  ).slice(0, 3);
  return shuffle([card.back, ...wrongs]);
};

export default function QuizPage() {
  // Setup state
  const [department, setDepartment] = useState("All");
  const [numQuestions, setNumQuestions] = useState(5);
  const [quizType, setQuizType] = useState<QuizType>("flashcard");

  // Quiz state
  const [quizCards, setQuizCards] = useState<Flashcard[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [finished, setFinished] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState<Flashcard[]>([]);
  const [tfStatement, setTfStatement] = useState<string>(""); // stable true/false statement

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && !finished) {
      interval = setInterval(() => setTimer((t) => t + 1), 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, finished]);

  // Start Quiz
  const startQuiz = () => {
    let cards =
      department === "All"
        ? mockFlashcards
        : mockFlashcards.filter((c) => c.department === department);
    cards = shuffle(cards).slice(0, numQuestions);
    setQuizCards(cards);
    setCurrentQ(0);
    setShowAnswer(false);
    setSelectedOption(null);
    setScore(0);
    setStreak(0);
    setTimer(0);
    setIsActive(true);
    setFinished(false);
    setWrongAnswers([]);
    generateTrueFalse(cards[0]); // generate for first question
  };

  // Generate stable true/false statement
  const generateTrueFalse = (card: Flashcard) => {
    const isTrue = Math.random() > 0.5;
    if (isTrue) {
      setTfStatement(card.back);
    } else {
      const wrong = shuffle(
        mockFlashcards.filter((c) => c.id !== card.id).map((c) => c.back)
      )[0];
      setTfStatement(wrong);
    }
  };

  // Handle Answer
  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
    } else {
      setStreak(0);
      setWrongAnswers([...wrongAnswers, quizCards[currentQ]]);
    }

    setTimeout(() => {
      if (currentQ + 1 < quizCards.length) {
        setCurrentQ(currentQ + 1);
        setShowAnswer(false);
        setSelectedOption(null);
        if (quizType === "trueFalse") {
          generateTrueFalse(quizCards[currentQ + 1]);
        }
      } else {
        setFinished(true);
        setIsActive(false);
      }
    }, 800); // short delay
  };

  // Restart Quiz
  const restartQuiz = () => {
    setDepartment("All");
    setNumQuestions(5);
    setQuizType("flashcard");
    setQuizCards([]);
    setFinished(false);
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-subtle">
      <h1 className="text-4xl font-bold text-primary text-center">
        Interactive Quiz Mode
      </h1>
      <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto">
        Test your knowledge with self-assessment quizzes, streaks, and progress tracking.
      </p>

      {/* Setup Form */}
      {!isActive && !finished && (
        <Card className="p-6 max-w-xl mx-auto mt-10">
          <h2 className="text-2xl font-semibold mb-4">Setup Quiz</h2>
          <div className="space-y-4">
            {/* Department */}
            <Select onValueChange={(v) => setDepartment(v)} defaultValue="All">
              <SelectTrigger>
                <SelectValue placeholder="Select Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Departments</SelectItem>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Mechanical">Mechanical</SelectItem>
                <SelectItem value="Electrical">Electrical</SelectItem>
                <SelectItem value="Chemical">Chemical</SelectItem>
                <SelectItem value="Civil">Civil</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>

            {/* Number of Questions */}
            <Input
              type="number"
              placeholder="Number of Questions"
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              min={1}
              max={20}
            />

            {/* Quiz Type */}
            <Select
              onValueChange={(v) => setQuizType(v as QuizType)}
              defaultValue="flashcard"
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Quiz Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="flashcard">Flashcard Flip</SelectItem>
                <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
                <SelectItem value="trueFalse">True / False</SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={startQuiz}
              className="w-full bg-gradient-primary text-white"
            >
              Start Quiz
            </Button>
          </div>
        </Card>
      )}

      {/* Quiz Section */}
      {isActive && !finished && quizCards.length > 0 && (
        <div className="max-w-2xl mx-auto mt-10">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm">
                Question {currentQ + 1} of {quizCards.length}
              </span>
              <span className="text-sm text-muted-foreground">⏱ {timer}s</span>
            </div>

            {/* Progress Bar */}
            <Progress
              value={((currentQ + 1) / quizCards.length) * 100}
              className="mb-4"
            />

            {/* Question */}
            <h2 className="text-xl font-bold mb-4">{quizCards[currentQ].front}</h2>

            {/* Flashcard Flip Mode */}
            {quizType === "flashcard" && (
              <>
                {showAnswer && (
                  <p className="text-muted-foreground mb-4">
                    {quizCards[currentQ].back}
                  </p>
                )}
                <Button
                  onClick={() => setShowAnswer(!showAnswer)}
                  variant="outline"
                  className="mb-4"
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </Button>
                <div className="flex gap-4">
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="flex-1 bg-green-500 text-white"
                  >
                    I was Correct
                  </Button>
                  <Button
                    onClick={() => handleAnswer(false)}
                    className="flex-1 bg-red-500 text-white"
                  >
                    I was Wrong
                  </Button>
                </div>
              </>
            )}

            {/* Multiple Choice Mode */}
            {quizType === "multipleChoice" && (
              <div className="space-y-3">
                {getOptions(quizCards[currentQ]).map((opt, idx) => {
                  const isCorrect = opt === quizCards[currentQ].back;
                  const isSelected = selectedOption === opt;

                  return (
                    <Button
                      key={idx}
                      variant="outline"
                      disabled={!!selectedOption}
                      className={`w-full justify-start ${
                        isSelected
                          ? isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                          : ""
                      }`}
                      onClick={() => {
                        if (!selectedOption) {
                          setSelectedOption(opt);
                          handleAnswer(isCorrect);
                        }
                      }}
                    >
                      {opt}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* True / False Mode */}
            {quizType === "trueFalse" && (
              <div className="space-y-3">
                <p className="text-muted-foreground mb-4">{tfStatement}</p>
                <div className="flex gap-4">
                  <Button
                    onClick={() =>
                      handleAnswer(tfStatement === quizCards[currentQ].back)
                    }
                    className="flex-1 bg-green-500 text-white"
                  >
                    True
                  </Button>
                  <Button
                    onClick={() =>
                      handleAnswer(tfStatement !== quizCards[currentQ].back)
                    }
                    className="flex-1 bg-red-500 text-white"
                  >
                    False
                  </Button>
                </div>
              </div>
            )}
          </Card>

          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              Score: {score} | Streak: {streak}
            </p>
          </div>
        </div>
      )}

      {/* Results Section */}
      {finished && (
        <Card className="p-6 max-w-2xl mx-auto mt-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Finished 🎉</h2>
          <p className="mb-2">
            Final Score: {score} / {quizCards.length}
          </p>
          <p className="mb-2">
            Accuracy: {((score / quizCards.length) * 100).toFixed(1)}%
          </p>
          <p className="mb-4">Time Taken: {timer} seconds</p>

          {wrongAnswers.length > 0 && (
            <div className="text-left mb-6">
              <h3 className="font-semibold mb-2">Review Mistakes:</h3>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {wrongAnswers.map((card) => (
                  <li key={card.id}>
                    <strong>{card.front}</strong> → {card.back}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Button
              onClick={startQuiz}
              className="bg-gradient-primary text-white"
            >
              Retry Same Quiz
            </Button>
            <Button onClick={restartQuiz} variant="outline">
              New Quiz Setup
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
