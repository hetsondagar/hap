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

      {/* Problem We Solve */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <Card className="glass-effect p-8 border-2 border-white/10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">The Problem</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Engineering students juggle dense syllabi, scattered notes, and last‑minute revisions. Traditional study methods make it hard to recall key concepts quickly, track progress, or collaborate with peers in a meaningful way.
              </p>
              <ul className="mt-6 space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Hard to organize topic-wise content by department and year</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> No quick self‑test to find weak areas</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-secondary" /> Little visibility into progress and consistency</li>
              </ul>
            </Card>

            <Card className="glass-effect p-8 border-2 border-white/10">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Our Solution</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                hap makes studying fast and focused with smart flashcards, interactive quizzes, analytics, and a supportive community—built specifically for your department and year.
              </p>
              <div className="grid sm:grid-cols-2 gap-3 mt-6">
                <Badge className="badge-glow">Create flashcards</Badge>
                <Badge className="badge-glow">Quiz yourself</Badge>
                <Badge className="badge-glow">Track analytics</Badge>
                <Badge className="badge-glow">Earn achievements</Badge>
                <Badge className="badge-glow">Share decks</Badge>
                <Badge className="badge-glow">Discuss doubts</Badge>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold">How it works</h2>
            <p className="text-muted-foreground mt-2">Only what exists in hap today</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="glass-effect p-6 border-2 border-white/10">
              <h3 className="text-xl font-semibold mb-2">1) Sign up and set profile</h3>
              <p className="text-muted-foreground">Choose your department and year. This personalizes subjects and content.</p>
            </Card>
            <Card className="glass-effect p-6 border-2 border-white/10">
              <h3 className="text-xl font-semibold mb-2">2) Create flashcards</h3>
              <p className="text-muted-foreground">Add question/answer cards by subject with difficulty. Auto-fills dept/year.</p>
            </Card>
            <Card className="glass-effect p-6 border-2 border-white/10">
              <h3 className="text-xl font-semibold mb-2">3) Take quizzes</h3>
              <p className="text-muted-foreground">Timed MCQ quizzes per subject with instant results and XP.</p>
            </Card>
            <Card className="glass-effect p-6 border-2 border-white/10">
              <h3 className="text-xl font-semibold mb-2">4) Track analytics</h3>
              <p className="text-muted-foreground">Weekly study hours, streaks, quiz scores, and topic coverage.</p>
            </Card>
            <Card className="glass-effect p-6 border-2 border-white/10">
              <h3 className="text-xl font-semibold mb-2">5) Earn achievements</h3>
              <p className="text-muted-foreground">Badges, levels, and leaderboards to keep you motivated.</p>
            </Card>
            <Card className="glass-effect p-6 border-2 border-white/10">
              <h3 className="text-xl font-semibold mb-2">6) Share & discuss</h3>
              <p className="text-muted-foreground">Publish decks, like/comment, and ask questions in the community.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* ... rest of your code remains the same (departments, gamification, exam phases, CTA, footer) ... */}
    </div>
  );
};

export default Index;
