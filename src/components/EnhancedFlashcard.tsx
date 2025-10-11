import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Eye, EyeOff, Star, Trash2, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedFlashcardProps {
  id: string | number;
  front: string;
  back: string;
  department?: string;
  year?: string;
  phase?: string;
  isFlipped?: boolean;
  onFlip?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  difficulty?: 'easy' | 'medium' | 'hard';
  isFavorite?: boolean;
  onToggleFavorite?: (id: string | number) => void;
  className?: string;
}

const EnhancedFlashcard: React.FC<EnhancedFlashcardProps> = ({
  id,
  front,
  back,
  department,
  year,
  phase,
  isFlipped = false,
  onFlip,
  onDelete,
  onEdit,
  difficulty = 'medium',
  isFavorite = false,
  onToggleFavorite,
  className
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-500/20 dark:bg-green-500/30 text-green-700 dark:text-green-300 border-green-500/30 dark:border-green-500/50';
      case 'medium': return 'bg-yellow-500/20 dark:bg-yellow-500/30 text-yellow-700 dark:text-yellow-300 border-yellow-500/30 dark:border-yellow-500/50';
      case 'hard': return 'bg-red-500/20 dark:bg-red-500/30 text-red-700 dark:text-red-300 border-red-500/30 dark:border-red-500/50';
      default: return 'bg-muted dark:bg-muted/50 text-muted-foreground border-border dark:border-border/60';
    }
  };

  const getDifficultyIcon = (diff: string) => {
    switch (diff) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div
      className={cn(
        "group relative perspective-1000",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={cn(
          "relative w-full h-64 cursor-pointer transition-all duration-500 transform-gpu",
          "glass-effect circuit-pattern feature-card-hover",
          "border-2 border-border/50 dark:border-border/40",
          "hover:border-primary/40 dark:hover:border-primary/60",
          "bg-card dark:bg-card/80 backdrop-blur-sm",
          "shadow-lg hover:shadow-xl dark:shadow-2xl",
          "overflow-hidden"
        )}
        onClick={() => onFlip?.(id)}
      >
        {/* 3D Flip Effect */}
        <div
          className={cn(
            "relative w-full h-full transition-transform duration-700 transform-style-preserve-3d",
            isFlipped && "rotate-y-180"
          )}
        >
          {/* Front Side */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full backface-hidden",
              "flex flex-col justify-between p-6",
              "bg-gradient-to-br from-blue-100/90 via-indigo-100/90 to-blue-200/90",
              "dark:from-blue-950/60 dark:via-indigo-950/60 dark:to-blue-900/60",
              "border border-primary/30 dark:border-primary/40"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                {department && (
                  <Badge variant="secondary" className="text-xs bg-white/80 dark:bg-white/10 text-foreground dark:text-foreground border-white/40 dark:border-white/20">
                    {department}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className={cn("text-xs font-medium", getDifficultyColor(difficulty))}
                >
                  {getDifficultyIcon(difficulty)} {difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(id);
                    }}
                  >
                    <Star 
                      className={cn(
                        "h-4 w-4",
                        isFavorite ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" : "text-muted-foreground dark:text-foreground/60"
                      )} 
                    />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                    }}
                  >
                    <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 hover:text-destructive dark:hover:text-red-400 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center">
                <div className="text-5xl mb-4 drop-shadow-sm">❓</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed drop-shadow-sm">
                  {front}
                </h3>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {year && phase && `${year} • ${phase}`}
                {year && !phase && year}
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 font-medium">
                <Eye className="h-4 w-4" />
                <span>Click to reveal</span>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
              "flex flex-col justify-between p-6",
              "bg-gradient-to-br from-emerald-100/90 via-green-100/90 to-emerald-200/90",
              "dark:from-emerald-950/60 dark:via-green-950/60 dark:to-emerald-900/60",
              "border border-emerald-400/40 dark:border-emerald-500/40"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs bg-emerald-200 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-400/40 dark:border-emerald-500/40">
                  Answer
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs font-medium", getDifficultyColor(difficulty))}
                >
                  {getDifficultyIcon(difficulty)} {difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(id);
                    }}
                  >
                    <Star 
                      className={cn(
                        "h-4 w-4",
                        isFavorite ? "fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" : "text-muted-foreground dark:text-foreground/60"
                      )} 
                    />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                    }}
                  >
                    <Edit3 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0 bg-white/80 dark:bg-black/30 hover:bg-white dark:hover:bg-black/50 hover:text-destructive dark:hover:text-red-400 rounded-full backdrop-blur-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {/* Answer Content */}
            <div className="flex-1 flex items-center justify-center px-4">
              <div className="text-center">
                <div className="text-5xl mb-4 drop-shadow-sm">💡</div>
                <p className="text-lg font-bold text-gray-900 dark:text-white leading-relaxed drop-shadow-sm">
                  {back}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                {year && phase && `${year} • ${phase}`}
                {year && !phase && year}
              </div>
              <div className="flex items-center gap-2 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                <EyeOff className="h-4 w-4" />
                <span>Click to hide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flip Animation Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 dark:from-primary/5 dark:via-transparent dark:to-secondary/5 rounded-lg pointer-events-none transition-opacity duration-300" />
        )}
      </Card>

      {/* Floating Action Buttons */}
      {isHovered && (
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full shadow-lg bg-primary/90 hover:bg-primary dark:bg-primary/80 dark:hover:bg-primary text-white"
            onClick={(e) => {
              e.stopPropagation();
              onFlip?.(id);
            }}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default EnhancedFlashcard;
