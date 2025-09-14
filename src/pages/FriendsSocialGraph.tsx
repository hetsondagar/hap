import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  MapPin,
  Calendar,
  Star,
  Zap,
  Crown,
  Trophy,
  Target,
  Heart,
  MessageCircle,
  Share2,
  Settings,
  Network,
  Link,
  Activity,
  TrendingUp,
  Eye,
  EyeOff
} from "lucide-react";

const FriendsSocialGraph = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConnections, setShowConnections] = useState(true);

  // Mock social graph data
  const user = {
    id: "you",
    name: "You",
    avatar: "/placeholder.svg",
    level: 12,
    eventsAttended: 23,
    friends: 15
  };

  const friends = [
    {
      id: 1,
      name: "Alex Chen",
      avatar: "/placeholder.svg",
      level: 15,
      eventsAttended: 31,
      mutualFriends: 8,
      connections: [2, 3, 4],
      recentEvents: [
        { title: "Tech Meetup", date: "2024-01-15", category: "Technology" },
        { title: "Music Festival", date: "2024-01-10", category: "Music" }
      ],
      status: "online"
    },
    {
      id: 2,
      name: "Sarah Kim",
      avatar: "/placeholder.svg",
      level: 14,
      eventsAttended: 28,
      mutualFriends: 6,
      connections: [1, 3, 5],
      recentEvents: [
        { title: "Art Exhibition", date: "2024-01-12", category: "Art" },
        { title: "Gaming Tournament", date: "2024-01-08", category: "Gaming" }
      ],
      status: "online"
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "/placeholder.svg",
      level: 13,
      eventsAttended: 25,
      mutualFriends: 7,
      connections: [1, 2, 6],
      recentEvents: [
        { title: "Sports Event", date: "2024-01-14", category: "Sports" },
        { title: "Networking Mixer", date: "2024-01-11", category: "Social" }
      ],
      status: "offline"
    },
    {
      id: 4,
      name: "Emma Wilson",
      avatar: "/placeholder.svg",
      level: 11,
      eventsAttended: 19,
      mutualFriends: 4,
      connections: [1, 5],
      recentEvents: [
        { title: "Theater Performance", date: "2024-01-13", category: "Theater" }
      ],
      status: "online"
    },
    {
      id: 5,
      name: "David Lee",
      avatar: "/placeholder.svg",
      level: 10,
      eventsAttended: 16,
      mutualFriends: 3,
      connections: [2, 4, 6],
      recentEvents: [
        { title: "Coffee Meetup", date: "2024-01-09", category: "Social" }
      ],
      status: "offline"
    },
    {
      id: 6,
      name: "Lisa Park",
      avatar: "/placeholder.svg",
      level: 9,
      eventsAttended: 14,
      mutualFriends: 2,
      connections: [3, 5],
      recentEvents: [
        { title: "Food Festival", date: "2024-01-07", category: "Food" }
      ],
      status: "online"
    }
  ];

  const getStatusColor = (status: string) => {
    return status === 'online' ? 'bg-accent' : 'bg-muted-foreground';
  };

  const getLevelColor = (level: number) => {
    if (level >= 15) return 'text-warning';
    if (level >= 12) return 'text-primary';
    if (level >= 9) return 'text-accent';
    return 'text-muted-foreground';
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent">
                Social Graph
              </h1>
              <p className="text-muted-foreground mt-2">Explore your network and connections</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add Friends
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Social Graph Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Network className="w-6 h-6 mr-2 text-primary" />
                    Your Network
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowConnections(!showConnections)}
                  >
                    {showConnections ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <CardDescription>Interactive visualization of your social connections</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-96 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-lg overflow-hidden">
                  {/* Central User Node */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                  >
                    <div className="relative">
                      <Avatar className="w-16 h-16 border-4 border-primary shadow-lg cursor-pointer">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-lg">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                        {user.level}
                      </div>
                    </div>
                  </motion.div>

                  {/* Friend Nodes */}
                  {friends.map((friend, index) => {
                    const angle = (index * 360) / friends.length;
                    const radius = 120;
                    const x = Math.cos((angle * Math.PI) / 180) * radius;
                    const y = Math.sin((angle * Math.PI) / 180) * radius;
                    
                    return (
                      <motion.div
                        key={friend.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                        }}
                      >
                        <div className="relative">
                          <Avatar 
                            className={`w-12 h-12 border-2 border-white/20 shadow-lg cursor-pointer hover:scale-110 transition-transform ${
                              selectedUser?.id === friend.id ? 'ring-2 ring-primary' : ''
                            }`}
                            onClick={() => setSelectedUser(selectedUser?.id === friend.id ? null : friend)}
                          >
                            <AvatarImage src={friend.avatar} />
                            <AvatarFallback>{friend.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                          <div className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-xs">
                            {friend.level}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}

                  {/* Connection Lines */}
                  {showConnections && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                      {friends.map((friend, index) => {
                        const angle = (index * 360) / friends.length;
                        const radius = 120;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                        
                        return (
                          <motion.line
                            key={`line-${friend.id}`}
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                            x1="50%"
                            y1="50%"
                            x2={`calc(50% + ${x}px)`}
                            y2={`calc(50% + ${y}px)`}
                            stroke="hsl(var(--primary))"
                            strokeWidth="2"
                            strokeOpacity="0.3"
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>

                {/* Network Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 glass rounded-lg">
                    <div className="text-2xl font-bold text-primary">{user.friends}</div>
                    <div className="text-sm text-muted-foreground">Total Friends</div>
                  </div>
                  <div className="text-center p-4 glass rounded-lg">
                    <div className="text-2xl font-bold text-accent">12</div>
                    <div className="text-sm text-muted-foreground">Mutual Connections</div>
                  </div>
                  <div className="text-center p-4 glass rounded-lg">
                    <div className="text-2xl font-bold text-secondary">8</div>
                    <div className="text-sm text-muted-foreground">Online Now</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Selected User Details */}
            {selectedUser && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <UserPlus className="w-5 h-5 mr-2" />
                    {selectedUser.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={selectedUser.avatar} />
                      <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-semibold">{selectedUser.name}</div>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getLevelColor(selectedUser.level)} bg-current/10`}>
                          Level {selectedUser.level}
                        </Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedUser.status)}`} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Events Attended:</span>
                      <span className="font-semibold">{selectedUser.eventsAttended}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Mutual Friends:</span>
                      <span className="font-semibold">{selectedUser.mutualFriends}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Recent Events</h4>
                    <div className="space-y-2">
                      {selectedUser.recentEvents.map((event, index) => (
                        <div key={index} className="p-2 glass rounded text-sm">
                          <div className="font-medium">{event.title}</div>
                          <div className="text-muted-foreground">{event.date} • {event.category}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" variant="outline">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Friends List */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Friends ({friends.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {friends.map((friend, index) => (
                    <motion.div
                      key={friend.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedUser?.id === friend.id ? 'bg-primary/10' : 'hover:bg-white/5'
                      }`}
                      onClick={() => setSelectedUser(selectedUser?.id === friend.id ? null : friend)}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={friend.avatar} />
                          <AvatarFallback>{friend.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(friend.status)}`} />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm">{friend.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Level {friend.level} • {friend.eventsAttended} events
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {friend.mutualFriends} mutual
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Network Insights */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-accent" />
                  Network Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 glass rounded-lg">
                    <div className="text-sm font-semibold text-primary mb-1">Most Active</div>
                    <div className="text-xs text-muted-foreground">Alex Chen with 31 events</div>
                  </div>
                  <div className="p-3 glass rounded-lg">
                    <div className="text-sm font-semibold text-accent mb-1">Newest Friend</div>
                    <div className="text-xs text-muted-foreground">Lisa Park joined 2 days ago</div>
                  </div>
                  <div className="p-3 glass rounded-lg">
                    <div className="text-sm font-semibold text-secondary mb-1">Common Interest</div>
                    <div className="text-xs text-muted-foreground">Technology events</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FriendsSocialGraph;
