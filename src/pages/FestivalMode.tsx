import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star,
  Zap,
  Trophy,
  Crown,
  Sparkles,
  Music,
  Gamepad2,
  Theater,
  Users2,
  Camera,
  Coffee,
  Heart,
  Share2,
  Ticket,
  Gift,
  Flame,
  Target
} from "lucide-react";

const FestivalMode = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Mock festival data
  const festival = {
    name: "TechFest 2024",
    tagline: "The Ultimate Technology Festival",
    startDate: "2024-02-15",
    endDate: "2024-02-17",
    location: "San Francisco Convention Center",
    description: "Join us for the biggest technology festival of the year! Three days of innovation, networking, and amazing experiences.",
    totalEvents: 25,
    totalAttendees: 5000,
    featured: true
  };

  const festivalEvents = [
    {
      id: 1,
      title: "AI Innovation Summit",
      date: "2024-02-15",
      time: "9:00 AM",
      location: "Main Hall",
      attendees: 500,
      category: "Technology",
      featured: true,
      icon: Users2,
      color: "text-primary"
    },
    {
      id: 2,
      title: "Startup Pitch Competition",
      date: "2024-02-15",
      time: "2:00 PM",
      location: "Auditorium",
      attendees: 300,
      category: "Business",
      featured: true,
      icon: Target,
      color: "text-accent"
    },
    {
      id: 3,
      title: "Gaming Championship",
      date: "2024-02-16",
      time: "10:00 AM",
      location: "Gaming Arena",
      attendees: 200,
      category: "Gaming",
      featured: false,
      icon: Gamepad2,
      color: "text-secondary"
    },
    {
      id: 4,
      title: "Tech Art Exhibition",
      date: "2024-02-16",
      time: "6:00 PM",
      location: "Gallery",
      attendees: 150,
      category: "Art",
      featured: false,
      icon: Camera,
      color: "text-warning"
    },
    {
      id: 5,
      title: "Networking Mixer",
      date: "2024-02-17",
      time: "7:00 PM",
      location: "Rooftop",
      attendees: 400,
      category: "Social",
      featured: true,
      icon: Users,
      color: "text-info"
    }
  ];

  const highlights = [
    { title: "50+ Speakers", icon: Star, color: "text-warning" },
    { title: "25 Events", icon: Calendar, color: "text-primary" },
    { title: "5000+ Attendees", icon: Users, color: "text-accent" },
    { title: "3 Days", icon: Clock, color: "text-secondary" }
  ];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const festivalStart = new Date(festival.startDate).getTime();
      const distance = festivalStart - now;

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [festival.startDate]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="mb-6 bg-gradient-primary text-white border-none">
              <Sparkles className="w-4 h-4 mr-2" />
              Festival Mode
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-gaming font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
              {festival.name}
            </h1>
            
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              {festival.tagline}
            </h2>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-8">
              {festival.description}
            </p>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex justify-center space-x-4 mb-8"
            >
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={item.label} className="text-center">
                  <div className="w-20 h-20 glass-card rounded-lg flex items-center justify-center mb-2">
                    <span className="text-2xl font-bold text-primary">{item.value}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-4 h-auto">
                <Ticket className="w-5 h-5 mr-2" />
                Get Festival Pass
              </Button>
              <Button size="lg" variant="outline" className="glass border-primary/50 text-foreground text-lg px-8 py-4 h-auto">
                <Share2 className="w-5 h-5 mr-2" />
                Share Festival
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Festival Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Festival Highlights
            </h2>
            <p className="text-xl text-muted-foreground">What makes this festival special</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {highlights.map((highlight, index) => {
              const Icon = highlight.icon;
              return (
                <motion.div
                  key={highlight.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                >
                  <Card className="glass-card hover-lift text-center">
                    <CardContent className="p-8">
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${highlight.color}`} />
                      <h3 className="text-2xl font-bold mb-2">{highlight.title}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Featured Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mb-16"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Featured Events
            </h2>
            <p className="text-xl text-muted-foreground">Don't miss these amazing experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {festivalEvents.filter(event => event.featured).map((event, index) => {
              const Icon = event.icon;
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                >
                  <Card className="glass-card hover-lift overflow-hidden border-2 border-primary/20">
                    <div className="relative">
                      <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Icon className="w-16 h-16 text-primary/50" />
                      </div>
                      <Badge className="absolute top-3 left-3 bg-gradient-primary text-white border-none">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-bold text-lg mb-2">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.date}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {event.time}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <MapPin className="w-4 h-4 mr-1" />
                            {event.location}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Users className="w-4 h-4 mr-1" />
                            {event.attendees}
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-primary hover:opacity-90">
                          <Zap className="w-4 h-4 mr-2" />
                          Join Event
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* All Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              All Festival Events
            </h2>
            <p className="text-xl text-muted-foreground">Complete schedule of events</p>
          </div>

          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                {festivalEvents.map((event, index) => {
                  const Icon = event.icon;
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.1 + index * 0.1 }}
                      className="flex items-center justify-between p-4 glass rounded-lg hover-lift"
                    >
                      <div className="flex items-center space-x-4">
                        <Icon className={`w-8 h-8 ${event.color}`} />
                        <div>
                          <h3 className="font-semibold">{event.title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>{event.date} at {event.time}</span>
                            <span>{event.location}</span>
                            <span>{event.attendees} attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {event.featured && (
                          <Badge className="bg-gradient-primary text-white border-none">
                            <Star className="w-3 h-3 mr-1" />
                            Featured
                          </Badge>
                        )}
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
        </motion.div>
      </div>
    </div>
  );
};

export default FestivalMode;
