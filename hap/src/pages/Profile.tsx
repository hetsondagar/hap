import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Trophy, Calendar, TrendingUp, Zap, Gift } from "lucide-react";

const Profile = () => {
  const userStats = {
    name: "Alex Chen",
    level: 5,
    totalPoints: 1250,
    nextLevelPoints: 1500,
    eventsAttended: 23,
    favoriteCategory: "Comedy",
    joinDate: "March 2024"
  };

  const achievements = [
    { id: 1, title: "First Event", description: "Attended your first event", icon: "🎉", unlocked: true },
    { id: 2, title: "Comedy Lover", description: "Attended 5 comedy shows", icon: "😂", unlocked: true },
    { id: 3, title: "Social Butterfly", description: "Attended 10 events", icon: "🦋", unlocked: true },
    { id: 4, title: "Culture Explorer", description: "Attended events in 3+ categories", icon: "🎭", unlocked: true },
    { id: 5, title: "Weekend Warrior", description: "Attended 20 events", icon: "⚔️", unlocked: true },
    { id: 6, title: "Experience Hunter", description: "Attended 50 events", icon: "🏹", unlocked: false },
    { id: 7, title: "Event Master", description: "Reached level 10", icon: "👑", unlocked: false },
    { id: 8, title: "Community Leader", description: "Invited 10 friends", icon: "🌟", unlocked: false }
  ];

  const recentEvents = [
    { title: "Stand-up Comedy Night", date: "Dec 10", points: 50, category: "comedy" },
    { title: "Jazz Concert", date: "Dec 8", points: 60, category: "music" },
    { title: "Art Gallery Opening", date: "Dec 5", points: 40, category: "art" },
    { title: "Movie Premiere", date: "Dec 2", points: 35, category: "movie" }
  ];

  const progressToNext = ((userStats.totalPoints % 250) / 250) * 100;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src="" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary text-primary-foreground">
                AC
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">{userStats.name}</h1>
              <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                <Badge variant="secondary" className="text-sm font-semibold">
                  Level {userStats.level}
                </Badge>
                <div className="flex items-center space-x-1 text-points-gold">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-semibold">{userStats.totalPoints} Points</span>
                </div>
              </div>
              
              <div className="max-w-md mx-auto md:mx-0">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to Level {userStats.level + 1}</span>
                  <span>{userStats.totalPoints % 250}/250 pts</span>
                </div>
                <Progress value={progressToNext} className="h-2" />
              </div>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Gift className="w-4 h-4 mr-2" />
                Redeem Points
              </Button>
              <Button size="sm">
                <Zap className="w-4 h-4 mr-2" />
                Boost Level
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Stats Cards */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold">{userStats.eventsAttended}</div>
                  <div className="text-sm text-muted-foreground">Events Attended</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-music-green" />
                  <div className="text-2xl font-bold">{userStats.favoriteCategory}</div>
                  <div className="text-sm text-muted-foreground">Favorite Category</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <Trophy className="w-8 h-8 mx-auto mb-2 text-points-gold" />
                  <div className="text-2xl font-bold">{achievements.filter(a => a.unlocked).length}</div>
                  <div className="text-sm text-muted-foreground">Achievements</div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Events */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div>
                        <h4 className="font-semibold">{event.title}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="capitalize">
                          {event.category}
                        </Badge>
                        <div className="flex items-center space-x-1 text-points-gold font-semibold">
                          <Star className="w-4 h-4 fill-current" />
                          <span>+{event.points}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-points-gold" />
                  <span>Achievements</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-3 rounded-lg border transition-all ${
                        achievement.unlocked
                          ? "bg-points-gold/10 border-points-gold/20"
                          : "bg-muted/30 border-border opacity-60"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm">{achievement.title}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <div className="text-points-gold">
                            <Star className="w-4 h-4 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;