import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Trophy, BookOpen, Users, Home } from 'lucide-react';
import HapLogo from '@/assets/hap-logo-3.png';
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
    { name: 'Departments', path: '/departments', icon: Users },
    { name: 'Gamification', path: '/gamification', icon: Trophy },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 card-gradient border-b border-border/20">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <img src={HapLogo} alt="Hap Logo" className="w-8 h-8 object-contain" />
          <span className="text-2xl font-display font-bold gradient-text">
            hap
          </span>
        </Link>

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
              <Link to="/analytics">
                <Button variant="outline" className="border-primary/20 hover:border-primary">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={handleLogout} className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to = "/login">
                <Button variant="outline" className="border-primary/20 hover:border-primary">
                  Log In
                </Button>
              </Link>
              <Link to = "/signup">
                <Button className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow">
                  Sign Up
                </Button>
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
      </nav>

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
                  <Link to="/analytics" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/20 hover:border-primary"
                    >
                      Dashboard
                    </Button>
                  </Link>
                  <Button 
                    className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-primary/20 hover:border-primary"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow"
                    >
                      Sign Up
                    </Button>
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