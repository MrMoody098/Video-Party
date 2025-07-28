import { useState } from "react";
import { Users, Crown, UserPlus, Play, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

interface PartyRoomEntryProps {
  isOpen: boolean;
  onCreateRoom: () => void;
  onJoinRoom: (roomId: string) => void;
  onClose: () => void;
}

export function PartyRoomEntry({ isOpen, onCreateRoom, onJoinRoom, onClose }: PartyRoomEntryProps) {
  const [roomId, setRoomId] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoinRoom = () => {
    if (roomId.trim()) {
      setIsJoining(true);
      // Simulate joining process
      setTimeout(() => {
        onJoinRoom(roomId.trim().toUpperCase());
        setIsJoining(false);
      }, 1000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
      <div className="w-full max-w-md mx-4">
        <Card className="glass-card border-gaming-border">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Users className="h-6 w-6 text-primary" />
              <CardTitle>Party Room</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">
              Watch videos together with friends in real-time
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Create Room */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Crown className="h-4 w-4 text-yellow-500" />
                <h3 className="font-medium">Create a Room</h3>
              </div>
              <Button 
                onClick={onCreateRoom} 
                className="w-full bg-primary hover:bg-primary/90 neon-glow"
              >
                <Play className="h-4 w-4 mr-2" />
                Host New Party
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gaming-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>

            {/* Join Room */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <h3 className="font-medium">Join a Room</h3>
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Enter Room ID (e.g., ABC123)"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="text-center font-mono"
                  maxLength={6}
                />
                <Button 
                  onClick={handleJoinRoom}
                  disabled={!roomId.trim() || isJoining}
                  variant="outline"
                  className="w-full border-gaming-border hover:bg-primary/10"
                >
                  {isJoining ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                      Joining...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Join Party
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Features */}
            <div className="pt-4 border-t border-gaming-border">
              <h4 className="text-sm font-medium mb-2">Party Features:</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Play className="h-3 w-3" />
                  <span>Synchronized video playback</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-3 w-3" />
                  <span>Real-time chat with friends</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Settings className="h-3 w-3" />
                  <span>Temporary clip sharing</span>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="w-full text-muted-foreground hover:text-foreground"
            >
              Cancel
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 