import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import EventCard from "./EventCard";
import { Search, Filter, MapPin, Calendar, SlidersHorizontal } from "lucide-react";

const EventsGrid = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");

  const categories = ["All", "Music", "Sports", "Culture", "Food", "Tech", "Art"];
  const locations = ["All", "Downtown", "University Area", "Westside", "Eastside"];

  // Mock event data
  const mockEvents = [
    {
      id: "1",
      title: "Summer Music Festival",
      description: "Join us for an amazing evening of live music featuring local bands and international artists. Food trucks and art vendors will be available.",
      date: "July 15, 2024",
      time: "6:00 PM",
      location: "Central Park, Downtown",
      category: "Music",
      attendees: 234,
      maxAttendees: 500,
      points: 150,
      difficulty: "Easy" as const,
      image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500",
      tags: ["Live Music", "Outdoor", "Food", "Artists"]
    },
    {
      id: "2", 
      title: "Basketball Championship",
      description: "City-wide basketball tournament with teams from all districts. Come support your local team and enjoy exciting matches.",
      date: "July 18, 2024",
      time: "2:00 PM",
      location: "Sports Complex, University Area",
      category: "Sports",
      attendees: 156,
      maxAttendees: 300,
      points: 200,
      difficulty: "Medium" as const,
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=500",
      tags: ["Basketball", "Tournament", "Competition", "Teams"]
    },
    {
      id: "3",
      title: "Cultural Heritage Exhibition",
      description: "Explore the rich cultural heritage of our city through interactive exhibits, traditional performances, and artisan demonstrations.",
      date: "July 20, 2024", 
      time: "10:00 AM",
      location: "Museum District, Westside",
      category: "Culture",
      attendees: 89,
      maxAttendees: 150,
      points: 120,
      difficulty: "Easy" as const,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500",
      tags: ["Heritage", "Museum", "Art", "History"]
    },
    {
      id: "4",
      title: "Tech Innovation Summit",
      description: "Connect with tech leaders, startups, and innovators. Featuring keynote speakers, workshops, and networking opportunities.",
      date: "July 22, 2024",
      time: "9:00 AM",
      location: "Convention Center, Eastside",
      category: "Tech",
      attendees: 445,
      maxAttendees: 600,
      points: 300,
      difficulty: "Hard" as const,
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
      tags: ["Technology", "Innovation", "Networking", "Startups"]
    },
    {
      id: "5",
      title: "Food Truck Festival",
      description: "Taste diverse cuisines from around the world at our annual food truck festival. Live music and family activities included.",
      date: "July 25, 2024",
      time: "4:00 PM", 
      location: "Riverside Park, Downtown",
      category: "Food",
      attendees: 378,
      maxAttendees: 800,
      points: 100,
      difficulty: "Easy" as const,
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500",
      tags: ["Food", "Festival", "Family", "Music"]
    },
    {
      id: "6",
      title: "Street Art Workshop",
      description: "Learn from professional street artists and create your own masterpiece. All materials provided, suitable for all skill levels.",
      date: "July 28, 2024",
      time: "1:00 PM",
      location: "Arts District, Westside", 
      category: "Art",
      attendees: 67,
      maxAttendees: 120,
      points: 180,
      difficulty: "Medium" as const,
      image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=500",
      tags: ["Art", "Workshop", "Creative", "Learning"]
    }
  ];

  const filteredEvents = mockEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || event.location.includes(selectedLocation);
    
    return matchesSearch && matchesCategory && matchesLocation;
  });

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Discover Amazing Events
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find events that match your interests and start earning points while making memories
        </p>
      </div>

      {/* Search and Filters */}
      <div className="glass-card mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-gradient-primary border-none text-white" 
                    : "border-border/50 hover:border-primary/50"
                  }
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <div className="flex gap-2 overflow-x-auto">
              {locations.map((location) => (
                <Button
                  key={location}
                  variant={selectedLocation === location ? "default" : "outline"}
                  size="sm" 
                  onClick={() => setSelectedLocation(location)}
                  className={selectedLocation === location
                    ? "bg-gradient-secondary border-none text-white"
                    : "border-border/50 hover:border-secondary/50"
                  }
                >
                  {location}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory !== "All" || selectedLocation !== "All" || searchTerm) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedCategory !== "All" && (
              <Badge variant="outline" className="border-primary/30 text-primary">
                {selectedCategory}
              </Badge>
            )}
            {selectedLocation !== "All" && (
              <Badge variant="outline" className="border-secondary/30 text-secondary">
                {selectedLocation}
              </Badge>
            )}
            {searchTerm && (
              <Badge variant="outline" className="border-accent/30 text-accent">
                "{searchTerm}"
              </Badge>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setSelectedLocation("All");
                setSearchTerm("");
              }}
              className="text-muted-foreground hover:text-foreground ml-2"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Counter */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Found {filteredEvents.length} events
        </p>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <Button variant="ghost" size="sm" className="text-muted-foreground">
            Sort by Date
          </Button>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="glass-card max-w-md mx-auto">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No events found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse all available events.
            </p>
            <Button 
              onClick={() => {
                setSelectedCategory("All");
                setSelectedLocation("All");
                setSearchTerm("");
              }}
              className="bg-gradient-primary hover:opacity-90 border-none text-white"
            >
              Show All Events
            </Button>
          </div>
        </div>
      )}

      {/* Load More */}
      {filteredEvents.length > 0 && (
        <div className="text-center mt-12">
          <Button 
            variant="outline"
            size="lg"
            className="border-primary/50 text-primary hover:bg-primary/10 hover:border-primary"
          >
            Load More Events
          </Button>
        </div>
      )}
    </section>
  );
};

export default EventsGrid;