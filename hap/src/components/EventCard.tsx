import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Star, Users } from "lucide-react";

interface EventCardProps {
  title: string;
  category: "comedy" | "movie" | "drama" | "music" | "art";
  date: string;
  location: string;
  price: string;
  rating: number;
  attendees: number;
  points: number;
  image?: string;
}

const categoryColors = {
  comedy: "bg-comedy-orange text-white",
  movie: "bg-movie-blue text-white", 
  drama: "bg-drama-red text-white",
  music: "bg-music-green text-white",
  art: "bg-primary text-primary-foreground"
};

const EventCard = ({ 
  title, 
  category, 
  date, 
  location, 
  price, 
  rating, 
  attendees, 
  points,
  image 
}: EventCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
      {/* Event Image */}
      <div className="relative h-48 bg-gradient-to-br from-muted to-accent overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <div className="text-6xl opacity-20">🎭</div>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <Badge className={categoryColors[category]} variant="secondary">
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </Badge>
        </div>
        <div className="absolute top-3 right-3 bg-points-gold text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
          <Star className="w-3 h-3 fill-current" />
          <span>{points} pts</span>
        </div>
      </div>

      <CardHeader className="pb-3">
        <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center space-x-1">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{attendees}</span>
            </div>
          </div>
          <div className="font-semibold text-lg">{price}</div>
        </div>
        
        <Button className="w-full" variant="default">
          Join Event
        </Button>
      </CardContent>
    </Card>
  );
};

export default EventCard;