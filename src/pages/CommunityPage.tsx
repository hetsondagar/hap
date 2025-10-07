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
import { Heart, MessageSquare, Loader2, Users } from "lucide-react";

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

const departments = [
  "Computer Science",
  "Mechanical",
  "Civil",
  "Electrical",
  "Biotech",
  "Mathematics",
];

const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [activeTab, setActiveTab] = useState("browse");
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string | undefined>("trending");
  const [userInfo, setUserInfo] = useState<{ department: string; year: string } | null>(null);

  const likeCount = (d: Deck) => (Array.isArray(d.likes) ? d.likes.length : Number(d.likes || 0));
  const commentCount = (d: Deck) => (Array.isArray(d.comments) ? d.comments.length : Number(d.comments || 0));

  useEffect(() => {
    // Get user info from localStorage
    const storedUserInfo = localStorage.getItem("userInfo");
    if (storedUserInfo) {
      const user = JSON.parse(storedUserInfo);
      setUserInfo({ department: user.department, year: user.year });
      // Set department filter to user's department by default
      setDepartment(user.department);
    }
  }, []);

  const loadDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      if (activeTab === "search" && query.trim()) {
        const res = await communityAPI.searchDecks({ q: query.trim(), department, sortBy });
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
        const res = await communityAPI.getDecks({ 
          department: department || userInfo?.department, 
          year: userInfo?.year,
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

  useEffect(() => {
    loadDecks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, department, sortBy]);

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Community Sharing</h1>
          <p className="text-muted-foreground">
            Share flashcards with peers and explore community-created decks.
          </p>
        </div>
        {userInfo && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>Showing decks for {userInfo.department.toUpperCase()} - {userInfo.year} Year</span>
          </div>
        )}
      </div>

      {/* Content Discovery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Content Discovery</h2>
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
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {departments.map((dept) => (
                    <Button
                      key={dept}
                      variant={department === dept ? "default" : "outline"}
                      onClick={() => setDepartment(dept === department ? undefined : dept)}
                    >
                      {dept}
                    </Button>
                  ))}
                  <Button variant="ghost" onClick={() => setDepartment(undefined)}>Clear</Button>
                </div>
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
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search decks by subject, tags, difficulty..."
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
              <p className="text-sm text-muted-foreground">🔥 Decks with high engagement this week.</p>
              <div className="flex gap-2">
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
            <p className="text-sm text-muted-foreground mb-3">🆕 Latest contributions from the community.</p>
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

      {/* Social Features */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Social Features</h2>
        <Card>
          <CardHeader>
            <CardTitle>User Profiles & Interactions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p>View bio, created decks, followers, and stats.</p>
            <div className="flex gap-2">
              <Button>Follow</Button>
              <Button variant="outline">Unfollow</Button>
              <Button variant="secondary">Like / Rate Deck</Button>
            </div>
            <Textarea placeholder="Add a comment or ask a doubt..." />
            <Button>Post Comment</Button>
            <div className="pt-2">
              <CreateDeckDialog onCreated={(id) => navigate(`/community/${id}`)} />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Engagement & Insights */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Engagement & Insights</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Deck Stats</CardTitle></CardHeader>
            <CardContent>Views, shares, likes, quiz attempts.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Author Insights</CardTitle></CardHeader>
            <CardContent>See how your decks are performing.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Community Analytics</CardTitle></CardHeader>
            <CardContent>Active members, trending subjects.</CardContent>
          </Card>
        </div>
      </section>

      {/* Access & Sharing */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Access & Sharing</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Public vs Private Decks</CardTitle></CardHeader>
            <CardContent>Choose visibility settings for your deck.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Invite-only Groups</CardTitle></CardHeader>
            <CardContent>Create private study circles.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Shareable Links</CardTitle></CardHeader>
            <CardContent>Generate share links like Google Docs.</CardContent>
          </Card>
        </div>
      </section>

      {/* Interaction & Communication */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Interaction & Communication</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Q&A Forum</CardTitle></CardHeader>
            <CardContent>Post subject-specific doubts tied to flashcards.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Direct Messaging</CardTitle></CardHeader>
            <CardContent>Optional chat system (Socket.io).</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Study Groups</CardTitle></CardHeader>
            <CardContent>Join communities by semester/subject.</CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default CommunityPage;
