import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  MapPin, 
  Filter, 
  Search, 
  Users, 
  Calendar, 
  Clock,
  Star,
  Zap,
  Music,
  Gamepad2,
  Theater,
  Users2,
  X,
  Plus,
  Minus,
  Navigation as NavIcon,
  Heart,
  Share2
} from "lucide-react";

const EventDiscoveryMap = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filters, setFilters] = useState({
    sports: true,
    concerts: true,
    plays: true,
    meetups: true
  });
  const [zoom, setZoom] = useState(12);

  // Mock data for events
  const events = [
    {
      id: 1,
      title: "Tech Meetup 2024",
      type: "meetups",
      location: { lat: 37.7749, lng: -122.4194 },
      attendees: 150,
      date: "2024-01-20",
      time: "7:00 PM",
      image: "/placeholder.svg",
      description: "Join us for the biggest tech meetup of the year!",
      organizer: "Tech Innovators Inc."
    },
    {
      id: 2,
      title: "Rock Concert",
      type: "concerts",
      location: { lat: 37.7849, lng: -122.4094 },
      attendees: 500,
      date: "2024-01-22",
      time: "8:00 PM",
      image: "/placeholder.svg",
      description: "Amazing rock concert with top artists",
      organizer: "Live Music Co."
    },
    {
      id: 3,
      title: "Basketball Tournament",
      type: "sports",
      location: { lat: 37.7649, lng: -122.4294 },
      attendees: 200,
      date: "2024-01-25",
      time: "2:00 PM",
      image: "/placeholder.svg",
      description: "Championship basketball tournament",
      organizer: "Sports League"
    },
    {
      id: 4,
      title: "Theater Performance",
      type: "plays",
      location: { lat: 37.7549, lng: -122.4394 },
      attendees: 100,
      date: "2024-01-28",
      time: "7:30 PM",
      image: "/placeholder.svg",
      description: "Classic theater performance",
      organizer: "City Theater"
    }
  ];

  const getEventIcon = (type: string) => {
    switch (type) {
      case "sports": return Gamepad2;
      case "concerts": return Music;
      case "plays": return Theater;
      case "meetups": return Users2;
      default: return MapPin;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case "sports": return "text-accent";
      case "concerts": return "text-secondary";
      case "plays": return "text-primary";
      case "meetups": return "text-warning";
      default: return "text-muted-foreground";
    }
  };

  const filteredEvents = events.filter(event => filters[event.type as keyof typeof filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Map Container */}
      <div className="relative h-screen pt-16">
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        </div>

        {/* Event Pins */}
        {filteredEvents.map((event, index) => {
          const Icon = getEventIcon(event.type);
          const color = getEventColor(event.type);
          
          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="absolute cursor-pointer"
              style={{
                left: `${20 + (index * 15)}%`,
                top: `${30 + (index * 10)}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedEvent(event)}
            >
              <motion.div
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative"
              >
                <div className={`w-12 h-12 glass-card rounded-full flex items-center justify-center border-2 border-white/20 ${color} animate-pulse-glow`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full flex items-center justify-center text-xs font-bold text-background">
                  {event.attendees}
                </div>
              </motion.div>
            </motion.div>
          );
        })}

        {/* Map Controls */}
        <div className="absolute top-20 right-4 space-y-2">
          <Button
            size="sm"
            variant="outline"
            className="glass border-white/20"
            onClick={() => setZoom(zoom + 1)}
          >
            <Plus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="glass border-white/20"
            onClick={() => setZoom(zoom - 1)}
          >
            <Minus className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="glass border-white/20"
          >
            <NavIcon className="w-4 h-4" />
          </Button>
        </div>

        {/* Search Bar */}
        <div className="absolute top-20 left-4 right-4 max-w-md mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search events near you..."
              className="w-full pl-10 pr-4 py-3 glass rounded-lg border border-white/10 focus:border-primary/50 focus:outline-none"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="absolute bottom-20 left-4 right-4">
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center text-lg">
                <Filter className="w-5 h-5 mr-2" />
                Event Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "sports", label: "Sports", icon: Gamepad2, color: "text-accent" },
                  { key: "concerts", label: "Concerts", icon: Music, color: "text-secondary" },
                  { key: "plays", label: "Plays", icon: Theater, color: "text-primary" },
                  { key: "meetups", label: "Meetups", icon: Users2, color: "text-warning" }
                ].map((filter) => {
                  const Icon = filter.icon;
                  return (
                    <motion.div
                      key={filter.key}
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center space-x-3 p-3 glass rounded-lg hover-lift"
                    >
                      <Icon className={`w-5 h-5 ${filter.color}`} />
                      <div className="flex-1">
                        <div className="text-sm font-medium">{filter.label}</div>
                        <div className="text-xs text-muted-foreground">
                          {events.filter(e => e.type === filter.key).length} events
                        </div>
                      </div>
                      <Switch
                        checked={filters[filter.key as keyof typeof filters]}
                        onCheckedChange={(checked) => 
                          setFilters(prev => ({ ...prev, [filter.key]: checked }))
                        }
                        className="data-[state=checked]:bg-primary"
                      />
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Popup */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader className="relative">
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-4 right-4"
                  onClick={() => setSelectedEvent(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
                <div className="flex items-center space-x-3">
                  {(() => {
                    const Icon = getEventIcon(selectedEvent.type);
                    const color = getEventColor(selectedEvent.type);
                    return <Icon className={`w-8 h-8 ${color}`} />;
                  })()}
                  <div>
                    <CardTitle className="text-xl">{selectedEvent.title}</CardTitle>
                    <CardDescription>{selectedEvent.organizer}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-primary/50" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {selectedEvent.date}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-2" />
                    {selectedEvent.time}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {selectedEvent.attendees} attending
                  </div>
                </div>

                <p className="text-sm text-muted-foreground">
                  {selectedEvent.description}
                </p>

                <div className="flex space-x-2">
                  <Button className="flex-1 bg-gradient-primary hover:opacity-90">
                    <Zap className="w-4 h-4 mr-2" />
                    Join Event
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EventDiscoveryMap;
