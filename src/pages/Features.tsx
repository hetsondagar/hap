import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Brain,
  Users,
  Trophy,
  BarChart3,
  Clock,
  Shuffle,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const Features = () => {
  const [searchParams] = useSearchParams();
  const deptId = searchParams.get("deptId");
  const yearId = searchParams.get("yearId");
  const phaseId = searchParams.get("phaseId");

  const flashcardsRoute = (() => {
    if (deptId && yearId && phaseId) {
      return `/flashcards?deptId=${encodeURIComponent(deptId)}&yearId=${encodeURIComponent(yearId)}&phaseId=${encodeURIComponent(phaseId)}`;
    }
    return "/flashcards";
  })();

  const coreFeatures = [
    {
      icon: Brain,
      title: "Smart Flashcard Creation",
      description:
        "Create interactive Q&A flashcards with rich formatting. Each deck focuses on one topic for maximum learning efficiency.",
      highlights: [
        "Rich text formatting",
        "Image support",
        "Audio notes",
        "LaTeX equations",
      ],
      route: flashcardsRoute,
    },
    {
      icon: Users,
      title: "Community Sharing",
      description:
        "Share your decks publicly or keep them private. Follow other students and discover the best study materials.",
      highlights: [
        "Public/Private decks",
        "Follow creators",
        "Discover trending",
        "Collaborative learning",
      ],
      route: "/community",
    },
    {
      icon: Shuffle,
      title: "Interactive Quiz Mode",
      description:
        "Test yourself with dynamic quizzes. Cards flip to reveal answers, track your progress automatically.",
      highlights: [
        "Spaced repetition",
        "Auto-tracking",
        "Difficulty levels",
        "Progress analytics",
      ],
      route: "/quiz",
    },
    {
      icon: BarChart3,
      title: "Study Analytics Dashboard",
      description:
        "Comprehensive insights into your learning journey with detailed progress tracking and performance metrics.",
      highlights: [
        "Daily activity",
        "Accuracy rates",
        "Learning streaks",
        "Time tracking",
      ],
      route: "/analytics",
    },
  ];

  const advancedFeatures = [
    {
      icon: Clock,
      title: "Smart Reminders",
      description:
        "Get notified when it's time to review. Automated emails keep you on track with your study schedule.",
    },
    {
      icon: Target,
      title: "Exam Phase Categorization",
      description:
        "Organize decks by Mid-Sem and End-Sem phases for targeted preparation and better time management.",
    },
    {
      icon: Trophy,
      title: "Leaderboards & Recognition",
      description:
        "Compete with peers through department-wise leaderboards. Get recognized for creating helpful content.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Powerful Features</span>
              <br />
              for Modern Learning
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover all the tools and features that make hap the ultimate
              flashcard platform for engineering students.
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow"
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Learning Now
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need for effective flashcard-based learning, all in
              one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {coreFeatures.map((feature, index) => (
              <Link key={index} to={feature.route} className="block">
                <Card className="hero-card p-8 group hover:shadow-xl transition-shadow">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center glow-effect">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        {feature.highlights.map((highlight, i) => (
                          <div
                            key={i}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium">
                              {highlight}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Advanced Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Take your learning to the next level with these powerful
              additional features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card
                key={index}
                className="hero-card p-6 text-center group hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 glow-effect">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="hero-card p-12 text-center">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Experience These Features?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of engineering students who are already using hap
              to ace their exams with smart flashcard learning.
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Features;
