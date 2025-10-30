import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Star, Sparkles, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BadgeNotificationProps {
  achievement: any;
  isVisible: boolean;
  onClose: () => void;
  autoCloseDelay?: number;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({
  achievement,
  isVisible,
  onClose,
  autoCloseDelay = 5000
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const getBadgeIcon = (badgeKey: string) => {
    if (badgeKey.includes('flashcard')) return '📚';
    if (badgeKey.includes('deck')) return '📦';
    if (badgeKey.includes('streak')) return '🔥';
    if (badgeKey.includes('quiz')) return '🎯';
    if (badgeKey.includes('perfect')) return '⭐';
    if (badgeKey.includes('community') || badgeKey.includes('social') || badgeKey.includes('discussion')) return '💬';
    if (badgeKey.includes('level')) return '👑';
    return '🏆';
  };

  const getBadgeColor = (badgeKey: string) => {
    if (badgeKey.includes('100') || badgeKey.includes('level_20')) return 'from-orange-500 to-amber-500';
    if (badgeKey.includes('50') || badgeKey.includes('level_10')) return 'from-yellow-500 to-orange-500';
    if (badgeKey.includes('25') || badgeKey.includes('30') || badgeKey.includes('level_5')) return 'from-blue-500 to-cyan-500';
    if (badgeKey.includes('10') || badgeKey.includes('7')) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-slate-500';
  };

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDelay, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right">
      <Card className={cn(
        "relative overflow-hidden border-2 border-yellow-400/50 shadow-2xl",
        "bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20",
        "backdrop-blur-lg p-6 max-w-sm",
        isAnimating && "animate-celebration-bounce"
      )}>
        {/* Celebration Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <Sparkles
              key={i}
              className="absolute text-yellow-400 animate-ping"
              style={{
                top: `${20 + (i * 10)}%`,
                left: `${10 + (i * 12)}%`,
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1s'
              }}
            />
          ))}
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 p-1 rounded-full hover:bg-black/10 transition-colors"
        >
          <X className="h-4 w-4 text-gray-600" />
        </button>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-start gap-4">
            {/* Badge Icon */}
            <div className={cn(
              "w-16 h-16 bg-gradient-to-br rounded-xl flex items-center justify-center shadow-lg",
              getBadgeColor(achievement.key),
              "animate-pulse"
            )}>
              <span className="text-2xl">{getBadgeIcon(achievement.key)}</span>
            </div>

            {/* Text Content */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                <span className="text-lg font-bold text-yellow-800 dark:text-yellow-200">
                  Badge Earned!
                </span>
              </div>
              
              <h3 className="font-bold text-lg mb-1 text-gray-900 dark:text-white">
                {achievement.name}
              </h3>
              
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                {achievement.description}
              </p>

              {achievement.xp > 0 && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-700 dark:text-yellow-300">
                    +{achievement.xp} XP
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse" />
      </Card>
    </div>
  );
};

export default BadgeNotification;
