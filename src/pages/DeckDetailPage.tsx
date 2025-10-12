import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, ArrowLeft, Send, Edit, Trash2, MessageSquare } from "lucide-react";
import { communityAPI, authAPI, dashboardAPI } from "@/lib/api";
import { toast } from "@/components/ui/sonner";
import EnhancedFlashcard from "@/components/EnhancedFlashcard";

type Deck = {
  _id: string;
  title: string;
  description: string;
  department?: string;
  difficulty?: string;
  tags?: string[];
  creatorId?: { username?: string; _id?: string };
  likes?: any[];
  comments?: { userId: string; username?: string; year?: string; text: string; createdAt?: string }[];
  flashcards?: { _id: string; front: string; back: string; difficulty?: string }[];
};

const DeckDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [comment, setComment] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [currentUsername, setCurrentUsername] = useState("");
  const [currentUserYear, setCurrentUserYear] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [editingComment, setEditingComment] = useState<{index: number, text: string} | null>(null);
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());
  const [likedFlashcards, setLikedFlashcards] = useState<Set<string>>(new Set());

  useEffect(() => {
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

    // Load user profile to check if deck is liked
    (async () => {
      try {
        const prof = await authAPI.getProfile();
        const user = prof?.user || prof?.data || prof;
        if (user && user.likedDecks && Array.isArray(user.likedDecks)) {
          const liked = user.likedDecks.some((d: any) => {
            const deckId = d._id || d;
            return deckId === id;
          });
          setIsLiked(liked);
        }
      } catch (e) {
        console.error('Error fetching user profile:', e);
      }
    })();

    load();
  }, [id]);

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await communityAPI.getDeck(id);
      const d: Deck = res?.data?.deck || res?.deck || res;
      setDeck(d);
    } catch (e: any) {
      toast.error("Failed to load deck");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!id) return;
    try {
      await communityAPI.likeDeck(id);
      setIsLiked(!isLiked);
      
      // Update like count locally
      if (deck) {
        const currentLikes = Array.isArray(deck.likes) ? deck.likes.length : 0;
        const newLikesCount = isLiked ? currentLikes - 1 : currentLikes + 1;
        setDeck({
          ...deck,
          likes: Array(newLikesCount).fill({}) // keep likes as an array
        });
      }
    } catch (e: any) {
      toast.error("Failed to like deck");
    }
  };

  const handleComment = async () => {
    if (!id || !comment.trim()) return;
    try {
      await communityAPI.commentDeck(id, { text: comment.trim() });
      
      // Add comment locally
      if (deck) {
        const newComment = {
          userId: currentUserId,
          username: currentUsername,
          year: currentUserYear,
          text: comment.trim(),
          createdAt: new Date().toISOString()
        };
        setDeck({
          ...deck,
          comments: [...(deck.comments || []), newComment]
        });
      }
      
      setComment("");
      toast.success("Comment added!");
    } catch (e: any) {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = (commentIndex: number) => {
    if (!confirm('Delete this comment?')) return;

    if (deck) {
      const updatedComments = (deck.comments || []).filter((_, idx) => idx !== commentIndex);
      setDeck({ ...deck, comments: updatedComments });
      toast.success("Comment deleted!");
    }
  };

  const handleEditComment = (commentIndex: number) => {
    if (!editingComment || !editingComment.text.trim()) return;

    if (deck && deck.comments) {
      const updatedComments = [...deck.comments];
      updatedComments[commentIndex] = {
        ...updatedComments[commentIndex],
        text: editingComment.text
      };
      setDeck({ ...deck, comments: updatedComments });
      setEditingComment(null);
      toast.success("Comment updated!");
    }
  };

  const handleFlipCard = (id: string) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleToggleLikeFlashcard = async (id: string | number) => {
    try {
      const flashcardId = id.toString();
      await dashboardAPI.toggleLikeFlashcard(flashcardId);
      
      setLikedFlashcards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(flashcardId)) {
          newSet.delete(flashcardId);
          toast.success('Removed from favorites');
        } else {
          newSet.add(flashcardId);
          toast.success('Added to favorites');
        }
        return newSet;
      });
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update favorite');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16 px-6 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="pt-24 pb-16 px-6">
          <p className="text-muted-foreground">Deck not found</p>
          <Button onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
        </div>
      </div>
    );
  }

  const isOwner = currentUserId && deck.creatorId?._id === currentUserId;
  const likeCountNum = Array.isArray(deck.likes) ? deck.likes.length : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />

      <div className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/decks')}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Decks
          </Button>

          {/* Deck Header */}
          <Card className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20 mb-6">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-3">{deck.title}</CardTitle>
                  <p className="text-muted-foreground mb-4">{deck.description}</p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
                    {deck.difficulty && <Badge variant="outline">{deck.difficulty}</Badge>}
                    <Badge variant="outline">{deck.flashcards?.length || 0} cards</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created by <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {deck.creatorId?.username || 'Unknown'}
                    </span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Like & Comment Stats */}
              <div className="flex items-center gap-6 mb-6 pb-4 border-b border-border">
                <button
                  className="flex items-center gap-2 text-sm hover:text-pink-600 transition group"
                  onClick={handleLike}
                >
                  <Heart
                    className={`h-6 w-6 transition-all ${
                      isLiked
                        ? 'fill-pink-600 text-pink-600'
                        : 'text-muted-foreground group-hover:text-pink-600'
                    }`}
                  />
                  <span className={`text-base ${isLiked ? 'text-pink-600 font-semibold' : ''}`}>
                    {likeCountNum} {likeCountNum === 1 ? 'like' : 'likes'}
                  </span>
                </button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-base">{deck.comments?.length || 0} comments</span>
                </div>
              </div>

              {/* Comments Section */}
              <div>
                <h3 className="font-semibold mb-4">Comments</h3>
                {deck.comments && deck.comments.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {deck.comments.map((c, idx) => {
                      const isCommentAuthor = currentUsername && c.username === currentUsername;
                      const isEditing = editingComment?.index === idx;

                      return (
                        <div key={idx} className="bg-muted/30 p-4 rounded-lg group">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <Input
                                value={editingComment.text}
                                onChange={(e) => setEditingComment({...editingComment, text: e.target.value})}
                                className="flex-1"
                                autoFocus
                              />
                              <Button size="sm" onClick={() => handleEditComment(idx)}>Save</Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingComment(null)}>Cancel</Button>
                            </div>
                          ) : (
                            <div className="flex justify-between items-start gap-2">
                              <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`font-semibold text-sm ${isCommentAuthor ? 'text-primary' : 'text-blue-600 dark:text-blue-400'}`}>
                                        {c.username || 'Unknown'}
                                      </span>
                                      <Badge variant="secondary" className="text-xs font-semibold">
                                        {c.year || 'Year N/A'}
                                      </Badge>
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(c.createdAt || '').toLocaleDateString()}
                                      </span>
                                    </div>
                                <p className="text-sm">{c.text}</p>
                              </div>
                              {isCommentAuthor && (
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2"
                                    onClick={() => setEditingComment({ index: idx, text: c.text })}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 px-2 text-destructive hover:text-destructive"
                                    onClick={() => handleDeleteComment(idx)}
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mb-4">No comments yet. Be the first!</p>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment();
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    className="bg-gradient-primary"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Flashcards in Deck */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Flashcards in this Deck</h2>
              <Badge variant="secondary" className="text-sm">{deck.flashcards?.length || 0} cards</Badge>
            </div>
            {deck.flashcards && deck.flashcards.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {deck.flashcards.map((flashcard: any) => (
                  <EnhancedFlashcard
                    key={flashcard._id}
                    id={flashcard._id}
                    front={flashcard.front}
                    back={flashcard.back}
                    difficulty={flashcard.difficulty || 'medium'}
                    department={flashcard.department}
                    isFlipped={flippedCards.has(flashcard._id)}
                    onFlip={handleFlipCard}
                    isFavorite={likedFlashcards.has(flashcard._id)}
                    onToggleFavorite={handleToggleLikeFlashcard}
                  />
                ))}
              </div>
            ) : (
              <Card className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
                <CardContent className="py-8 text-center text-muted-foreground">
                  No flashcards in this deck
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckDetailPage;

