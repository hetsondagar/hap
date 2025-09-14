import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Plus, 
  UserPlus, 
  MapPin, 
  Calendar, 
  Clock,
  Zap,
  Crown,
  Star,
  Heart,
  Share2,
  Settings,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Gamepad2,
  Music,
  Theater,
  Users2,
  Coffee,
  Camera,
  MessageCircle
} from "lucide-react";

const GroupHangouts = () => {
  const [activeTab, setActiveTab] = useState("my-groups");

  // Mock data for hangout groups
  const hangoutGroups = [
    {
      id: 1,
      name: "Tech Enthusiasts",
      event: "Tech Innovation Summit",
      date: "2024-01-20",
      time: "7:00 PM",
      location: "Convention Center",
      maxMembers: 8,
      currentMembers: 5,
      confirmedMembers: 3,
      status: "active",
      category: "Technology",
      organizer: {
        name: "Alex Chen",
        avatar: "/placeholder.svg"
      },
      members: [
        { name: "Alex Chen", avatar: "/placeholder.svg", status: "confirmed", role: "organizer" },
        { name: "Sarah Kim", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "Mike Johnson", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "Emma Wilson", avatar: "/placeholder.svg", status: "pending", role: "member" },
        { name: "David Lee", avatar: "/placeholder.svg", status: "pending", role: "member" }
      ],
      description: "Join us for the biggest tech meetup of the year! We'll be discussing the latest innovations in AI and machine learning."
    },
    {
      id: 2,
      name: "Music Lovers",
      event: "Rock Concert 2024",
      date: "2024-01-22",
      time: "8:00 PM",
      location: "Madison Square Garden",
      maxMembers: 6,
      currentMembers: 4,
      confirmedMembers: 2,
      status: "active",
      category: "Music",
      organizer: {
        name: "Sarah Kim",
        avatar: "/placeholder.svg"
      },
      members: [
        { name: "Sarah Kim", avatar: "/placeholder.svg", status: "confirmed", role: "organizer" },
        { name: "Lisa Park", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "Tom Wilson", avatar: "/placeholder.svg", status: "pending", role: "member" },
        { name: "Anna Chen", avatar: "/placeholder.svg", status: "pending", role: "member" }
      ],
      description: "Let's rock out together at the biggest concert of the year! VIP tickets secured."
    },
    {
      id: 3,
      name: "Art Appreciators",
      event: "Modern Art Exhibition",
      date: "2024-01-25",
      time: "6:00 PM",
      location: "Downtown Gallery",
      maxMembers: 10,
      currentMembers: 7,
      confirmedMembers: 5,
      status: "active",
      category: "Art",
      organizer: {
        name: "Emma Wilson",
        avatar: "/placeholder.svg"
      },
      members: [
        { name: "Emma Wilson", avatar: "/placeholder.svg", status: "confirmed", role: "organizer" },
        { name: "David Lee", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "Maria Garcia", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "John Smith", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "Sophie Brown", avatar: "/placeholder.svg", status: "confirmed", role: "member" },
        { name: "Alex Chen", avatar: "/placeholder.svg", status: "pending", role: "member" },
        { name: "Sarah Kim", avatar: "/placeholder.svg", status: "pending", role: "member" }
      ],
      description: "Exploring contemporary art and discussing the meaning behind each piece."
    }
  ];

  const availableEvents = [
    {
      id: 1,
      title: "Basketball Tournament",
      date: "2024-01-28",
      time: "2:00 PM",
      location: "Sports Arena",
      category: "Sports",
      icon: Gamepad2,
      color: "text-accent"
    },
    {
      id: 2,
      title: "Theater Performance",
      date: "2024-01-30",
      time: "7:30 PM",
      location: "City Theater",
      category: "Theater",
      icon: Theater,
      color: "text-primary"
    },
    {
      id: 3,
      title: "Coffee Meetup",
      date: "2024-02-02",
      time: "10:00 AM",
      location: "Downtown Cafe",
      category: "Social",
      icon: Coffee,
      color: "text-warning"
    }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Technology": return Users2;
      case "Music": return Music;
      case "Art": return Camera;
      case "Sports": return Gamepad2;
      case "Theater": return Theater;
      default: return Users;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "text-accent";
      case "pending": return "text-warning";
      case "declined": return "text-destructive";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed": return CheckCircle;
      case "pending": return Clock;
      case "declined": return XCircle;
      default: return Clock;
    }
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
                Group Hangouts
              </h1>
              <p className="text-muted-foreground mt-2">Create and join groups for events with friends</p>
            </div>
            <Button className="bg-gradient-primary hover:opacity-90">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex space-x-4 border-b border-border/50">
            <Button
              variant={activeTab === "my-groups" ? "default" : "ghost"}
              onClick={() => setActiveTab("my-groups")}
              className={activeTab === "my-groups" ? "bg-gradient-primary" : ""}
            >
              My Groups
            </Button>
            <Button
              variant={activeTab === "discover" ? "default" : "ghost"}
              onClick={() => setActiveTab("discover")}
              className={activeTab === "discover" ? "bg-gradient-primary" : ""}
            >
              Discover Events
            </Button>
            <Button
              variant={activeTab === "invitations" ? "default" : "ghost"}
              onClick={() => setActiveTab("invitations")}
              className={activeTab === "invitations" ? "bg-gradient-primary" : ""}
            >
              Invitations
            </Button>
          </div>
        </motion.div>

        {/* My Groups Tab */}
        {activeTab === "my-groups" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {hangoutGroups.map((group, index) => {
              const CategoryIcon = getCategoryIcon(group.category);
              
              return (
                <Card key={group.id} className="glass-card hover-lift">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                          <CategoryIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{group.name}</CardTitle>
                          <CardDescription>{group.event}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-accent/20 text-accent border-accent/30">
                          {group.currentMembers}/{group.maxMembers} members
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Event Details */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{group.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{group.time}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          <span>{group.location}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground">{group.description}</p>

                      {/* Members */}
                      <div>
                        <h4 className="font-semibold mb-3">Group Members</h4>
                        <div className="flex flex-wrap gap-2">
                          {group.members.map((member, memberIndex) => {
                            const StatusIcon = getStatusIcon(member.status);
                            const statusColor = getStatusColor(member.status);
                            
                            return (
                              <motion.div
                                key={memberIndex}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: memberIndex * 0.1 }}
                                className="flex items-center space-x-2 p-2 glass rounded-lg"
                              >
                                <div className="relative">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={member.avatar} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <StatusIcon className={`absolute -bottom-1 -right-1 w-3 h-3 ${statusColor}`} />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold">{member.name}</div>
                                  <div className="text-xs text-muted-foreground capitalize">{member.role}</div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Confirmed Members</span>
                          <span>{group.confirmedMembers}/{group.maxMembers}</span>
                        </div>
                        <div className="w-full bg-muted/20 rounded-full h-2">
                          <div 
                            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(group.confirmedMembers / group.maxMembers) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-2">
                        <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                        <Button variant="outline">
                          <UserPlus className="w-4 h-4 mr-2" />
                          Invite
                        </Button>
                        <Button variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Discover Events Tab */}
        {activeTab === "discover" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableEvents.map((event, index) => {
                const Icon = event.icon;
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card hover-lift">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3 mb-4">
                          <Icon className={`w-8 h-8 ${event.color}`} />
                          <div>
                            <h3 className="font-semibold">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">{event.category}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                        
                        <Button className="w-full bg-gradient-primary hover:opacity-90">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Group
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Invitations Tab */}
        {activeTab === "invitations" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Group Invitations</CardTitle>
                <CardDescription>You have 2 pending invitations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      id: 1,
                      groupName: "Gaming Squad",
                      event: "Esports Championship",
                      organizer: "Mike Johnson",
                      avatar: "/placeholder.svg",
                      date: "2024-02-05",
                      time: "3:00 PM"
                    },
                    {
                      id: 2,
                      groupName: "Food Lovers",
                      event: "Food Festival",
                      organizer: "Lisa Park",
                      avatar: "/placeholder.svg",
                      date: "2024-02-10",
                      time: "12:00 PM"
                    }
                  ].map((invitation, index) => (
                    <motion.div
                      key={invitation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center justify-between p-4 glass rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={invitation.avatar} />
                          <AvatarFallback>{invitation.organizer[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{invitation.groupName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {invitation.event} • {invitation.date} at {invitation.time}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Invited by {invitation.organizer}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="bg-gradient-primary hover:opacity-90">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle className="w-4 h-4 mr-1" />
                          Decline
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default GroupHangouts;
