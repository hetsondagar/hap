import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { communityAPI } from "@/lib/api";
import CreateDeckDialog from "./community/CreateDeckDialog";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Loader2, Users, BookOpen, MessagesSquare, Plus, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

type Deck = {
  _id: string;
  title?: string;
  description?: string;
  department?: string;
  year?: string;
  subjectId?: string;
  difficulty?: string;
  tags?: string[];
  likes?: any[] | number;
  comments?: any[] | number;
  creator?: { username?: string } | string;
  createdAt?: string;
};

type Post = {
  _id: string;
  userId: { username?: string } | string;
  title: string;
  content: string;
  department?: string;
  year?: string;
  tags?: string[];
  likes?: any[] | number;
  comments?: Array<{
    userId: string;
    username: string;
    text: string;
    createdAt: string;
  }>;
  createdAt?: string;
};

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [mainSection, setMainSection] = useState<"decks" | "discussion">("decks");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>("trending");
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);
  
  // Posts state
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [postComment, setPostComment] = useState<{[key: string]: string}>({});

  const likeCount = (d: Deck | Post) => (Array.isArray(d.likes) ? d.likes.length : Number(d.likes || 0));
  const commentCount = (d: Deck | Post) => (Array.isArray(d.comments) ? d.comments.length : Number(d.comments || 0));

  useEffect(() => {
    // Get user info from localStorage - will be used to filter decks automatically
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserInfo({ department: user.department, year: user.year });
    }
  }, []);

  const loadDecks = async () => {
    if (!userInfo) return; // Wait for user info to load
    
    try {
      setLoading(true);
      setError(null);
      if (activeTab === "search" && query.trim()) {
        // Search within user's department and year only
        const res = await communityAPI.searchDecks({ 
          q: query.trim(), 
          department: userInfo.department, 
          year: userInfo.year,
          sortBy 
        });
        const items: Deck[] = res?.data?.decks || res?.decks || res?.data || res || [];
        setDecks(items);
      } else if (activeTab === "mine") {
        // attempt to read user id if stored; otherwise just fetch decks and let backend filter public if not owner
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          const res = await communityAPI.getUserDecks(storedUserId, {});
          const items: Deck[] = res?.data?.decks || res?.decks || res?.data || res || [];
          setDecks(items);
        } else {
          setDecks([]);
        }
      } else {
        // Always filter by user's department and year
        const res = await communityAPI.getDecks({ 
          department: userInfo.department, 
          year: userInfo.year,
          sortBy 
        });
        const items: Deck[] = res?.data?.decks || res?.decks || res?.data || res || [];
        setDecks(items);
      }
    } catch (e: any) {
      setError(e?.message || "Failed to load community decks");
    } finally {
      setLoading(false);
    }
  };

  const loadPosts = async () => {
    if (!userInfo) return;
    
    try {
      setLoading(true);
      setError(null);
      const res = await communityAPI.getPosts({ 
        department: userInfo.department, 
        year: userInfo.year,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      const items: Post[] = res?.data?.posts || res?.posts || res?.data || res || [];
      setPosts(items);
    } catch (e: any) {
      setError(e?.message || "Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast.error("Please fill in both title and content for your question");
      return;
    }
    
    if (newPostTitle.length > 200) {
      toast.error("Title cannot exceed 200 characters");
      return;
    }
    
    if (newPostContent.length > 2000) {
      toast.error("Content cannot exceed 2000 characters");
      return;
    }
    
    try {
      await communityAPI.createPost({
        title: newPostTitle,
        content: newPostContent,
        department: userInfo?.department,
        year: userInfo?.year
      });
      toast.success("Question posted successfully!");
      setNewPostTitle("");
      setNewPostContent("");
      setIsCreatePostOpen(false);
      loadPosts();
    } catch (e: any) {
      // Handle validation errors from backend
      const errorMessage = e?.response?.data?.message || e?.message || "Failed to create post";
      const errors = e?.response?.data?.errors;
      
      if (errors && Array.isArray(errors)) {
        // Show first validation error
        toast.error(errors[0]?.msg || errorMessage);
      } else {
        toast.error(errorMessage);
      }
      
      console.error("Create post error:", e);
    }
  };

  const handleLikePost = async (id: string) => {
    try {
      await communityAPI.likePost(id);
      loadPosts();
    } catch (e: any) {
      toast.error("Failed to like post");
    }
  };

  const handleCommentPost = async (id: string) => {
    const text = postComment[id]?.trim();
    if (!text) return;
    
    try {
      await communityAPI.commentPost(id, { text });
      setPostComment({ ...postComment, [id]: "" });
      loadPosts();
      toast.success("Comment added!");
    } catch (e: any) {
      toast.error("Failed to add comment");
    }
  };

  useEffect(() => {
    if (mainSection === "decks") {
      loadDecks();
    } else {
      loadPosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, sortBy, userInfo, mainSection]);

  const handleLike = async (id: string) => {
    try {
      await communityAPI.likeDeck(id);
      await loadDecks();
    } catch (e) {
      // If not authenticated, send to login
      const msg = (e as any)?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        navigate('/login');
      }
    }
  };

  const visibleDecks = useMemo(() => decks.slice(0, 24), [decks]);

  return (
    <div className="p-6 space-y-10">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary">Community Sharing</h1>
            <p className="text-muted-foreground">
              Explore and share flashcards with peers from your department and year.
            </p>
          </div>
          {userInfo && (
            <div className="flex items-center gap-2 text-sm">
              <Users className="h-4 w-4 text-primary" />
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {userInfo.department.toUpperCase()} - {userInfo.year.replace('-', ' ').toUpperCase()}
              </Badge>
            </div>
          )}
        </div>
        
        {/* Section Switcher */}
        <div className="flex gap-3">
          <Button
            variant={mainSection === "decks" ? "default" : "outline"}
            onClick={() => setMainSection("decks")}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Flashcard Decks
          </Button>
          <Button
            variant={mainSection === "discussion" ? "default" : "outline"}
            onClick={() => setMainSection("discussion")}
            className="flex items-center gap-2"
          >
            <MessagesSquare className="h-4 w-4" />
            Discussion & Doubts
          </Button>
        </div>
      </div>

      {/* DECKS SECTION */}
      {mainSection === "decks" && (
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Flashcard Decks</h2>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="browse">Browse Decks</TabsTrigger>
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">New</TabsTrigger>
            <TabsTrigger value="mine">My Decks</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>Browse Decks</CardTitle>
                {userInfo && (
                  <p className="text-sm text-muted-foreground">
                    Showing decks for your department and year
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {loading && (
                    <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading decks…
                    </div>
                  )}
                  {error && (
                    <div className="col-span-full text-sm text-destructive">{error}</div>
                  )}
                  {!loading && !error && visibleDecks.map((deck) => (
                    <Card key={deck._id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/community/${deck._id}`)}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          {deck.title || "Untitled Deck"}
                        </CardTitle>
                        <div className="flex gap-2">
                          {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
                          {deck.difficulty && <Badge>{deck.difficulty}</Badge>}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                          {deck.description || "No description provided."}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">
                            by {typeof deck.creator === 'string' ? deck.creator : deck.creator?.username || 'Unknown'}
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleLike(deck._id)}>
                              <Heart className="w-4 h-4" /> {likeCount(deck)}
                            </button>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" /> {commentCount(deck)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <p className="text-sm text-muted-foreground mb-3">
              🔍 Search decks from your department and year
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search by title, subject, tags, difficulty..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') loadDecks(); }}
              />
              <Button onClick={loadDecks}>Search</Button>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading && (
                <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Searching…
                </div>
              )}
              {error && (
                <div className="col-span-full text-sm text-destructive">{error}</div>
              )}
              {!loading && !error && visibleDecks.map((deck) => (
                <Card key={deck._id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg">{deck.title || "Untitled Deck"}</CardTitle>
                    <div className="flex gap-2">
                      {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
                      {deck.difficulty && <Badge>{deck.difficulty}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {deck.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        by {typeof deck.creator === 'string' ? deck.creator : deck.creator?.username || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleLike(deck._id)}>
                          <Heart className="w-4 h-4" /> {likeCount(deck)}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> {commentCount(deck)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">🔥 Most popular decks from your department this week.</p>
              <div className="flex gap-2">
                <CreateDeckDialog onCreated={(id) => navigate(`/community/${id}`)} />
                <Button variant={sortBy === 'trending' ? 'default' : 'outline'} onClick={() => setSortBy('trending')}>Trending</Button>
                <Button variant={sortBy === 'new' ? 'default' : 'outline'} onClick={() => setSortBy('new')}>Newest</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading && (
                <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
                </div>
              )}
              {error && (
                <div className="col-span-full text-sm text-destructive">{error}</div>
              )}
              {!loading && !error && visibleDecks.map((deck) => (
                <Card key={deck._id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg">{deck.title || "Untitled Deck"}</CardTitle>
                    <div className="flex gap-2">
                      {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
                      {deck.difficulty && <Badge>{deck.difficulty}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {deck.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        by {typeof deck.creator === 'string' ? deck.creator : deck.creator?.username || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleLike(deck._id)}>
                          <Heart className="w-4 h-4" /> {likeCount(deck)}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> {commentCount(deck)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mine">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">Your decks only.</p>
              <CreateDeckDialog onCreated={(id) => navigate(`/community/${id}`)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading && (
                <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
                </div>
              )}
              {error && (
                <div className="col-span-full text-sm text-destructive">{error}</div>
              )}
              {!loading && !error && visibleDecks.map((deck) => (
                <Card key={deck._id} className="hover:shadow-md transition cursor-pointer" onClick={() => navigate(`/community/${deck._id}`)}>
                  <CardHeader>
                    <CardTitle className="text-lg">{deck.title || "Untitled Deck"}</CardTitle>
                    <div className="flex gap-2">
                      {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
                      {deck.difficulty && <Badge>{deck.difficulty}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{deck.description || "No description provided."}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">🆕 Latest decks from your department and year.</p>
              <CreateDeckDialog onCreated={(id) => navigate(`/community/${id}`)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading && (
                <div className="col-span-full flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
                </div>
              )}
              {error && (
                <div className="col-span-full text-sm text-destructive">{error}</div>
              )}
              {!loading && !error && visibleDecks.map((deck) => (
                <Card key={deck._id} className="hover:shadow-md transition">
                  <CardHeader>
                    <CardTitle className="text-lg">{deck.title || "Untitled Deck"}</CardTitle>
                    <div className="flex gap-2">
                      {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
                      {deck.difficulty && <Badge>{deck.difficulty}</Badge>}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {deck.description || "No description provided."}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        by {typeof deck.creator === 'string' ? deck.creator : deck.creator?.username || 'Unknown'}
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <button className="flex items-center gap-1 hover:text-primary" onClick={() => handleLike(deck._id)}>
                          <Heart className="w-4 h-4" /> {likeCount(deck)}
                        </button>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" /> {commentCount(deck)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
      )}

      {/* DISCUSSION SECTION */}
      {mainSection === "discussion" && (
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Community Discussion & Doubts</h2>
          <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Ask a Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Post a Question or Doubt</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Brief title for your question..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Question Details</Label>
                  <Textarea
                    id="content"
                    placeholder="Describe your question or doubt in detail..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="min-h-[150px]"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreatePost}>
                  <Send className="h-4 w-4 mr-2" />
                  Post Question
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          )}
          {error && (
            <Card className="border-destructive">
              <CardContent className="py-6 text-center text-destructive">
                {error}
              </CardContent>
            </Card>
          )}
          {!loading && !error && posts.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <MessagesSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No questions posted yet. Be the first to ask!</p>
              </CardContent>
            </Card>
          )}
          {!loading && !error && posts.map((post) => (
            <Card key={post._id} className="hover:shadow-md transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground line-clamp-3">{post.content}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                  <span>by {typeof post.userId === 'string' ? post.userId : post.userId?.username || 'Unknown'}</span>
                  <span>•</span>
                  <span>{new Date(post.createdAt || '').toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent>
                {/* Actions */}
                <div className="flex items-center gap-4 mb-4">
                  <button
                    className="flex items-center gap-1 text-sm hover:text-primary transition"
                    onClick={() => handleLikePost(post._id)}
                  >
                    <Heart className="w-4 h-4" />
                    <span>{likeCount(post)}</span>
                  </button>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MessageSquare className="w-4 h-4" />
                    <span>{commentCount(post)}</span>
                  </div>
                </div>

                {/* Comments */}
                {Array.isArray(post.comments) && post.comments.length > 0 && (
                  <div className="space-y-2 mb-4 pl-4 border-l-2 border-muted">
                    {post.comments.slice(0, 3).map((comment, idx) => (
                      <div key={idx} className="text-sm">
                        <span className="font-medium">{comment.username}: </span>
                        <span className="text-muted-foreground">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={postComment[post._id] || ""}
                    onChange={(e) => setPostComment({ ...postComment, [post._id]: e.target.value })}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleCommentPost(post._id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    onClick={() => handleCommentPost(post._id)}
                    disabled={!postComment[post._id]?.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      )}

    </div>
  );
};

export default CommunityPage;
