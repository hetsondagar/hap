import { useState, useEffect, useCallback } from 'react';
import { gamificationAPI } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

interface BadgeNotification {
  id: string;
  achievement: any;
  timestamp: number;
}

export const useBadgeNotifications = () => {
  const [notifications, setNotifications] = useState<BadgeNotification[]>([]);
  const [previousBadgeCount, setPreviousBadgeCount] = useState<number>(0);

  // Check for new badges
  const checkForNewBadges = useCallback(async () => {
    try {
      const response = await gamificationAPI.getStats();
      const currentBadgeCount = response.data?.badges?.earned?.length || 0;
      
      if (currentBadgeCount > previousBadgeCount && previousBadgeCount > 0) {
        // New badge(s) earned
        const newBadges = response.data.badges.earned.slice(-(currentBadgeCount - previousBadgeCount));
        
        newBadges.forEach((badge: any) => {
          const notification: BadgeNotification = {
            id: `${badge.key}-${Date.now()}`,
            achievement: badge,
            timestamp: Date.now()
          };
          
          setNotifications(prev => [...prev, notification]);
          
          // Show toast notification
          toast.success(`🏆 Badge Earned: ${badge.name}!`, {
            description: `+${badge.xp} XP - ${badge.description}`,
            duration: 5000,
          });
        });
      }
      
      setPreviousBadgeCount(currentBadgeCount);
    } catch (error) {
      console.error('Error checking for new badges:', error);
    }
  }, [previousBadgeCount]);

  // Initialize badge count
  const initializeBadgeCount = useCallback(async () => {
    try {
      const response = await gamificationAPI.getStats();
      const initialCount = response.data?.badges?.earned?.length || 0;
      setPreviousBadgeCount(initialCount);
    } catch (error) {
      console.error('Error initializing badge count:', error);
    }
  }, []);

  // Remove notification
  const removeNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  }, []);

  // Clear all notifications
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    notifications.forEach(notification => {
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  // Check for badges periodically (every 30 seconds)
  useEffect(() => {
    const interval = setInterval(checkForNewBadges, 30000);
    return () => clearInterval(interval);
  }, [checkForNewBadges]);

  return {
    notifications,
    removeNotification,
    clearAllNotifications,
    initializeBadgeCount,
    checkForNewBadges
  };
};
