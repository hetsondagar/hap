import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Users, Trophy, Star } from "lucide-react";

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: string;
    attendees: number;
    maxAttendees: number;
    points: number;
    difficulty: "Easy" | "Medium" | "Hard";
    image: string;
    tags: string[];
  };
}

const EventCard = ({ event }: EventCardProps) => {
  const difficultyColors = {
    Easy: "bg-success/20 text-success",
    Medium: "bg-warning/20 text-warning", 
    Hard: "bg-destructive/20 text-destructive"
  };

  const categoryColors = {
    "Music": "bg-primary/20 text-primary",
    "Sports": "bg-accent/20 text-accent",
    "Culture": "bg-secondary/20 text-secondary",
    "Food": "bg-warning/20 text-warning",
    "Tech": "bg-info/20 text-info"
  };

  return (
    <div className="glass-card group cursor-pointer hover-lift">
      {/* Event Image */}
      <div className="relative mb-4 rounded-xl overflow-hidden">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            className={`${categoryColors[event.category as keyof typeof categoryColors] || 'bg-muted/20 text-muted-foreground'} border-none backdrop-blur-sm`}
          >
            {event.category}
          </Badge>
          <Badge 
            className={`${difficultyColors[event.difficulty]} border-none backdrop-blur-sm`}
          >
            {event.difficulty}
          </Badge>
        </div>

        {/* Points Badge */}
        <div className="absolute top-3 right-3 glass-card py-1 px-3 flex items-center gap-1">
          <Trophy className="w-4 h-4 text-accent" />
          <span className="text-sm font-bold text-accent">+{event.points}</span>
        </div>

        {/* Attendees */}
        <div className="absolute bottom-3 left-3 glass-card py-1 px-3 flex items-center gap-1">
          <Users className="w-4 h-4 text-foreground" />
          <span className="text-sm text-foreground">{event.attendees}/{event.maxAttendees}</span>
        </div>
      </div>

      {/* Event Content */}
      <div className="space-y-4">
        {/* Title and Rating */}
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-sm text-muted-foreground">4.8</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-muted-foreground text-sm line-clamp-2">
          {event.description}
        </p>

        {/* Event Details */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{event.date} at {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4 text-secondary" />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {event.tags.map((tag) => (
            <Badge 
              key={tag}
              variant="outline"
              className="text-xs border-border/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Spots Available</span>
            <span>{event.maxAttendees - event.attendees} left</span>
          </div>
          <div className="progress-bar h-2">
            <div 
              className="progress-fill"
              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <Button 
          className="w-full bg-gradient-primary hover:opacity-90 border-none text-white font-semibold"
        >
          Join Event
        </Button>
      </div>
    </div>
  );
};

export default EventCard;