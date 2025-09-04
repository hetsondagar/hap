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
      points: 30,
      image:"data:image/jpeg;base64,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"
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