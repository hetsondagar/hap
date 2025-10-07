import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, Loader2, Trash2, Pencil } from "lucide-react";
import { communityAPI } from "@/lib/api";

type Deck = {
  _id: string;
  title: string;
  description: string;
  department?: string;
  difficulty?: string;
  tags?: string[];
  creatorId?: { username?: string; _id?: string };
  likes?: any[];
  comments?: { username?: string; text: string; createdAt?: string }[];
  flashcards?: { front: string; back: string }[];
};

const DeckDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [comment, setComment] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const load = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const res = await communityAPI.getDeck(id);
      const d: Deck = res?.data?.deck || res?.deck || res;
      setDeck(d);
      // infer ownership by comparing stored user id (from token profile) if available
      try {
        const token = localStorage.getItem('token');
        if (token && d?.creatorId?._id) {
          // We don't have a dedicated profile here; fallback: store userId in LS when logging in if available
          const storedUserId = localStorage.getItem('userId');
          setIsOwner(Boolean(storedUserId && d.creatorId?._id && storedUserId === d.creatorId._id));
        }
      } catch {}
    } catch (e: any) {
      setError(e?.message || "Failed to load deck");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = async () => {
    if (!id) return;
    try {
      await communityAPI.likeDeck(id);
      await load();
    } catch {}
  };

  const handleComment = async () => {
    if (!id || !comment.trim()) return;
    try {
      await communityAPI.commentDeck(id, { text: comment.trim() });
      setComment("");
      await load();
    } catch (e: any) {
      const msg = e?.message || '';
      if (msg.includes('401') || msg.toLowerCase().includes('unauthorized')) {
        navigate('/login');
      }
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Delete this deck?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/community/decks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      navigate('/community');
    } catch {}
  };

  const handleEditMeta = async () => {
    if (!id || !deck) return;
    const title = prompt('Update title', deck.title || '') || deck.title;
    const description = prompt('Update description', deck.description || '') || deck.description;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/community/decks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ title, description })
      });
      await load();
    } catch {}
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center text-muted-foreground">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Loading…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-500 mb-3">{error}</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Back</Button>
      </div>
    );
  }

  if (!deck) return null;

  const likeCount = Array.isArray(deck.likes) ? deck.likes.length : 0;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{deck.title || "Untitled Deck"}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {deck.department && <Badge variant="secondary">{deck.department}</Badge>}
            {deck.difficulty && <Badge>{deck.difficulty}</Badge>}
            {deck.tags?.map((t, i) => (
              <Badge key={`${t}-${i}`} variant="outline">#{t}</Badge>
            ))}
          </div>
          <div className="mt-2 text-sm text-muted-foreground">by {deck.creatorId?.username || "Unknown"}</div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleLike} variant="secondary" className="flex items-center gap-2">
            <Heart className="w-4 h-4" /> {likeCount}
          </Button>
          {isOwner && (
            <>
              <Button variant="outline" onClick={handleEditMeta} className="flex items-center gap-2"><Pencil className="w-4 h-4" /> Edit</Button>
              <Button variant="destructive" onClick={handleDelete} className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> Delete</Button>
            </>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground whitespace-pre-wrap">{deck.description || "No description provided."}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Flashcards</CardTitle>
        </CardHeader>
        <CardContent>
          {(!deck.flashcards || deck.flashcards.length === 0) ? (
            <p className="text-sm text-muted-foreground">No flashcards in this deck.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {deck.flashcards!.map((fc, idx) => (
                <div key={idx} className="p-4 rounded-lg border hover:shadow-sm transition">
                  <div className="text-sm font-semibold mb-2">Q: {fc.front}</div>
                  <div className="text-sm text-muted-foreground">A: {fc.back}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Textarea placeholder="Add a comment…" value={comment} onChange={(e) => setComment(e.target.value)} />
            <Button onClick={handleComment}>Post</Button>
          </div>
          <div className="space-y-3">
            {deck.comments && deck.comments.length > 0 ? deck.comments.map((c, i) => (
              <div key={i} className="p-3 rounded-md border">
                <div className="text-xs text-muted-foreground mb-1">{c.username || "User"}</div>
                <div className="text-sm">{c.text}</div>
              </div>
            )) : (
              <p className="text-sm text-muted-foreground">No comments yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeckDetail;


