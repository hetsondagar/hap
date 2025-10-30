import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/premium-button';
import { Menu, X, Trophy, BookOpen, Users, Home, BarChart3, LayoutDashboard, Sparkles, MessageSquare } from 'lucide-react';
const MAIN_LOGO = '/logo1.png';
import { authAPI } from '@/lib/api';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Initialize from localStorage immediately (no flicker)
  const token = localStorage.getItem('token');
  const cachedUsername = localStorage.getItem('username');
  const [isAuthenticated, setIsAuthenticated] = useState(!!token);
  const [username, setUsername] = useState<string | null>(cachedUsername);

  useEffect(() => {
    let mounted = true;
    const token = localStorage.getItem('token');
    
    if (!token) {
      setIsAuthenticated(false);
      setUsername(null);
      setIsAuthLoading(false);
      return;
    }
    
    // Token exists, verify it's still valid
    (async () => {
      try {
        const prof = await authAPI.getProfile();
        if (!mounted) return;
        const user = prof?.user || prof?.data || prof;
        setIsAuthenticated(true);
        setUsername(user?.username || null);
        
        // Cache username for instant display next time
        if (user?.username) {
          localStorage.setItem('username', user.username);
        }
      } catch {
        if (!mounted) return;
        // Token is invalid, clear everything
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false);
        setUsername(null);
      } finally {
        if (mounted) {
          setIsAuthLoading(false);
        }
      }
    })();
    
    return () => {
      mounted = false;
    };
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    localStorage.removeItem('userInfo');
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
    <header className="w-full flex items-center justify-between px-8 py-2 glass-effect circuit-pattern fixed top-0 left-0 z-50">
      {/* Logo section - left aligned, compact and centered */}
      <div className="flex items-center">
        <img
          src={MAIN_LOGO}
          alt="HAP"
          className="h-10 w-auto object-contain"
          style={{ objectFit: "contain" }}
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center space-x-6">
        {navItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-all duration-300 ${
              location.pathname === item.path
                ? 'text-primary bg-primary/10 glow-effect'
                : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
            }`}
          >
            <item.icon className="w-4 h-4" />
            <span className="font-medium text-sm">{item.name}</span>
          </Link>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="hidden md:flex items-center space-x-4">
        {isAuthLoading ? (
          <div className="w-48 h-10"></div>
        ) : isAuthenticated ? (
          <>
            <span className="text-sm text-muted-foreground mr-2 hidden lg:inline">
              {username ? `Hi, ${username}` : 'Signed in'}
            </span>
            <Link to="/dashboard">
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
              {isAuthLoading ? (
                <div className="h-32"></div>
              ) : isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
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
      {/* Neon underline */}
      <div className="pointer-events-none absolute left-0 right-0 -bottom-px h-[2px] bg-[linear-gradient(90deg,var(--accent-primary),var(--accent-secondary))] shadow-[0_0_12px_var(--glow)]" />
    </header>
  );
};

export default Header;
