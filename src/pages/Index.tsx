import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
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
import HapLogo from '@/assets/hap-logo-3.png';

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
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="animate-fade-in">
              <div className="flex justify-start mb-4">
                <img src={HapLogo} alt="Hap Logo" className="h-16 w-16 object-contain" />
              </div>
              <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">
                <Zap className="w-3 h-3 mr-1" />
                Gamified Learning Platform
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                <span className="gradient-text">Master Engineering</span>
                <br />
                with Smart Flashcards
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                Create, share, and study with bite-sized flashcard decks. Join thousands of engineering students using hap for quick revision and exam prep.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                {isAuthenticated ? (
                  <Link to="/analytics">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow">
                      Go to Dashboard
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/signup">
                    <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-white font-medium shadow-glow">
                      Get Started Free
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                )}
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
            <div className="animate-slide-up">
              <img 
                src={heroImage} 
                alt="Interactive flashcards floating in digital space"
                className="w-full rounded-2xl shadow-intense glow-effect"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="hero-card p-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Everything You Need to Excel</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed specifically for engineering students to make learning efficient and engaging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Link key={index} to={feature.link} className="block">
                <Card className="hero-card p-8 group cursor-pointer hover:shadow-lg transition">
                  <div className="flex items-start space-x-6">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center glow-effect`}>
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-display font-bold mb-3 group-hover:text-primary transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/features">
              <Button variant="outline" className="border-primary/20 hover:border-primary">
                Explore All Features
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ... rest of your code remains the same (departments, gamification, exam phases, CTA, footer) ... */}
    </div>
  );
};

export default Index;
