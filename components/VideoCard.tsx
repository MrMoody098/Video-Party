import { Play, Heart, MessageCircle, Share, Eye, Clock, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { VideoModal } from "./VideoModal";
import { useState } from "react";

interface VideoCardProps {
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  likes: string;
  author: string;
  authorAvatar: string;
  game: string;
  uploadTime: string;
  size?: "small" | "medium" | "large";
  onDelete?: (clipId: string) => void;
  isOwner?: boolean;
  clipId?: string;
}

export function VideoCard({
  title,
  thumbnail,
  duration,
  views,
  likes,
  author,
  authorAvatar,
  game,
  uploadTime,
  size = "medium",
  onDelete,
  isOwner,
  clipId
}: VideoCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const sizeClasses = {
    small: "w-full max-w-sm",
    medium: "w-full max-w-md",
    large: "w-full max-w-lg"
  };

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <div 
        className={`${sizeClasses[size]} glass-card rounded-lg overflow-hidden group cursor-pointer`}
        onClick={handleCardClick}
      >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        {thumbnail.includes('uploads/') ? (
          <video
            src={thumbnail}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            muted
            preload="metadata"
          />
        ) : (
          <ImageWithFallback
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <Button size="icon" className="h-12 w-12 rounded-full bg-primary/90 hover:bg-primary neon-glow">
            <Play className="h-6 w-6" />
          </Button>
        </div>

        {/* Duration Badge */}
        <Badge className="absolute bottom-2 right-2 bg-black/80 text-white border-0">
          <Clock className="h-3 w-3 mr-1" />
          {duration}
        </Badge>

        {/* Game Badge */}
        <Badge className="absolute top-2 left-2 bg-primary/90 text-primary-foreground border-0">
          {game}
        </Badge>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center space-x-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={authorAvatar} alt={author} />
            <AvatarFallback className="text-xs">{author[0]}</AvatarFallback>
          </Avatar>
          <span className="text-sm text-muted-foreground">{author}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{uploadTime}</span>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="h-3 w-3" />
              <span>{views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Heart className="h-3 w-3" />
              <span>{likes}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Heart className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={(e) => e.stopPropagation()}
            >
              <MessageCircle className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6"
              onClick={(e) => e.stopPropagation()}
            >
              <Share className="h-3 w-3" />
            </Button>
            {isOwner && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  if (clipId && window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
                    onDelete?.(clipId);
                  }
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Video Modal */}
    <VideoModal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      videoUrl={thumbnail}
      title={title}
      game={game}
      views={parseInt(views) || 0}
      likes={parseInt(likes) || 0}
      uploadTime={uploadTime}
    />
  </>
);
}