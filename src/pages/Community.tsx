import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Users, 
  MessageCircle, 
  Plus, 
  Search, 
  Filter,
  Heart,
  Share2,
  MoreHorizontal,
  Calendar,
  MapPin,
  Clock,
  Star,
  Zap,
  Crown,
  Send,
  Smile,
  Image,
  Video,
  UserPlus,
  Settings,
  Bell
} from "lucide-react";

const Community = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [newMessage, setNewMessage] = useState("");

  // Mock data
  const friends = [
    { id: 1, name: "Alex Chen", avatar: "/placeholder.svg", status: "online", lastSeen: "2 min ago" },
    { id: 2, name: "Sarah Kim", avatar: "/placeholder.svg", status: "online", lastSeen: "5 min ago" },
    { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg", status: "offline", lastSeen: "1 hour ago" },
    { id: 4, name: "Emma Wilson", avatar: "/placeholder.svg", status: "online", lastSeen: "10 min ago" }
  ];

  const activityFeed = [
    {
      id: 1,
      user: { name: "Alex Chen", avatar: "/placeholder.svg" },
      action: "joined",
      event: "Tech Innovation Summit",
      time: "2 hours ago",
      type: "event"
    },
    {
      id: 2,
      user: { name: "Sarah Kim", avatar: "/placeholder.svg" },
      action: "earned",
      achievement: "Social Butterfly Badge",
      time: "3 hours ago",
      type: "achievement"
    },
    {
      id: 3,
      user: { name: "Mike Johnson", avatar: "/placeholder.svg" },
      action: "created",
      event: "Weekend Hiking Group",
      time: "5 hours ago",
      type: "event"
    },
    {
      id: 4,
      user: { name: "Emma Wilson", avatar: "/placeholder.svg" },
      action: "reached",
      level: "Level 15",
      time: "1 day ago",
      type: "level"
    }
  ];

  const chatMessages = [
    { id: 1, user: "Alex Chen", message: "Anyone going to the tech meetup tomorrow?", time: "2:30 PM", avatar: "/placeholder.svg" },
    { id: 2, user: "Sarah Kim", message: "I'll be there! Looking forward to it", time: "2:32 PM", avatar: "/placeholder.svg" },
    { id: 3, user: "Mike Johnson", message: "Same here, see you all there!", time: "2:35 PM", avatar: "/placeholder.svg" },
    { id: 4, user: "You", message: "Count me in too!", time: "2:40 PM", avatar: "/placeholder.svg" }
  ];

  const groups = [
    { id: 1, name: "Tech Enthusiasts", members: 45, events: 12, avatar: "/placeholder.svg" },
    { id: 2, name: "Music Lovers", members: 32, events: 8, avatar: "/placeholder.svg" },
    { id: 3, name: "Art & Culture", members: 28, events: 15, avatar: "/placeholder.svg" }
  ];

  const getActionIcon = (type: string) => {
    switch (type) {
      case "event": return Calendar;
      case "achievement": return Star;
      case "level": return Crown;
      default: return Zap;
    }
  };

  const getActionColor = (type: string) => {
    switch (type) {
      case "event": return "text-primary";
      case "achievement": return "text-accent";
      case "level": return "text-warning";
      default: return "text-secondary";
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
                Community
              </h1>
              <p className="text-muted-foreground mt-2">Connect with friends and discover events together</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Friends */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  Friends ({friends.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {friends.map((friend, index) => (
                  <motion.div
                    key={friend.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={friend.avatar} />
                        <AvatarFallback>{friend.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                        friend.status === 'online' ? 'bg-accent' : 'bg-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{friend.name}</div>
                      <div className="text-xs text-muted-foreground">{friend.lastSeen}</div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Friends
                </Button>
              </CardContent>
            </Card>

            {/* Groups */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Groups</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {groups.map((group, index) => (
                  <motion.div
                    key={group.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                  >
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={group.avatar} />
                      <AvatarFallback>{group.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">{group.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {group.members} members • {group.events} events
                      </div>
                    </div>
                  </motion.div>
                ))}
                <Button variant="outline" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Group
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 space-y-6"
          >
            {/* Tabs */}
            <div className="flex space-x-4 border-b border-border/50">
              <Button
                variant={activeTab === "feed" ? "default" : "ghost"}
                onClick={() => setActiveTab("feed")}
                className={activeTab === "feed" ? "bg-gradient-primary" : ""}
              >
                Activity Feed
              </Button>
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => setActiveTab("chat")}
                className={activeTab === "chat" ? "bg-gradient-primary" : ""}
              >
                Group Chat
              </Button>
              <Button
                variant={activeTab === "create" ? "default" : "ghost"}
                onClick={() => setActiveTab("create")}
                className={activeTab === "create" ? "bg-gradient-primary" : ""}
              >
                Create Event
              </Button>
            </div>

            {/* Activity Feed */}
            {activeTab === "feed" && (
              <div className="space-y-4">
                {/* Create Post */}
                <Card className="glass-card">
                  <CardContent className="p-6">
                    <div className="flex space-x-4">
                      <Avatar>
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback>You</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea 
                          placeholder="Share what's on your mind..." 
                          className="min-h-[100px] resize-none"
                        />
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-2">
                            <Button size="sm" variant="ghost">
                              <Image className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Video className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="ghost">
                              <Smile className="w-4 h-4" />
                            </Button>
                          </div>
                          <Button className="bg-gradient-primary hover:opacity-90">
                            <Send className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Activity Items */}
                {activityFeed.map((activity, index) => {
                  const ActionIcon = getActionIcon(activity.type);
                  const actionColor = getActionColor(activity.type);
                  
                  return (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="glass-card hover-lift">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={activity.user.avatar} />
                              <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <span className="font-semibold">{activity.user.name}</span>
                                <ActionIcon className={`w-4 h-4 ${actionColor}`} />
                                <span className="text-muted-foreground">
                                  {activity.action} {activity.event || activity.achievement || activity.level}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{activity.time}</span>
                                <div className="flex items-center space-x-2">
                                  <Button size="sm" variant="ghost">
                                    <Heart className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <Share2 className="w-4 h-4" />
                                  </Button>
                                  <Button size="sm" variant="ghost">
                                    <MoreHorizontal className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Group Chat */}
            {activeTab === "chat" && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Group Chat
                  </CardTitle>
                  <CardDescription>Chat with your friends about upcoming events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex space-x-3 ${message.user === "You" ? "justify-end" : ""}`}
                      >
                        {message.user !== "You" && (
                          <Avatar className="w-8 h-8">
                            <AvatarImage src={message.avatar} />
                            <AvatarFallback>{message.user[0]}</AvatarFallback>
                          </Avatar>
                        )}
                        <div className={`max-w-xs ${message.user === "You" ? "order-first" : ""}`}>
                          {message.user !== "You" && (
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-sm">{message.user}</span>
                              <span className="text-xs text-muted-foreground">{message.time}</span>
                            </div>
                          )}
                          <div className={`p-3 rounded-lg ${
                            message.user === "You" 
                              ? "bg-gradient-primary text-white" 
                              : "glass"
                          }`}>
                            <p className="text-sm">{message.message}</p>
                          </div>
                          {message.user === "You" && (
                            <div className="text-xs text-muted-foreground mt-1 text-right">
                              {message.time}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Type a message..." 
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      size="sm"
                      onClick={() => setNewMessage("")}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Create Event */}
            {activeTab === "create" && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create Group Event
                  </CardTitle>
                  <CardDescription>Organize an event with your friends</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Event Title</label>
                      <Input placeholder="Enter event title" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input placeholder="e.g., Social, Sports, Music" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea placeholder="Describe your event..." rows={4} />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Date</label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Time</label>
                      <Input type="time" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input placeholder="Venue or address" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Invite Friends</label>
                    <div className="flex flex-wrap gap-2">
                      {friends.map((friend) => (
                        <Badge key={friend.id} variant="outline" className="cursor-pointer hover:bg-primary/10">
                          {friend.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <Button variant="outline">Save Draft</Button>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Calendar className="w-4 h-4 mr-2" />
                      Create Event
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Community;
