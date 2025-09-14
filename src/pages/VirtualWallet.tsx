import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Wallet, 
  Zap, 
  TrendingUp, 
  TrendingDown,
  Plus,
  Minus,
  Gift,
  Trophy,
  Star,
  Crown,
  Target,
  Award,
  Clock,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Settings,
  History,
  CreditCard,
  Coins,
  Sparkles
} from "lucide-react";

const VirtualWallet = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock wallet data
  const walletData = {
    totalPoints: 1250,
    availablePoints: 850,
    lockedPoints: 400,
    level: 12,
    xpToNext: 500,
    currentXP: 2450,
    monthlyEarned: 320,
    monthlySpent: 150
  };

  const transactions = [
    {
      id: 1,
      type: "earned",
      amount: 50,
      description: "Attended Tech Meetup",
      date: "2024-01-15",
      time: "7:30 PM",
      icon: Trophy,
      color: "text-accent"
    },
    {
      id: 2,
      type: "spent",
      amount: -100,
      description: "Redeemed Coffee Voucher",
      date: "2024-01-14",
      time: "2:15 PM",
      icon: Gift,
      color: "text-secondary"
    },
    {
      id: 3,
      type: "earned",
      amount: 75,
      description: "Completed Profile",
      date: "2024-01-13",
      time: "10:45 AM",
      icon: Star,
      color: "text-accent"
    },
    {
      id: 4,
      type: "earned",
      amount: 200,
      description: "Invited 2 Friends",
      date: "2024-01-12",
      time: "6:20 PM",
      icon: Crown,
      color: "text-warning"
    },
    {
      id: 5,
      type: "spent",
      amount: -300,
      description: "Redeemed Event Ticket",
      date: "2024-01-10",
      time: "4:30 PM",
      icon: Gift,
      color: "text-secondary"
    }
  ];

  const challenges = [
    {
      id: 1,
      title: "Event Explorer",
      description: "Attend 5 different types of events",
      reward: 200,
      progress: 3,
      total: 5,
      icon: Target,
      color: "text-primary"
    },
    {
      id: 2,
      title: "Social Butterfly",
      description: "Invite 3 friends to events",
      reward: 150,
      progress: 1,
      total: 3,
      icon: Star,
      color: "text-accent"
    },
    {
      id: 3,
      title: "Streak Master",
      description: "Attend events for 7 consecutive days",
      reward: 300,
      progress: 4,
      total: 7,
      icon: Trophy,
      color: "text-warning"
    }
  ];

  const quickActions = [
    { title: "Top Up", description: "Complete challenges", icon: Plus, color: "text-accent" },
    { title: "Redeem", description: "Use points for rewards", icon: Gift, color: "text-secondary" },
    { title: "Transfer", description: "Send points to friends", icon: ArrowUpRight, color: "text-primary" },
    { title: "History", description: "View transactions", icon: History, color: "text-warning" }
  ];

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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent">
                Virtual Wallet
              </h1>
              <p className="text-muted-foreground mt-2">Manage your points and rewards</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Wallet Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card overflow-hidden">
            <div className="relative p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Your Points Balance</h2>
                      <p className="text-muted-foreground">Level {walletData.level} Explorer</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-gaming font-bold text-accent">
                      {walletData.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Points</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{walletData.availablePoints}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-warning">{walletData.lockedPoints}</div>
                    <div className="text-sm text-muted-foreground">Locked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">+{walletData.monthlyEarned}</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                </div>

                {/* XP Progress */}
                <div className="mt-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Level Progress</span>
                    <span>{walletData.xpToNext} XP to next level</span>
                  </div>
                  <Progress value={(walletData.currentXP / (walletData.currentXP + walletData.xpToNext)) * 100} className="h-3" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="glass-card hover-lift cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <Icon className={`w-8 h-8 mx-auto mb-3 ${action.color}`} />
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex space-x-4 border-b border-border/50">
            <Button
              variant={activeTab === "overview" ? "default" : "ghost"}
              onClick={() => setActiveTab("overview")}
              className={activeTab === "overview" ? "bg-gradient-primary" : ""}
            >
              Overview
            </Button>
            <Button
              variant={activeTab === "transactions" ? "default" : "ghost"}
              onClick={() => setActiveTab("transactions")}
              className={activeTab === "transactions" ? "bg-gradient-primary" : ""}
            >
              Transactions
            </Button>
            <Button
              variant={activeTab === "challenges" ? "default" : "ghost"}
              onClick={() => setActiveTab("challenges")}
              className={activeTab === "challenges" ? "bg-gradient-primary" : ""}
            >
              Challenges
            </Button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-accent" />
                    Monthly Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                          <ArrowUpRight className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold">Points Earned</div>
                          <div className="text-sm text-muted-foreground">This month</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-accent">+{walletData.monthlyEarned}</div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 glass rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
                          <ArrowDownRight className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <div className="font-semibold">Points Spent</div>
                          <div className="text-sm text-muted-foreground">This month</div>
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-secondary">-{walletData.monthlySpent}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="w-6 h-6 mr-2 text-warning" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Event Explorer", points: 200, icon: Target, color: "text-primary" },
                      { title: "Social Butterfly", points: 150, icon: Star, color: "text-accent" },
                      { title: "Streak Master", points: 300, icon: Trophy, color: "text-warning" }
                    ].map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.title}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center justify-between p-3 glass rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-6 h-6 ${achievement.color}`} />
                            <div>
                              <div className="font-semibold text-sm">{achievement.title}</div>
                              <div className="text-xs text-muted-foreground">+{achievement.points} points</div>
                            </div>
                          </div>
                          <Sparkles className="w-4 h-4 text-warning" />
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <History className="w-6 h-6 mr-2 text-primary" />
                  Transaction History
                </CardTitle>
                <CardDescription>Your recent point transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.map((transaction, index) => {
                    const Icon = transaction.icon;
                    return (
                      <motion.div
                        key={transaction.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 glass rounded-lg hover-lift"
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 glass-card rounded-full flex items-center justify-center ${transaction.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="font-semibold">{transaction.description}</div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Calendar className="w-3 h-3" />
                              <span>{transaction.date}</span>
                              <Clock className="w-3 h-3" />
                              <span>{transaction.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${
                          transaction.type === 'earned' ? 'text-accent' : 'text-secondary'
                        }`}>
                          {transaction.type === 'earned' ? '+' : ''}{transaction.amount}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-6 h-6 mr-2 text-accent" />
                  Active Challenges
                </CardTitle>
                <CardDescription>Complete challenges to earn bonus points</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {challenges.map((challenge, index) => {
                    const Icon = challenge.icon;
                    return (
                      <motion.div
                        key={challenge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 glass rounded-lg hover-lift"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-8 h-8 ${challenge.color}`} />
                            <div>
                              <h3 className="font-semibold text-lg">{challenge.title}</h3>
                              <p className="text-sm text-muted-foreground">{challenge.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-accent">+{challenge.reward}</div>
                            <div className="text-sm text-muted-foreground">points</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{challenge.progress}/{challenge.total}</span>
                          </div>
                          <Progress value={(challenge.progress / challenge.total) * 100} className="h-2" />
                        </div>
                        
                        <Button className="w-full mt-4 bg-gradient-primary hover:opacity-90">
                          <Target className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VirtualWallet;
