import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Zap, Medal, Crown, Target } from "lucide-react";

const GamificationPanel = () => {
  const userStats = {
    level: 12,
    xp: 2350,
    xpToNext: 2800,
    rank: 47,
    totalUsers: 50000,
    points: 12750,
    streak: 7
  };

  const achievements = [
    { id: 1, name: "First Steps", description: "Attended your first event", icon: Star, unlocked: true, rarity: "Common" },
    { id: 2, name: "Social Butterfly", description: "Attended 10 social events", icon: Trophy, unlocked: true, rarity: "Rare" },
    { id: 3, name: "Culture Vulture", description: "Attended 5 cultural events", icon: Medal, unlocked: true, rarity: "Uncommon" },
    { id: 4, name: "Sports Fanatic", description: "Attended 15 sports events", icon: Zap, unlocked: false, rarity: "Epic" },
    { id: 5, name: "Event Master", description: "Attended 50 events total", icon: Crown, unlocked: false, rarity: "Legendary" },
  ];

  const recentRewards = [
    { name: "Coffee Voucher", points: 500, claimed: false },
    { name: "Event Ticket Discount", points: 200, claimed: true },
    { name: "HAP Merchandise", points: 1000, claimed: false },
  ];

  const rarityColors = {
    Common: "border-muted-foreground text-muted-foreground",
    Uncommon: "border-success text-success",
    Rare: "border-info text-info", 
    Epic: "border-secondary text-secondary",
    Legendary: "border-warning text-warning"
  };

  return (
    <div className="space-y-6">
      {/* Player Stats */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Your Progress</h2>
          <Badge className="bg-gradient-primary border-none text-white">
            Level {userStats.level}
          </Badge>
        </div>

        {/* XP Progress */}
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Experience Points</span>
            <span className="text-sm font-medium text-foreground">
              {userStats.xp} / {userStats.xpToNext} XP
            </span>
          </div>
          <div className="progress-bar h-3">
            <div 
              className="progress-fill"
              style={{ width: `${(userStats.xp / userStats.xpToNext) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg border border-border/50">
            <div className="text-2xl font-bold text-primary mb-1">#{userStats.rank}</div>
            <div className="text-xs text-muted-foreground">Global Rank</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border/50">
            <div className="text-2xl font-bold text-accent mb-1">{userStats.points.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border/50">
            <div className="text-2xl font-bold text-warning mb-1">{userStats.streak}</div>
            <div className="text-xs text-muted-foreground">Day Streak</div>
          </div>
          <div className="text-center p-3 rounded-lg border border-border/50">
            <div className="text-2xl font-bold text-secondary mb-1">85%</div>
            <div className="text-xs text-muted-foreground">Completion</div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Achievements</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.slice(0, 4).map((achievement) => {
            const Icon = achievement.icon;
            return (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                  achievement.unlocked 
                    ? `${rarityColors[achievement.rarity as keyof typeof rarityColors]} bg-gradient-to-br from-current/5 to-transparent hover:from-current/10`
                    : 'border-muted/30 text-muted-foreground/50 grayscale'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${achievement.unlocked ? 'bg-current/20' : 'bg-muted/10'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{achievement.name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${rarityColors[achievement.rarity as keyof typeof rarityColors]} border-current/30`}
                      >
                        {achievement.rarity}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-80">{achievement.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Rewards */}
      <div className="glass-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Available Rewards</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            Marketplace
          </Button>
        </div>

        <div className="space-y-3">
          {recentRewards.map((reward, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-primary/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-sm text-foreground">{reward.name}</h3>
                  <p className="text-xs text-muted-foreground">{reward.points} points</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant={reward.claimed ? "ghost" : "default"}
                className={reward.claimed ? "text-muted-foreground" : "bg-gradient-accent hover:opacity-90 border-none text-white"}
                disabled={reward.claimed}
              >
                {reward.claimed ? "Claimed" : "Redeem"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamificationPanel;