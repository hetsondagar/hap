import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Zap, 
  Users, 
  MapPin, 
  Clock, 
  TrendingUp,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Heart,
  MessageCircle,
  Share2,
  Star,
  Crown,
  Trophy,
  Music,
  Gamepad2,
  Theater,
  Users2,
  Eye,
  Activity,
  Flame
} from "lucide-react";

const LiveEventFeed = () => {
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState([]);

  // Mock data for live updates
  const liveUpdatesData = [
    {
      id: 1,
      type: "checkin",
      message: "30 people checked in at Rock Concert!",
      event: "Rock Concert 2024",
      location: "Madison Square Garden",
      time: "2 minutes ago",
      attendees: 30,
      icon: Users,
      color: "text-accent"
    },
    {
      id: 2,
      type: "trending",
      message: "Tech Meetup is trending! 🔥",
      event: "Tech Innovation Summit",
      location: "Convention Center",
      time: "5 minutes ago",
      attendees: 150,
      icon: TrendingUp,
      color: "text-warning"
    },
    {
      id: 3,
      type: "milestone",
      message: "Art Exhibition reached 100 attendees!",
      event: "Modern Art Gallery",
      location: "Downtown Gallery",
      time: "8 minutes ago",
      attendees: 100,
      icon: Trophy,
      color: "text-primary"
    },
    {
      id: 4,
      type: "new",
      message: "New event: Gaming Tournament",
      event: "Esports Championship",
      location: "Gaming Arena",
      time: "12 minutes ago",
      attendees: 0,
      icon: Gamepad2,
      color: "text-secondary"
    }
  ];

  // Mock data for stories
  const stories = [
    {
      id: 1,
      organizer: "Tech Innovators Inc.",
      avatar: "/placeholder.svg",
      event: "Tech Innovation Summit",
      image: "/placeholder.svg",
      views: 1250,
      duration: 5
    },
    {
      id: 2,
      organizer: "Live Music Co.",
      avatar: "/placeholder.svg",
      event: "Rock Concert 2024",
      image: "/placeholder.svg",
      views: 2100,
      duration: 3
    },
    {
      id: 3,
      organizer: "Art Gallery",
      avatar: "/placeholder.svg",
      event: "Modern Art Exhibition",
      image: "/placeholder.svg",
      views: 890,
      duration: 4
    },
    {
      id: 4,
      organizer: "Sports League",
      avatar: "/placeholder.svg",
      event: "Basketball Tournament",
      image: "/placeholder.svg",
      views: 1560,
      duration: 6
    }
  ];

  // Mock data for trending events
  const trendingEvents = [
    {
      id: 1,
      title: "Music Festival 2024",
      category: "Music",
      attendees: 2500,
      trend: "+15%",
      image: "/placeholder.svg",
      icon: Music,
      color: "text-secondary"
    },
    {
      id: 2,
      title: "Gaming Championship",
      category: "Gaming",
      attendees: 1800,
      trend: "+25%",
      image: "/placeholder.svg",
      icon: Gamepad2,
      color: "text-accent"
    },
    {
      id: 3,
      title: "Theater Performance",
      category: "Theater",
      attendees: 450,
      trend: "+8%",
      image: "/placeholder.svg",
      icon: Theater,
      color: "text-primary"
    },
    {
      id: 4,
      title: "Tech Meetup",
      category: "Technology",
      attendees: 320,
      trend: "+12%",
      image: "/placeholder.svg",
      icon: Users2,
      color: "text-warning"
    }
  ];

  // Auto-play stories
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % stories.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying, stories.length]);

  // Simulate live updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveUpdates(prev => {
        const newUpdate = liveUpdatesData[Math.floor(Math.random() * liveUpdatesData.length)];
        return [newUpdate, ...prev.slice(0, 9)];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getEventIcon = (category: string) => {
    switch (category) {
      case "Music": return Music;
      case "Gaming": return Gamepad2;
      case "Theater": return Theater;
      case "Technology": return Users2;
      default: return Star;
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent">
                Live Event Feed
              </h1>
              <p className="text-muted-foreground mt-2">Real-time updates from events happening now</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 text-sm text-accent">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stories Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="w-6 h-6 mr-2 text-primary" />
                  Event Stories
                </CardTitle>
                <CardDescription>Behind-the-scenes content from organizers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Story Navigation */}
                  <div className="flex items-center justify-between mb-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStoryIndex((prev) => (prev - 1 + stories.length) % stories.length)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    
                    <div className="flex space-x-2">
                      {stories.map((_, index) => (
                        <div
                          key={index}
                          className={`h-1 w-8 rounded-full transition-all ${
                            index === currentStoryIndex ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentStoryIndex((prev) => (prev + 1) % stories.length)}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Current Story */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentStoryIndex}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 rounded-lg flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                        <Play className="w-16 h-16 text-white/80" />
                        
                        {/* Story Info */}
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="w-8 h-8 border-2 border-white/20">
                              <AvatarImage src={stories[currentStoryIndex].avatar} />
                              <AvatarFallback>{stories[currentStoryIndex].organizer[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-white font-semibold">{stories[currentStoryIndex].organizer}</div>
                              <div className="text-white/80 text-sm">{stories[currentStoryIndex].event}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4 text-white/80 text-sm">
                            <span className="flex items-center">
                              <Eye className="w-4 h-4 mr-1" />
                              {stories[currentStoryIndex].views} views
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {stories[currentStoryIndex].duration}s
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Play/Pause Controls */}
                  <div className="flex justify-center mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Live Updates Feed */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="w-6 h-6 mr-2 text-accent" />
                  Live Updates
                </CardTitle>
                <CardDescription>Real-time activity from events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveUpdates.map((update, index) => {
                    const Icon = update.icon;
                    return (
                      <motion.div
                        key={`${update.id}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-4 p-4 glass rounded-lg hover-lift"
                      >
                        <div className={`w-12 h-12 glass-card rounded-full flex items-center justify-center ${update.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold">{update.message}</p>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{update.event}</span>
                            <span className="flex items-center">
                              <MapPin className="w-3 h-3 mr-1" />
                              {update.location}
                            </span>
                            <span>{update.time}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-accent">{update.attendees}</div>
                          <div className="text-xs text-muted-foreground">attending</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trending Events Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Flame className="w-6 h-6 mr-2 text-warning" />
                  Trending Events
                </CardTitle>
                <CardDescription>Events gaining momentum</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingEvents.map((event, index) => {
                    const Icon = getEventIcon(event.category);
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-4 glass rounded-lg hover-lift border border-warning/20"
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <Icon className={`w-6 h-6 ${event.color}`} />
                          <div className="flex-1">
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.category}</p>
                          </div>
                          <Badge className="bg-warning/20 text-warning border-warning/30">
                            {event.trend}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-1" />
                            {event.attendees} attending
                          </div>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
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
                  Discover Events
                </Button>
                <Button variant="outline" className="w-full">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discussion
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Feed
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveEventFeed;
