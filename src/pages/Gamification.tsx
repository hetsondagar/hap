import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
      const [statsRes, leaderboardRes] = await Promise.all([
        gamificationAPI.getStats(),
        gamificationAPI.getLeaderboard('all')
      ]);
      
      console.log('Gamification stats:', statsRes);
      console.log('Leaderboard:', leaderboardRes);
      
      setStats(statsRes.data);
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
    if (badgeKey.includes('100') || badgeKey.includes('level_20')) return 'bg-gradient-to-br from-purple-500 to-pink-500';
    if (badgeKey.includes('50') || badgeKey.includes('level_10')) return 'bg-gradient-to-br from-yellow-500 to-orange-500';
    if (badgeKey.includes('25') || badgeKey.includes('30') || badgeKey.includes('level_5')) return 'bg-gradient-to-br from-blue-500 to-cyan-500';
    if (badgeKey.includes('10') || badgeKey.includes('7')) return 'bg-gradient-to-br from-green-500 to-emerald-500';
    return 'bg-gradient-to-br from-gray-500 to-slate-500';
  };

  const getLevelInfo = (level: number) => {
    if (level >= 20) return { title: 'Legendary Scholar', color: 'text-purple-500' };
    if (level >= 15) return { title: 'Elite Learner', color: 'text-yellow-500' };
    if (level >= 10) return { title: 'Expert Student', color: 'text-blue-500' };
    if (level >= 5) return { title: 'Advanced Learner', color: 'text-green-500' };
    if (level >= 3) return { title: 'Dedicated Student', color: 'text-cyan-500' };
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

  const { user, levelProgress, badges } = stats;
  const levelInfo = getLevelInfo(user.level);

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section with User Stats */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              <span className="gradient-text">Level Up</span>
              <br />
              Your Learning
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your progress, earn badges, and compete with fellow students!
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="p-8 max-w-4xl mx-auto glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
                <Crown className="w-12 h-12 text-white" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                  <h2 className="text-3xl font-bold">{user.username}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {user.department?.toUpperCase() || 'N/A'} • {user.year || 'N/A'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <p className={`text-lg font-semibold ${levelInfo.color}`}>
                    Level {user.level || 1} • {levelInfo.title}
                  </p>
                </div>

                {/* XP Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">
                      {user.xp || 0} / {levelProgress?.nextLevelXP || 100} XP
                    </span>
                    <span className="text-sm font-semibold text-primary">
                      {levelProgress?.xpToNextLevel || 100} XP to next level
                    </span>
                  </div>
                  <Progress value={levelProgress?.progress || 0} className="h-3" />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Flame className="h-4 w-4 text-orange-500" />
                      <p className="text-2xl font-bold">{user.streak || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <BookOpen className="h-4 w-4 text-blue-500" />
                      <p className="text-2xl font-bold">{user.totalFlashcardsCreated || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Flashcards</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Layers className="h-4 w-4 text-purple-500" />
                      <p className="text-2xl font-bold">{user.totalDecksCreated || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Decks</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-4 w-4 text-green-500" />
                      <p className="text-2xl font-bold">{user.totalQuizzesTaken || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Quizzes</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="h-4 w-4 text-pink-500" />
                      <p className="text-2xl font-bold">{user.totalCommentsPosted || 0}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Comments</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Achievements & Badges */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">Achievements & Badges</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
              Unlock badges by completing challenges. {badges?.total || 0} / {badges?.totalPossible || 27} earned!
            </p>
            <Progress value={badges?.total && badges?.totalPossible ? (badges.total / badges.totalPossible) * 100 : 0} className="max-w-md mx-auto h-3" />
          </div>

          {/* Earned Badges */}
          {badges?.earned && badges.earned.length > 0 && (
            <div className="mb-12">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-yellow-500" />
                Your Badges ({badges.earned.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.earned.map((achievement: any) => {
                  const Icon = getBadgeIcon(achievement.key);
                  return (
                    <Card key={achievement.key} className="glass-effect circuit-pattern feature-card-hover p-6 border-2 border-white/10 dark:border-white/20 relative overflow-hidden">
                      <div className="absolute top-2 right-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 ${getBadgeColor(achievement.key, true)} rounded-xl flex items-center justify-center shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          {achievement.xp > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-500" />
                              <span className="font-medium text-sm">+{achievement.xp} XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Available Badges */}
          {badges?.available && badges.available.length > 0 && (
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Lock className="h-6 w-6 text-muted-foreground" />
                Available Badges ({badges.available.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {badges.available.map((achievement: any) => {
                  const Icon = getBadgeIcon(achievement.key);
                  return (
                    <Card key={achievement.key} className="glass-effect circuit-pattern p-6 border-2 border-white/10 dark:border-white/20 opacity-70 hover:opacity-100 transition-opacity">
                      <div className="flex items-start space-x-4">
                        <div className={`w-16 h-16 ${getBadgeColor(achievement.key, false)} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-8 h-8 text-white opacity-50" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-1 text-muted-foreground">{achievement.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{achievement.description}</p>
                          {achievement.xp > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">+{achievement.xp} XP</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Department-wise Leaderboard */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">Department Leaderboard</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See who's leading in your department and across all departments
            </p>
          </div>

          {/* Department Selector */}
          <div className="flex justify-center gap-2 mb-8 flex-wrap">
            <Button
              variant={selectedDepartment === 'all' ? 'default' : 'outline'}
              onClick={() => loadLeaderboard('all')}
            >
              All Departments
            </Button>
            <Button
              variant={selectedDepartment === 'cse' ? 'default' : 'outline'}
              onClick={() => loadLeaderboard('cse')}
            >
              CSE
            </Button>
            <Button
              variant={selectedDepartment === 'mechanical' ? 'default' : 'outline'}
              onClick={() => loadLeaderboard('mechanical')}
            >
              Mechanical
            </Button>
            <Button
              variant={selectedDepartment === 'electrical' ? 'default' : 'outline'}
              onClick={() => loadLeaderboard('electrical')}
            >
              Electrical
            </Button>
            <Button
              variant={selectedDepartment === 'chemical' ? 'default' : 'outline'}
              onClick={() => loadLeaderboard('chemical')}
            >
              Chemical
            </Button>
            <Button
              variant={selectedDepartment === 'civil' ? 'default' : 'outline'}
              onClick={() => loadLeaderboard('civil')}
            >
              Civil
            </Button>
          </div>

          {/* Leaderboard Table */}
          <Card className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20 overflow-hidden max-w-4xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border">
                  <tr className="bg-muted/50">
                    <th className="text-left p-4 font-semibold">Rank</th>
                    <th className="text-left p-4 font-semibold">Player</th>
                    <th className="text-left p-4 font-semibold">Department</th>
                    <th className="text-center p-4 font-semibold">Level</th>
                    <th className="text-center p-4 font-semibold">XP</th>
                    <th className="text-center p-4 font-semibold">Streak</th>
                    <th className="text-center p-4 font-semibold">Badges</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-muted-foreground">
                        No players found for this department yet
                      </td>
                    </tr>
                  ) : (
                    leaderboard.map((player: any, index: number) => {
                      const isCurrentUser = player.username === user.username;
                      const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
                      
                      return (
                        <tr 
                          key={player._id} 
                          className={`border-b border-border/50 hover:bg-muted/30 transition ${
                            isCurrentUser ? 'bg-primary/5 border-primary/20' : ''
                          }`}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl">{rankIcon}</span>
                              <span className="font-semibold text-lg">{index + 1}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <span className={`font-semibold ${isCurrentUser ? 'text-primary' : ''}`}>
                                {player.username}
                              </span>
                              {isCurrentUser && (
                                <Badge variant="default" className="text-xs">You</Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant="secondary" className="text-xs">
                              {player.department?.toUpperCase() || 'N/A'}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="outline" className="font-bold">
                              {player.level || 1}
                            </Badge>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Zap className="h-4 w-4 text-yellow-500" />
                              <span className="font-semibold">{player.xp || 0}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span className="font-semibold">{player.streak || 0}</span>
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <Badge variant="secondary">{player.badges?.length || 0}</Badge>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* How to Earn XP */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-display font-bold mb-4">How to Earn XP</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Every action you take contributes to your progress!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">+10 XP</p>
                  <p className="text-sm text-muted-foreground">per flashcard</p>
                </div>
              </div>
              <p className="text-sm">Create flashcards to help you and others study</p>
            </Card>

            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <Layers className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">+25 XP</p>
                  <p className="text-sm text-muted-foreground">per deck</p>
                </div>
              </div>
              <p className="text-sm">Organize flashcards into study decks</p>
            </Card>

            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <Target className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">Up to +30 XP</p>
                  <p className="text-sm text-muted-foreground">per quiz</p>
                </div>
              </div>
              <p className="text-sm">Based on your quiz performance (100% = 30 XP)</p>
            </Card>

            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-yellow-500/20 rounded-lg">
                  <Star className="h-6 w-6 text-yellow-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">+50 XP</p>
                  <p className="text-sm text-muted-foreground">perfect quiz</p>
                </div>
              </div>
              <p className="text-sm">Bonus for scoring 100% on a quiz</p>
            </Card>

            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-pink-500/20 rounded-lg">
                  <MessageSquare className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">+5 XP</p>
                  <p className="text-sm text-muted-foreground">per comment</p>
                </div>
              </div>
              <p className="text-sm">Help others by commenting on decks and posts</p>
            </Card>

            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-orange-500/20 rounded-lg">
                  <Flame className="h-6 w-6 text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">+5 XP</p>
                  <p className="text-sm text-muted-foreground">daily streak</p>
                </div>
              </div>
              <p className="text-sm">Study every day to maintain your streak</p>
            </Card>

            <Card className="p-6 glass-effect border-2 border-white/10 dark:border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-indigo-500/20 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-indigo-500" />
                </div>
                <div>
                  <p className="font-bold text-lg">+15 XP</p>
                  <p className="text-sm text-muted-foreground">per post</p>
                </div>
              </div>
              <p className="text-sm">Ask questions or start discussions</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="glass-effect circuit-pattern feature-card-hover p-12 text-center border-2 border-white/10 dark:border-white/20 max-w-3xl mx-auto">
            <Trophy className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-display font-bold mb-4">
              Keep Learning, Keep Earning!
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Every flashcard you create, every quiz you take, and every comment you post brings you closer to the top of the leaderboard.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate('/flashcards')} className="bg-gradient-primary">
                <BookOpen className="w-5 h-5 mr-2" />
                Create Flashcards
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/quiz')}>
                <Target className="w-5 h-5 mr-2" />
                Take a Quiz
              </Button>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Gamification;
