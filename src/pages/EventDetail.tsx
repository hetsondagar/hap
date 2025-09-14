import { useState } from "react";
import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  Share2, 
  Heart, 
  MessageCircle,
  Camera,
  User,
  Star,
  ChevronLeft,
  Play,
  Download
} from "lucide-react";

const EventDetail = () => {
  const [activeTab, setActiveTab] = useState("about");
  const [isJoined, setIsJoined] = useState(false);

  // Mock event data
  const event = {
    id: 1,
    title: "Tech Innovation Summit 2024",
    date: "January 20, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Downtown Convention Center",
    address: "123 Innovation Street, Tech City, TC 12345",
    category: "Technology",
    description: "Join us for the biggest tech innovation summit of the year! Discover cutting-edge technologies, network with industry leaders, and explore the future of digital transformation.",
    organizer: {
      name: "Tech Innovators Inc.",
      avatar: "/placeholder.svg",
      verified: true
    },
    attendees: 450,
    maxAttendees: 500,
    price: "Free",
    image: "/placeholder.svg",
    tags: ["AI", "Machine Learning", "Startups", "Networking"]
  };

  const attendees = [
    { id: 1, name: "Alex Chen", avatar: "/placeholder.svg", status: "online" },
    { id: 2, name: "Sarah Kim", avatar: "/placeholder.svg", status: "online" },
    { id: 3, name: "Mike Johnson", avatar: "/placeholder.svg", status: "offline" },
    { id: 4, name: "Emma Wilson", avatar: "/placeholder.svg", status: "online" },
    { id: 5, name: "David Lee", avatar: "/placeholder.svg", status: "online" }
  ];

  const photos = [
    { id: 1, url: "/placeholder.svg", caption: "Previous year's event" },
    { id: 2, url: "/placeholder.svg", caption: "Keynote presentation" },
    { id: 3, url: "/placeholder.svg", caption: "Networking session" }
  ];

  const chatMessages = [
    { id: 1, user: "Alex Chen", message: "Excited for this event!", time: "2h ago", avatar: "/placeholder.svg" },
    { id: 2, user: "Sarah Kim", message: "Same here! Looking forward to the AI panel", time: "1h ago", avatar: "/placeholder.svg" },
    { id: 3, user: "Mike Johnson", message: "Anyone know if there's parking available?", time: "30m ago", avatar: "/placeholder.svg" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </motion.div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative"
      >
        <div className="aspect-video bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20 flex items-center justify-center">
          <div className="text-center">
            <Play className="w-16 h-16 text-white/80 mx-auto mb-4" />
            <p className="text-white/80">Event Preview Video</p>
          </div>
        </div>
        
        {/* Floating Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button size="sm" variant="secondary" className="glass">
            <Share2 className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="secondary" className="glass">
            <Heart className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Event Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8"
        >
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  {event.category}
                </Badge>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="w-4 h-4 mr-2" />
                  {event.attendees}/{event.maxAttendees} attending
                </div>
              </div>
              
              <h1 className="text-4xl font-gaming font-bold mb-4">{event.title}</h1>
              
              <div className="flex items-center space-x-6 text-muted-foreground mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  {event.date}
                </div>
                <div className="flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  {event.time}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  {event.location}
                </div>
              </div>

              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                {event.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-6">
                {event.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-primary/30 text-primary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="glass-card">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-accent mb-2">{event.price}</div>
                  <div className="text-sm text-muted-foreground">per person</div>
                </div>
                
                <Button 
                  className={`w-full mb-4 ${isJoined ? 'bg-accent hover:bg-accent/90' : 'bg-gradient-primary hover:opacity-90'}`}
                  onClick={() => setIsJoined(!isJoined)}
                >
                  {isJoined ? 'Joined ✓' : 'Join Event'}
                </Button>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span>{event.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right">{event.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Organizer
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={event.organizer.avatar} />
                    <AvatarFallback>{event.organizer.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold flex items-center">
                      {event.organizer.name}
                      {event.organizer.verified && <Star className="w-4 h-4 ml-1 text-accent" />}
                    </div>
                    <div className="text-sm text-muted-foreground">Event Organizer</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass p-1 w-full justify-start">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="attendees">Attendees</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What to Expect</h4>
                    <p className="text-muted-foreground">
                      This full-day summit will feature keynote presentations from industry leaders, 
                      interactive workshops, networking sessions, and a startup showcase. 
                      Perfect for developers, entrepreneurs, and tech enthusiasts.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Agenda</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span>9:00 AM - Registration & Welcome</span>
                        <Badge variant="outline">Main Hall</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span>10:00 AM - Keynote: Future of AI</span>
                        <Badge variant="outline">Main Hall</Badge>
                      </div>
                      <div className="flex justify-between items-center p-3 glass rounded-lg">
                        <span>11:30 AM - Panel Discussion</span>
                        <Badge variant="outline">Room A</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="photos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {photos.map((photo, index) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="glass-card overflow-hidden hover-lift">
                      <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-primary/50" />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm text-muted-foreground">{photo.caption}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="attendees" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Attendees ({attendees.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {attendees.map((attendee, index) => (
                      <motion.div
                        key={attendee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center space-x-3 p-3 glass rounded-lg hover-lift"
                      >
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src={attendee.avatar} />
                            <AvatarFallback>{attendee.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-background ${
                            attendee.status === 'online' ? 'bg-accent' : 'bg-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm">{attendee.name}</div>
                          <div className="text-xs text-muted-foreground capitalize">{attendee.status}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="chat" className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Event Chat
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {chatMessages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex space-x-3"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.avatar} />
                          <AvatarFallback>{message.user[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm">{message.user}</span>
                            <span className="text-xs text-muted-foreground">{message.time}</span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input 
                      type="text" 
                      placeholder="Type a message..." 
                      className="flex-1 px-4 py-2 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
                    />
                    <Button size="sm">
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetail;
