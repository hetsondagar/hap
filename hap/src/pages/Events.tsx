import Layout from "@/components/Layout";
import EventCard from "@/components/EventCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useState } from "react";

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { id: "all", label: "All Events", count: 42 },
    { id: "comedy", label: "Comedy", count: 12 },
    { id: "movie", label: "Movies", count: 8 },
    { id: "drama", label: "Drama", count: 6 },
    { id: "music", label: "Music", count: 10 },
    { id: "art", label: "Art", count: 6 }
  ];

  const events = [
    {
      title: "Stand-up Comedy Night with Mike Chen",
      category: "comedy" as const,
      date: "Dec 15, 8:00 PM",
      location: "Comedy Club Downtown",
      price: "$25",
      rating: 4.8,
      attendees: 156,
      points: 50
    },
    {
      title: "Inception: Director's Cut Screening",
      category: "movie" as const,
      date: "Dec 16, 7:30 PM", 
      location: "Grand Cinema",
      price: "$15",
      rating: 4.9,
      attendees: 203,
      points: 30
    },
    {
      title: "Hamlet - Modern Adaptation",
      category: "drama" as const,
      date: "Dec 18, 8:00 PM",
      location: "Royal Theater",
      price: "$45",
      rating: 4.7,
      attendees: 89,
      points: 75
    },
    {
      title: "Jazz Under the Stars",
      category: "music" as const,
      date: "Dec 20, 9:00 PM",
      location: "Rooftop Lounge",
      price: "$35",
      rating: 4.6,
      attendees: 124,
      points: 60
    },
    {
      title: "Contemporary Art Exhibition",
      category: "art" as const,
      date: "Dec 22, 6:00 PM",
      location: "Modern Art Gallery",
      price: "$20",
      rating: 4.5,
      attendees: 78,
      points: 40
    },
    {
      title: "Improv Comedy Workshop",
      category: "comedy" as const,
      date: "Dec 23, 7:00 PM",
      location: "Community Center",
      price: "$30",
      rating: 4.4,
      attendees: 45,
      points: 55
    }
  ];

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === "all" || event.category === selectedCategory;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Discover Events
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Find amazing events, join the fun, and earn points for every experience!
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search events, venues..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>More Filters</span>
          </Button>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Badge
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              className="cursor-pointer px-4 py-2 text-sm font-medium transition-all hover:scale-105"
              onClick={() => setSelectedCategory(category.id)}
            >
              {category.label} ({category.count})
            </Badge>
          ))}
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <EventCard key={index} {...event} />
          ))}
        </div>

        {/* Load More */}
        {filteredEvents.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Events
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or browse different categories
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Events;