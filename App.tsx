import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { Homepage } from "./components/Homepage";
import { UploadPage } from "./components/UploadPage";
import { VideoPlayerPage } from "./components/VideoPlayerPage";
import { UserProfilePage } from "./components/UserProfilePage";
import { PartyRoom } from "./components/PartyRoom";
import { PartyRoomEntry } from "./components/PartyRoomEntry";

type Page = "home" | "upload" | "watch" | "profile";

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>("home");
  const [isPartyRoomOpen, setIsPartyRoomOpen] = useState(false);
  const [isPartyEntryOpen, setIsPartyEntryOpen] = useState(false);
  const [currentRoomId, setCurrentRoomId] = useState("");

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Homepage />;
      case "upload":
        return <UploadPage />;
      case "watch":
        return <VideoPlayerPage />;
      case "profile":
        return <UserProfilePage />;
      default:
        return <Homepage />;
    }
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <Navigation />
      
      {/* Development Navigation (for demo purposes) */}
      <div className="container mx-auto px-4 py-4">
        <div className="glass-card rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-3">Demo Navigation:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCurrentPage("home")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentPage === "home" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              Homepage
            </button>
            <button
              onClick={() => setCurrentPage("upload")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentPage === "upload" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              Upload Page
            </button>
            <button
              onClick={() => setCurrentPage("watch")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentPage === "watch" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              Video Player
            </button>
            <button
              onClick={() => setCurrentPage("profile")}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                currentPage === "profile" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary hover:bg-secondary/80"
              }`}
            >
              User Profile
            </button>
            <button
              onClick={() => setIsPartyEntryOpen(true)}
              className="px-3 py-1 rounded text-sm transition-colors bg-secondary hover:bg-secondary/80"
            >
              🎮 Party Room
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-8">
        {renderPage()}
      </main>

      {/* Party Room Entry */}
      <PartyRoomEntry
        isOpen={isPartyEntryOpen}
        onCreateRoom={() => {
          setIsPartyEntryOpen(false);
          setIsPartyRoomOpen(true);
        }}
        onJoinRoom={(roomId) => {
          setCurrentRoomId(roomId);
          setIsPartyEntryOpen(false);
          setIsPartyRoomOpen(true);
        }}
        onClose={() => setIsPartyEntryOpen(false)}
      />

      {/* Party Room */}
      <PartyRoom 
        isOpen={isPartyRoomOpen} 
        onClose={() => setIsPartyRoomOpen(false)} 
      />
    </div>
  );
}