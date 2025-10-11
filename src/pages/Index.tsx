import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { PremiumButton } from '@/components/ui/premium-button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Brain,
  Users,
  Trophy,
  BarChart3,
  Zap,
  Clock,
  Target,
  CheckCircle2,
  Star,
  BookOpen,
  Shuffle,
  TrendingUp,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { authAPI } from '@/lib/api';
import heroImage from '@/assets/hero-flashcards.jpg';

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) { setIsAuthenticated(false); return; }
        await authAPI.getProfile();
        if (!mounted) return;
        setIsAuthenticated(true);
      } catch {
        if (!mounted) return;
        setIsAuthenticated(false);
      }
    })();
    return () => { mounted = false; };
  }, []);
  const features = [
    {
      icon: Brain,
      title: "Smart Flashcard Creation",
      description: "Create interactive Q&A flashcards with rich formatting for maximum learning efficiency.",
      gradient: "from-blue-500 to-purple-600",
      link: "/flashcards", // ✅ direct page
    },
    {
      icon: Users,
      title: "Community Sharing",
      description: "Share your decks publicly or keep them private. Follow creators and discover trending content.",
      gradient: "from-purple-500 to-pink-600",
      link: "/community", // ✅ direct page
    },
    {
      icon: Shuffle,
      title: "Interactive Quiz Mode",
      description: "Test yourself with dynamic quizzes that track your progress and accuracy automatically.",
      gradient: "from-green-500 to-blue-600",
      link: "/quiz", // ✅ direct page
    },
    {
      icon: BarChart3,
      title: "Study Analytics",
      description: "Comprehensive insights into your learning journey with detailed progress tracking.",
      gradient: "from-orange-500 to-red-600",
      link: "/analytics", // ✅ direct page
    }
  ];

  const departments = [
    { name: 'Computer Science & Engineering', count: '2.4k decks', popular: true, link: '/departments#cse' },
    { name: 'Mechanical Engineering', count: '1.8k decks', popular: false, link: '/departments#mech' },
    { name: 'Electrical Engineering', count: '1.6k decks', popular: false, link: '/departments#eee' },
    { name: 'Chemical Engineering', count: '980 decks', popular: false, link: '/departments#chem' },
    { name: 'Civil Engineering', count: '1.3k decks', popular: false, link: '/departments#civil' },
    { name: 'Other Engineering', count: '760 decks', popular: false, link: '/departments#other' }
  ];

  const gamificationFeatures = [
    { icon: Trophy, title: 'XP & Levels', description: 'Earn XP and unlock new levels' },
    { icon: Award, title: 'Achievements', description: 'Unlock badges and trophies' },
    { icon: Target, title: 'Streaks', description: 'Maintain daily learning streaks' },
    { icon: TrendingUp, title: 'Leaderboards', description: 'Compete with other learners' }
  ];

  const stats = [
    { number: '60K+', label: 'Active Students' },
    { number: '9K+', label: 'Flashcard Decks' },
    { number: '6', label: 'Engineering Depts' },
    { number: '4.6★', label: 'Average Rating' }
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        {/* Techy background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-slide-in-left space-y-6">
              <Badge className="mb-2 bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border-primary/20 hover-glow inline-flex items-center gap-2">
                <Zap className="w-3 h-3" />
                Gamified Learning Platform
              </Badge>
              
              <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight">
                <span className="text-foreground">Master</span>
                <br />
                <span className="gradient-text-engineering">engineering</span>
                <br />
                <span className="text-foreground">with Smart</span>
                <br />
                <span className="text-foreground">flashcards</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-lg">
                Create, share, and study with bite-sized flashcard decks. Join <span className="text-primary font-semibold">60K+</span> engineering students using hap.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {isAuthenticated ? (
                  <Link to="/analytics">
                    <PremiumButton size="xl" variant="premium" className="group">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </PremiumButton>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <PremiumButton size="xl" variant="premium" className="group">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </PremiumButton>
                  </Link>
                )}
                <Link to="/features">
                  <PremiumButton size="xl" variant="glass">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Explore Features
                  </PremiumButton>
                </Link>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Join 60K+ students</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Hero Image */}
            <div className="animate-slide-in-right relative">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img 
                  src={heroImage} 
                  alt="Interactive flashcards floating in digital space"
                  className="relative w-full rounded-2xl shadow-2xl hover-lift border-2 border-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="glass-effect circuit-pattern p-12 hover-lift border-2 border-white/10 animate-scale-in">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className="text-center group cursor-default"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-5xl md:text-6xl font-bold gradient-text mb-3 group-hover:scale-110 transition-transform duration-300">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground text-sm md:text-base font-medium">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">
              <Star className="w-3 h-3 mr-1" />
              Premium Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Everything You Need to <span className="gradient-text">Excel</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Powerful features designed specifically for engineering students to make learning efficient and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Link 
                key={index} 
                to={feature.link} 
                className="block animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <Card className="glass-effect circuit-pattern p-8 group cursor-pointer hover-lift border-2 border-white/10 h-full">
                  <div className="flex items-start space-x-6">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                      <feature.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-display font-bold mb-3 group-hover:gradient-text transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed text-base">
                        {feature.description}
                      </p>
                      <div className="mt-4 flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <span className="text-sm font-semibold">Learn more</span>
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/features">
              <PremiumButton variant="outline" size="lg" className="group">
                Explore All Features
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </PremiumButton>
            </Link>
          </div>
        </div>
      </section>

      {/* ... rest of your code remains the same (departments, gamification, exam phases, CTA, footer) ... */}
    </div>
  );
};

export default Index;
