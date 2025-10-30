import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Loader2, BookOpen, Plus, Eye, Search, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CreateDeckDialog from "./community/CreateDeckDialog";
import { communityAPI, authAPI } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

type Deck = {
  _id: string;
  title?: string;
  description?: string;
  department?: string;
  year?: string;
  difficulty?: string;
  tags?: string[];
  likes?: any[];
  comments?: Array<{
    userId: string;
    username: string;
    year?: string;
    text: string;
    createdAt: string;
  }>;
  creator?: { _id?: string; username?: string } | string;
  creatorId?: { _id?: string; username?: string } | string;
  flashcards?: any[];
  createdAt?: string;
};

const FlashcardDecksPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserYear, setCurrentUserYear] = useState<string>("");
  const [userLikedDecks, setUserLikedDecks] = useState<Set<string>>(new Set());
  const [deckComments, setDeckComments] = useState<{[key: string]: string}>({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    // Get current user info
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    const storedUserInfo = localStorage.getItem("userInfo");

    if (storedUserId) setCurrentUserId(storedUserId);
    if (storedUsername) setCurrentUsername(storedUsername);

    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setCurrentUserYear(user.year || '');
    }

    // Load user profile to get liked decks
    (async () => {
      try {
        const prof = await authAPI.getProfile();
        const userData = prof?.data?.user || prof?.user || prof?.data || prof;
        if (userData) {
          setCurrentUsername(userData.username || storedUsername || '');
          setCurrentUserYear(userData.year || '');
          setCurrentUserId(userData.id || userData._id || storedUserId || '');
          
          // Get liked decks - handle both ObjectId strings and populated objects
          if (userData.likedDecks && Array.isArray(userData.likedDecks)) {
            const likedDeckIds = userData.likedDecks.map((d: any) => {
              // Handle if it's a string ID or an object with _id
              if (typeof d === 'string') return d;
              return d._id || d.id || d;
            }).filter(Boolean);
            
            console.log('Loaded liked decks:', likedDeckIds);
            setUserLikedDecks(new Set(likedDeckIds));
          }
        }
      } catch (e) {
        console.error('Error fetching user profile:', e);
      }
    })();

    loadDecks();
  }, [navigate]);

  const loadDecks = async () => {
    try {
      setLoading(true);
      const res = await communityAPI.getDecks({
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 100
      });

      const items: Deck[] = res?.data?.decks || res?.decks || res?.data || res || [];
      setDecks(items);
    } catch (e: any) {
      toast.error("Failed to load decks");
    } finally {
      setLoading(false);
    }
  };

  const handleLikeDeck = async (id: string) => {
    try {
      const response = await communityAPI.likeDeck(id);

      // Update local state
      setDecks(decks.map(deck => {
        if (deck._id === id) {
          const currentLikes = Array.isArray(deck.likes) ? deck.likes.length : Number(deck.likes || 0);
          const isNowLiked = !userLikedDecks.has(id);
          return {
            ...deck,
            likes: isNowLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
          };
        }
        return deck;
      }));

      // Update liked decks set
      setUserLikedDecks(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    } catch (e: any) {
      if (e?.message?.includes('401')) {
        navigate('/login');
      } else {
        toast.error("Failed to like deck");
      }
    }
  };

  const handleCommentDeck = async (id: string) => {
    const text = deckComments[id]?.trim();
    if (!text) return;

    try {
      await communityAPI.commentDeck(id, { text });

      // Update deck comments locally
      setDecks(decks.map(deck => {
        if (deck._id === id) {
          const newComment = {
            userId: currentUserId,
            username: currentUsername || 'You',
            year: currentUserYear,
            text: text,
            createdAt: new Date().toISOString()
          };
          const comments = Array.isArray(deck.comments) ? [...deck.comments, newComment] : [newComment];
          return { ...deck, comments };
        }
        return deck;
      }));

      setDeckComments({ ...deckComments, [id]: "" });
      toast.success("Comment added!");
    } catch (e: any) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!confirm('Delete this deck? This cannot be undone.')) return;

    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/community/decks/${deckId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      setDecks(decks.filter(deck => deck._id !== deckId));
      toast.success("Deck deleted!");
    } catch (e: any) {
      toast.error("Failed to delete deck");
    }
  };

  const filteredDecks = useMemo(() => {
    return decks.filter(deck => {
      // Tab filtering
      if (activeTab === "mine") {
        const creatorId = typeof deck.creatorId === 'object' ? deck.creatorId?._id : deck.creatorId;
        if (creatorId !== currentUserId) return false;
      } else if (activeTab === "liked") {
        if (!userLikedDecks.has(deck._id)) return false;
      }

      // Search filtering
      if (query.trim()) {
        const searchLower = query.toLowerCase();
        return (
          deck.title?.toLowerCase().includes(searchLower) ||
          deck.description?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    });
  }, [decks, activeTab, query, currentUserId, userLikedDecks]);

  const likeCount = (deck: Deck) => Array.isArray(deck.likes) ? deck.likes.length : Number(deck.likes || 0);
  const commentCount = (deck: Deck) => Array.isArray(deck.comments) ? deck.comments.length : Number(deck.comments || 0);

  return (
    <div className="min-h-screen">
      <Header />

      <div className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">Flashcard Decks</h1>
                <p className="text-lg text-muted-foreground">
                  Explore and create organized flashcard collections
                </p>
              </div>
              <CreateDeckDialog onCreated={(id) => {
                loadDecks();
                toast.success('Deck created successfully! Opening deck...');
                setTimeout(() => navigate(`/decks/${id}`), 500);
              }} />
            </div>

            {/* Search */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search decks..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="all">All Decks</TabsTrigger>
              <TabsTrigger value="mine">My Decks</TabsTrigger>
              <TabsTrigger value="liked">Liked</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredDecks.length === 0 ? (
                <Card className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
                  <CardContent className="py-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <p className="text-muted-foreground">
                      {activeTab === "mine" ? "You haven't created any decks yet" :
                       activeTab === "liked" ? "You haven't liked any decks yet" :
                       "No decks found"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDecks.map((deck) => {
                    const creatorId = typeof deck.creatorId === 'object' ? deck.creatorId?._id : deck.creatorId;
                    const creatorName = typeof deck.creatorId === 'object' ? deck.creatorId?.username : 
                                       typeof deck.creator === 'object' ? deck.creator?.username : 
                                       typeof deck.creator === 'string' ? deck.creator : 'Unknown';
                    const isOwner = currentUserId && creatorId === currentUserId;
                    const isLiked = userLikedDecks.has(deck._id);

                    return (
                      <Card key={deck._id} className="glass-effect circuit-pattern feature-card-hover border-2 border-white/10 dark:border-white/20 flex flex-col">
                        <CardHeader>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <CardTitle className="text-lg line-clamp-2">{deck.title || "Untitled Deck"}</CardTitle>
                            {isOwner && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-destructive hover:text-destructive h-7 w-7 p-0"
                                onClick={() => handleDeleteDeck(deck._id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {deck.description || "No description"}
                          </p>
                          <div className="flex gap-2 flex-wrap mt-2">
                            {deck.difficulty && <Badge variant="secondary">{deck.difficulty}</Badge>}
                            <Badge variant="outline">{deck.flashcards?.length || 0} cards</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col justify-between">
                          <div className="text-xs text-muted-foreground mb-3">
                            by <span className="font-semibold text-primary">{creatorName}</span>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center justify-between border-t border-border pt-3">
                            <button
                              className="flex items-center gap-1 text-sm hover:text-pink-600 transition group"
                              onClick={() => handleLikeDeck(deck._id)}
                            >
                              <Heart
                                className={`h-5 w-5 transition-all ${
                                  isLiked
                                    ? 'fill-pink-600 text-pink-600'
                                    : 'text-muted-foreground group-hover:text-pink-600'
                                }`}
                              />
                              <span className={isLiked ? 'text-pink-600 font-semibold' : ''}>
                                {likeCount(deck)}
                              </span>
                            </button>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MessageSquare className="h-4 w-4" />
                              <span>{commentCount(deck)}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/decks/${deck._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default FlashcardDecksPage;

