import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/premium-button';
import { Menu, X, Trophy, BookOpen, Users, Home, BarChart3, LayoutDashboard, Sparkles, MessageSquare } from 'lucide-react';
import hapLogo from '../assets/hap-logo-3.png';
import HapLogo from '../assets/hap-logo.png';
import { authAPI } from '@/lib/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
      setUsername(null);
      return;
    }
    (async () => {
      try {
        const prof = await authAPI.getProfile();
        if (!mounted) return;
        const user = prof?.user || prof?.data || prof;
        setIsAuthenticated(true);
        setUsername(user?.username || null);
      } catch {
        if (!mounted) return;
        setIsAuthenticated(false);
        setUsername(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUsername(null);
    if (isMenuOpen) setIsMenuOpen(false);
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Features', path: '/features', icon: BookOpen },
    { name: 'Subjects', path: '/subjects', icon: Users },
    { name: 'Community', path: '/community', icon: MessageSquare },
    { name: 'Gamification', path: '/gamification', icon: Trophy },
  ];

  return (
    <header className="w-full flex items-center justify-between px-8 py-4 glass-effect circuit-pattern fixed top-0 left-0 z-50">
      {/* Logo section - left aligned, first image zoomed and slightly up */}
      <div className="flex items-center">
        <img
          src={hapLogo}
          alt="Hap Logo"
          className="h-24 w-24 object-contain scale-90 -mt-4"
          style={{ objectFit: "contain" }}
        />
        <img
          src={HapLogo}
          alt="Hap Logo 3"
          className="h-20 w-15 object-contain -ml-5"
          style={{ objectFit: "contain", marginLeft: '-18px' }}
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-8">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? 'text-primary bg-primary/10 glow-effect'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthenticated ? (
          <>
            <span className="text-sm text-muted-foreground mr-2 hidden lg:inline">
              {username ? `Hi, ${username}` : 'Signed in'}
            </span>
            <Link to="/">
              <PremiumButton variant="glass" className="flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </PremiumButton>
            </Link>
            <PremiumButton onClick={handleLogout} variant="glow">
              Logout
            </PremiumButton>
          </>
        ) : (
          <>
            <Link to="/login">
              <PremiumButton variant="ghost">
                Log In
              </PremiumButton>
            </Link>
            <Link to="/signup">
              <PremiumButton variant="premium">
                <Sparkles className="w-4 h-4" />
                Sign Up
              </PremiumButton>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <Button
        variant="outline"
        size="sm"
        className="md:hidden"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden card-gradient border-t border-border/20">
          <div className="container mx-auto px-4 py-6 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10 glow-effect'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            ))}
            
            <div className="pt-4 space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/" onClick={() => setIsMenuOpen(false)}>
                    <PremiumButton 
                      variant="glass" 
                      className="w-full flex items-center justify-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </PremiumButton>
                  </Link>
                  <PremiumButton 
                    variant="glow"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Logout
                  </PremiumButton>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <PremiumButton 
                      variant="ghost" 
                      className="w-full"
                    >
                      Log In
                    </PremiumButton>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <PremiumButton 
                      variant="premium"
                      className="w-full"
                    >
                      <Sparkles className="w-4 h-4" />
                      Sign Up
                    </PremiumButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
