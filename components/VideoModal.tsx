import { useState, useEffect } from "react";
import { X, Play, Pause, Volume2, VolumeX, Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  game: string;
  views: number;
  likes: number;
  uploadTime: string;
}

export function VideoModal({ 
  isOpen, 
  onClose, 
  videoUrl, 
  title, 
  game, 
  views, 
  likes, 
  uploadTime 
}: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  const handleVideoClick = () => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      if (isPlaying) {
        video.pause();
      } else {
        video.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      setCurrentTime(video.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      setDuration(video.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      const time = (parseFloat(e.target.value) / 100) * duration;
      video.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      video.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    const video = document.getElementById('modal-video') as HTMLVideoElement;
    if (video) {
      if (!isFullscreen) {
        if (video.requestFullscreen) {
          video.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-4xl mx-4 glass-card rounded-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gaming-border">
          <div className="flex items-center space-x-3">
            <Badge className="bg-primary/90 text-primary-foreground border-0">
              {game}
            </Badge>
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video bg-black">
          <video
            id="modal-video"
            src={videoUrl}
            className="w-full h-full object-contain"
            onClick={handleVideoClick}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onError={(e) => {
              console.error('Video error:', e);
              console.error('Video URL:', videoUrl);
            }}
            muted={isMuted}
          />
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleVideoClick}
                  className="text-white hover:bg-white/20"
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="text-white hover:bg-white/20"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Bar - Underneath Video */}
        <div className="px-4 py-3 bg-card border-t border-gaming-border">
          <div className="relative">
            {/* Background Track */}
            <div className="w-full h-2 timeline-track">
              {/* Progress Bar with Glow Effect */}
              <div 
                className="h-full timeline-progress"
                style={{ 
                  width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`
                }}
              />
            </div>
            
            {/* Interactive Slider */}
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="timeline-slider"
            />
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <span>{views} views</span>
              <span>{likes} likes</span>
              <span>{uploadTime}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 