import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

// Mock Data
const studyTimeData = [
  { day: "Mon", hours: 2 },
  { day: "Tue", hours: 3 },
  { day: "Wed", hours: 1 },
  { day: "Thu", hours: 4 },
  { day: "Fri", hours: 2 },
  { day: "Sat", hours: 5 },
  { day: "Sun", hours: 3 },
];

const quizPerformanceData = [
  { quiz: "Q1", score: 65 },
  { quiz: "Q2", score: 72 },
  { quiz: "Q3", score: 80 },
  { quiz: "Q4", score: 90 },
];

const topicCoverageData = [
  { name: "Math", value: 35 },
  { name: "Science", value: 25 },
  { name: "History", value: 20 },
  { name: "Literature", value: 20 },
];

const masteryData = [
  { subject: "Math", mastery: 70 },
  { subject: "Science", mastery: 55 },
  { subject: "History", mastery: 40 },
  { subject: "Literature", mastery: 65 },
];

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];

const AnalyticsPage: React.FC = () => {
  return (
    <div className="p-8 space-y-10 bg-background min-h-screen">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Study Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Gain insights into your study habits, performance trends, and progress
          towards your learning goals.
        </p>
      </header>

      {/* Study Progress & Activity */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Study Progress & Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Weekly Study Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={studyTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="hours"
                    stroke="#4ade80"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Active Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">5 Days 🔥</p>
              <Progress value={70} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Keep it up to reach your 7-day streak!
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quiz & Test Performance */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Quiz & Test Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Quiz Scores Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={quizPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="quiz" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Bar dataKey="score" fill="#60a5fa" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Topic Accuracy Radar</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart outerRadius="70%" data={masteryData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Mastery"
                    dataKey="mastery"
                    stroke="#facc15"
                    fill="#facc15"
                    fillOpacity={0.6}
                  />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Analytics */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Content Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Topic Coverage</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={topicCoverageData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {topicCoverageData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Flashcard Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">New</p>
                <Progress value={40} />
              </div>
              <div>
                <p className="text-sm font-medium">Learning</p>
                <Progress value={30} />
              </div>
              <div>
                <p className="text-sm font-medium">Mastered</p>
                <Progress value={30} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Goals & Achievements */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Goals & Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Weekly Study Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">12 / 15 Hours</p>
              <Progress value={80} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Almost there! Just 3 hours left to hit your goal.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>🏆 Completed 100 Flashcards</li>
                <li>🔥 7-Day Study Streak</li>
                <li>⭐ Scored 90% on Quiz 4</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;         