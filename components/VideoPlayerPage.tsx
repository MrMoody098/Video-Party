import { useState } from "react";
import { Heart, MessageCircle, Share, Bookmark, MoreVertical, Flag, Eye, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Separator } from "./ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { VideoCard } from "./VideoCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function VideoPlayerPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [comment, setComment] = useState("");

  const videoData = {
    title: "Insane 1v5 Clutch in Valorant Ranked - Diamond Gameplay",
    author: "ProGamer123",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
    game: "Valorant",
    uploadTime: "2 hours ago",
    views: "1,234,567",
    likes: "45,231",
    dislikes: "892",
    description: "This was probably one of my best clutch rounds ever! The enemy team had me completely surrounded but I managed to turn it around with some smart positioning and aim. This happened during my Diamond rank-up game which made it even more intense. Let me know what you think in the comments!",
    tags: ["Clutch", "Valorant", "Ranked", "Diamond", "1v5", "Headshots"]
  };

  const comments = [
    {
      id: 1,
      author: "GamerGirl99",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face",
      content: "That was absolutely insane! Your crosshair placement is on point 🔥",
      time: "1h ago",
      likes: 23
    },
    {
      id: 2,
      author: "ValorantPro",
      avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=32&h=32&fit=crop&crop=face",
      content: "The way you positioned yourself behind that box was genius. Great game sense!",
      time: "45m ago",
      likes: 18
    },
    {
      id: 3,
      author: "ClutchKing",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
      content: "I've been trying to hit shots like these for months 😭 Any tips for improving aim?",
      time: "30m ago",
      likes: 12
    }
  ];

  const suggestedVideos = [
    {
      title: "Another Insane Valorant Clutch",
      thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300&h=169&fit=crop",
      duration: "0:34",
      views: "892K",
      likes: "21K",
      author: "ValMaster",
      authorAvatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=32&h=32&fit=crop&crop=face",
      game: "Valorant",
      uploadTime: "1d ago"
    },
    {
      title: "How to Improve Your Aim",
      thumbnail: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=300&h=169&fit=crop",
      duration: "5:23",
      views: "1.2M",
      likes: "67K",
      author: "AimCoach",
      authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=face",
      game: "Tutorial",
      uploadTime: "3d ago"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Video Player */}
          <div className="glass-card rounded-xl overflow-hidden neon-border">
            <div className="aspect-video bg-gaming-darker flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-muted-foreground">Video Player</p>
                <p className="text-xs text-muted-foreground mt-1">1080p • 60fps</p>
              </div>
            </div>
          </div>

          {/* Video Info */}
          <div className="glass-card rounded-xl p-6">
            <div className="space-y-4">
              {/* Title and Actions */}
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-xl font-semibold mb-2">{videoData.title}</h1>
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="h-4 w-4" />
                      {videoData.views} views
                    </span>
                    <span>•</span>
                    <span>{videoData.uploadTime}</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">
                      {videoData.game}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "bg-primary hover:bg-primary/90 neon-glow" : "border-gaming-border"}
                  >
                    <ThumbsUp className="h-4 w-4 mr-2" />
                    {videoData.likes}
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-gaming-border">
                    <ThumbsDown className="h-4 w-4 mr-2" />
                    {videoData.dislikes}
                  </Button>
                  
                  <Button variant="outline" size="sm" className="border-gaming-border">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  
                  <Button
                    variant={isBookmarked ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={isBookmarked ? "bg-[#0099ff] hover:bg-[#0099ff]/90" : "border-gaming-border"}
                  >
                    <Bookmark className="h-4 w-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="border-gaming-border">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="glass-card border-gaming-border">
                      <DropdownMenuItem>
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <Separator className="bg-gaming-border" />

              {/* Author Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={videoData.authorAvatar} alt={videoData.author} />
                    <AvatarFallback>{videoData.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{videoData.author}</h3>
                    <p className="text-sm text-muted-foreground">2.4M subscribers</p>
                  </div>
                </div>
                <Button className="bg-primary hover:bg-primary/90 neon-glow">
                  Subscribe
                </Button>
              </div>

              {/* Description */}
              <div className="glass-card p-4 rounded-lg">
                <p className="text-sm leading-relaxed mb-3">{videoData.description}</p>
                <div className="flex flex-wrap gap-2">
                  {videoData.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="glass-card text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="glass-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Comments ({comments.length})</h3>
            
            {/* Comment Input */}
            <div className="space-y-3 mb-6">
              <Textarea
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="bg-card border-gaming-border focus:border-primary resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm" className="border-gaming-border">
                  Cancel
                </Button>
                <Button size="sm" className="bg-primary hover:bg-primary/90 neon-glow">
                  Comment
                </Button>
              </div>
            </div>

            <Separator className="bg-gaming-border mb-6" />

            {/* Comments List */}
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={comment.avatar} alt={comment.author} />
                    <AvatarFallback className="text-xs">{comment.author[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.time}</span>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                    <div className="flex items-center space-x-4 pt-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <Heart className="h-3 w-3 mr-1" />
                        {comment.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        Reply
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl p-4">
            <h3 className="font-semibold mb-4">Up Next</h3>
            <div className="space-y-4">
              {suggestedVideos.map((video, index) => (
                <VideoCard key={index} {...video} size="small" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}