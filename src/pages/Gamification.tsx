import React, { useState } from "react";
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Flame,
  Award,
  Users,
  Calendar,
  CheckCircle2,
  Crown,
  Medal,
  Gem
} from 'lucide-react';
import gamificationBadges from '@/assets/gamification-badges.jpg';
import LeaderboardTable from "@/gamification/components/LeaderboardTable";

const Gamification = () => {
  const [showLeaderboard, setShowLeaderboard] = useState<number | null>(null);

  const xpLevels = [
    { level: 1, title: 'Beginner Learner', xp: '0-100 XP', color: 'text-muted-foreground' },
    { level: 2, title: 'Study Enthusiast', xp: '101-500 XP', color: 'text-primary' },
    { level: 3, title: 'Knowledge Seeker', xp: '501-1500 XP', color: 'text-secondary' },
    { level: 4, title: 'Flashcard Master', xp: '1501-3000 XP', color: 'text-warning' },
    { level: 5, title: 'Learning Legend', xp: '3001+ XP', color: 'text-achievement' }
  ];

  const achievements = [
    { icon: Zap, name: 'First Steps', description: 'Complete your first flashcard deck', xp: 50, rarity: 'common', color: 'bg-badge-bronze' },
    { icon: Flame, name: 'Streak Keeper', description: 'Maintain a 7-day learning streak', xp: 200, rarity: 'uncommon', color: 'bg-badge-silver' },
    { icon: Trophy, name: 'Deck Master', description: 'Create 10 public flashcard decks', xp: 500, rarity: 'rare', color: 'bg-badge-gold' },
    { icon: Crown, name: 'Community Hero', description: 'Get 1000 likes across your decks', xp: 1000, rarity: 'epic', color: 'bg-badge-diamond' },
    { icon: Star, name: 'Perfect Score', description: 'Achieve 100% accuracy on 50 quizzes', xp: 300, rarity: 'rare', color: 'bg-badge-gold' },
    { icon: Users, name: 'Study Group Leader', description: 'Have 100+ followers', xp: 750, rarity: 'epic', color: 'bg-badge-diamond' }
  ];

  const leaderboards = [
    { category: 'Most Active Learners', icon: Zap, description: 'Based on daily study streaks and XP earned', timeframe: 'This Week' },
    { category: 'Top Deck Creators', icon: Trophy, description: 'Creators with most helpful and liked decks', timeframe: 'This Month' },
    { category: 'Department Champions', icon: Award, description: 'Top performers in each engineering department', timeframe: 'All Time' }
  ];

  const sampleProfile = {
    name: 'Alex Chen',
    level: 3,
    xp: 1250,
    totalXP: 1500,
    streak: 12,
    accuracy: 85,
    decksCreated: 8,
    decksCompleted: 45,
    badges: ['Streak Keeper', 'Deck Master', 'Perfect Score']
  };

  // Dummy leaderboard data
  const dummyData = [
    { name: "Alice", xp: 1400 },
    { name: "Bob", xp: 1200 },
    { name: "Charlie", xp: 1000 },
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Level Up</span>
              <br />
              Your Learning
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Experience gamified learning with XP points, achievements, streaks, and leaderboards. Make studying addictive!
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow">
              <Trophy className="w-5 h-5 mr-2" />
              Start Your Journey
            </Button>
          </div>

          
        </div>
      </section>

      {/* Sample User Profile (kept as before, with XP progress bars, streak flame, accuracy target, badge icons, etc.) */}
      {/* ... keep your original profile code unchanged here ... */}

      {/* XP & Levels System with cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">XP & Level System</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Earn XP for every study action and unlock new levels as you progress in your learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 max-w-5xl mx-auto">
            {xpLevels.map((level, index) => (
              <Card 
                key={level.level} 
                className={`glass-effect circuit-pattern feature-card-hover p-6 text-center group cursor-pointer border-2 border-white/10 ${
                  level.level === sampleProfile.level ? 'ring-2 ring-primary glow-effect' : ''
                }`}
              >
                <div className={`text-3xl font-bold mb-2 ${level.color}`}>
                  {level.level}
                </div>
                <h3 className="font-display font-bold mb-2 group-hover:gradient-text transition-all duration-300">{level.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{level.xp}</p>
                {level.level === sampleProfile.level && (
                  <Badge className="bg-primary/10 text-primary">Current Level</Badge>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements with icons/badge images */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Achievements & Badges</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Unlock badges by completing challenges, maintaining streaks, and contributing to the community.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement, index) => (
              <Card key={index} className="glass-effect circuit-pattern feature-card-hover p-6 group cursor-pointer border-2 border-white/10">
                <div className="flex items-start space-x-4">
                  <div className={`w-16 h-16 ${achievement.color} rounded-xl flex items-center justify-center glow-effect group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <achievement.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display font-bold group-hover:gradient-text transition-all duration-300">
                        {achievement.name}
                      </h3>
                      <Badge 
                        variant="secondary" 
                        className="text-xs"
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-3">
                      {achievement.description}
                    </p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-warning" />
                      <span className="font-medium text-sm">+{achievement.xp} XP</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboards with toggle */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Leaderboards</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Compete with fellow students and see who's leading in different categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {leaderboards.map((board, index) => (
              <Card key={index} className="glass-effect circuit-pattern feature-card-hover p-6 text-center group cursor-pointer border-2 border-white/10">
                <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 glow-effect group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <board.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display font-bold text-xl mb-3 group-hover:gradient-text transition-all duration-300">
                  {board.category}
                </h3>
                <p className="text-muted-foreground mb-4">{board.description}</p>
                <Badge variant="outline" className="mb-4">{board.timeframe}</Badge>

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() =>
                    setShowLeaderboard(showLeaderboard === index ? null : index)
                  }
                >
                  {showLeaderboard === index ? "Hide Leaderboard" : "View Leaderboard"}
                </Button>

                {showLeaderboard === index && (
                  <div className="mt-6">
                    <LeaderboardTable users={dummyData} />
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="glass-effect circuit-pattern feature-card-hover p-12 text-center border-2 border-white/10">
            <h2 className="text-3xl font-display font-bold mb-4">
              Ready to Start Earning XP?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the gamified learning revolution. Create your first deck, earn your first badge, and climb the leaderboards!
            </p>
            <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow">
              <Gem className="w-5 h-5 mr-2" />
              Begin Your Journey
            </Button>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Gamification;
