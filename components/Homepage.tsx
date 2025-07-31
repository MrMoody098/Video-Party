import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame, TrendingUp, Star, Clock, Upload } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { VideoCard } from "./VideoCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { getApiUrl, getVideoUrl } from "../src/utils/api";

interface UploadedClip {
  id: string;
  title: string;
  description: string;
  game: string;
  tags: string[];
  isPrivate: boolean;
  uploadedAt: string;
  views: number;
  likes: number;
  filename: string;
  originalName: string;
  size: number;
  thumbnail_url?: string;
}

export function Homepage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [uploadedClips, setUploadedClips] = useState<UploadedClip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Generate dynamic categories from uploaded clips
  const generateCategories = () => {
    const gameCounts = uploadedClips.reduce((acc, clip) => {
      const game = clip.game.toLowerCase();
      acc[game] = (acc[game] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const dynamicCategories = Object.entries(gameCounts).map(([game, count]) => ({
      id: game,
      name: game.charAt(0).toUpperCase() + game.slice(1),
      icon: "🎮",
      count
    }));

    return [
      { id: "all", name: "All Games", icon: "🎮", count: uploadedClips.length },
      ...dynamicCategories.sort((a, b) => b.count - a.count)
    ];
  };

  const categories = generateCategories();

  // Fetch uploaded clips from server
  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await fetch(getApiUrl('/api/clips'));
        if (response.ok) {
          const clips = await response.json();
          setUploadedClips(clips);
        } else {
          setError('Failed to load clips');
        }
      } catch (error) {
        setError('Network error. Make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchClips();

    // Refresh clips every 30 seconds to show new uploads
    const interval = setInterval(fetchClips, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filter clips based on active category
  const filteredClips = activeCategory === "all" 
    ? uploadedClips 
    : uploadedClips.filter(clip => 
        clip.game.toLowerCase() === activeCategory.toLowerCase()
      );

  // Format upload time
  const formatUploadTime = (uploadedAt: string) => {
    const now = new Date();
    const uploadDate = new Date(uploadedAt);
    const diffInHours = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleDeleteVideo = async (clipId: string) => {
    try {
      console.log('🗑️ Deleting video with ID:', clipId);
      
              const response = await fetch(getApiUrl(`/api/clips/${clipId}`), {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove the clip from the local state
        setUploadedClips(uploadedClips.filter(clip => clip.id !== clipId));
        console.log('✅ Video deleted successfully from UI');
        alert('Video deleted successfully!');
      } else {
        console.error('❌ Failed to delete video');
        alert('Failed to delete video. Please try again.');
      }
    } catch (error) {
      console.error('💥 Error deleting video:', error);
      alert('Error deleting video. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Loading and Error States */}
      {loading && (
        <div className="glass-card rounded-xl p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading uploaded clips...</p>
        </div>
      )}

      {error && (
        <div className="glass-card rounded-xl p-6 border border-destructive/20">
          <div className="flex items-center space-x-2 mb-4">
            <Upload className="h-5 w-5 text-destructive" />
            <h2 className="text-xl font-semibold text-destructive">Upload Your First Clip</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            {error === 'Network error. Make sure the server is running.' 
              ? 'Unable to connect to server. Make sure the backend server is running on port 3001.'
              : error}
          </p>
          <Button className="bg-primary hover:bg-primary/90 neon-glow">
            Go to Upload Page
          </Button>
        </div>
      )}

      {/* Hero Section with Featured Clips */}
      {!loading && !error && uploadedClips.length > 0 && (
        <section className="relative">
          <div className="glass-card rounded-xl p-6 neon-border">
            <div className="flex items-center space-x-2 mb-4">
              <Flame className="h-5 w-5 text-[#ff0099]" />
              <h2 className="text-xl font-semibold">Featured Clips</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              {uploadedClips.slice(0, 3).map((clip) => (
                <div key={clip.id} className="relative group cursor-pointer">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gaming-darker">
                    <video 
                      src={getVideoUrl(clip.filename)}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge className="mb-2 bg-primary/90 text-primary-foreground border-0">
                        {clip.game}
                      </Badge>
                      <h3 className="font-semibold text-white mb-1">{clip.title}</h3>
                      <div className="flex items-center justify-between text-sm text-white/80">
                        <span>{clip.views} views</span>
                        <span>{formatUploadTime(clip.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Category Filters */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#0099ff]" />
            <h2 className="text-xl font-semibold">Browse by Category</h2>
          </div>
          {!loading && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.location.reload()}
              className="border-gaming-border hover:bg-primary/10"
            >
              <Upload className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {categories.length > 1 ? (
            categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "secondary"}
                className={`${
                  activeCategory === category.id 
                    ? "bg-primary hover:bg-primary/90 neon-glow-sm" 
                    : "glass-card hover:glass-card"
                } transition-all duration-300`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                {category.count !== undefined && (
                  <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary-foreground">
                    {category.count}
                  </Badge>
                )}
              </Button>
            ))
          ) : (
            <div className="text-center py-8 w-full">
              <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-muted-foreground text-sm">No videos uploaded yet. Upload your first clip to see categories!</p>
            </div>
          )}
        </div>
      </section>

      {/* Content Tabs */}
      <section>
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="glass-card border-gaming-border">
            <TabsTrigger value="trending" className="data-[state=active]:bg-primary data-[state=active]:text-black !text-black">
              <TrendingUp className="h-4 w-4 mr-2" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Clock className="h-4 w-4 mr-2" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="top" className="data-[state=active]:bg-primary data-[state=active]:text-black">
              <Star className="h-4 w-4 mr-2" />
              Top Rated
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            {filteredClips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredClips.map((clip) => (
                  <VideoCard 
                    key={clip.id}
                    title={clip.title}
                    thumbnail={clip.thumbnail_url || getVideoUrl(clip.filename)}
                    videoUrl={getVideoUrl(clip.filename)}
                    duration="0:00"
                    views={`${clip.views}`}
                    likes={`${clip.likes}`}
                    author="Anonymous"
                    authorAvatar=""
                    game={clip.game}
                    uploadTime={formatUploadTime(clip.uploadedAt)}
                    onDelete={() => handleDeleteVideo(clip.id)}
                    isOwner={false} // Assuming not owner for now, will be updated based on actual user
                    clipId={clip.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No clips found</h3>
                <p className="text-muted-foreground">Upload your first gaming clip to get started!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent" className="mt-6">
            {filteredClips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...filteredClips].sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()).map((clip) => (
                  <VideoCard 
                    key={clip.id}
                    title={clip.title}
                    thumbnail={clip.thumbnail_url || getVideoUrl(clip.filename)}
                    videoUrl={getVideoUrl(clip.filename)}
                    duration="0:00"
                    views={`${clip.views}`}
                    likes={`${clip.likes}`}
                    author="Anonymous"
                    authorAvatar=""
                    game={clip.game}
                    uploadTime={formatUploadTime(clip.uploadedAt)}
                    onDelete={() => handleDeleteVideo(clip.id)}
                    isOwner={false} // Assuming not owner for now, will be updated based on actual user
                    clipId={clip.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No clips found</h3>
                <p className="text-muted-foreground">Upload your first gaming clip to get started!</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="top" className="mt-6">
            {filteredClips.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...filteredClips].sort((a, b) => b.likes - a.likes).map((clip) => (
                  <VideoCard 
                    key={clip.id}
                    title={clip.title}
                    thumbnail={clip.thumbnail_url || getVideoUrl(clip.filename)}
                    videoUrl={getVideoUrl(clip.filename)}
                    duration="0:00"
                    views={`${clip.views}`}
                    likes={`${clip.likes}`}
                    author="Anonymous"
                    authorAvatar=""
                    game={clip.game}
                    uploadTime={formatUploadTime(clip.uploadedAt)}
                    onDelete={() => handleDeleteVideo(clip.id)}
                    isOwner={false} // Assuming not owner for now, will be updated based on actual user
                    clipId={clip.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">No clips found</h3>
                <p className="text-muted-foreground">Upload your first gaming clip to get started!</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}