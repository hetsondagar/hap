import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  User,
  BookOpen,
  Layers,
  Heart,
  MessageSquare,
  Lock,
  Edit,
  Eye,
  Trash2,
  Calendar
} from 'lucide-react';
import { dashboardAPI, authAPI } from '@/lib/api';
import { toast } from '@/components/ui/sonner';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  
  // Password change state
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Username change state
  const [usernameDialogOpen, setUsernameDialogOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [changingUsername, setChangingUsername] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await dashboardAPI.getDashboardData();
      console.log('Dashboard data:', response);
      setDashboardData(response.data);
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
      if (error.message.includes('401') || error.message.includes('token')) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setChangingPassword(true);
      await dashboardAPI.changePassword(currentPassword, newPassword);
      toast.success('Password changed successfully!');
      setPasswordDialogOpen(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast.error(error.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleChangeUsername = async () => {
    if (!newUsername.trim()) {
      toast.error('Please enter a new username');
      return;
    }
    
    if (newUsername.length < 3 || newUsername.length > 30) {
      toast.error('Username must be between 3 and 30 characters');
      return;
    }

    try {
      setChangingUsername(true);
      const response = await dashboardAPI.changeUsername(newUsername);
      toast.success('Username changed successfully!');
      setUsernameDialogOpen(false);
      setNewUsername('');
      
      // Update dashboard data with new username
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          user: {
            ...dashboardData.user,
            username: response.data.username
          }
        });
      }
    } catch (error: any) {
      console.error('Error changing username:', error);
      toast.error(error.message || 'Failed to change username');
    } finally {
      setChangingUsername(false);
    }
  };

  const handleToggleLikeFlashcard = async (flashcardId: string) => {
    try {
      await dashboardAPI.toggleLikeFlashcard(flashcardId);
      loadDashboardData(); // Reload to update likes
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  const handleToggleLikeDeck = async (deckId: string) => {
    try {
      await dashboardAPI.toggleLikeDeck(deckId);
      loadDashboardData(); // Reload to update likes
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Failed to update like');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load dashboard</p>
      </div>
    );
  }

  const { user, myFlashcards = [], myDecks = [], likedFlashcards = [], likedDecks = [], myPosts = [] } = dashboardData;

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      
      <div className="container mx-auto px-4 pt-32 pb-16">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">My Dashboard</h1>
              <p className="text-muted-foreground">Manage your flashcards, decks, and account settings</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">
                {user.department?.toUpperCase() || 'N/A'}
              </Badge>
              <Badge variant="outline" className="text-sm">
                {user.year || 'N/A'}
              </Badge>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <Card className="p-6 glass-effect circuit-pattern border-2 border-white/10 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-primary/20 rounded-full">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{user.username}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* Change Username Dialog */}
              <Dialog open={usernameDialogOpen} onOpenChange={setUsernameDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Change Username
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Username</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="newUsername">New Username</Label>
                      <Input
                        id="newUsername"
                        type="text"
                        placeholder="Enter new username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleChangeUsername}
                      disabled={changingUsername}
                      className="w-full"
                    >
                      {changingUsername ? 'Changing...' : 'Change Username'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* Change Password Dialog */}
              <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                    <Button 
                      onClick={handleChangePassword}
                      disabled={changingPassword}
                      className="w-full"
                    >
                      {changingPassword ? 'Changing...' : 'Change Password'}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 glass-effect border-2 border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myFlashcards.length}</p>
                <p className="text-sm text-muted-foreground">My Flashcards</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-2 border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Layers className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myDecks.length}</p>
                <p className="text-sm text-muted-foreground">My Decks</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-2 border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-pink-500/20 rounded-lg">
                <Heart className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{likedFlashcards.length + likedDecks.length}</p>
                <p className="text-sm text-muted-foreground">Liked Items</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 glass-effect border-2 border-white/10">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <MessageSquare className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myPosts.length}</p>
                <p className="text-sm text-muted-foreground">My Posts</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="flashcards" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="flashcards">My Flashcards</TabsTrigger>
            <TabsTrigger value="decks">My Decks</TabsTrigger>
            <TabsTrigger value="liked-flashcards">Liked Flashcards</TabsTrigger>
            <TabsTrigger value="liked-decks">Liked Decks</TabsTrigger>
            <TabsTrigger value="posts">My Posts</TabsTrigger>
          </TabsList>

          {/* My Flashcards Tab */}
          <TabsContent value="flashcards" className="mt-6">
            {myFlashcards.length > 0 ? (
              <div className="grid gap-4">
                {myFlashcards.map((flashcard: any) => (
                  <Card key={flashcard._id} className="p-6 glass-effect border-2 border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{flashcard.front}</h3>
                        <p className="text-muted-foreground mb-3">{flashcard.back}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant={flashcard.difficulty === 'easy' ? 'default' : flashcard.difficulty === 'hard' ? 'destructive' : 'secondary'}>
                            {flashcard.difficulty}
                          </Badge>
                          {flashcard.tags?.map((tag: string) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                          ))}
                          <Badge variant="outline" className="text-xs">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(flashcard.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/subjects/${flashcard.subjectId}/flashcards`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center glass-effect border-2 border-white/10">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No flashcards yet</h3>
                <p className="text-muted-foreground mb-4">Start creating flashcards to see them here</p>
                <Button onClick={() => navigate('/flashcards')}>Create Flashcard</Button>
              </Card>
            )}
          </TabsContent>

          {/* My Decks Tab */}
          <TabsContent value="decks" className="mt-6">
            {myDecks.length > 0 ? (
              <div className="grid gap-4">
                {myDecks.map((deck: any) => (
                  <Card key={deck._id} className="p-6 glass-effect border-2 border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{deck.title}</h3>
                        <p className="text-muted-foreground mb-3">{deck.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">{deck.flashcards.length} cards</Badge>
                          <Badge variant="outline">{deck.difficulty}</Badge>
                          <Badge variant="outline" className="text-xs">
                            <Heart className="h-3 w-3 mr-1" />
                            {deck.likes?.length || 0} likes
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/community/${deck._id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center glass-effect border-2 border-white/10">
                <Layers className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No decks yet</h3>
                <p className="text-muted-foreground mb-4">Create a deck to organize your flashcards</p>
                <Button onClick={() => navigate('/community')}>Go to Community</Button>
              </Card>
            )}
          </TabsContent>

          {/* Liked Flashcards Tab */}
          <TabsContent value="liked-flashcards" className="mt-6">
            {likedFlashcards.length > 0 ? (
              <div className="grid gap-4">
                {likedFlashcards.map((flashcard: any) => (
                  <Card key={flashcard._id} className="p-6 glass-effect border-2 border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{flashcard.front}</h3>
                        <p className="text-muted-foreground mb-3">{flashcard.back}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant={flashcard.difficulty === 'easy' ? 'default' : flashcard.difficulty === 'hard' ? 'destructive' : 'secondary'}>
                            {flashcard.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleLikeFlashcard(flashcard._id)}
                      >
                        <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center glass-effect border-2 border-white/10">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No liked flashcards</h3>
                <p className="text-muted-foreground">Start liking flashcards to see them here</p>
              </Card>
            )}
          </TabsContent>

          {/* Liked Decks Tab */}
          <TabsContent value="liked-decks" className="mt-6">
            {likedDecks.length > 0 ? (
              <div className="grid gap-4">
                {likedDecks.map((deck: any) => (
                  <Card key={deck._id} className="p-6 glass-effect border-2 border-white/10">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{deck.title}</h3>
                        <p className="text-muted-foreground mb-3">{deck.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary">{deck.flashcards?.length || 0} cards</Badge>
                          <Badge variant="outline">{deck.difficulty}</Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleLikeDeck(deck._id)}
                        >
                          <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/community/${deck._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center glass-effect border-2 border-white/10">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No liked decks</h3>
                <p className="text-muted-foreground">Start liking decks to see them here</p>
              </Card>
            )}
          </TabsContent>

          {/* My Posts Tab */}
          <TabsContent value="posts" className="mt-6">
            {myPosts.length > 0 ? (
              <div className="grid gap-4">
                {myPosts.map((post: any) => (
                  <Card key={post._id} className="p-6 glass-effect border-2 border-white/10">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{post.title}</h3>
                      <p className="text-muted-foreground mb-3">{post.content}</p>
                      <div className="flex gap-2 flex-wrap">
                        {post.tags?.map((tag: string) => (
                          <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(post.createdAt).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center glass-effect border-2 border-white/10">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
                <p className="text-muted-foreground mb-4">Share your thoughts with the community</p>
                <Button onClick={() => navigate('/community')}>Go to Community</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardPage;

