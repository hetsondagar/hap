import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Trophy, Zap } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const HeroSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Discover Events",
      description: "Find amazing events near you"
    },
    {
      icon: Trophy,
      title: "Earn Points",
      description: "Get rewarded for attending"
    },
    {
      icon: Calendar,
      title: "Track Progress",
      description: "Monitor your event journey"
    },
    {
      icon: Zap,
      title: "Unlock Badges",
      description: "Achieve milestone rewards"
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Youth enjoying events with gamification elements"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/80 via-background/60 to-background/80"></div>
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 glass-card w-20 h-20 flex items-center justify-center animate-float">
        <Trophy className="w-8 h-8 text-accent animate-glow" />
      </div>
      <div className="absolute top-32 right-16 glass-card w-24 h-12 flex items-center justify-center animate-float" style={{ animationDelay: '1s' }}>
        <span className="text-sm font-bold text-primary">+50 XP</span>
      </div>
      <div className="absolute bottom-32 left-20 glass-card w-16 h-16 flex items-center justify-center animate-float" style={{ animationDelay: '2s' }}>
        <Zap className="w-6 h-6 text-warning" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-gaming font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-glow">
              HAP
            </h1>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              Make it Happen
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover amazing cultural, social, and sports events while earning points, 
              unlocking achievements, and competing with friends. Turn every experience into an adventure.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:opacity-90 border-none text-white text-lg px-8 py-4 h-auto font-semibold hover-lift"
            >
              <MapPin className="w-5 h-5 mr-2" />
              Discover Events
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="glass border-primary/50 text-foreground text-lg px-8 py-4 h-auto font-semibold hover-lift hover:bg-primary/10"
            >
              <Zap className="w-5 h-5 mr-2" />
              Host an Event
            </Button>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={feature.title}
                  className="glass-card text-center hover-lift"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto mt-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent">50K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary">1000+</div>
              <div className="text-muted-foreground">Events Monthly</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-secondary">500+</div>
              <div className="text-muted-foreground">Cities</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;