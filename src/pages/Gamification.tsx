import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import AnimatedBadge from '@/components/AnimatedBadge';
import { 
  Trophy, 
  Star, 
  Zap, 
  Target,
  Flame,
  Award,
  Users,
  BookOpen,
  Layers,
  MessageSquare,
  CheckCircle2,
  Crown,
  Medal,
  Sparkles,
  Lock,
  TrendingUp
} from 'lucide-react';
import { gamificationAPI } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

const Gamification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Try to trigger badge recalculation on backend, but do not block on errors
      try {
        await gamificationAPI.checkBadges();
      } catch (e) {
        console.warn('checkBadges failed, continuing without it');
      }

      // Load core data first (must not fail silently)
      const [statsRes, leaderboardRes] = await Promise.all([
        gamificationAPI.getStats(),
        gamificationAPI.getLeaderboard('all'),
      ]);

      // Achievements are optional; ignore failure and fallback to stats.badges
      let achievementsRes: any = null;
      try {
        achievementsRes = await gamificationAPI.getAllAchievements();
      } catch (e) {
        console.warn('getAllAchievements failed, using stats.badges fallback');
      }
      
      console.log('Gamification stats:', statsRes);
      console.log('Leaderboard:', leaderboardRes);
      
      setStats(statsRes.data);
      setAchievements(achievementsRes?.data?.achievements || achievementsRes?.achievements || []);
      setLeaderboard(leaderboardRes.data?.leaderboard || []);
      
      // Set user's department as default
      if (statsRes.data?.user?.department) {
        setSelectedDepartment(statsRes.data.user.department);
      }
    } catch (error: any) {
      console.error('Error loading gamification data:', error);
      if (error.message?.includes('401') || error.message?.includes('token')) {
        navigate('/login');
      } else {
        toast.error('Failed to load gamification data');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadLeaderboard = async (dept: string) => {
    try {
      const response = await gamificationAPI.getLeaderboard(dept);
      setLeaderboard(response.data?.leaderboard || []);
      setSelectedDepartment(dept);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      toast.error('Failed to load leaderboard');
    }
  };

  const getBadgeIcon = (badgeKey: string) => {
    if (badgeKey.includes('flashcard')) return BookOpen;
    if (badgeKey.includes('deck')) return Layers;
    if (badgeKey.includes('streak')) return Flame;
    if (badgeKey.includes('quiz')) return Target;
    if (badgeKey.includes('perfect')) return Star;
    if (badgeKey.includes('community') || badgeKey.includes('social') || badgeKey.includes('discussion')) return MessageSquare;
    if (badgeKey.includes('level')) return Crown;
    return Award;
  };

  const getBadgeColor = (badgeKey: string, earned: boolean) => {
    if (!earned) return 'bg-muted/50';
    
    // Tier-based colors
    if (badgeKey.includes('100') || badgeKey.includes('level_20')) return 'bg-gradient-to-br from-orange-500 to-amber-500';
    if (badgeKey.includes('50') || badgeKey.includes('level_10')) return 'bg-gradient-to-br from-amber-400 to-orange-600';
    if (badgeKey.includes('25') || badgeKey.includes('30') || badgeKey.includes('level_5')) return 'bg-gradient-to-br from-orange-400 to-amber-500';
    if (badgeKey.includes('10') || badgeKey.includes('7')) return 'bg-gradient-to-br from-yellow-500 to-amber-600';
    return 'bg-gradient-to-br from-gray-500 to-slate-500';
  };

  const getLevelInfo = (level: number) => {
    if (level >= 20) return { title: 'Legendary Scholar', color: 'text-primary' };
    if (level >= 15) return { title: 'Elite Learner', color: 'text-amber-400' };
    if (level >= 10) return { title: 'Expert Student', color: 'text-primary' };
    if (level >= 5) return { title: 'Advanced Learner', color: 'text-amber-500' };
    if (level >= 3) return { title: 'Dedicated Student', color: 'text-amber-300' };
    return { title: 'Beginner Learner', color: 'text-muted-foreground' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load gamification data</p>
      </div>
    );
  }

  const { user, levelProgress } = stats;
  // Prefer backend achievements list if provided (no hooks to avoid conditional hook ordering issues)
  const computedBadges = ((): any => {
    if (achievements && achievements.length) {
      const earned = achievements.filter((a: any) => a.earned);
      const available = achievements.filter((a: any) => !a.earned);
      return {
        total: earned.length,
        totalPossible: achievements.length,
        earned,
        available,
      };
    }
    return stats.badges || { total: 0, totalPossible: 0, earned: [], available: [] };
  })();
  const levelInfo = getLevelInfo(user.level);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Compact Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              <span className="gradient-text">Level Up</span> Your Learning
            </h1>
            <p className="text-lg text-muted-foreground">
              Track progress, earn badges, and compete with fellow students!
            </p>
          </div>

          {/* Compact User Profile Card */}
          <Card className="p-6 max-w-4xl mx-auto glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20 mb-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Crown className="w-8 h-8 text-white" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h2 className="text-2xl font-bold">{user.username}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {user.department?.toUpperCase() || 'N/A'} • {user.year || 'N/A'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 justify-center md:justify-start mb-3">
                  <p className={`text-lg font-semibold ${levelInfo.color}`}>
                    Level {user.level || 1} • {levelInfo.title}
                  </p>
                </div>

                {/* Compact XP Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {user.xp || 0} / {levelProgress?.nextLevelXP || 100} XP
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {levelProgress?.xpToNextLevel || 100} XP to next level
                    </span>
                  </div>
                  <Progress value={levelProgress?.progress || 0} className="h-2" />
                </div>

                {/* Compact Stats Grid */}
                <div className="grid grid-cols-5 gap-3">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Flame className="h-3 w-3 text-orange-500" />
                      <p className="text-lg font-bold">{user.streak || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen className="h-3 w-3 text-primary" />
                      <p className="text-lg font-bold">{user.totalFlashcardsCreated || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Cards</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Layers className="h-3 w-3 text-primary" />
                      <p className="text-lg font-bold">{user.totalDecksCreated || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Decks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-green-500" />
                      <p className="text-lg font-bold">{user.totalQuizzesTaken || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Quizzes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="h-3 w-3 text-pink-500" />
                      <p className="text-lg font-bold">{user.totalCommentsPosted || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Main Content Grid */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Achievements & Badges */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Badges Overview */}
            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Achievements & Badges</h2>
                  <p className="text-muted-foreground">
                    {computedBadges?.total || 0} / {computedBadges?.totalPossible || 27} badges earned
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round(((computedBadges?.total || 0) / (computedBadges?.totalPossible || 1)) * 100)}%
                  </div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
              <Progress 
                value={computedBadges?.total && computedBadges?.totalPossible ? (computedBadges.total / computedBadges.totalPossible) * 100 : 0} 
                className="h-3 mb-6" 
              />

              {/* Earned Badges - Compact Grid */}
              {computedBadges?.earned && computedBadges.earned.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Your Badges ({computedBadges.earned.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {computedBadges.earned.map((achievement: any, index: number) => (
                      <AnimatedBadge
                        key={achievement.key}
                        achievement={achievement}
                        isEarned={true}
                        size="sm"
                        className="animate-in"
                        style={{ animationDelay: `${index * 50}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available Badges - Compact Grid */}
              {computedBadges?.available && computedBadges.available.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                    Available Badges ({computedBadges.available.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {computedBadges.available.slice(0, 6).map((achievement: any, index: number) => (
                      <AnimatedBadge
                        key={achievement.key}
                        achievement={achievement}
                        isEarned={false}
                        progress={achievement.progress || 0}
                        showProgress={true}
                        size="sm"
                        className="animate-in"
                        style={{ animationDelay: `${(index + (computedBadges.earned?.length || 0)) * 50}ms` }}
                      />
                    ))}
                  </div>
                  {computedBadges.available.length > 6 && (
                    <div className="mt-4 text-center">
                      <Button variant="outline" size="sm">
                        View All {computedBadges.available.length} Available Badges
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* How to Earn XP - Compact */}
            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <h2 className="text-2xl font-bold mb-6">How to Earn XP</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold">+10 XP</p>
                    <p className="text-xs text-muted-foreground">per flashcard</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Layers className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-bold">+25 XP</p>
                    <p className="text-xs text-muted-foreground">per deck</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Target className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="font-bold">+30 XP</p>
                    <p className="text-xs text-muted-foreground">perfect quiz</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <MessageSquare className="h-5 w-5 text-pink-500" />
                  <div>
                    <p className="font-bold">+5 XP</p>
                    <p className="text-xs text-muted-foreground">per comment</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Flame className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="font-bold">+5 XP</p>
                    <p className="text-xs text-muted-foreground">daily streak</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <TrendingUp className="h-5 w-5 text-indigo-500" />
                  <div>
                    <p className="font-bold">+15 XP</p>
                    <p className="text-xs text-muted-foreground">per post</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Leaderboard */}
          <div className="space-y-6">
            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
              
              {/* Department Selector */}
              <div className="grid grid-cols-2 gap-2 mb-6">
                <Button
                  variant={selectedDepartment === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadLeaderboard('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedDepartment === 'cse' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadLeaderboard('cse')}
                >
                  CSE
                </Button>
                <Button
                  variant={selectedDepartment === 'mechanical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadLeaderboard('mechanical')}
                >
                  Mech
                </Button>
                <Button
                  variant={selectedDepartment === 'electrical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadLeaderboard('electrical')}
                >
                  Elec
                </Button>
                <Button
                  variant={selectedDepartment === 'chemical' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadLeaderboard('chemical')}
                >
                  Chem
                </Button>
                <Button
                  variant={selectedDepartment === 'civil' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => loadLeaderboard('civil')}
                >
                  Civil
                </Button>
              </div>

              {/* Compact Leaderboard */}
              <div className="space-y-3">
                {leaderboard.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground text-sm">
                    No players found
                  </p>
                ) : (
                  leaderboard.slice(0, 10).map((player: any, index: number) => {
                    const isCurrentUser = player.username === user.username;
                    const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                    
                    return (
                      <div 
                        key={player._id}
                        className={`flex items-center justify-between p-3 rounded-lg transition ${
                          isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30 hover:bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-lg">{rankIcon}</span>
                            <span className="font-bold text-sm w-6">{index + 1}</span>
                          </div>
                          <div>
                            <p className={`font-semibold text-sm ${isCurrentUser ? 'text-primary' : ''}`}>
                              {player.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {player.department?.toUpperCase() || 'N/A'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            <span className="font-bold text-sm">{player.xp || 0}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Flame className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-muted-foreground">{player.streak || 0}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {leaderboard.length > 10 && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    View Full Leaderboard
                  </Button>
                </div>
              )}
            </Card>

            {/* Quick Actions */}
            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/flashcards')} 
                  className="w-full bg-gradient-primary"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Create Flashcards
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/quiz')}
                  className="w-full"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Take a Quiz
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => navigate('/community')}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Join Community
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gamification;

