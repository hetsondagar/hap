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
      case 'easy': return 'bg-success/10 text-success border-success/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'hard': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted text-muted-foreground border-border';
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
          "border-2 border-white/10 dark:border-white/20",
          "bg-card dark:bg-card/50",
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
              "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/20",
              "border border-primary/20"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                {department && (
                <Badge variant="secondary" className="text-xs">
                    {department}
                  </Badge>
                )}
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getDifficultyColor(difficulty))}
                >
                  {getDifficultyIcon(difficulty)} {difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(id);
                    }}
                  >
                    <Star 
                      className={cn(
                        "h-3 w-3",
                        isFavorite ? "fill-warning text-warning" : "text-muted-foreground"
                      )} 
                    />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                    }}
                  >
                    <Edit3 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">❓</div>
                <h3 className="text-lg font-semibold text-foreground leading-relaxed">
                  {front}
                </h3>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {year && phase && `${year} • ${phase}`}
              </div>
              <div className="flex items-center gap-2 text-sm text-primary">
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
              "bg-gradient-to-br from-green-50 to-emerald-100 dark:from-emerald-950/30 dark:to-green-950/20",
              "border border-green-200 dark:border-green-900/40"
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  Answer
                </Badge>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getDifficultyColor(difficulty))}
                >
                  {getDifficultyIcon(difficulty)} {difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onToggleFavorite && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(id);
                    }}
                  >
                    <Star 
                      className={cn(
                        "h-3 w-3",
                        isFavorite ? "fill-warning text-warning" : "text-muted-foreground"
                      )} 
                    />
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(id);
                    }}
                  >
                    <Edit3 className="h-3 w-3 text-muted-foreground" />
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>
            </div>

            {/* Answer Content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">💡</div>
                <p className="text-lg font-medium text-foreground leading-relaxed">
                  {back}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                {year && phase && `${year} • ${phase}`}
              </div>
              <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <EyeOff className="h-4 w-4" />
                <span>Click to hide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flip Animation Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/5 rounded-lg pointer-events-none transition-opacity duration-300" />
        )}
      </Card>

      {/* Floating Action Buttons */}
      {isHovered && (
        <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Button
            size="sm"
            variant="secondary"
            className="h-8 w-8 p-0 rounded-full shadow-lg"
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
