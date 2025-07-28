import { useState, useRef, useEffect } from "react";
import { 
  Users, 
  LogOut, 
  Copy, 
  Crown, 
  Mic, 
  MicOff, 
  Send, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize, 
  X, 
  Video, 
  Upload, 
  Plus 
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";
import { VideoModal } from "./VideoModal";

interface PartyMember {
  id: string;
  name: string;
  avatar: string;
  isHost: boolean;
  isOnline: boolean;
}

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'video';
}

interface PartyRoomProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
}

export function PartyRoom({ isOpen, onClose, roomId = "PARTY123" }: PartyRoomProps) {
  const [isHost, setIsHost] = useState(true);
  const [members, setMembers] = useState<PartyMember[]>([
    { id: "1", name: "You", avatar: "", isHost: true, isOnline: true },
    { id: "2", name: "Alex", avatar: "", isHost: false, isOnline: true },
    { id: "3", name: "Sam", avatar: "", isHost: false, isOnline: true },
    { id: "4", name: "Jordan", avatar: "", isHost: false, isOnline: false },
  ]);
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", userId: "system", userName: "System", message: "Welcome to the party room!", timestamp: new Date(), type: 'system' },
    { id: "2", userId: "2", userName: "Alex", message: "Hey everyone!", timestamp: new Date(), type: 'text' },
    { id: "3", userId: "3", userName: "Sam", message: "Ready to watch some videos!", timestamp: new Date(), type: 'text' },
  ]);
  
  const [newMessage, setNewMessage] = useState("");
  const [currentVideo, setCurrentVideo] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [uploadedClips, setUploadedClips] = useState<string[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videoQueue, setVideoQueue] = useState<string[]>([]);
  const [currentQueueIndex, setCurrentQueueIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate room ID if hosting
  useEffect(() => {
    if (isHost && !roomId) {
      const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
      // In a real app, you'd set this in your state management
    }
  }, [isHost, roomId]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: ChatMessage = {
        id: Date.now().toString(),
        userId: "1",
        userName: "You",
        message: newMessage.trim(),
        timestamp: new Date(),
        type: 'text'
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleVideoUpload = (file: File) => {
    const videoUrl = URL.createObjectURL(file);
    setUploadedClips([...uploadedClips, videoUrl]);
    
    // Add to queue automatically
    const newQueue = [...videoQueue, videoUrl];
    setVideoQueue(newQueue);
    
    // If this is the first video in queue, start playing it
    if (newQueue.length === 1) {
      setCurrentVideo(videoUrl);
      setCurrentQueueIndex(0);
    }
    
    // Add system message
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "system",
      userName: "System",
      message: `Video uploaded and added to queue: ${file.name}`,
      timestamp: new Date(),
      type: 'video'
    };
    setMessages([...messages, message]);
  };

  const handleVideoSelect = (videoUrl: string) => {
    setCurrentVideo(videoUrl);
    setShowVideoModal(true);
    setSelectedVideo(videoUrl);
  };

  const addToQueue = (videoUrl: string) => {
    const newQueue = [...videoQueue, videoUrl];
    setVideoQueue(newQueue);
    
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "system",
      userName: "System",
      message: "Video added to queue",
      timestamp: new Date(),
      type: 'video'
    };
    setMessages([...messages, message]);
  };

  const removeFromQueue = (index: number) => {
    const newQueue = videoQueue.filter((_, i) => i !== index);
    setVideoQueue(newQueue);
    
    if (currentQueueIndex === index && newQueue.length > 0) {
      setCurrentVideo(newQueue[0]);
      setCurrentQueueIndex(0);
    } else if (currentQueueIndex > index) {
      setCurrentQueueIndex(currentQueueIndex - 1);
    }
  };

  const playNextInQueue = () => {
    if (currentQueueIndex < videoQueue.length - 1) {
      setCurrentQueueIndex(currentQueueIndex + 1);
      setCurrentVideo(videoQueue[currentQueueIndex + 1]);
    }
  };

  const playPreviousInQueue = () => {
    if (currentQueueIndex > 0) {
      setCurrentQueueIndex(currentQueueIndex - 1);
      setCurrentVideo(videoQueue[currentQueueIndex - 1]);
    }
  };

  const playAndAddToQueue = (videoUrl: string) => {
    // Add to queue
    const newQueue = [...videoQueue, videoUrl];
    setVideoQueue(newQueue);
    
    // Play immediately
    setCurrentVideo(videoUrl);
    setCurrentQueueIndex(newQueue.length - 1);
    
    // Add system message
    const message: ChatMessage = {
      id: Date.now().toString(),
      userId: "system",
      userName: "System",
      message: `Video added to queue and playing now`,
      timestamp: new Date(),
      type: 'video'
    };
    setMessages([...messages, message]);
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    // Auto-play next video in queue
    if (currentQueueIndex < videoQueue.length - 1) {
      playNextInQueue();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopyFeedback(true);
      setShowNotification(true);
      setTimeout(() => {
        setCopyFeedback(false);
        setShowNotification(false);
      }, 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopyFeedback(true);
      setShowNotification(true);
      setTimeout(() => {
        setCopyFeedback(false);
        setShowNotification(false);
      }, 2000);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gaming-border bg-card">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">Party Room</h1>
            </div>
            <Badge variant="secondary" className="bg-primary/20 text-primary-foreground">
              {members.filter(m => m.isOnline).length} Online
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Room ID Display */}
            <div className="flex items-center space-x-2 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg px-4 py-2">
              <div className="flex flex-col items-start">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Room Code</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-lg font-bold text-primary">{roomId}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyRoomId}
                    className={`transition-all duration-200 ${
                      copyFeedback 
                        ? 'bg-green-500/20 text-green-500 scale-110' 
                        : 'hover:bg-primary/20 hover:text-primary hover:scale-105'
                    }`}
                    title={copyFeedback ? "Copied to clipboard!" : "Copy Room ID to clipboard"}
                  >
                    {copyFeedback ? (
                      <span className="text-sm font-bold">✓</span>
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            <Button variant="outline" size="sm" onClick={onClose} className="border-gaming-border hover:bg-destructive/10 hover:text-destructive">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Queue */}
          <div className="w-64 flex flex-col border-r border-gaming-border bg-card">
            <div className="p-4 border-b border-gaming-border">
              <h3 className="text-sm font-medium mb-3">Video Queue</h3>
              <div className="flex items-center space-x-2 mb-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playPreviousInQueue}
                  disabled={currentQueueIndex === 0}
                  className="flex-1"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={playNextInQueue}
                  disabled={currentQueueIndex >= videoQueue.length - 1}
                  className="flex-1"
                >
                  Next
                </Button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {videoQueue.length === 0 ? (
                <div className="text-center py-8">
                  <Video className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">No videos in queue</p>
                </div>
              ) : (
                videoQueue.map((video, index) => (
                  <div
                    key={index}
                    className={`relative cursor-pointer group rounded-lg overflow-hidden border ${
                      index === currentQueueIndex 
                        ? 'border-primary bg-primary/10' 
                        : 'border-gaming-border hover:border-primary/50'
                    }`}
                  >
                    <video
                      src={video}
                      className="w-full h-20 object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 bg-black/50 hover:bg-black/70"
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentQueueIndex(index);
                          setCurrentVideo(video);
                        }}
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* Queue Position Badge */}
                    <div className="absolute top-1 left-1">
                      <Badge variant="secondary" className="text-xs bg-black/80 text-white">
                        {index + 1}
                      </Badge>
                    </div>
                    
                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 bg-black/50 hover:bg-red-500/80 hover:text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Video Player */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
              {currentVideo ? (
                <video
                  ref={videoRef}
                  src={currentVideo}
                  className="w-full h-full object-contain"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={handleVideoEnded}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onVolumeChange={(e) => setIsMuted((e.target as HTMLVideoElement).muted)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No video selected</p>
                    <p className="text-sm">Upload a video or select from the list</p>
                  </div>
                </div>
              )}
              
              {/* Video Controls Overlay */}
              {currentVideo && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleVideoClick}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
                      >
                        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </Button>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </div>
                    
                    <span className="text-white text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                    
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Timeline Bar - Underneath Video */}
            {currentVideo && (
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
                    max={duration}
                    value={currentTime}
                    onChange={(e) => {
                      if (videoRef.current) {
                        videoRef.current.currentTime = parseFloat(e.target.value);
                      }
                    }}
                    className="timeline-slider"
                  />
                </div>
              </div>
            )}

            {/* Uploaded Clips */}
            {uploadedClips.length > 0 && (
              <div className="p-4 border-t border-gaming-border bg-card">
                <h3 className="text-sm font-medium mb-3">Uploaded Clips</h3>
                <div className="flex space-x-2 overflow-x-auto">
                  {uploadedClips.map((clip, index) => (
                    <div
                      key={index}
                      className="relative cursor-pointer group"
                    >
                      <video
                        src={clip}
                        className="w-24 h-16 object-cover rounded-lg border border-gaming-border"
                        muted
                        preload="metadata"
                        onClick={() => handleVideoSelect(clip)}
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center space-x-1">
                        <Button
                          size="icon"
                          className="h-8 w-8 bg-black/50 hover:bg-black/70"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoSelect(clip);
                          }}
                          title="Play Now"
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          className="h-8 w-8 bg-primary/80 hover:bg-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            playAndAddToQueue(clip);
                          }}
                          title="Add to Queue"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 flex flex-col border-l border-gaming-border bg-card">
            {/* Members */}
            <div className="p-4 border-b border-gaming-border">
              <h3 className="text-sm font-medium mb-3">Party Members</h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center space-x-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={member.avatar} />
                      <AvatarFallback className="text-xs">
                        {member.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1">{member.name}</span>
                    {member.isHost && <Crown className="h-3 w-3 text-yellow-500" />}
                    <div className={`w-2 h-2 rounded-full ${member.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                  </div>
                ))}
              </div>
            </div>

            {/* Chat */}
            <div className="flex-1 flex flex-col">
              <div className="p-4 border-b border-gaming-border">
                <h3 className="text-sm font-medium mb-3">Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.userId === "1" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      message.type === 'system' 
                        ? 'bg-primary/20 text-primary-foreground text-center'
                        : message.userId === "1"
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {message.type !== 'system' && (
                        <div className="text-xs opacity-70 mb-1">{message.userName}</div>
                      )}
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gaming-border">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="p-4 border-t border-gaming-border">
              <div className="flex space-x-2">
                <Button
                  variant={isMicOn ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className="flex-1"
                >
                  {isMicOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  {isMicOn ? "Mic On" : "Mic Off"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
              
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleVideoUpload(e.target.files[0]);
                    e.target.value = ''; // Reset input
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Copy Notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-60 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-in slide-in-from-right">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">✓</span>
            <span className="text-sm">Room ID copied to clipboard!</span>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <VideoModal
          isOpen={showVideoModal}
          onClose={() => setShowVideoModal(false)}
          videoUrl={selectedVideo}
          title="Party Video"
          game="Party Room"
          views={0}
          likes={0}
          uploadTime="Now"
        />
      )}
    </div>
  );
} 