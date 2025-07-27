import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Star, Users, Calendar, Gift, TrendingUp } from "lucide-react";

const About = () => {
  const features = [
    {
      icon: Calendar,
      title: "Discover Events",
      description: "Find amazing events across comedy, movies, drama, music, and art in your city."
    },
    {
      icon: Star,
      title: "Earn Points",
      description: "Get rewarded for every event you attend. More unique events = more points!"
    },
    {
      icon: TrendingUp,
      title: "Level Up",
      description: "Progress through levels and unlock exclusive achievements and rewards."
    },
    {
      icon: Users,
      title: "Build Community",
      description: "Connect with like-minded people who love experiencing new things."
    },
    {
      icon: Gift,
      title: "Redeem Rewards",
      description: "Use your points for discounts, exclusive events, and special perks."
    },
    {
      icon: Zap,
      title: "Get Active",
      description: "Break out of your routine and make every day an adventure."
    }
  ];

  const stats = [
    { label: "Events Hosted", value: "10K+" },
    { label: "Active Users", value: "25K+" },
    { label: "Cities", value: "50+" },
    { label: "Points Earned", value: "2M+" }
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              HAP
            </h1>
          </div>
          <h2 className="text-3xl font-bold mb-4">make it happen!</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            HAP is the gamified event discovery platform that rewards you for living life to the fullest. 
            Discover amazing events, earn points for every experience, and level up your social life!
          </p>
        </div>

        {/* Mission */}
        <div className="bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-2xl p-8 mb-16">
          <div className="text-center max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We believe life is meant to be experienced, not just lived. HAP encourages you to step out of your comfort zone, 
              try new things, and build meaningful connections through shared experiences. Every event you attend makes you more 
              cultured, more social, and more alive.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features */}
        <div className="mb-16">
          <h3 className="text-3xl font-bold text-center mb-12">How HAP Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 flex items-center justify-center">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How Points Work */}
        <div className="bg-gradient-to-r from-points-gold/10 to-primary/10 rounded-2xl p-8 mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-8">How Points Work</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-comedy-orange flex items-center justify-center">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h4 className="font-semibold mb-2">Attend Events</h4>
                <p className="text-sm text-muted-foreground">Check in to events to earn base points</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-movie-blue flex items-center justify-center">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h4 className="font-semibold mb-2">Try New Things</h4>
                <p className="text-sm text-muted-foreground">Bonus points for different event categories</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-music-green flex items-center justify-center">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h4 className="font-semibold mb-2">Level Up</h4>
                <p className="text-sm text-muted-foreground">Unlock achievements and exclusive rewards</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-4">Ready to Start Your Adventure?</h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of adventurous people who are already making every day count. 
            Your next amazing experience is just a click away!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Browse Events
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;