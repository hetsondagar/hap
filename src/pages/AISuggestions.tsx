import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Heart, 
  Bookmark, 
  Share2, 
  ChevronLeft, 
  ChevronRight,
  Star,
  Zap,
  TrendingUp,
  Target,
  Sparkles,
  ArrowRight,
  Filter,
  Search,
  Music,
  Gamepad2,
  Theater,
  Users2,
  Camera,
  Coffee,
  MapPin,
  Calendar,
  Clock,
  Users,
  Award
} from "lucide-react";

const AISuggestions = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [favorites, setFavorites] = useState(new Set());
  const [wishlist, setWishlist] = useState(new Set());

  // Mock AI suggestions data
  const suggestions = [
    {
      id: 1,
      title: "Tech Innovation Summit",
      category: "Technology",
      reason: "Because you liked 'AI & Machine Learning Workshop'",
      confidence: 95,
      date: "2024-01-20",
      time: "7:00 PM",
      location: "Convention Center",
      attendees: 150,
      price: "Free",
      image: "/placeholder.svg",
      icon: Users2,
      color: "text-primary",
      tags: ["AI", "Innovation", "Networking"],
      description: "Join industry leaders for discussions on the latest tech innovations and AI breakthroughs."
    },
    {
      id: 2,
      title: "Indie Music Festival",
      category: "Music",
      reason: "Based on your interest in alternative music",
      confidence: 88,
      date: "2024-01-25",
      time: "6:00 PM",
      location: "Music Hall",
      attendees: 300,
      price: "$25",
      image: "/placeholder.svg",
      icon: Music,
      color: "text-secondary",
      tags: ["Indie", "Live Music", "Festival"],
      description: "Discover emerging artists and enjoy live performances from indie bands."
    },
    {
      id: 3,
      title: "Gaming Championship",
      category: "Gaming",
      reason: "You frequently attend gaming events",
      confidence: 92,
      date: "2024-01-28",
      time: "2:00 PM",
      location: "Gaming Arena",
      attendees: 200,
      price: "$15",
      image: "/placeholder.svg",
      icon: Gamepad2,
      color: "text-accent",
      tags: ["Esports", "Competition", "Gaming"],
      description: "Watch the best gamers compete in the ultimate championship tournament."
    },
    {
      id: 4,
      title: "Art Gallery Opening",
      category: "Art",
      reason: "Similar to 'Modern Art Exhibition' you attended",
      confidence: 85,
      date: "2024-02-02",
      time: "7:00 PM",
      location: "Downtown Gallery",
      attendees: 80,
      price: "Free",
      image: "/placeholder.svg",
      icon: Camera,
      color: "text-warning",
      tags: ["Art", "Gallery", "Opening"],
      description: "Experience contemporary art from local and international artists."
    },
    {
      id: 5,
      title: "Coffee & Networking",
      category: "Social",
      reason: "You enjoy casual meetups and networking",
      confidence: 78,
      date: "2024-02-05",
      time: "10:00 AM",
      location: "Downtown Cafe",
      attendees: 25,
      price: "Free",
      image: "/placeholder.svg",
      icon: Coffee,
      color: "text-info",
      tags: ["Networking", "Coffee", "Social"],
      description: "Connect with like-minded professionals over coffee and conversation."
    }
  ];

  const trendingTags = [
    { name: "AI & Tech", count: 45, color: "bg-primary/20 text-primary" },
    { name: "Live Music", count: 32, color: "bg-secondary/20 text-secondary" },
    { name: "Gaming", count: 28, color: "bg-accent/20 text-accent" },
    { name: "Art & Culture", count: 22, color: "bg-warning/20 text-warning" },
    { name: "Networking", count: 18, color: "bg-info/20 text-info" }
  ];

  const currentSuggestion = suggestions[currentCardIndex];

  const nextCard = () => {
    setCurrentCardIndex((prev) => (prev + 1) % suggestions.length);
  };

  const prevCard = () => {
    setCurrentCardIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleWishlist = (id: number) => {
    setWishlist(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return "text-accent";
    if (confidence >= 80) return "text-primary";
    if (confidence >= 70) return "text-warning";
    return "text-muted-foreground";
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
            <h1 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              AI-Powered Suggestions
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Personalized event recommendations powered by artificial intelligence
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Suggestion Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="glass-card overflow-hidden">
              <div className="relative">
                {/* AI Badge */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-gradient-to-r from-primary/20 to-secondary/20 text-white border-white/20">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Recommended
                  </Badge>
                </div>

                {/* Confidence Score */}
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center space-x-2 glass-card px-3 py-1 rounded-full">
                    <Target className="w-4 h-4 text-accent" />
                    <span className={`text-sm font-semibold ${getConfidenceColor(currentSuggestion.confidence)}`}>
                      {currentSuggestion.confidence}% match
                    </span>
                  </div>
                </div>

                {/* Event Image */}
                <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent"></div>
                  <currentSuggestion.icon className="w-16 h-16 text-primary/50" />
                </div>

                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Event Info */}
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <currentSuggestion.icon className={`w-6 h-6 ${currentSuggestion.color}`} />
                        <Badge variant="outline" className="border-primary/30 text-primary">
                          {currentSuggestion.category}
                        </Badge>
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{currentSuggestion.title}</h2>
                      <p className="text-muted-foreground">{currentSuggestion.description}</p>
                    </div>

                    {/* AI Reason */}
                    <div className="p-4 glass rounded-lg border border-primary/20">
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-primary">Why we recommend this:</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{currentSuggestion.reason}</p>
                    </div>

                    {/* Event Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{currentSuggestion.date}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />
                        <span>{currentSuggestion.time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{currentSuggestion.location}</span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {currentSuggestion.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="border-primary/30 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {currentSuggestion.attendees} attending
                        </span>
                        <span className="font-semibold text-foreground">{currentSuggestion.price}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                        <Zap className="w-4 h-4 mr-2" />
                        Join Event
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleFavorite(currentSuggestion.id)}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(currentSuggestion.id) ? 'fill-accent text-accent' : ''}`} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toggleWishlist(currentSuggestion.id)}
                      >
                        <Bookmark className={`w-4 h-4 ${wishlist.has(currentSuggestion.id) ? 'fill-warning text-warning' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button variant="outline" onClick={prevCard}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex space-x-2">
                {suggestions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentCardIndex ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              <Button variant="outline" onClick={nextCard}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Trending Tags */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-accent" />
                  Trending Interests
                </CardTitle>
                <CardDescription>Based on your activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {trendingTags.map((tag, index) => (
                    <motion.div
                      key={tag.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-2 glass rounded-lg hover-lift cursor-pointer"
                    >
                      <span className="text-sm font-medium">{tag.name}</span>
                      <Badge className={tag.color}>
                        {tag.count}
                      </Badge>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full">
                  <Filter className="w-4 h-4 mr-2" />
                  Refine Suggestions
                </Button>
                <Button variant="outline" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Events
                </Button>
                <Button variant="outline" className="w-full">
                  <Award className="w-4 h-4 mr-2" />
                  View Wishlist
                </Button>
              </CardContent>
            </Card>

            {/* AI Insights */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-primary" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 glass rounded-lg">
                    <div className="text-sm font-semibold text-accent mb-1">Event Diversity</div>
                    <div className="text-xs text-muted-foreground">You attend 60% tech events</div>
                  </div>
                  <div className="p-3 glass rounded-lg">
                    <div className="text-sm font-semibold text-primary mb-1">Time Preference</div>
                    <div className="text-xs text-muted-foreground">You prefer evening events</div>
                  </div>
                  <div className="p-3 glass rounded-lg">
                    <div className="text-sm font-semibold text-secondary mb-1">Social Activity</div>
                    <div className="text-xs text-muted-foreground">You attend 3 events per month</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
