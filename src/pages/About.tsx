import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Target, 
  Eye, 
  Users, 
  Mail, 
  MapPin, 
  Phone,
  Zap,
  Trophy,
  Star,
  Heart,
  Globe,
  MessageCircle,
  Send,
  Linkedin,
  Twitter,
  Instagram,
  Github,
  Award,
  Lightbulb,
  Shield,
  Rocket
} from "lucide-react";

const About = () => {
  const team = [
    {
      name: "Alex Chen",
      role: "CEO & Founder",
      avatar: "/placeholder.svg",
      bio: "Passionate about connecting people through technology and experiences.",
      social: { linkedin: "#", twitter: "#" }
    },
    {
      name: "Sarah Kim",
      role: "CTO",
      avatar: "/placeholder.svg",
      bio: "Tech enthusiast with 10+ years in full-stack development and AI.",
      social: { github: "#", linkedin: "#" }
    },
    {
      name: "Mike Johnson",
      role: "Head of Design",
      avatar: "/placeholder.svg",
      bio: "Creative director focused on user experience and visual storytelling.",
      social: { instagram: "#", twitter: "#" }
    },
    {
      name: "Emma Wilson",
      role: "Community Manager",
      avatar: "/placeholder.svg",
      bio: "Building vibrant communities and fostering meaningful connections.",
      social: { twitter: "#", linkedin: "#" }
    }
  ];

  const values = [
    {
      icon: Heart,
      title: "Community First",
      description: "We believe in the power of community and human connections."
    },
    {
      icon: Zap,
      title: "Innovation",
      description: "Constantly pushing boundaries with cutting-edge technology."
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Creating safe spaces for authentic experiences and connections."
    },
    {
      icon: Globe,
      title: "Inclusivity",
      description: "Everyone deserves to discover amazing events and make memories."
    }
  ];

  const stats = [
    { number: "50K+", label: "Active Users", icon: Users },
    { number: "1000+", label: "Events Monthly", icon: Trophy },
    { number: "500+", label: "Cities Worldwide", icon: MapPin },
    { number: "98%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative py-20 pt-32 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-6xl md:text-8xl font-gaming font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6">
              HAP
            </h1>
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Make it Happen
            </h2>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing how young people discover, attend, and engage with events. 
              Through gamification and community, we're turning every experience into an adventure.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission & Vision */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20"
        >
          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Target className="w-8 h-8 mr-3 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To empower young people to discover amazing events, build meaningful connections, 
                and create unforgettable memories. We believe that every experience should be 
                rewarding, social, and fun.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card hover-lift">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Eye className="w-8 h-8 mr-3 text-secondary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To become the world's leading platform for youth event discovery, where every 
                interaction is gamified, every connection matters, and every experience 
                contributes to personal growth and community building.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="glass-card hover-lift text-center">
                <CardContent className="p-8">
                  <Icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <div className="text-4xl font-bold text-foreground mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            );
          })}
        </motion.div>

        {/* Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Our Values
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="glass-card hover-lift text-center h-full">
                    <CardContent className="p-8">
                      <Icon className="w-12 h-12 text-accent mx-auto mb-6" />
                      <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                      <p className="text-muted-foreground">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The passionate people behind HAP
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
              >
                <Card className="glass-card hover-lift text-center">
                  <CardContent className="p-8">
                    <Avatar className="w-24 h-24 mx-auto mb-6 border-4 border-primary/20">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                    <Badge className="mb-4 bg-primary/20 text-primary border-primary/30">
                      {member.role}
                    </Badge>
                    <p className="text-muted-foreground mb-6">{member.bio}</p>
                    <div className="flex justify-center space-x-3">
                      {member.social.linkedin && (
                        <Button size="sm" variant="ghost">
                          <Linkedin className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.twitter && (
                        <Button size="sm" variant="ghost">
                          <Twitter className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.github && (
                        <Button size="sm" variant="ghost">
                          <Github className="w-4 h-4" />
                        </Button>
                      )}
                      {member.social.instagram && (
                        <Button size="sm" variant="ghost">
                          <Instagram className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h2 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Get in Touch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions or want to collaborate? We'd love to hear from you!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-6 h-6 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Name</label>
                    <input 
                      type="text" 
                      placeholder="Your name" 
                      className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email</label>
                    <input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Subject</label>
                  <input 
                    type="text" 
                    placeholder="How can we help?" 
                    className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Message</label>
                  <textarea 
                    placeholder="Tell us more..." 
                    rows={4}
                    className="w-full px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none resize-none"
                  />
                </div>
                <Button className="w-full bg-gradient-primary hover:opacity-90">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Mail className="w-6 h-6 mr-2" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <span>hello@hap.com</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-primary" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-primary" />
                    <span>San Francisco, CA</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Rocket className="w-6 h-6 mr-2" />
                    Follow Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      <Twitter className="w-4 h-4 mr-2" />
                      Twitter
                    </Button>
                    <Button variant="outline" size="sm">
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </Button>
                    <Button variant="outline" size="sm">
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
