import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Star, Calendar, Users, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const featuredEvents = [
    {
      title: "Stand-up Comedy Night with Mike Chen",
      category: "comedy" as const,
      date: "Dec 15, 8:00 PM",
      location: "Comedy Club Downtown",
      price: "$25",
      rating: 4.8,
      attendees: 156,
      points: 50
    },
    {
      title: "Inception: Director's Cut Screening", 
      category: "movie" as const,
      date: "Dec 16, 7:30 PM",
      location: "Grand Cinema",
      price: "$15",
      rating: 4.9,
      attendees: 203,
      points: 30
    },
    {
      title: "Jazz Under the Stars",
      category: "music" as const,
      date: "Dec 20, 9:00 PM",
      location: "Rooftop Lounge",
      price: "$35",
      rating: 4.6,
      attendees: 124,
      points: 60
    }
  ];

  const categories = [
    { name: "Comedy", icon: "😂", count: 12, color: "bg-comedy-orange" },
    { name: "Movies", icon: "🎬", count: 8, color: "bg-movie-blue" },
    { name: "Drama", icon: "🎭", count: 6, color: "bg-drama-red" },
    { name: "Music", icon: "🎵", count: 10, color: "bg-music-green" },
    { name: "Art", icon: "🎨", count: 6, color: "bg-primary" }
  ];

  const stats = [
    { icon: Calendar, label: "Active Events", value: "500+" },
    { icon: Users, label: "Happy Users", value: "25K+" },
    { icon: TrendingUp, label: "Cities", value: "50+" },
    { icon: Star, label: "Points Earned", value: "2M+" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div 
          className="bg-cover bg-center bg-no-repeat min-h-[600px] flex items-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/70 to-transparent"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    HAP
                  </h1>
                  <p className="text-lg text-muted-foreground font-medium">make it happen!</p>
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Discover Events, <br />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Earn Points, Live Life
                </span>
              </h2>
              
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                Join the gamified event platform that rewards you for exploring your city. 
                From comedy shows to art galleries - every experience earns points!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/events">
                    Explore Events
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                  <Link to="/about">Learn How It Works</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold mb-4">Explore Event Categories</h3>
            <p className="text-xl text-muted-foreground">
              Find your passion and earn points for every new experience
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${category.color} flex items-center justify-center text-white text-2xl`}>
                    {category.icon}
                  </div>
                  <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">{category.name}</h4>
                  <Badge variant="outline">{category.count} events</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Featured Events */}
      <div className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-3xl font-bold mb-4">Featured Events</h3>
              <p className="text-xl text-muted-foreground">
                Trending events this week - don't miss out!
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/events">View All Events</Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold mb-6">
            Ready to Start Your Adventure?
          </h3>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Join thousands of people who are already earning points and building amazing memories. 
            Your next experience is waiting!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/profile">View My Profile</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
              <Link to="/events">Browse Events</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
