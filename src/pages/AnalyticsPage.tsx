import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { analyticsAPI, authAPI } from "@/lib/api";
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

type UserProfile = { _id: string; username: string; email: string };
type UserAnalyticsResponse = {
  success: boolean;
  data: {
    analytics: {
      studiedCount: number;
      quizAccuracy: number;
      timeSpent: number;
      weeklyGoal: number;
      weeklyProgress: number;
      streaks: { current: number; longest: number };
      departmentStats?: { department: string; studiedCount: number; accuracy: number; timeSpent: number }[];
    };
    quizStats: {
      totalQuizzes: number;
      averageScore: number;
      bestScore: number;
      totalTimeSpent: number;
      recentQuizzes: number;
    };
    flashcardStats: {
      totalFlashcards: number;
      departmentBreakdown: { department: string; count: number }[];
    };
    deckStats: {
      totalDecks: number;
      publicDecks: number;
      totalLikes: number;
      totalComments: number;
    };
  };
};

type ProgressResponse = {
  success: boolean;
  data: {
    period: "week" | "month" | "year";
    progress: { _id: string; quizzesCompleted: number; averageScore: number; totalTimeSpent: number }[];
  };
};

const COLORS = ["#4ade80", "#60a5fa", "#facc15", "#f87171"];

const AnalyticsPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [analytics, setAnalytics] = useState<UserAnalyticsResponse["data"] | null>(null);
  const [progress, setProgress] = useState<ProgressResponse["data"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const prof = await authAPI.getProfile();
        const user: UserProfile = prof?.user || prof?.data || prof; // tolerant shape
        if (!user?._id) throw new Error("Unable to load user profile");
        if (!mounted) return;
        setProfile(user);
        const [a, p] = await Promise.all([
          analyticsAPI.getUserAnalytics(user._id) as Promise<UserAnalyticsResponse>,
          analyticsAPI.getProgressTracking(user._id, "week") as Promise<ProgressResponse>,
        ]);
        if (!mounted) return;
        setAnalytics(a.data);
        setProgress(p.data);
        setError(null);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load analytics");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const studyTimeData = useMemo(() => {
    if (!progress?.progress) return [] as { day: string; hours: number }[];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return progress.progress.map((bucket) => {
      const date = new Date(bucket._id);
      return { day: days[date.getDay()], hours: Number((bucket.totalTimeSpent / 60).toFixed(2)) };
    });
  }, [progress]);

  const quizPerformanceData = useMemo(() => {
    if (!progress?.progress) return [] as { quiz: string; score: number }[];
    return progress.progress.map((bucket, idx) => ({ quiz: `Q${idx + 1}`, score: Math.round(bucket.averageScore || 0) }));
  }, [progress]);

  const topicCoverageData = useMemo(() => {
    if (!analytics?.flashcardStats?.departmentBreakdown) return [] as { name: string; value: number }[];
    const merged: Record<string, number> = {};
    analytics.flashcardStats.departmentBreakdown.forEach(({ department, count }) => {
      merged[department] = (merged[department] || 0) + count;
    });
    return Object.entries(merged).map(([name, value]) => ({ name, value }));
  }, [analytics]);

  const masteryData = useMemo(() => {
    const depts = analytics?.analytics?.departmentStats || [];
    return depts.slice(0, 8).map((d) => ({ subject: d.department, mastery: Math.round(d.accuracy || 0) }));
  }, [analytics]);

  const weeklyGoalPct = useMemo(() => {
    if (!analytics?.analytics) return 0;
    const goalHours = analytics.analytics.weeklyGoal;
    const progressHours = analytics.analytics.weeklyProgress;
    if (!goalHours) return 0;
    return Math.min(100, Math.round((progressHours / goalHours) * 100));
  }, [analytics]);

  return (
    <div className="p-8 space-y-10 min-h-screen">
      <header className="space-y-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-primary">
          Study Analytics Dashboard
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          Gain insights into your study habits, performance trends, and progress
          towards your learning goals.
        </p>
        <div className="flex gap-3 pt-2">
          <Link to="/">
            <Button variant="outline" className="border-primary/20 hover:border-primary">Home</Button>
          </Link>
          <Link to="/flashcards">
            <Button className="bg-gradient-primary hover:opacity-90 text-white">Go to Flashcards</Button>
          </Link>
        </div>
      </header>

      {loading && (
        <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
          <CardHeader>
            <CardTitle>Loading analytics…</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={30} />
          </CardContent>
        </Card>
      )}

      {!loading && error && (
        <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
          <CardHeader>
            <CardTitle>Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Study Progress & Activity */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Study Progress & Activity</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
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

          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
            <CardHeader>
              <CardTitle>Active Study Streak</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{analytics?.analytics?.streaks?.current || 0} Days 🔥</p>
              <Progress value={weeklyGoalPct} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Longest streak: {analytics?.analytics?.streaks?.longest || 0} days. Weekly goal progress: {weeklyGoalPct}%
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Quiz & Test Performance */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Quiz & Test Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
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

          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
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
          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
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

          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
            <CardHeader>
              <CardTitle>Flashcard Mastery</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Studied Count</p>
                <Progress value={Math.min(100, (analytics?.analytics?.studiedCount || 0) % 100)} />
              </div>
              <div>
                <p className="text-sm font-medium">Average Quiz Score</p>
                <Progress value={Math.round(analytics?.quizStats?.averageScore || 0)} />
              </div>
              <div>
                <p className="text-sm font-medium">Overall Accuracy</p>
                <Progress value={Math.round(analytics?.analytics?.quizAccuracy || 0)} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Goals & Achievements */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Goals & Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
            <CardHeader>
              <CardTitle>Weekly Study Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold">{analytics?.analytics?.weeklyProgress || 0} / {analytics?.analytics?.weeklyGoal || 0} Hours</p>
              <Progress value={weeklyGoalPct} className="mt-3" />
              <p className="text-sm text-muted-foreground mt-2">
                Keep it up! Update your goal in settings if needed.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10">
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-sm">
                <li>🏆 Quizzes completed: {analytics?.quizStats?.totalQuizzes || 0}</li>
                <li>🔥 Recent quizzes (7d): {analytics?.quizStats?.recentQuizzes || 0}</li>
                <li>⭐ Best score: {Math.round(analytics?.quizStats?.bestScore || 0)}%</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsPage;         