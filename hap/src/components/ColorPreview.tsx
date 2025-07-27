import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Zap } from "lucide-react";

interface ColorScheme {
  name: string;
  description: string;
  primary: string;
  secondary: string;
  accent: string;
  pointsGold: string;
  style: Record<string, string>;
}

const ColorPreview = () => {
  const colorSchemes: ColorScheme[] = [
    {
      name: "Current (Purple Magic)",
      description: "Vibrant purple and pink for entertainment",
      primary: "280 100% 70%",
      secondary: "320 100% 85%", 
      accent: "320 100% 88%",
      pointsGold: "45 100% 60%",
      style: {
        '--primary': '280 100% 70%',
        '--secondary': '320 100% 85%',
        '--accent': '320 100% 88%',
        '--points-gold': '45 100% 60%'
      }
    },
    {
      name: "Sunset Vibes",
      description: "Warm orange, pink and coral energy",
      primary: "20 100% 60%",
      secondary: "340 100% 70%",
      accent: "10 100% 65%", 
      pointsGold: "45 100% 60%",
      style: {
        '--primary': '20 100% 60%',
        '--secondary': '340 100% 70%',
        '--accent': '10 100% 65%',
        '--points-gold': '45 100% 60%'
      }
    },
    {
      name: "Ocean Energy",
      description: "Cool blues and teals for freshness",
      primary: "200 100% 60%",
      secondary: "180 100% 65%",
      accent: "190 100% 70%",
      pointsGold: "45 100% 60%",
      style: {
        '--primary': '200 100% 60%',
        '--secondary': '180 100% 65%',
        '--accent': '190 100% 70%',
        '--points-gold': '45 100% 60%'
      }
    },
    {
      name: "Nature Fresh", 
      description: "Green and mint for natural vibes",
      primary: "140 80% 55%",
      secondary: "120 60% 65%",
      accent: "160 70% 70%",
      pointsGold: "45 100% 60%",
      style: {
        '--primary': '140 80% 55%',
        '--secondary': '120 60% 65%',
        '--accent': '160 70% 70%',
        '--points-gold': '45 100% 60%'
      }
    },
    {
      name: "Electric",
      description: "Bold purple and magenta power",
      primary: "280 100% 65%",
      secondary: "310 100% 70%", 
      accent: "260 90% 75%",
      pointsGold: "50 100% 65%",
      style: {
        '--primary': '280 100% 65%',
        '--secondary': '310 100% 70%',
        '--accent': '260 90% 75%',
        '--points-gold': '50 100% 65%'
      }
    },
    {
      name: "Peachy",
      description: "Soft peach and coral warmth",
      primary: "15 100% 70%",
      secondary: "350 80% 75%",
      accent: "25 90% 65%",
      pointsGold: "40 100% 60%",
      style: {
        '--primary': '15 100% 70%',
        '--secondary': '350 80% 75%',
        '--accent': '25 90% 65%',
        '--points-gold': '40 100% 60%'
      }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Color Theme Preview</h2>
        <p className="text-xl text-muted-foreground">
          See how different color combinations would look on HAP
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {colorSchemes.map((scheme, index) => (
          <div key={index} style={scheme.style} className="theme-preview">
            <Card className="overflow-hidden hover:shadow-xl transition-all duration-300">
              <CardHeader 
                className="text-center relative"
                style={{
                  background: `linear-gradient(135deg, hsl(${scheme.primary}), hsl(${scheme.secondary}))`
                }}
              >
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative">
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `hsl(${scheme.primary})` }}
                    >
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-bold text-white">HAP</span>
                  </div>
                  <p className="text-white/90 text-sm">make it happen!</p>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <CardTitle className="mb-2">{scheme.name}</CardTitle>
                <p className="text-muted-foreground text-sm mb-4">{scheme.description}</p>
                
                {/* Sample UI Elements */}
                <div className="space-y-3">
                  <Button 
                    className="w-full"
                    style={{ 
                      backgroundColor: `hsl(${scheme.primary})`,
                      color: 'white'
                    }}
                  >
                    Join Event
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Badge 
                      style={{ 
                        backgroundColor: `hsl(${scheme.secondary})`,
                        color: `hsl(${scheme.primary})`
                      }}
                    >
                      Comedy
                    </Badge>
                    <div 
                      className="flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: `hsl(${scheme.pointsGold})` }}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      <span>50 pts</span>
                    </div>
                  </div>

                  {/* Color Swatches */}
                  <div className="flex space-x-2 pt-2">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${scheme.primary})` }}
                      title="Primary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${scheme.secondary})` }}
                      title="Secondary"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${scheme.accent})` }}
                      title="Accent"
                    />
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: `hsl(${scheme.pointsGold})` }}
                      title="Points Gold"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
        <p className="text-muted-foreground mb-4">
          Like one of these themes? Let me know and I'll apply it to the entire website!
        </p>
        <Button variant="outline">
          Apply Selected Theme
        </Button>
      </div>
    </div>
  );
};

export default ColorPreview;