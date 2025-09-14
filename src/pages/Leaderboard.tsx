import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Crown, 
  Star, 
  Zap, 
  Target, 
  Medal,
  TrendingUp,
  Award,
  Flame,
  Shield,
  Sword,
  Gem,
  Filter,
  Calendar
} from "lucide-react";

const Leaderboard = () => {
  // Mock data
  const leaderboardData = [
    { 
      rank: 1, 
      name: "Alex Chen", 
      xp: 3200, 
      level: 15,
      avatar: "/placeholder.svg", 
      badge: "Crown",
      achievements: 12,
      streak: 7,
      change: "+2"
    },
    { 
      rank: 2, 
      name: "Sarah Kim", 
      xp: 3100, 
      level: 14,
      avatar: "/placeholder.svg", 
      badge: "Star",
      achievements: 11,
      streak: 5,
      change: "+1"
    },
    { 
      rank: 3, 
      name: "Mike Johnson", 
      xp: 2900, 
      level: 13,
      avatar: "/placeholder.svg", 
      badge: "Trophy",
      achievements: 10,
      streak: 3,
      change: "-1"
    },
    { 
      rank: 4, 
      name: "Emma Wilson", 
      xp: 2450, 
      level: 12,
      avatar: "/placeholder.svg", 
      badge: "Zap",
      achievements: 8,
      streak: 4,
      change: "+3"
    },
    { 
      rank: 5, 
      name: "David Lee", 
      xp: 2200, 
      level: 11,
      avatar: "/placeholder.svg", 
      badge: "Target",
      achievements: 7,
      streak: 2,
      change: "+1"
    },
    { 
      rank: 6, 
      name: "Lisa Park", 
      xp: 2100, 
      level: 11,
      avatar: "/placeholder.svg", 
      badge: "Medal",
      achievements: 6,
      streak: 1,
      change: "-2"
    },
    { 
      rank: 7, 
      name: "You", 
      xp: 1950, 
      level: 10,
      avatar: "/placeholder.svg", 
      badge: "Flame",
      achievements: 5,
      streak: 3,
      change: "+2"
    }
  ];

  const achievements = [
    { id: 1, name: "First Event", description: "Attend your first event", icon: Star, unlocked: true, rarity: "common" },
    { id: 2, name: "Social Butterfly", description: "Attend 10 events", icon: Zap, unlocked: true, rarity: "rare" },
    { id: 3, name: "Event Master", description: "Attend 50 events", icon: Crown, unlocked: false, rarity: "epic" },
    { id: 4, name: "Streak Master", description: "7-day attendance streak", icon: Flame, unlocked: true, rarity: "rare" },
    { id: 5, name: "Explorer", description: "Visit 5 different venues", icon: Target, unlocked: false, rarity: "common" },
    { id: 6, name: "Legend", description: "Reach level 20", icon: Trophy, unlocked: false, rarity: "legendary" }
  ];

  const getBadgeIcon = (badge: string) => {
    switch (badge) {
      case "Crown": return Crown;
      case "Star": return Star;
      case "Trophy": return Trophy;
      case "Zap": return Zap;
      case "Target": return Target;
      case "Medal": return Medal;
      case "Flame": return Flame;
      default: return Star;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case "Crown": return "text-warning";
      case "Star": return "text-accent";
      case "Trophy": return "text-secondary";
      case "Zap": return "text-primary";
      case "Target": return "text-info";
      case "Medal": return "text-muted-foreground";
      case "Flame": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-500";
      case "rare": return "border-blue-500";
      case "epic": return "border-purple-500";
      case "legendary": return "border-yellow-500";
      default: return "border-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-5xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Leaderboard
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Compete with friends and climb the ranks. Every event attended brings you closer to the top!
            </p>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Updated 2 hours ago
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-6 h-6 mr-2 text-warning" />
                  Global Rankings
                </CardTitle>
                <CardDescription>Top performers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {leaderboardData.map((user, index) => {
                    const BadgeIcon = getBadgeIcon(user.badge);
                    const badgeColor = getBadgeColor(user.badge);
                    const isCurrentUser = user.name === "You";
                    
                    return (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all ${
                          isCurrentUser 
                            ? "bg-primary/10 border-2 border-primary/30" 
                            : "hover:bg-white/5 border border-transparent"
                        } ${user.rank <= 3 ? "ring-2 ring-warning/20" : ""}`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                            user.rank === 1 ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-black" :
                            user.rank === 2 ? "bg-gradient-to-r from-gray-300 to-gray-500 text-black" :
                            user.rank === 3 ? "bg-gradient-to-r from-amber-600 to-amber-800 text-white" :
                            "bg-gradient-primary text-white"
                          }`}>
                            {user.rank}
                          </div>
                          
                          <Avatar className="w-12 h-12 border-2 border-white/20">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold">{user.name}</span>
                              {user.rank <= 3 && <BadgeIcon className={`w-4 h-4 ${badgeColor}`} />}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                              <span>Level {user.level}</span>
                              <span>{user.xp} XP</span>
                              <span className="flex items-center">
                                <Flame className="w-3 h-3 mr-1" />
                                {user.streak} day streak
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-sm text-muted-foreground">Achievements</div>
                            <div className="font-semibold">{user.achievements}</div>
                          </div>
                          <div className={`text-sm font-semibold ${
                            user.change.startsWith('+') ? 'text-accent' : 'text-destructive'
                          }`}>
                            {user.change}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            {/* Your Stats */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">#7</div>
                  <div className="text-sm text-muted-foreground">Current Rank</div>
                </div>
                
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Level 10</span>
                    <span>1,950 / 2,000 XP</span>
                  </div>
                  <Progress value={(1950 / 2000) * 100} className="h-2" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-accent">5</div>
                    <div className="text-xs text-muted-foreground">Achievements</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-secondary">3</div>
                    <div className="text-xs text-muted-foreground">Day Streak</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-accent" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-3 rounded-lg border-2 text-center ${
                          achievement.unlocked 
                            ? `${getRarityColor(achievement.rarity)} bg-white/5` 
                            : 'border-muted/20 bg-muted/10 opacity-50'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                        }`} />
                        <div className="text-xs font-semibold">{achievement.name}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {achievement.description}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  <Zap className="w-4 h-4 mr-2" />
                  Find Events
                </Button>
                <Button variant="outline" className="w-full">
                  <Shield className="w-4 h-4 mr-2" />
                  View Profile
                </Button>
                <Button variant="outline" className="w-full">
                  <Sword className="w-4 h-4 mr-2" />
                  Challenge Friends
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
