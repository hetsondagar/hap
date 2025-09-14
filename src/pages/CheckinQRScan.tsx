import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  QrCode, 
  CheckCircle, 
  XCircle, 
  Camera, 
  Flashlight,
  FlashlightOff,
  MapPin,
  Calendar,
  Clock,
  Users,
  Zap,
  Star,
  Trophy,
  Crown,
  Target,
  Award,
  Sparkles,
  Gift,
  Heart,
  Share2,
  Download,
  RotateCcw
} from "lucide-react";

const CheckinQRScan = () => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [newBadge, setNewBadge] = useState(null);
  const [flashlightOn, setFlashlightOn] = useState(false);

  // Mock event data
  const event = {
    id: 1,
    title: "Tech Innovation Summit 2024",
    date: "2024-01-20",
    time: "7:00 PM",
    location: "Convention Center",
    organizer: "Tech Innovators Inc.",
    attendees: 450,
    maxAttendees: 500,
    points: 50,
    image: "/placeholder.svg"
  };

  const achievements = [
    { id: 1, name: "First Event", description: "Attend your first event", icon: Star, rarity: "common" },
    { id: 2, name: "Tech Enthusiast", description: "Attend 5 tech events", icon: Trophy, rarity: "rare" },
    { id: 3, name: "Early Bird", description: "Check in 30 minutes early", icon: Target, rarity: "epic" }
  ];

  const handleScan = () => {
    setScanning(true);
    
    // Simulate scanning process
    setTimeout(() => {
      setScanning(false);
      setScanResult(event);
      
      // Simulate check-in success
      setTimeout(() => {
        setCheckinSuccess(true);
        
        // Simulate badge unlock
        setTimeout(() => {
          setNewBadge(achievements[Math.floor(Math.random() * achievements.length)]);
        }, 1000);
      }, 500);
    }, 2000);
  };

  const resetScan = () => {
    setScanning(false);
    setScanResult(null);
    setCheckinSuccess(false);
    setNewBadge(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="text-center">
            <h1 className="text-4xl font-gaming font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
              Event Check-in
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Scan the QR code to check in and earn points
            </p>
          </div>
        </motion.div>

        {/* QR Scanner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card overflow-hidden">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                {/* Scanner Viewport */}
                <div className="relative mx-auto w-80 h-80">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    {scanning ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
                        />
                        <p className="text-lg font-semibold">Scanning QR Code...</p>
                        <p className="text-sm text-muted-foreground">Hold steady and point at the code</p>
                      </motion.div>
                    ) : scanResult ? (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="text-center"
                      >
                        <CheckCircle className="w-16 h-16 text-accent mx-auto mb-4" />
                        <p className="text-lg font-semibold text-accent">QR Code Detected!</p>
                        <p className="text-sm text-muted-foreground">Processing check-in...</p>
                      </motion.div>
                    ) : (
                      <div className="text-center">
                        <QrCode className="w-16 h-16 text-primary/50 mx-auto mb-4" />
                        <p className="text-lg font-semibold">Ready to Scan</p>
                        <p className="text-sm text-muted-foreground">Point your camera at the QR code</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Scanner Frame */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center space-x-4">
                  <Button
                    onClick={handleScan}
                    disabled={scanning}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {scanning ? "Scanning..." : "Start Scan"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setFlashlightOn(!flashlightOn)}
                  >
                    {flashlightOn ? <FlashlightOff className="w-4 h-4" /> : <Flashlight className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={resetScan}
                    disabled={!scanResult}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Check-in Success */}
        <AnimatePresence>
          {checkinSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mb-8"
            >
              <Card className="glass-card border-2 border-accent/30">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <CheckCircle className="w-20 h-20 text-accent mx-auto mb-4" />
                  </motion.div>
                  
                  <h2 className="text-3xl font-bold text-accent mb-2">Check-in Successful!</h2>
                  <p className="text-muted-foreground mb-6">Welcome to {event.title}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="p-4 glass rounded-lg">
                      <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
                      <div className="text-2xl font-bold text-accent">+{event.points}</div>
                      <div className="text-sm text-muted-foreground">Points Earned</div>
                    </div>
                    <div className="p-4 glass rounded-lg">
                      <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-primary">{event.attendees + 1}</div>
                      <div className="text-sm text-muted-foreground">Total Attendees</div>
                    </div>
                    <div className="p-4 glass rounded-lg">
                      <Calendar className="w-8 h-8 text-secondary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-secondary">1</div>
                      <div className="text-sm text-muted-foreground">Events This Month</div>
                    </div>
                  </div>

                  <div className="flex justify-center space-x-4">
                    <Button className="bg-gradient-primary hover:opacity-90">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Check-in
                    </Button>
                    <Button variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Ticket
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* New Badge Unlocked */}
        <AnimatePresence>
          {newBadge && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              className="mb-8"
            >
              <Card className="glass-card border-2 border-warning/30">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="mb-4"
                  >
                    <div className="w-20 h-20 bg-gradient-to-br from-warning/20 to-warning/10 rounded-full flex items-center justify-center mx-auto">
                      <newBadge.icon className="w-10 h-10 text-warning" />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Badge className="mb-4 bg-warning/20 text-warning border-warning/30">
                      <Sparkles className="w-3 h-3 mr-1" />
                      New Badge Unlocked!
                    </Badge>
                    
                    <h2 className="text-2xl font-bold mb-2">{newBadge.name}</h2>
                    <p className="text-muted-foreground mb-6">{newBadge.description}</p>
                    
                    <div className="flex justify-center space-x-4">
                      <Button className="bg-gradient-primary hover:opacity-90">
                        <Trophy className="w-4 h-4 mr-2" />
                        View All Badges
                      </Button>
                      <Button variant="outline">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share Achievement
                      </Button>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="w-6 h-6 mr-2 text-primary" />
                Event Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-8 h-8 text-primary/50" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{event.title}</h3>
                    <p className="text-muted-foreground">{event.organizer}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="w-4 h-4 mr-2" />
                    {event.attendees}/{event.maxAttendees} attendees
                  </div>
                  <div className="flex items-center text-sm text-accent">
                    <Zap className="w-4 h-4 mr-2" />
                    +{event.points} points
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CheckinQRScan;
