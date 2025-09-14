import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin, Trophy, Gift, Users } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Discover", href: "#discover", icon: MapPin },
    { name: "Leaderboard", href: "#leaderboard", icon: Trophy },
    { name: "Rewards", href: "#rewards", icon: Gift },
    { name: "Community", href: "#community", icon: Users },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-2xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent">
              HAP
            </h1>
            <span className="ml-2 text-sm text-muted-foreground hidden sm:block">
              Make it Happen
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 group-hover:text-primary transition-colors" />
                  <span>{item.name}</span>
                </a>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              Login
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-primary hover:opacity-90 border-none text-white"
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-foreground/80 hover:text-foreground transition-colors duration-200 px-2 py-1"
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </a>
                );
              })}
              <div className="flex flex-col space-y-2 pt-4 border-t border-white/10">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
                <Button 
                  size="sm" 
                  className="bg-gradient-primary hover:opacity-90 border-none text-white"
                >
                  Sign Up
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;