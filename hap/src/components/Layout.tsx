import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Zap, User, Calendar, Info } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/20 bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  HAP
                </span>
                <p className="text-xs text-muted-foreground -mt-1">make it happen!</p>
              </div>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex space-x-1">
              <Button
                variant={isActive("/") ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/">Home</Link>
              </Button>
              <Button
                variant={isActive("/events") ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/events" className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Events</span>
                </Link>
              </Button>
              <Button
                variant={isActive("/profile") ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/profile" className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </Link>
              </Button>
              <Button
                variant={isActive("/about") ? "default" : "ghost"}
                asChild
                size="sm"
              >
                <Link to="/about" className="flex items-center space-x-1">
                  <Info className="w-4 h-4" />
                  <span>About</span>
                </Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border/20 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                HAP
              </span>
            </div>
            <p className="text-sm text-muted-foreground">make it happen! • Discover events, earn points, live life.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;