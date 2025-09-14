import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  Star,
  Zap,
  Trophy,
  Crown,
  Target,
  Award,
  Medal,
  Shield,
  Sword,
  Gem,
  Flame,
  Sparkles,
  Gift,
  Heart,
  Share2,
  Settings,
  Filter,
  Search,
  Calendar,
  Users,
  MapPin,
  Clock,
  MessageCircle,
  UserPlus,
  TrendingUp,
  Activity
} from "lucide-react";

const NotificationsAchievements = () => {
  const [activeTab, setActiveTab] = useState("notifications");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "achievement",
      title: "New Badge Unlocked!",
      message: "You've earned the 'Tech Enthusiast' badge",
      time: "2 minutes ago",
      read: false,
      icon: Trophy,
      color: "text-warning"
    },
    {
      id: 2,
      type: "event",
      title: "Event Reminder",
      message: "Tech Innovation Summit starts in 1 hour",
      time: "15 minutes ago",
      read: false,
      icon: Calendar,
      color: "text-primary"
    },
    {
      id: 3,
      type: "social",
      title: "Friend Activity",
      message: "Alex Chen joined 'Music Festival 2024'",
      time: "1 hour ago",
      read: true,
      icon: Users,
      color: "text-accent"
    },
    {
      id: 4,
      type: "reward",
      title: "Points Earned",
      message: "You earned 50 points for attending Tech Meetup",
      time: "2 hours ago",
      read: true,
      icon: Zap,
      color: "text-accent"
    },
    {
      id: 5,
      type: "invitation",
      title: "Group Invitation",
      message: "Sarah Kim invited you to join 'Art Lovers' group",
      time: "3 hours ago",
      read: true,
      icon: UserPlus,
      color: "text-secondary"
    }
  ]);

  const achievements = [
    {
      id: 1,
      name: "First Event",
      description: "Attend your first event",
      icon: Star,
      unlocked: true,
      rarity: "common",
      date: "2023-06-20",
      points: 50
    },
    {
      id: 2,
      name: "Social Butterfly",
      description: "Attend 10 events",
      icon: Users,
      unlocked: true,
      rarity: "rare",
      date: "2023-08-15",
      points: 100
    },
    {
      id: 3,
      name: "Tech Enthusiast",
      description: "Attend 5 technology events",
      icon: Trophy,
      unlocked: true,
      rarity: "rare",
      date: "2024-01-15",
      points: 150
    },
    {
      id: 4,
      name: "Event Master",
      description: "Attend 50 events",
      icon: Crown,
      unlocked: false,
      rarity: "epic",
      date: null,
      points: 500
    },
    {
      id: 5,
      name: "Streak Master",
      description: "Attend events for 7 consecutive days",
      icon: Flame,
      unlocked: true,
      rarity: "epic",
      date: "2023-12-01",
      points: 300
    },
    {
      id: 6,
      name: "Explorer",
      description: "Visit 5 different venues",
      icon: Target,
      unlocked: true,
      rarity: "common",
      date: "2023-09-10",
      points: 75
    },
    {
      id: 7,
      name: "Legend",
      description: "Reach level 20",
      icon: Award,
      unlocked: false,
      rarity: "legendary",
      date: null,
      points: 1000
    },
    {
      id: 8,
      name: "Friend Maker",
      description: "Invite 5 friends",
      icon: UserPlus,
      unlocked: true,
      rarity: "rare",
      date: "2023-11-05",
      points: 200
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "border-gray-500 bg-gray-500/10";
      case "rare": return "border-blue-500 bg-blue-500/10";
      case "epic": return "border-purple-500 bg-purple-500/10";
      case "legendary": return "border-yellow-500 bg-yellow-500/10";
      default: return "border-gray-500 bg-gray-500/10";
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case "common": return "";
      case "rare": return "animate-pulse-glow";
      case "epic": return "animate-glow";
      case "legendary": return "animate-pulse-glow";
      default: return "";
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
                Notifications & Achievements
              </h1>
              <p className="text-muted-foreground mt-2">Stay updated with your progress and activities</p>
            </div>
            <div className="flex items-center space-x-4">
              {unreadCount > 0 && (
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  {unreadCount} unread
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-4 border-b border-border/50">
            <Button
              variant={activeTab === "notifications" ? "default" : "ghost"}
              onClick={() => setActiveTab("notifications")}
              className={activeTab === "notifications" ? "bg-gradient-primary" : ""}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="ml-2 bg-accent/20 text-accent border-accent/30">
                  {unreadCount}
                </Badge>
              )}
            </Button>
            <Button
              variant={activeTab === "achievements" ? "default" : "ghost"}
              onClick={() => setActiveTab("achievements")}
              className={activeTab === "achievements" ? "bg-gradient-primary" : ""}
            >
              <Trophy className="w-4 h-4 mr-2" />
              Achievements
            </Button>
          </div>
        </motion.div>

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
              {unreadCount > 0 && (
                <Button variant="outline" size="sm" onClick={markAllAsRead}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark All Read
                </Button>
              )}
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`glass-card hover-lift cursor-pointer transition-all ${
                      !notification.read ? 'border-primary/30 bg-primary/5' : ''
                    }`} onClick={() => markAsRead(notification.id)}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`w-12 h-12 glass-card rounded-full flex items-center justify-center ${notification.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{notification.title}</h3>
                              {!notification.read && (
                                <div className="w-2 h-2 bg-primary rounded-full"></div>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-2">{notification.message}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{notification.time}</span>
                              <div className="flex space-x-2">
                                <Button size="sm" variant="ghost">
                                  <Heart className="w-4 h-4" />
                                </Button>
                                <Button size="sm" variant="ghost">
                                  <Share2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Achievements Tab */}
        {activeTab === "achievements" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-warning">
                    {achievements.filter(a => a.unlocked).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Unlocked</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">
                    {achievements.filter(a => !a.unlocked).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Locked</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent">
                    {achievements.filter(a => a.unlocked).reduce((sum, a) => sum + a.points, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Points Earned</div>
                </CardContent>
              </Card>
              <Card className="glass-card">
                <CardContent className="p-6 text-center">
                  <Crown className="w-8 h-8 text-warning mx-auto mb-2" />
                  <div className="text-2xl font-bold text-warning">
                    {achievements.filter(a => a.rarity === 'legendary' && a.unlocked).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Legendary</div>
                </CardContent>
              </Card>
            </div>

            {/* Achievements Grid */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-6 h-6 mr-2 text-accent" />
                  All Achievements
                </CardTitle>
                <CardDescription>
                  {achievements.filter(a => a.unlocked).length} of {achievements.length} unlocked
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 rounded-lg border-2 text-center ${
                          achievement.unlocked 
                            ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}` 
                            : 'border-muted/20 bg-muted/10 opacity-50'
                        }`}
                      >
                        <Icon className={`w-16 h-16 mx-auto mb-4 ${
                          achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                        }`} />
                        <h3 className="font-bold text-lg mb-2">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{achievement.description}</p>
                        
                        {achievement.unlocked ? (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center text-accent font-semibold">
                              <Zap className="w-4 h-4 mr-1" />
                              +{achievement.points} points
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Unlocked {achievement.date}
                            </div>
                            <Button size="sm" variant="outline" className="w-full">
                              <Share2 className="w-4 h-4 mr-2" />
                              Share
                            </Button>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <Badge variant="outline" className="text-xs">Locked</Badge>
                            <div className="text-xs text-muted-foreground">
                              {achievement.points} points reward
                            </div>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default NotificationsAchievements;
