import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CommunityPage: React.FC = () => {
  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-primary">Community Sharing</h1>
      <p className="text-muted-foreground">
        Share flashcards with peers and explore community-created decks.
      </p>

      {/* Content Discovery */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Content Discovery</h2>
        <Tabs defaultValue="browse">
          <TabsList>
            <TabsTrigger value="browse">Browse Decks</TabsTrigger>
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="new">Newly Published</TabsTrigger>
          </TabsList>

          <TabsContent value="browse">
            <Card>
              <CardHeader>
                <CardTitle>Browse by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    "CSE",
                    "Mechanical",
                    "Civil",
                    "Electrical",
                    "Biotech",
                    "Maths",
                  ].map((dept) => (
                    <Button key={dept} variant="outline">{dept}</Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <Input placeholder="Search decks by subject, tags, difficulty..." />
          </TabsContent>

          <TabsContent value="trending">
            <p>🔥 Decks with high engagement this week.</p>
          </TabsContent>

          <TabsContent value="new">
            <p>🆕 Latest contributions from the community.</p>
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
