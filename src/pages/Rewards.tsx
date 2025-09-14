import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Gift, 
  Star, 
  Zap, 
  Crown, 
  Coffee, 
  Ticket, 
  ShoppingBag,
  Search,
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingCart,
  Heart,
  Share2,
  TrendingUp,
  Award,
  Target
} from "lucide-react";

const Rewards = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Mock data
  const userPoints = 1250;

  const categories = [
    { id: "all", name: "All", icon: Gift },
    { id: "food", name: "Food & Drinks", icon: Coffee },
    { id: "tickets", name: "Event Tickets", icon: Ticket },
    { id: "merchandise", name: "Merchandise", icon: ShoppingBag },
    { id: "premium", name: "Premium", icon: Crown }
  ];

  const rewards = [
    {
      id: 1,
      name: "Free Coffee",
      description: "Get a free coffee at any partner café",
      cost: 100,
      category: "food",
      image: "/placeholder.svg",
      available: true,
      popular: true,
      partner: "Starbucks",
      expiry: "30 days"
    },
    {
      id: 2,
      name: "Concert Ticket",
      description: "VIP ticket to the next big concert",
      cost: 500,
      category: "tickets",
      image: "/placeholder.svg",
      available: true,
      popular: false,
      partner: "Live Nation",
      expiry: "7 days"
    },
    {
      id: 3,
      name: "HAP T-Shirt",
      description: "Exclusive HAP branded t-shirt",
      cost: 300,
      category: "merchandise",
      image: "/placeholder.svg",
      available: true,
      popular: true,
      partner: "HAP Store",
      expiry: "14 days"
    },
    {
      id: 4,
      name: "Premium Badge",
      description: "Unlock premium features for 1 month",
      cost: 800,
      category: "premium",
      image: "/placeholder.svg",
      available: true,
      popular: false,
      partner: "HAP",
      expiry: "30 days"
    },
    {
      id: 5,
      name: "Movie Tickets",
      description: "2 tickets to any movie",
      cost: 200,
      category: "tickets",
      image: "/placeholder.svg",
      available: false,
      popular: false,
      partner: "AMC Theaters",
      expiry: "7 days"
    },
    {
      id: 6,
      name: "Gaming Headset",
      description: "High-quality gaming headset",
      cost: 1200,
      category: "merchandise",
      image: "/placeholder.svg",
      available: true,
      popular: true,
      partner: "Tech Store",
      expiry: "60 days"
    }
  ];

  const filteredRewards = rewards.filter(reward => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || reward.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.icon : Gift;
  };

  const getRarityColor = (cost: number) => {
    if (cost <= 200) return "border-gray-500";
    if (cost <= 500) return "border-blue-500";
    if (cost <= 800) return "border-purple-500";
    return "border-yellow-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-5xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Rewards Marketplace
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
              Redeem your hard-earned points for amazing rewards and exclusive perks!
            </p>
            
            {/* Points Display */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 glass-card px-6 py-3"
            >
              <Zap className="w-6 h-6 text-accent" />
              <span className="text-2xl font-bold text-accent">{userPoints}</span>
              <span className="text-muted-foreground">Points Available</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row items-center justify-between mb-8 space-y-4 md:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search rewards..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={selectedCategory === category.id ? "bg-gradient-primary" : ""}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Rewards Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredRewards.map((reward, index) => {
            const CategoryIcon = getCategoryIcon(reward.category);
            const canAfford = userPoints >= reward.cost;
            
            return (
              <motion.div
                key={reward.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <Card className={`glass-card hover-lift overflow-hidden ${
                  !reward.available ? 'opacity-50' : ''
                } ${getRarityColor(reward.cost)} border-2`}>
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center relative">
                    <CategoryIcon className="w-16 h-16 text-primary/50" />
                    
                    {/* Popular Badge */}
                    {reward.popular && (
                      <Badge className="absolute top-3 left-3 bg-accent/20 text-accent border-accent/30">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    
                    {/* Availability Badge */}
                    <div className="absolute top-3 right-3">
                      {reward.available ? (
                        <CheckCircle className="w-6 h-6 text-accent" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive" />
                      )}
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <h3 className="font-bold text-lg mb-2">{reward.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{reward.description}</p>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Partner: {reward.partner}</span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {reward.expiry}
                          </span>
                        </div>
                      </div>

                      {/* Cost */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Zap className="w-5 h-5 text-accent" />
                          <span className="text-2xl font-bold text-accent">{reward.cost}</span>
                          <span className="text-sm text-muted-foreground">points</span>
                        </div>
                        
                        {!canAfford && reward.available && (
                          <Badge variant="outline" className="text-warning border-warning/30">
                            Need {reward.cost - userPoints} more
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button 
                          className={`flex-1 ${
                            reward.available && canAfford 
                              ? 'bg-gradient-primary hover:opacity-90' 
                              : 'bg-muted/20 text-muted-foreground'
                          }`}
                          disabled={!reward.available || !canAfford}
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          {reward.available ? 'Redeem' : 'Unavailable'}
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4" />
                        </Button>
                        
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* How to Earn Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-6 h-6 mr-2 text-primary" />
                How to Earn Points
              </CardTitle>
              <CardDescription>Ways to accumulate points for amazing rewards</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { action: "Attend Event", points: "+50", icon: Star, description: "Join any event" },
                  { action: "Complete Profile", points: "+100", icon: Award, description: "Fill out your profile" },
                  { action: "Invite Friends", points: "+200", icon: Zap, description: "Bring friends to HAP" },
                  { action: "Write Review", points: "+25", icon: Gift, description: "Share your experience" }
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={item.action}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="text-center p-4 glass rounded-lg hover-lift"
                    >
                      <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                      <h4 className="font-semibold mb-2">{item.action}</h4>
                      <div className="text-2xl font-bold text-accent mb-2">{item.points}</div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Rewards;
