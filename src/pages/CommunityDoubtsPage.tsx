import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Loader2, Plus, Send, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { communityAPI, authAPI } from "@/lib/api";
import { toast } from "@/components/ui/sonner";

type Post = {
  _id: string;
  userId: { _id: string; username?: string; year?: string } | string;
  title: string;
  content: string;
  department?: string;
  year?: string;
  tags?: string[];
  likes?: any[];
  comments?: Array<{
    userId: string;
    username: string;
    year?: string;
    text: string;
    createdAt: string;
  }>;
  createdAt?: string;
};

const CommunityDoubtsPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [postComment, setPostComment] = useState<{[key: string]: string}>({});
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [currentUsername, setCurrentUsername] = useState<string>("");
  const [currentUserYear, setCurrentUserYear] = useState<string>("");
  const [editingComment, setEditingComment] = useState<{postId: string, commentIndex: number, text: string} | null>(null);
  const [userLikedPosts, setUserLikedPosts] = useState<Set<string>>(new Set());
  const [expandedAnswers, setExpandedAnswers] = useState<Set<string>>(new Set());

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
      const userYear = user.year || '';
      setCurrentUserYear(userYear);
      console.log('Setting user year from localStorage:', userYear);
    }

    // Load user profile to get liked posts
    (async () => {
      try {
        const prof = await authAPI.getProfile();
        const userData = prof?.data?.user || prof?.user || prof?.data || prof;
        if (userData) {
          setCurrentUsername(userData.username || storedUsername || '');
          const year = userData.year || '';
          setCurrentUserYear(year);
          setCurrentUserId(userData.id || userData._id || storedUserId || '');
          console.log('Setting user year from profile:', year);
          
          // Get liked posts - handle both ObjectId strings and populated objects
          if (userData.likedPosts && Array.isArray(userData.likedPosts)) {
            const likedPostIds = userData.likedPosts.map((p: any) => {
              // Handle if it's a string ID or an object with _id
              if (typeof p === 'string') return p;
              return p._id || p.id || p;
            }).filter(Boolean);
            
            console.log('Loaded liked posts:', likedPostIds);
            setUserLikedPosts(new Set(likedPostIds));
          }
        }
      } catch (e) {
        console.error('Error fetching user profile:', e);
      }
    })();

    loadPosts();
  }, [navigate]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load CSE department posts only
      const res = await communityAPI.getPosts({
        department: 'cse',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        limit: 100
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
      toast.error("Please fill in both title and content");
      return;
    }

    try {
      const response = await communityAPI.createPost({
        title: newPostTitle,
        content: newPostContent,
        department: 'cse', // Always CSE
        year: currentUserYear, // Include user's year
        tags: []
      });

      const newPost = response?.data?.post || response?.post || response;
      
      // Ensure the post has proper user data with year
      const postWithUserData = {
        ...newPost,
        userId: {
          _id: currentUserId,
          username: currentUsername,
          year: currentUserYear
        }
      };
      
      setPosts([postWithUserData, ...posts]);

      toast.success("Question posted successfully!");
      setNewPostTitle("");
      setNewPostContent("");
      setIsCreatePostOpen(false);
    } catch (e: any) {
      toast.error(e?.message || "Failed to create post");
    }
  };

  const handleLikePost = async (id: string) => {
    try {
      const response = await communityAPI.likePost(id);
      const isNowLiked = response?.data?.isLiked;

      // Update local state
      setPosts(posts.map(post => {
        if (post._id === id) {
          const currentLikes = Array.isArray(post.likes) ? post.likes : [];
          const likesArray = isNowLiked 
            ? [...currentLikes, currentUserId] 
            : currentLikes.filter((likeId: any) => {
                const lid = typeof likeId === 'string' ? likeId : likeId._id || likeId;
                return lid !== currentUserId;
              });
          return {
            ...post,
            likes: likesArray as any[]
          };
        }
        return post;
      }));

      // Update liked posts set
      setUserLikedPosts(prev => {
        const newSet = new Set(prev);
        if (isNowLiked) {
          newSet.add(id);
        } else {
          newSet.delete(id);
        }
        return newSet;
      });
    } catch (e: any) {
      if (e?.message?.includes('401')) {
        navigate('/login');
      } else {
        toast.error("Failed to like post");
      }
    }
  };

  const handleCommentPost = async (id: string) => {
    const text = postComment[id]?.trim();
    if (!text) return;

    try {
      await communityAPI.commentPost(id, { text });

      setPosts(posts.map(post => {
        if (post._id === id) {
          const newComment = {
            userId: currentUserId,
            username: currentUsername || 'You',
            year: currentUserYear,
            text: text,
            createdAt: new Date().toISOString()
          };
          const comments = Array.isArray(post.comments) ? [...post.comments, newComment] : [newComment];
          return { ...post, comments };
        }
        return post;
      }));

      setPostComment({ ...postComment, [id]: "" });
      toast.success("Answer posted!");
      
      // Reload posts to get the updated comment with year from backend
      await loadPosts();
    } catch (e: any) {
      toast.error("Failed to post answer");
    }
  };

  const handleDeleteComment = async (postId: string, commentIndex: number) => {
    if (!confirm('Delete this comment?')) return;

    setPosts(posts.map(post => {
      if (post._id === postId) {
        const comments = Array.isArray(post.comments)
          ? post.comments.filter((_, idx) => idx !== commentIndex)
          : [];
        return { ...post, comments };
      }
      return post;
    }));

    toast.success("Comment deleted!");
  };

  const handleEditComment = async (postId: string, commentIndex: number) => {
    if (!editingComment || !editingComment.text.trim()) return;

    setPosts(posts.map(post => {
      if (post._id === postId && Array.isArray(post.comments)) {
        const updatedComments = [...post.comments];
        updatedComments[commentIndex] = {
          ...updatedComments[commentIndex],
          text: editingComment.text
        };
        return { ...post, comments: updatedComments };
      }
      return post;
    }));

    setEditingComment(null);
    toast.success("Comment updated!");
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Delete this question? This cannot be undone.')) return;

    try {
      await communityAPI.deletePost(postId);
      setPosts(posts.filter(post => post._id !== postId));
      toast.success("Question deleted!");
    } catch (e: any) {
      toast.error("Failed to delete question");
    }
  };

  const likeCount = (post: Post) => Array.isArray(post.likes) ? post.likes.length : Number(post.likes || 0);
  const commentCount = (post: Post) => Array.isArray(post.comments) ? post.comments.length : Number(post.comments || 0);
  
  const toggleAnswers = (postId: string) => {
    setExpandedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <div className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-4xl font-bold gradient-text mb-2">CSE Community</h1>
                <p className="text-lg text-muted-foreground">
                  Doubts & Discussion for Computer Science Students
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-sm">CSE Department</Badge>
                  <Badge variant="outline" className="text-sm">All Years Welcome</Badge>
                </div>
              </div>
              <Dialog open={isCreatePostOpen} onOpenChange={setIsCreatePostOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2 bg-gradient-primary hover:opacity-90">
                    <Plus className="h-4 w-4" />
                    Ask a Question
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-card dark:bg-card/95 border-border dark:border-border/60">
                  <DialogHeader>
                    <DialogTitle>Post a Question or Doubt</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-foreground">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief title for your question..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        maxLength={200}
                        className="bg-background dark:bg-background/50 border-border dark:border-border/60 text-foreground placeholder:text-muted-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content" className="text-foreground">Question Details *</Label>
                      <Textarea
                        id="content"
                        placeholder="Describe your question or doubt in detail..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[150px] bg-background dark:bg-background/50 border-border dark:border-border/60 text-foreground placeholder:text-muted-foreground"
                        maxLength={2000}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatePostOpen(false)} className="border-border dark:border-border/60 hover:bg-muted dark:hover:bg-muted/50">
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost} className="bg-gradient-primary hover:opacity-90">
                      <Send className="h-4 w-4 mr-2" />
                      Post Question
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            
            {error && (
              <Card className="border-destructive dark:border-destructive/60 bg-card dark:bg-card/80">
                <CardContent className="py-6 text-center text-destructive dark:text-destructive/90">
                  {error}
                </CardContent>
              </Card>
            )}
            
            {!loading && !error && posts.length === 0 && (
              <Card className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20 bg-card dark:bg-card/80">
                <CardContent className="py-12 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-muted-foreground">No questions posted yet. Be the first to ask!</p>
                </CardContent>
              </Card>
            )}
            
            {!loading && !error && posts.map((post) => {
              const postUserId = typeof post.userId === 'string' ? post.userId : post.userId?._id || '';
              const postUsername = typeof post.userId === 'string' ? post.userId : post.userId?.username || 'Unknown';
              const postUserYear = typeof post.userId === 'string' ? '' : post.userId?.year || '';
              const isPostAuthor = currentUserId && postUserId === currentUserId;
              const isLiked = userLikedPosts.has(post._id);
              const areAnswersExpanded = expandedAnswers.has(post._id);
              const hasAnswers = Array.isArray(post.comments) && post.comments.length > 0;
              
              return (
                <Card key={post._id} className="overflow-hidden border-2 border-border/50 dark:border-border/40 hover:border-primary/50 dark:hover:border-primary/60 transition-all duration-300 bg-card dark:bg-card/90 backdrop-blur-sm relative">
                  {/* Subtle background animation */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:via-transparent dark:to-secondary/10 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-3 font-bold text-foreground">{post.title}</CardTitle>
                        <p className="text-base leading-relaxed text-foreground/90">{post.content}</p>
                      </div>
                      {isPostAuthor && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/30 dark:border-border/20">
                      <span className="text-sm text-muted-foreground">Asked by</span>
                      <span className={`font-bold text-sm ${isPostAuthor ? 'text-primary' : 'text-primary'}`}>
                        {postUsername}
                      </span>
                      <Badge variant="default" className="text-xs bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary-foreground border-primary/30 dark:border-primary/50">
                        {postUserYear || post.year || 'Year N/A'}
                      </Badge>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(post.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative z-10">
                    {/* Actions */}
                    <div className="flex items-center gap-6 pb-4 border-b border-border/50 dark:border-border/30">
                      <button
                        className="flex items-center gap-2 text-base font-medium hover:text-pink-600 dark:hover:text-pink-400 transition-all duration-200 group"
                        onClick={() => handleLikePost(post._id)}
                      >
                        <Heart 
                          className={`h-6 w-6 transition-all duration-200 ${
                            isLiked 
                              ? 'fill-pink-600 text-pink-600 dark:fill-pink-500 dark:text-pink-500 scale-110' 
                              : 'text-muted-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 group-hover:scale-105'
                          }`} 
                        />
                        <span className={isLiked ? 'text-pink-600 dark:text-pink-500 font-bold' : 'text-muted-foreground'}>
                          {likeCount(post)} {likeCount(post) === 1 ? 'like' : 'likes'}
                        </span>
                      </button>
                      <div className="flex items-center gap-2 text-base text-muted-foreground">
                        <MessageSquare className="h-5 w-5" />
                        <span className="font-medium">{commentCount(post)} {commentCount(post) === 1 ? 'answer' : 'answers'}</span>
                      </div>
                    </div>

                    {/* View Answers Text (Instagram/Facebook style) */}
                    {hasAnswers && !areAnswersExpanded && (
                      <div className="mb-4">
                        <button
                          onClick={() => toggleAnswers(post._id)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          View all {commentCount(post)} {commentCount(post) === 1 ? 'answer' : 'answers'}
                        </button>
                      </div>
                    )}

                    {/* Comments/Answers - Collapsible */}
                    {areAnswersExpanded && hasAnswers && (
                      <div className="space-y-3 mb-4 animate-in fade-in-0 slide-in-from-top-4 duration-300">
                        {post.comments!.map((comment, idx) => {
                          const isCommentAuthor = currentUsername && comment.username === currentUsername;
                          const isEditing = editingComment?.postId === post._id && editingComment?.commentIndex === idx;

                          return (
                            <div key={idx} className="relative group">
                              {/* Subtle animated background */}
                              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,106,0,0.06),rgba(255,157,66,0.06))] rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                              
                              {/* Comment content */}
                              <div className="relative bg-card dark:bg-card/80 border border-border/40 dark:border-border/30 rounded-xl p-4 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-200">
                                {isEditing ? (
                                  <div className="flex gap-2">
                                    <Input
                                      value={editingComment.text}
                                      onChange={(e) => setEditingComment({...editingComment, text: e.target.value})}
                                      className="flex-1 bg-background dark:bg-background/50 border-border dark:border-border/60"
                                      autoFocus
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => handleEditComment(post._id, idx)}
                                      className="bg-primary hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/80"
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => setEditingComment(null)}
                                      className="hover:bg-muted dark:hover:bg-muted/50"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-3">
                                        <span className={`font-bold text-base ${isCommentAuthor ? 'text-primary' : 'text-primary'}`}>
                                          {comment.username}
                                        </span>
                                        <Badge variant="default" className="text-xs bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 dark:border-emerald-500/50">
                                          {comment.year || 'Year N/A'}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                          {new Date(comment.createdAt).toLocaleDateString()}
                                        </span>
                                      </div>
                                      <p className="text-base leading-relaxed text-foreground dark:text-foreground/95">{comment.text}</p>
                                    </div>
                                    {isCommentAuthor && (
                                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 px-3 text-xs hover:bg-primary/10 dark:hover:bg-primary/20 hover:text-primary"
                                          onClick={() => setEditingComment({ postId: post._id, commentIndex: idx, text: comment.text })}
                                        >
                                          <Edit className="h-3 w-3 mr-1" />
                                          Edit
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-8 px-3 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 dark:hover:bg-destructive/20"
                                          onClick={() => handleDeleteComment(post._id, idx)}
                                        >
                                          <Trash2 className="h-3 w-3 mr-1" />
                                          Delete
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                        
                        {/* Hide Answers Text */}
                        <button
                          onClick={() => toggleAnswers(post._id)}
                          className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mt-2"
                        >
                          Hide answers
                        </button>
                      </div>
                    )}

                    {/* Add Answer */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-border/30 dark:border-border/20">
                      <Input
                        placeholder="Write your answer..."
                        value={postComment[post._id] || ""}
                        onChange={(e) => setPostComment({ ...postComment, [post._id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleCommentPost(post._id);
                          }
                        }}
                        className="flex-1 h-11 bg-background dark:bg-background/50 border-border/60 dark:border-border/40 focus:border-primary/60 dark:focus:border-primary/70 text-foreground placeholder:text-muted-foreground"
                      />
                      <Button
                        size="default"
                        onClick={() => handleCommentPost(post._id)}
                        disabled={!postComment[post._id]?.trim()}
                        className="bg-gradient-primary hover:opacity-90 dark:hover:opacity-80 px-6 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Answer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDoubtsPage;

