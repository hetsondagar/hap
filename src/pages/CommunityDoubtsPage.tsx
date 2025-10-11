import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Loader2, Plus, Send, Edit, Trash2 } from "lucide-react";
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

    // Load user profile to get liked posts
    (async () => {
      try {
        const prof = await authAPI.getProfile();
        const user = prof?.user || prof?.data || prof;
        if (user) {
          setCurrentUsername(user.username || storedUsername || '');
          setCurrentUserYear(user.year || '');
          // Get liked posts
          if (user.likedPosts && Array.isArray(user.likedPosts)) {
            setUserLikedPosts(new Set(user.likedPosts.map((p: any) => p._id || p)));
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
        tags: []
      });

      const newPost = response?.data?.post || response?.post || response;
      setPosts([newPost, ...posts]);

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
          const currentLikes = Array.isArray(post.likes) ? post.likes.length : Number(post.likes || 0);
          return {
            ...post,
            likes: isNowLiked ? currentLikes + 1 : Math.max(0, currentLikes - 1)
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
      toast.success("Comment added!");
    } catch (e: any) {
      toast.error("Failed to add comment");
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="pt-32 pb-16 px-4 md:px-8">
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
                  <Button className="flex items-center gap-2 bg-gradient-primary">
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
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        placeholder="Brief title for your question..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        maxLength={200}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Question Details *</Label>
                      <Textarea
                        id="content"
                        placeholder="Describe your question or doubt in detail..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[150px]"
                        maxLength={2000}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsCreatePostOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleCreatePost} className="bg-gradient-primary">
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
              <Card className="border-destructive">
                <CardContent className="py-6 text-center text-destructive">
                  {error}
                </CardContent>
              </Card>
            )}
            
            {!loading && !error && posts.length === 0 && (
              <Card className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20">
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
              
              return (
                <Card key={post._id} className="glass-effect circuit-pattern border-2 border-white/10 dark:border-white/20 hover:border-primary/30 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{post.title}</CardTitle>
                        <p className="text-muted-foreground">{post.content}</p>
                      </div>
                      {isPostAuthor && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeletePost(post._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-sm">
                      <span className="text-muted-foreground">Asked by</span>
                      <span className={`font-semibold ${isPostAuthor ? 'text-primary' : 'text-blue-600 dark:text-blue-400'}`}>
                        {postUsername}
                      </span>
                      {postUserYear && (
                        <Badge variant="outline" className="text-xs">
                          {postUserYear}
                        </Badge>
                      )}
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(post.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {/* Actions */}
                    <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border">
                      <button
                        className="flex items-center gap-2 text-sm hover:text-pink-600 transition group"
                        onClick={() => handleLikePost(post._id)}
                      >
                        <Heart 
                          className={`h-5 w-5 transition-all ${
                            isLiked 
                              ? 'fill-pink-600 text-pink-600' 
                              : 'text-muted-foreground group-hover:text-pink-600'
                          }`} 
                        />
                        <span className={isLiked ? 'text-pink-600 font-semibold' : ''}>
                          {likeCount(post)} {likeCount(post) === 1 ? 'like' : 'likes'}
                        </span>
                      </button>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MessageSquare className="h-5 w-5" />
                        <span>{commentCount(post)} {commentCount(post) === 1 ? 'answer' : 'answers'}</span>
                      </div>
                    </div>

                    {/* Comments/Answers */}
                    {Array.isArray(post.comments) && post.comments.length > 0 && (
                      <div className="space-y-4 mb-4">
                        <h4 className="font-semibold text-sm text-muted-foreground">Answers:</h4>
                        {post.comments.map((comment, idx) => {
                          const isCommentAuthor = currentUsername && comment.username === currentUsername;
                          const isEditing = editingComment?.postId === post._id && editingComment?.commentIndex === idx;

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
                                  <Button
                                    size="sm"
                                    onClick={() => handleEditComment(post._id, idx)}
                                  >
                                    Save
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingComment(null)}
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex justify-between items-start gap-2">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className={`font-semibold ${isCommentAuthor ? 'text-primary' : 'text-blue-600 dark:text-blue-400'}`}>
                                        {comment.username}
                                      </span>
                                      {comment.year && (
                                        <Badge variant="secondary" className="text-xs">
                                          {comment.year}
                                        </Badge>
                                      )}
                                      <span className="text-xs text-muted-foreground">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <p className="text-sm">{comment.text}</p>
                                  </div>
                                  {isCommentAuthor && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 px-2 text-xs"
                                        onClick={() => setEditingComment({ postId: post._id, commentIndex: idx, text: comment.text })}
                                      >
                                        <Edit className="h-3 w-3" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 px-2 text-xs text-destructive hover:text-destructive"
                                        onClick={() => handleDeleteComment(post._id, idx)}
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
                    )}

                    {/* Add Answer */}
                    <div className="flex gap-2 mt-4">
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
                      />
                      <Button
                        size="sm"
                        onClick={() => handleCommentPost(post._id)}
                        disabled={!postComment[post._id]?.trim()}
                        className="bg-gradient-primary"
                      >
                        <Send className="h-4 w-4" />
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

