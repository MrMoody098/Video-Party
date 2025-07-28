import { useState } from "react";
import { Settings, Share, MoreHorizontal, Users, Eye, Heart, Calendar, Trophy, Target, Zap } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { VideoCard } from "./VideoCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function UserProfilePage() {
  const [isFollowing, setIsFollowing] = useState(false);

  const profileData = {
    username: "ProGamer123",
    displayName: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop&crop=face",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=300&fit=crop",
    bio: "Diamond Valorant player • Content Creator • Streaming weekdays 8PM EST",
    joinDate: "March 2023",
    location: "Los Angeles, CA",
    followers: "125K",
    following: "432",
    totalViews: "12.5M",
    totalLikes: "890K",
    clipsUploaded: "247",
    achievements: ["Diamond Rank", "100K Subscribers", "Viral Clip", "Top Creator"]
  };

  const stats = [
    { label: "Total Views", value: profileData.totalViews, icon: Eye, color: "text-[#0099ff]" },
    { label: "Total Likes", value: profileData.totalLikes, icon: Heart, color: "text-[#ff0099]" },
    { label: "Clips", value: profileData.clipsUploaded, icon: Target, color: "text-primary" },
    { label: "Followers", value: profileData.followers, icon: Users, color: "text-[#8855ff]" }
  ];

  const userClips = [
    {
      title: "Insane 1v5 Clutch in Valorant",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop",
      duration: "0:45",
      views: "1.2M",
      likes: "45K",
      author: "ProGamer123",
      authorAvatar: profileData.avatar,
      game: "Valorant",
      uploadTime: "2 days ago"
    },
    {
      title: "Perfect Headshot Compilation",
      thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=225&fit=crop",
      duration: "2:15",
      views: "890K",
      likes: "32K",
      author: "ProGamer123",
      authorAvatar: profileData.avatar,
      game: "CS2",
      uploadTime: "5 days ago"
    },
    {
      title: "Ranked to Diamond Speedrun",
      thumbnail: "https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400&h=225&fit=crop",
      duration: "8:34",
      views: "2.1M",
      likes: "89K",
      author: "ProGamer123",
      authorAvatar: profileData.avatar,
      game: "Valorant",
      uploadTime: "1 week ago"
    },
    {
      title: "How I Got Better at FPS Games",
      thumbnail: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=225&fit=crop",
      duration: "12:45",
      views: "1.8M",
      likes: "76K",
      author: "ProGamer123",
      authorAvatar: profileData.avatar,
      game: "Tutorial",
      uploadTime: "2 weeks ago"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Banner */}
      <div className="relative h-64 md:h-80">
        <ImageWithFallback
          src={profileData.banner}
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10">
        {/* Profile Header */}
        <div className="glass-card rounded-xl p-6 mb-6 neon-border">
          <div className="flex flex-col md:flex-row items-start gap-6">
            {/* Avatar */}
            <Avatar className="h-24 w-24 border-4 border-primary neon-glow">
              <AvatarImage src={profileData.avatar} alt={profileData.username} />
              <AvatarFallback className="text-2xl">{profileData.displayName[0]}</AvatarFallback>
            </Avatar>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold">{profileData.displayName}</h1>
                  <p className="text-lg text-muted-foreground">@{profileData.username}</p>
                  <p className="mt-2">{profileData.bio}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined {profileData.joinDate}
                    </span>
                    <span>{profileData.location}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={isFollowing 
                      ? "bg-secondary hover:bg-secondary/90" 
                      : "bg-primary hover:bg-primary/90 neon-glow"
                    }
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline" className="border-gaming-border">
                    <Share className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="border-gaming-border">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Follow Stats */}
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="font-semibold">{profileData.followers}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold">{profileData.following}</div>
                  <div className="text-sm text-muted-foreground">Following</div>
                </div>
              </div>

              {/* Achievements */}
              <div className="flex flex-wrap gap-2 mt-4">
                {profileData.achievements.map((achievement) => (
                  <Badge key={achievement} className="bg-[#8855ff]/20 text-[#8855ff] border-[#8855ff]/30">
                    <Trophy className="h-3 w-3 mr-1" />
                    {achievement}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <Card key={stat.label} className="glass-card border-gaming-border">
              <CardContent className="p-4 text-center">
                <stat.icon className={`h-6 w-6 mx-auto mb-2 ${stat.color}`} />
                <div className="font-semibold text-lg">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="clips" className="w-full">
          <TabsList className="glass-card border-gaming-border mb-6">
            <TabsTrigger 
              value="clips" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Target className="h-4 w-4 mr-2" />
              Clips ({profileData.clipsUploaded})
            </TabsTrigger>
            <TabsTrigger 
              value="liked" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Heart className="h-4 w-4 mr-2" />
              Liked
            </TabsTrigger>
            <TabsTrigger 
              value="playlists" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Zap className="h-4 w-4 mr-2" />
              Playlists
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clips">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {userClips.map((clip, index) => (
                <VideoCard key={index} {...clip} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="liked">
            <div className="text-center py-12">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No liked clips yet</h3>
              <p className="text-muted-foreground">Clips you like will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="playlists">
            <div className="text-center py-12">
              <Zap className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No playlists yet</h3>
              <p className="text-muted-foreground">Create playlists to organize your favorite clips</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}