import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Upload, 
  MapPin, 
  Calendar, 
  Clock,
  Users,
  DollarSign,
  Image,
  Settings,
  Zap,
  Star,
  Trophy,
  Gift,
  Target,
  Sparkles,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

const EventCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    date: "",
    time: "",
    duration: "",
    location: "",
    maxAttendees: "",
    price: "",
    image: null,
    rewards: {
      attendance: 0,
      earlyBird: 0,
      referral: 0
    },
    settings: {
      requireApproval: false,
      allowWaitlist: false,
      sendReminders: true
    }
  });

  const steps = [
    { id: 1, title: "Basic Info", description: "Event details and description" },
    { id: 2, title: "Date & Time", description: "Schedule and duration" },
    { id: 3, title: "Location", description: "Venue and capacity" },
    { id: 4, title: "Pricing", description: "Cost and payment" },
    { id: 5, title: "Media", description: "Images and content" },
    { id: 6, title: "Rewards", description: "Points and incentives" },
    { id: 7, title: "Settings", description: "Event configuration" },
    { id: 8, title: "Review", description: "Final confirmation" }
  ];

  const categories = [
    { value: "technology", label: "Technology", icon: Settings },
    { value: "music", label: "Music", icon: Star },
    { value: "sports", label: "Sports", icon: Trophy },
    { value: "art", label: "Art & Culture", icon: Image },
    { value: "business", label: "Business", icon: Target },
    { value: "education", label: "Education", icon: Zap },
    { value: "social", label: "Social", icon: Users }
  ];

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateNestedFormData = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof typeof prev],
        [field]: value
      }
    }));
  };

  const progress = (currentStep / steps.length) * 100;

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
              Create Event
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow the wizard to create an amazing event that people will love
            </p>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Step {currentStep} of {steps.length}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-3" />
                <div className="flex justify-between">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center space-y-2 ${
                        step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        step.id < currentStep 
                          ? 'bg-accent text-white' 
                          : step.id === currentStep 
                            ? 'bg-primary text-white' 
                            : 'bg-muted text-muted-foreground'
                      }`}>
                        {step.id < currentStep ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      <div className="text-xs text-center max-w-20">
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-muted-foreground">{step.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Form Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card">
            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {/* Step 1: Basic Info */}
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Basic Information</h2>
                      <p className="text-muted-foreground">Tell us about your event</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Event Title</Label>
                        <Input
                          id="title"
                          placeholder="Enter event title"
                          value={formData.title}
                          onChange={(e) => updateFormData('title', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your event..."
                          rows={4}
                          value={formData.description}
                          onChange={(e) => updateFormData('description', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label>Category</Label>
                        <Select value={formData.category} onValueChange={(value) => updateFormData('category', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => {
                              const Icon = category.icon;
                              return (
                                <SelectItem key={category.value} value={category.value}>
                                  <div className="flex items-center space-x-2">
                                    <Icon className="w-4 h-4" />
                                    <span>{category.label}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Date & Time */}
                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Date & Time</h2>
                      <p className="text-muted-foreground">When will your event take place?</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={formData.date}
                          onChange={(e) => updateFormData('date', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={formData.time}
                          onChange={(e) => updateFormData('time', e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Input
                        id="duration"
                        type="number"
                        placeholder="2"
                        value={formData.duration}
                        onChange={(e) => updateFormData('duration', e.target.value)}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Location</h2>
                      <p className="text-muted-foreground">Where will your event be held?</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="location">Venue/Address</Label>
                        <Input
                          id="location"
                          placeholder="Enter venue or address"
                          value={formData.location}
                          onChange={(e) => updateFormData('location', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="maxAttendees">Maximum Attendees</Label>
                        <Input
                          id="maxAttendees"
                          type="number"
                          placeholder="100"
                          value={formData.maxAttendees}
                          onChange={(e) => updateFormData('maxAttendees', e.target.value)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Pricing */}
                {currentStep === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Pricing</h2>
                      <p className="text-muted-foreground">Set the cost for your event</p>
                    </div>

                    <div>
                      <Label htmlFor="price">Price per person</Label>
                      <Input
                        id="price"
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => updateFormData('price', e.target.value)}
                      />
                      <p className="text-sm text-muted-foreground mt-1">Enter 0 for free events</p>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Media */}
                {currentStep === 5 && (
                  <motion.div
                    key="step5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Media</h2>
                      <p className="text-muted-foreground">Upload images for your event</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Event Image</Label>
                        <div className="mt-2">
                          <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center border-2 border-dashed border-primary/30">
                            <div className="text-center">
                              <Upload className="w-12 h-12 text-primary/50 mx-auto mb-2" />
                              <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Rewards */}
                {currentStep === 6 && (
                  <motion.div
                    key="step6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Rewards</h2>
                      <p className="text-muted-foreground">Set points for attendees</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="attendance">Attendance Points</Label>
                        <Input
                          id="attendance"
                          type="number"
                          placeholder="50"
                          value={formData.rewards.attendance}
                          onChange={(e) => updateNestedFormData('rewards', 'attendance', parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="earlyBird">Early Bird Bonus</Label>
                        <Input
                          id="earlyBird"
                          type="number"
                          placeholder="25"
                          value={formData.rewards.earlyBird}
                          onChange={(e) => updateNestedFormData('rewards', 'earlyBird', parseInt(e.target.value) || 0)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="referral">Referral Bonus</Label>
                        <Input
                          id="referral"
                          type="number"
                          placeholder="100"
                          value={formData.rewards.referral}
                          onChange={(e) => updateNestedFormData('rewards', 'referral', parseInt(e.target.value) || 0)}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 7: Settings */}
                {currentStep === 7 && (
                  <motion.div
                    key="step7"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Settings</h2>
                      <p className="text-muted-foreground">Configure event preferences</p>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="requireApproval"
                          checked={formData.settings.requireApproval}
                          onCheckedChange={(checked) => updateNestedFormData('settings', 'requireApproval', checked)}
                        />
                        <Label htmlFor="requireApproval">Require approval for attendees</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="allowWaitlist"
                          checked={formData.settings.allowWaitlist}
                          onCheckedChange={(checked) => updateNestedFormData('settings', 'allowWaitlist', checked)}
                        />
                        <Label htmlFor="allowWaitlist">Allow waitlist when full</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="sendReminders"
                          checked={formData.settings.sendReminders}
                          onCheckedChange={(checked) => updateNestedFormData('settings', 'sendReminders', checked)}
                        />
                        <Label htmlFor="sendReminders">Send reminder notifications</Label>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 8: Review */}
                {currentStep === 8 && (
                  <motion.div
                    key="step8"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold mb-2">Review & Create</h2>
                      <p className="text-muted-foreground">Review your event details before publishing</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 glass rounded-lg">
                        <h3 className="font-semibold text-lg">{formData.title}</h3>
                        <p className="text-muted-foreground">{formData.description}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 glass rounded-lg">
                          <div className="text-sm text-muted-foreground">Date & Time</div>
                          <div className="font-semibold">{formData.date} at {formData.time}</div>
                        </div>
                        <div className="p-4 glass rounded-lg">
                          <div className="text-sm text-muted-foreground">Location</div>
                          <div className="font-semibold">{formData.location}</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 glass rounded-lg">
                          <div className="text-sm text-muted-foreground">Max Attendees</div>
                          <div className="font-semibold">{formData.maxAttendees}</div>
                        </div>
                        <div className="p-4 glass rounded-lg">
                          <div className="text-sm text-muted-foreground">Price</div>
                          <div className="font-semibold">${formData.price || 'Free'}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-between mt-8"
        >
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          {currentStep < steps.length ? (
            <Button
              onClick={nextStep}
              className="bg-gradient-primary hover:opacity-90"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              className="bg-gradient-primary hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventCreationWizard;
