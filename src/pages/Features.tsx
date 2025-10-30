import React from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Users,
  Trophy,
  Layers,
  MessageSquare,
  Target,
  Zap,
  CheckCircle2,
  ArrowRight,
  Flame,
  LayoutDashboard,
  Star
} from "lucide-react";

const Features = () => {
  const coreFeatures = [
    {
      icon: BookOpen,
      title: "Smart Flashcard Creation",
      description:
        "Create interactive flashcards organized by subjects. Perfect for department-specific and year-specific study materials with difficulty levels.",
      highlights: [
        "Subject-based organization",
        "Difficulty levels (Easy/Medium/Hard)",
        "Tag system",
        "Public sharing",
      ],
      route: "/flashcards",
    },
    {
      icon: Layers,
      title: "Flashcard Decks",
      description:
        "Organize your flashcards into curated decks. Like, comment, and learn from decks created by other students.",
      highlights: [
        "Multi-card collections",
        "Like & comment system",
        "Share with community",
        "Track deck popularity",
      ],
      route: "/decks",
    },
    {
      icon: Target,
      title: "Interactive Quizzes",
      description:
        "Test your knowledge with self-assessment quizzes. Earn XP and track your performance with real-time feedback.",
      highlights: [
        "Multiple quiz types",
        "Instant feedback",
        "Performance tracking",
        "Earn XP & badges",
      ],
      route: "/quiz",
    },
    {
      icon: MessageSquare,
      title: "CSE Community & Doubts",
      description:
        "Ask questions and get answers from CSE students across all years. Share knowledge and help each other succeed.",
      highlights: [
        "Department-specific discussions",
        "Year tags for answers",
        "Like helpful answers",
        "Edit/delete your posts",
      ],
      route: "/community",
    },
    {
      icon: Trophy,
      title: "Gamification & Achievements",
      description:
        "Level up your learning with XP points, badges, and streaks. Compete on department leaderboards and earn recognition.",
      highlights: [
        "27 unique achievements",
        "20-level progression",
        "Daily streaks",
        "Department leaderboards",
      ],
      route: "/gamification",
    },
    {
      icon: LayoutDashboard,
      title: "Personal Dashboard",
      description:
        "Manage all your flashcards, decks, liked items, and account settings in one centralized dashboard.",
      highlights: [
        "View your content",
        "Manage liked items",
        "Change password",
        "Update username",
      ],
      route: "/dashboard",
    },
  ];

  const advancedFeatures = [
    {
      icon: Flame,
      title: "Daily Streaks",
      description:
        "Build consistent study habits with daily streak tracking. The longer your streak, the more bonus XP you earn!",
    },
    {
      icon: Star,
      title: "Subject Organization",
      description:
        "Browse subjects by department and year. Find exactly what you need to study organized by your curriculum.",
    },
    {
      icon: Zap,
      title: "Real-time Updates",
      description:
        "All likes, comments, and interactions update instantly without page refreshes for a smooth experience.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Everything You Need</span>
              <br />
              to Ace Your Exams
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A complete learning platform built specifically for engineering students
              with all the features you need to study smarter, not harder.
            </p>
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow"
              onClick={() => window.location.href = '/signup'}
            >
              <Zap className="w-5 h-5 mr-2" />
              Get Started Free
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">
              Core Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six powerful features designed to supercharge your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {coreFeatures.map((feature, index) => (
              <Link key={index} to={feature.route} className="block">
                <Card className="glass-effect circuit-pattern feature-card-hover p-8 group cursor-pointer border-2 border-white/10 dark:border-white/20 h-full hover:border-primary/30 transition-all">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center glow-effect group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-display font-bold mb-3 group-hover:gradient-text transition-all duration-300">
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
                      <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-semibold">Explore feature</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
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
              Additional Features
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Even more tools to enhance your studying experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card
                key={index}
                className="glass-effect circuit-pattern feature-card-hover p-6 text-center group cursor-pointer border-2 border-white/10 dark:border-white/20"
              >
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4 glow-effect group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold mb-3 group-hover:gradient-text transition-all duration-300">
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
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <Card className="glass-effect circuit-pattern feature-card-hover p-12 text-center border-2 border-white/10 dark:border-white/20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join students who are already acing their exams with hap's comprehensive flashcard platform.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow"
                >
                  Sign Up Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/subjects">
                <Button
                  size="lg"
                  variant="outline"
                >
                  Browse Subjects
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Features;
