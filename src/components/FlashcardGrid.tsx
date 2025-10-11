import React, { useState, useEffect } from 'react';
import EnhancedFlashcard from './EnhancedFlashcard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Grid, List, Shuffle, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Flashcard {
  id: string | number;
  front: string;
  back: string;
  department?: string;
  year?: string;
  phase?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  isFavorite?: boolean;
  ownerId?: string; // used to authorize delete client-side
}

interface FlashcardGridProps {
  flashcards: Flashcard[];
  onFlip?: (id: string | number) => void;
  onDelete?: (id: string | number) => void;
  onEdit?: (id: string | number) => void;
  onToggleFavorite?: (id: string | number) => void;
  className?: string;
}

const FlashcardGrid: React.FC<FlashcardGridProps> = ({
  flashcards,
  onFlip,
  onDelete,
  onEdit,
  onToggleFavorite,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'difficulty' | 'alphabetical'>('newest');
  const [flippedCards, setFlippedCards] = useState<Set<string | number>>(new Set());

  // Get unique departments
  const departments = Array.from(new Set(flashcards.map(card => card.department).filter(Boolean)));

  // Filter and sort flashcards
  const filteredFlashcards = flashcards
    .filter(card => {
      const matchesSearch = card.front.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.back.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDepartment = filterDepartment === 'all' || card.department === filterDepartment;
      const matchesDifficulty = filterDifficulty === 'all' || card.difficulty === filterDifficulty;
      const matchesFavorites = !showFavoritesOnly || card.isFavorite;
      
      return matchesSearch && matchesDepartment && matchesDifficulty && matchesFavorites;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return a.front.localeCompare(b.front);
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          return (difficultyOrder[a.difficulty || 'medium'] || 2) - (difficultyOrder[b.difficulty || 'medium'] || 2);
        case 'oldest':
          return 0; // Assuming no timestamp for now
        default:
          return 0; // newest
      }
    });

  const handleFlip = (id: string | number) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
    onFlip?.(id);
  };

  const shuffleCards = () => {
    // This would trigger a re-render with shuffled order
    setSortBy(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterDepartment('all');
    setFilterDifficulty('all');
    setShowFavoritesOnly(false);
  };

  const activeFiltersCount = [
    searchTerm,
    filterDepartment !== 'all',
    filterDifficulty !== 'all',
    showFavoritesOnly
  ].filter(Boolean).length;

  return (
    <div className={cn("space-y-6", className)}>
      {/* Search and Filter Bar */}
      <div className="bg-card dark:bg-card/90 rounded-lg border border-border dark:border-border/60 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search flashcards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-background text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2">
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-40 bg-background">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map(dept => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-32 bg-background">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFavoritesOnly ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className="flex items-center gap-1"
            >
              <Star className="h-4 w-4" />
              Favorites
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={shuffleCards}
              className="flex items-center gap-1"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Search: "{searchTerm}"
                <button onClick={() => setSearchTerm('')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {filterDepartment !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Department: {filterDepartment}
                <button onClick={() => setFilterDepartment('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {filterDifficulty !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Difficulty: {filterDifficulty}
                <button onClick={() => setFilterDifficulty('all')} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            {showFavoritesOnly && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Favorites only
                <button onClick={() => setShowFavoritesOnly(false)} className="ml-1 hover:text-destructive">×</button>
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">
            {filteredFlashcards.length} flashcard{filteredFlashcards.length !== 1 ? 's' : ''}
          </h3>
          
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="alphabetical">A-Z</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Flashcard Grid/List */}
      {filteredFlashcards.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-muted-foreground mb-2">No flashcards found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className={cn(
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            : "space-y-4"
        )}>
          {filteredFlashcards.map((card, index) => (
            <div
              key={card.id}
              className="animate-in fade-in-0 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <EnhancedFlashcard
                {...card}
                isFlipped={flippedCards.has(card.id)}
                onFlip={handleFlip}
                onDelete={card.ownerId ? onDelete : undefined}
                onEdit={onEdit}
                onToggleFavorite={onToggleFavorite}
                className={viewMode === 'list' ? "h-32" : ""}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardGrid;
