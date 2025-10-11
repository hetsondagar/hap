import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, 
  Lock, 
  Star, 
  Sparkles,
  Award,
  BookOpen,
  Layers,
  MessageSquare,
  Target,
  Flame,
  Crown
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnimatedBadgeProps {
  achievement: any;
  isEarned: boolean;
  progress?: number; // 0-100 for progress animation
  showProgress?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onAnimationComplete?: () => void;
}

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  achievement,
  isEarned,
  progress = 0,
  showProgress = false,
  size = 'md',
  className,
  onAnimationComplete
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [progressValue, setProgressValue] = useState(0);

  const getBadgeIcon = (badgeKey: string) => {
    if (badgeKey.includes('flashcard')) return BookOpen;
    if (badgeKey.includes('deck')) return Layers;
    if (badgeKey.includes('streak')) return Flame;
    if (badgeKey.includes('quiz')) return Target;
    if (badgeKey.includes('perfect')) return Star;
    if (badgeKey.includes('community') || badgeKey.includes('social') || badgeKey.includes('discussion')) return MessageSquare;
    if (badgeKey.includes('level')) return Crown;
    return Award;
  };

  const getBadgeColor = (badgeKey: string, earned: boolean) => {
    if (!earned) return 'bg-muted/50';
    
    // Tier-based colors
    if (badgeKey.includes('100') || badgeKey.includes('level_20')) return 'bg-gradient-to-br from-purple-500 to-pink-500';
    if (badgeKey.includes('50') || badgeKey.includes('level_10')) return 'bg-gradient-to-br from-yellow-500 to-orange-500';
    if (badgeKey.includes('25') || badgeKey.includes('30') || badgeKey.includes('level_5')) return 'bg-gradient-to-br from-blue-500 to-cyan-500';
    if (badgeKey.includes('10') || badgeKey.includes('7')) return 'bg-gradient-to-br from-green-500 to-emerald-500';
    return 'bg-gradient-to-br from-gray-500 to-slate-500';
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          icon: 'w-10 h-10',
          iconSize: 'w-5 h-5',
          title: 'text-sm font-bold',
          description: 'text-xs'
        };
      case 'lg':
        return {
          container: 'p-8',
          icon: 'w-20 h-20',
          iconSize: 'w-10 h-10',
          title: 'text-xl font-bold',
          description: 'text-sm'
        };
      default:
        return {
          container: 'p-6',
          icon: 'w-16 h-16',
          iconSize: 'w-8 h-8',
          title: 'text-lg font-bold',
          description: 'text-sm'
        };
    }
  };

  const sizeClasses = getSizeClasses();
  const Icon = getBadgeIcon(achievement.key);

  // Progress animation effect
  useEffect(() => {
    if (showProgress && progress > 0) {
      setIsAnimating(true);
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += 2;
        setProgressValue(currentProgress);
        if (currentProgress >= progress) {
          clearInterval(interval);
          setProgressValue(progress);
          setIsAnimating(false);
        }
      }, 50);
      return () => clearInterval(interval);
    }
  }, [progress, showProgress]);

  // Celebration animation when badge is earned
  useEffect(() => {
    if (isEarned && !showCelebration) {
      setShowCelebration(true);
      const timer = setTimeout(() => {
        setShowCelebration(false);
        onAnimationComplete?.();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isEarned, showCelebration, onAnimationComplete]);

  return (
    <div className={cn("relative", className)}>
      <Card 
        className={cn(
          "glass-effect circuit-pattern border-2 transition-all duration-500 relative overflow-hidden",
          isEarned 
            ? "border-white/20 shadow-lg hover:shadow-xl" 
            : "border-white/10 opacity-70 hover:opacity-100",
          showCelebration && "animate-pulse shadow-2xl border-yellow-400/50"
        )}
      >
        {/* Celebration Sparkles */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <Sparkles
                key={i}
                className={cn(
                  "absolute text-yellow-400 animate-ping",
                  `w-${3 + (i % 3)} h-${3 + (i % 3)}`
                )}
                style={{
                  top: `${20 + (i * 7)}%`,
                  left: `${10 + (i * 8)}%`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '1s'
                }}
              />
            ))}
          </div>
        )}

        {/* Progress Ring for unearned badges */}
        {!isEarned && showProgress && progress > 0 && (
          <div className="absolute top-2 right-2">
            <div className="relative w-8 h-8">
              <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeDasharray={`${progressValue}, 100`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
                {Math.round(progressValue)}%
              </span>
            </div>
          </div>
        )}

        {/* Earned Checkmark */}
        {isEarned && (
          <div className="absolute top-2 right-2 z-10">
            <CheckCircle2 className={cn(
              "text-green-500 transition-all duration-500",
              showCelebration ? "scale-150 animate-bounce" : "scale-100",
              sizeClasses.iconSize
            )} />
          </div>
        )}

        {/* Lock for unearned badges */}
        {!isEarned && !showProgress && (
          <div className="absolute top-2 right-2">
            <Lock className={cn("text-muted-foreground", sizeClasses.iconSize)} />
          </div>
        )}

        <div className={cn("flex items-start space-x-4", sizeClasses.container)}>
          <div className={cn(
            "relative rounded-xl flex items-center justify-center shadow-lg transition-all duration-500",
            sizeClasses.icon,
            getBadgeColor(achievement.key, isEarned),
            showCelebration && "animate-pulse scale-110",
            isAnimating && "animate-pulse"
          )}>
            <Icon className={cn(
              "text-white transition-all duration-500",
              sizeClasses.iconSize,
              !isEarned && "opacity-50",
              showCelebration && "animate-spin"
            )} />
            
            {/* Shine effect for earned badges */}
            {isEarned && (
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 animate-shine" />
            )}
          </div>

          <div className="flex-1">
            <h3 className={cn(
              sizeClasses.title,
              "mb-1 transition-colors duration-300",
              isEarned ? "text-foreground" : "text-muted-foreground"
            )}>
              {achievement.name}
            </h3>
            <p className={cn(
              sizeClasses.description,
              "text-muted-foreground mb-3 transition-colors duration-300"
            )}>
              {achievement.description}
            </p>

            {/* Progress Bar for unearned badges */}
            {!isEarned && showProgress && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Progress</span>
                  <span className="text-xs font-medium text-primary">{Math.round(progressValue)}%</span>
                </div>
                <Progress 
                  value={progressValue} 
                  className="h-2 transition-all duration-500"
                />
              </div>
            )}

            {achievement.xp > 0 && (
              <div className="flex items-center gap-1">
                <Star className={cn(
                  "text-yellow-500 transition-all duration-500",
                  size === 'sm' ? "w-3 h-3" : size === 'lg' ? "w-5 h-5" : "w-4 h-4",
                  showCelebration && "animate-pulse"
                )} />
                <span className={cn(
                  "font-medium transition-colors duration-300",
                  size === 'sm' ? "text-xs" : "text-sm",
                  isEarned ? "text-foreground" : "text-muted-foreground"
                )}>
                  +{achievement.xp} XP
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Celebration Message */}
        {showCelebration && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse" />
        )}
      </Card>

      {/* Floating celebration elements */}
      {showCelebration && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce text-yellow-400"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '2s'
              }}
            >
              <Sparkles className="w-4 h-4" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnimatedBadge;
