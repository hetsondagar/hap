import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, 
  Calendar, 
  Trophy, 
  Gift, 
  Users, 
  Star, 
  Clock, 
  TrendingUp,
  Filter,
  Search,
  Plus,
  Crown,
  Zap,
  Target,
  Loader2
} from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userStats, setUserStats] = useState(null);
  
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const [eventsData, statsData] = await Promise.all([
          apiClient.getEvents(),
          apiClient.getUserStats(user._id)
        ]);
        
        setEvents(eventsData.events || []);
        setUserStats(statsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, toast]);

  // Mock data for fallback
  const userStats = {
    level: 12,
    xp: 2450,
    xpToNext: 500,
    points: 1250,
    eventsAttended: 23,
    badges: 8
  };

  const upcomingEvents = [
    {
      id: 1,
      title: "Tech Meetup 2024",
      date: "2024-01-15",
      location: "Downtown Hub",
      category: "Technology",
      attendees: 150,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Music Festival",
      date: "2024-01-20",
      location: "Central Park",
      category: "Music",
      attendees: 500,
      image: "/placeholder.svg"
    }
  ];

  const leaderboardData = [
    { rank: 1, name: "Alex Chen", xp: 3200, avatar: "/placeholder.svg", badge: "Crown" },
    { rank: 2, name: "Sarah Kim", xp: 3100, avatar: "/placeholder.svg", badge: "Star" },
    { rank: 3, name: "Mike Johnson", xp: 2900, avatar: "/placeholder.svg", badge: "Trophy" },
    { rank: 4, name: "You", xp: 2450, avatar: "/placeholder.svg", badge: "Zap" },
    { rank: 5, name: "Emma Wilson", xp: 2200, avatar: "/placeholder.svg", badge: "Target" }
  ];

  const rewards = [
    { id: 1, name: "Free Coffee", cost: 100, image: "/placeholder.svg", available: true },
    { id: 2, name: "Event Ticket", cost: 500, image: "/placeholder.svg", available: true },
    { id: 3, name: "Premium Badge", cost: 1000, image: "/placeholder.svg", available: false }
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
                Welcome back, Explorer!
              </h1>
              <p className="text-muted-foreground mt-2">Ready to make it happen?</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{userStats.points}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
              <Avatar className="w-12 h-12 border-2 border-primary">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>EX</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-2xl font-bold text-primary">{userStats.level}</p>
                </div>
                <Trophy className="w-8 h-8 text-primary" />
              </div>
              <Progress value={(userStats.xp / (userStats.xp + userStats.xpToNext)) * 100} className="mt-4" />
              <p className="text-xs text-muted-foreground mt-2">{userStats.xpToNext} XP to next level</p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Events Attended</p>
                  <p className="text-2xl font-bold text-secondary">{userStats.eventsAttended}</p>
                </div>
                <Calendar className="w-8 h-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Badges Earned</p>
                  <p className="text-2xl font-bold text-accent">{userStats.badges}</p>
                </div>
                <Star className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Rank</p>
                  <p className="text-2xl font-bold text-warning">#4</p>
                </div>
                <TrendingUp className="w-8 h-8 text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass p-1 w-full justify-start">
              <TabsTrigger value="discover" className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Discover</span>
              </TabsTrigger>
              <TabsTrigger value="my-events" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>My Events</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="flex items-center space-x-2">
                <Trophy className="w-4 h-4" />
                <span>Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="rewards" className="flex items-center space-x-2">
                <Gift className="w-4 h-4" />
                <span>Rewards</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Discover Events</h2>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input 
                      type="text" 
                      placeholder="Search events..." 
                      className="pl-10 pr-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover-lift overflow-hidden">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-primary/50" />
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                            <div className="flex items-center text-sm text-muted-foreground mb-1">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                          </div>
                          <Badge variant="secondary">{event.category}</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-2" />
                            {event.attendees} attending
                          </div>
                          <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                            Join Event
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-events" className="space-y-6">
              <h2 className="text-2xl font-bold">My Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {upcomingEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="font-bold text-lg">{event.title}</h3>
                          <Badge className="bg-accent/20 text-accent border-accent/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Upcoming
                          </Badge>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          View Details
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <h2 className="text-2xl font-bold">Leaderboard</h2>
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {leaderboardData.map((user, index) => (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-4 rounded-lg ${
                          user.name === "You" ? "bg-primary/10 border border-primary/30" : "hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-primary text-white font-bold">
                            {user.rank}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.xp} XP</div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {user.badge === "Crown" && <Crown className="w-5 h-5 text-warning" />}
                          {user.badge === "Star" && <Star className="w-5 h-5 text-accent" />}
                          {user.badge === "Trophy" && <Trophy className="w-5 h-5 text-secondary" />}
                          {user.badge === "Zap" && <Zap className="w-5 h-5 text-primary" />}
                          {user.badge === "Target" && <Target className="w-5 h-5 text-info" />}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <h2 className="text-2xl font-bold">Rewards Marketplace</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {rewards.map((reward, index) => (
                  <motion.div
                    key={reward.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className={`glass-card hover-lift ${!reward.available ? 'opacity-50' : ''}`}>
                      <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <Gift className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="font-bold text-lg mb-2">{reward.name}</h3>
                        <div className="text-2xl font-bold text-accent mb-4">{reward.cost} points</div>
                        <Button 
                          size="sm" 
                          className="w-full"
                          disabled={!reward.available}
                        >
                          {reward.available ? 'Redeem Now' : 'Not Available'}
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
