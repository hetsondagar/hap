import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Star, 
  Zap, 
  Crown, 
  Target,
  Medal,
  Award,
  Flame,
  Shield,
  Sword,
  Gem,
  Calendar,
  Users,
  Heart,
  Share2,
  Settings,
  Edit,
  Plus,
  TrendingUp,
  Clock,
  MapPin,
  Camera,
  Gift
} from "lucide-react";

const GamifiedProfile = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Mock user data
  const user = {
    name: "Alex Chen",
    username: "@alexchen",
    avatar: "/placeholder.svg",
    level: 12,
    xp: 2450,
    xpToNext: 500,
    points: 1250,
    eventsAttended: 23,
    friendsInvited: 8,
    badges: 8,
    joinDate: "2023-06-15",
    bio: "Event enthusiast and tech lover. Always looking for the next adventure!",
    location: "San Francisco, CA"
  };

  const achievements = [
    { id: 1, name: "First Event", description: "Attend your first event", icon: Star, unlocked: true, rarity: "common", date: "2023-06-20" },
    { id: 2, name: "Social Butterfly", description: "Attend 10 events", icon: Zap, unlocked: true, rarity: "rare", date: "2023-08-15" },
    { id: 3, name: "Event Master", description: "Attend 50 events", icon: Crown, unlocked: false, rarity: "epic", date: null },
    { id: 4, name: "Streak Master", description: "7-day attendance streak", icon: Flame, unlocked: true, rarity: "rare", date: "2023-12-01" },
    { id: 5, name: "Explorer", description: "Visit 5 different venues", icon: Target, unlocked: true, rarity: "common", date: "2023-09-10" },
    { id: 6, name: "Legend", description: "Reach level 20", icon: Trophy, unlocked: false, rarity: "legendary", date: null },
    { id: 7, name: "Friend Maker", description: "Invite 5 friends", icon: Users, unlocked: true, rarity: "rare", date: "2023-11-05" },
    { id: 8, name: "Early Bird", description: "Attend 5 morning events", icon: Clock, unlocked: false, rarity: "common", date: null }
  ];

  const eventTimeline = [
    { id: 1, title: "Tech Innovation Summit", date: "2024-01-15", type: "Technology", xp: 50, image: "/placeholder.svg" },
    { id: 2, title: "Music Festival 2024", date: "2024-01-10", type: "Music", xp: 75, image: "/placeholder.svg" },
    { id: 3, title: "Art Exhibition", date: "2024-01-05", type: "Art", xp: 40, image: "/placeholder.svg" },
    { id: 4, title: "Sports Tournament", date: "2023-12-28", type: "Sports", xp: 60, image: "/placeholder.svg" },
    { id: 5, title: "Gaming Meetup", date: "2023-12-20", type: "Gaming", xp: 35, image: "/placeholder.svg" }
  ];

  const stats = [
    { label: "Events Attended", value: user.eventsAttended, icon: Calendar, color: "text-primary" },
    { label: "Points Earned", value: user.points, icon: Zap, color: "text-accent" },
    { label: "Friends Invited", value: user.friendsInvited, icon: Users, color: "text-secondary" },
    { label: "Badges Earned", value: user.badges, icon: Award, color: "text-warning" }
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="glass-card overflow-hidden">
            <div className="relative h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
              <div className="absolute bottom-4 right-4">
                <Button size="sm" variant="outline" className="glass border-white/20">
                  <Camera className="w-4 h-4 mr-2" />
                  Edit Cover
                </Button>
              </div>
            </div>
            
            <CardContent className="relative -mt-16 pb-6">
              <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
                <div className="relative">
                  <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user.level}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-2">
                    <h1 className="text-3xl font-gaming font-bold">{user.name}</h1>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      Level {user.level}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-2">{user.username}</p>
                  <p className="text-sm text-muted-foreground mb-4">{user.bio}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {user.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      Joined {new Date(user.joinDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="glass-card hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* XP Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-primary" />
                Level Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Level {user.level}</span>
                  <span className="text-sm text-muted-foreground">{user.xpToNext} XP to next level</span>
                </div>
                <Progress value={(user.xp / (user.xp + user.xpToNext)) * 100} className="h-3" />
                <div className="flex justify-between text-sm">
                  <span className="text-accent font-semibold">{user.xp} XP</span>
                  <span className="text-muted-foreground">{user.xp + user.xpToNext} XP</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
              variant={activeTab === "achievements" ? "default" : "ghost"}
              onClick={() => setActiveTab("achievements")}
              className={activeTab === "achievements" ? "bg-gradient-primary" : ""}
            >
              Achievements
            </Button>
            <Button
              variant={activeTab === "timeline" ? "default" : "ghost"}
              onClick={() => setActiveTab("timeline")}
              className={activeTab === "timeline" ? "bg-gradient-primary" : ""}
            >
              Event Timeline
            </Button>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-6 h-6 mr-2 text-warning" />
                    Recent Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {achievements.filter(a => a.unlocked).slice(0, 3).map((achievement, index) => {
                      const Icon = achievement.icon;
                      return (
                        <motion.div
                          key={achievement.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}`}
                        >
                          <Icon className="w-8 h-8 text-accent" />
                          <div className="flex-1">
                            <div className="font-semibold">{achievement.name}</div>
                            <div className="text-sm text-muted-foreground">{achievement.description}</div>
                            <div className="text-xs text-muted-foreground">{achievement.date}</div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="w-6 h-6 mr-2 text-primary" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { title: "Tech Meetup", date: "Jan 25", time: "7:00 PM" },
                      { title: "Music Festival", date: "Feb 2", time: "8:00 PM" },
                      { title: "Art Exhibition", date: "Feb 8", time: "6:00 PM" }
                    ].map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 glass rounded-lg hover-lift"
                      >
                        <div>
                          <div className="font-semibold">{event.title}</div>
                          <div className="text-sm text-muted-foreground">{event.date} at {event.time}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <motion.div
                        key={achievement.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-4 rounded-lg border-2 text-center ${
                          achievement.unlocked 
                            ? `${getRarityColor(achievement.rarity)} ${getRarityGlow(achievement.rarity)}` 
                            : 'border-muted/20 bg-muted/10 opacity-50'
                        }`}
                      >
                        <Icon className={`w-12 h-12 mx-auto mb-3 ${
                          achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
                        }`} />
                        <h3 className="font-semibold mb-2">{achievement.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                        {achievement.unlocked && achievement.date && (
                          <p className="text-xs text-accent">{achievement.date}</p>
                        )}
                        {!achievement.unlocked && (
                          <Badge variant="outline" className="text-xs">Locked</Badge>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-6 h-6 mr-2 text-secondary" />
                  Event Timeline
                </CardTitle>
                <CardDescription>Your event attendance history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {eventTimeline.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4 p-4 glass rounded-lg hover-lift"
                    >
                      <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-primary/50" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{event.date}</span>
                          <Badge variant="outline">{event.type}</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center text-accent font-semibold">
                          <Zap className="w-4 h-4 mr-1" />
                          +{event.xp} XP
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GamifiedProfile;
