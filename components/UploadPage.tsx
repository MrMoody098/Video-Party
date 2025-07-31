import { useState, useCallback, useEffect } from "react";
import { Upload, X, Play, Eye, EyeOff, Tag, FileVideo } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Badge } from "./ui/badge";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { getApiUrl } from "../src/utils/api";

export function UploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPrivate, setIsPrivate] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedGame, setSelectedGame] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [existingGames, setExistingGames] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith("video/")) {
        setFile(droppedFile);
      }
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Fetch existing games for autocomplete
  useEffect(() => {
    const fetchExistingGames = async () => {
      try {
        const response = await fetch(getApiUrl('/api/clips'));
        if (response.ok) {
          const clips = await response.json() as Array<{ game: string }>;
          const games = [...new Set(clips.map(clip => clip.game))];
          setExistingGames(games);
        }
      } catch (error) {
        console.log('Could not fetch existing games for suggestions');
      }
    };

    fetchExistingGames();
  }, []);

  // Filter suggestions based on input
  const handleGameInputChange = (value: string) => {
    setSelectedGame(value);
    
    if (value.trim()) {
      const filtered = existingGames.filter(game => 
        game.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSelectedGame(suggestion);
    setShowSuggestions(false);
  };

  const handleUpload = async () => {
    if (!file || !title.trim() || !selectedGame.trim()) {
      setUploadError("Please fill in all required fields (title, game, and upload a video)");
      return;
    }
    
    setIsUploading(true);
    setUploadError("");
    setUploadSuccess(false);
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      formData.append('game', selectedGame);
      formData.append('tags', JSON.stringify(tags));
      formData.append('isPrivate', isPrivate.toString());
      
      // Simulate upload progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 5;
        setUploadProgress(Math.min(progress, 90));
      }, 100);
      
              const response = await fetch(getApiUrl('/api/upload'), {
        method: 'POST',
        body: formData,
      });
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      if (response.ok) {
        const result = await response.json();
        setUploadSuccess(true);
        setUploadError("");
        
        // Reset form after successful upload
        setTimeout(() => {
          setFile(null);
          setTitle("");
          setDescription("");
          setSelectedGame("");
          setTags([]);
          setIsPrivate(false);
          setUploadProgress(0);
          setUploadSuccess(false);
        }, 2000);
      } else {
        const errorData = await response.json();
        setUploadError(errorData.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Network error. Make sure the server is running on port 3001.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Upload Your Gaming Clip</h1>
          <p className="text-muted-foreground">Share your best gaming moments with the community</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* File Upload */}
            <Card className="glass-card border-gaming-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileVideo className="h-5 w-5 text-primary" />
                  <span>Video File</span>
                </CardTitle>
                <CardDescription>Upload your gaming clip (MP4, MOV, AVI supported)</CardDescription>
              </CardHeader>
              <CardContent>
                {!file ? (
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive 
                        ? "border-primary bg-primary/10 neon-glow" 
                        : "border-gaming-border hover:border-primary/50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Drop your video here</h3>
                    <p className="text-muted-foreground mb-4">or</p>
                    <div>
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                      <Button asChild className="bg-primary hover:bg-primary/90 neon-glow">
                        <label htmlFor="file-upload" className="cursor-pointer">
                          Browse Files
                        </label>
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-4">
                      Max file size: 500MB • Formats: MP4, MOV, AVI
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 glass-card rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileVideo className="h-8 w-8 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {(file.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setFile(null)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Details */}
            <Card className="glass-card border-gaming-border">
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
                <CardDescription>Add information about your clip</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    placeholder="Enter a catchy title for your clip"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="bg-card border-gaming-border focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what happens in your clip..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="bg-card border-gaming-border focus:border-primary resize-none"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="game">Game *</Label>
                  <div className="relative">
                    <Input
                      id="game"
                      placeholder="Enter the game name (e.g., Valorant, Counter-Strike 2)"
                      value={selectedGame}
                      onChange={(e) => handleGameInputChange(e.target.value)}
                      onFocus={() => selectedGame.trim() && setShowSuggestions(filteredSuggestions.length > 0)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      className="bg-card border-gaming-border focus:border-primary"
                    />
                    
                    {/* Autocomplete Suggestions */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white dark:bg-gray-900 border border-gaming-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {filteredSuggestions.map((suggestion, index) => (
                          <button
                            key={index}
                            className="w-full px-3 py-2 text-left hover:bg-primary/10 transition-colors border-b border-gaming-border/20 last:border-b-0"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <div className="flex items-center space-x-2">
                              <span className="text-sm">{suggestion}</span>
                              <Badge variant="secondary" className="text-xs bg-primary/20 text-primary-foreground">
                                Existing
                              </Badge>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                    
                    {/* Show existing games count */}
                    {existingGames.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {existingGames.length} existing game{existingGames.length !== 1 ? 's' : ''} available for suggestions
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      placeholder="Add tags (e.g., clutch, headshot)"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addTag()}
                      className="bg-card border-gaming-border focus:border-primary"
                    />
                    <Button onClick={addTag} variant="outline" className="border-gaming-border">
                      <Tag className="h-4 w-4" />
                    </Button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="glass-card">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-xs hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview & Settings */}
          <div className="space-y-6">
            {/* Video Preview */}
            <Card className="glass-card border-gaming-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Play className="h-5 w-5 text-primary" />
                  <span>Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gaming-darker rounded-lg border border-gaming-border overflow-hidden">
                  {file ? (
                    <video
                      src={URL.createObjectURL(file)}
                      className="w-full h-full object-cover"
                      controls
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        const video = e.target as HTMLVideoElement;
                        console.log('Video loaded:', {
                          duration: video.duration,
                          width: video.videoWidth,
                          height: video.videoHeight
                        });
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <FileVideo className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Upload a video to see preview</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="glass-card border-gaming-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {isPrivate ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  <span>Privacy Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="privacy">Private Clip</Label>
                    <p className="text-sm text-muted-foreground">Only you can view this clip</p>
                  </div>
                  <Switch
                    id="privacy"
                    checked={isPrivate}
                    onCheckedChange={setIsPrivate}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Upload Actions */}
            <div className="space-y-4">
              {uploadError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  {uploadError}
                </div>
              )}
              
              {uploadSuccess && (
                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-500 text-sm">
                  ✅ Upload successful! Your clip has been saved.
                </div>
              )}
              
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading}
                className="w-full bg-primary hover:bg-primary/90 neon-glow disabled:opacity-50"
                size="lg"
              >
                {isUploading ? "Uploading..." : "Upload Clip"}
              </Button>
              <Button variant="outline" className="w-full border-gaming-border">
                Save as Draft
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}