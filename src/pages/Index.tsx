import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import EventsGrid from "@/components/EventsGrid";
import GamificationPanel from "@/components/GamificationPanel";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        <HeroSection />
        
        <section id="discover" className="py-16">
          <EventsGrid />
        </section>
        
        <section id="leaderboard" className="py-16 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Your Gaming Profile
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Track your progress, earn rewards, and compete with friends
              </p>
            </div>
            <div className="max-w-4xl mx-auto">
              <GamificationPanel />
            </div>
          </div>
        </section>
        
        <footer className="py-16 border-t border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent">
                  HAP
                </h3>
                <p className="text-muted-foreground">
                  Make it Happen - The gamified event discovery platform for youth.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Discover</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Events</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Categories</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Locations</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Gaming</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Leaderboard</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Achievements</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Rewards</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-foreground mb-4">Community</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-foreground transition-colors">Friends</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Groups</a></li>
                  <li><a href="#" className="hover:text-foreground transition-colors">Support</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-border/50 mt-12 pt-8 text-center text-muted-foreground">
              <p>&copy; 2024 HAP. All rights reserved. Make it Happen.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
