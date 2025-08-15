import { useState, useEffect } from "react";
import { Broadcast } from "@/types/broadcast";
import { Header } from "@/components/Header";
import { BroadcastList } from "@/components/BroadcastList";
import { StreamingPlayer } from "@/components/StreamingPlayer";
import { ErrorModal } from "@/components/ErrorModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MobileControls } from "@/components/MobileControls";
import { useToast } from "@/hooks/use-toast";
import broadcastsData from "@/data/broadcasts.json";

export default function Home() {
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load broadcasts from local JSON data and sort by date (newest first)
    const broadcastsWithDates = broadcastsData.map(broadcast => ({
      ...broadcast,
      createdAt: new Date(broadcast.createdAt)
    })) as Broadcast[];
    
    const sortedBroadcasts = broadcastsWithDates.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    setBroadcasts(sortedBroadcasts);
    setIsLoading(false);

    // Check for shared broadcast in URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const sharedBroadcastId = urlParams.get('broadcast');
    if (sharedBroadcastId) {
      const sharedBroadcast = sortedBroadcasts.find(
        b => b.id === parseInt(sharedBroadcastId)
      );
      if (sharedBroadcast) {
        setSelectedBroadcast(sharedBroadcast);
        // Auto-play shared broadcast after a short delay
        setTimeout(() => {
          setIsPlaying(true);
        }, 1000);
      }
    }
  }, []);

  const handleSelectBroadcast = (broadcast: Broadcast) => {
    setSelectedBroadcast(broadcast);
    setError(null);
  };

  const handleNext = () => {
    if (!selectedBroadcast || broadcasts.length === 0) return;
    
    const currentIndex = broadcasts.findIndex(b => b.id === selectedBroadcast.id);
    const nextIndex = (currentIndex + 1) % broadcasts.length;
    setSelectedBroadcast(broadcasts[nextIndex]);
  };

  const handlePrevious = () => {
    if (!selectedBroadcast || broadcasts.length === 0) return;
    
    const currentIndex = broadcasts.findIndex(b => b.id === selectedBroadcast.id);
    const prevIndex = currentIndex === 0 ? broadcasts.length - 1 : currentIndex - 1;
    setSelectedBroadcast(broadcasts[prevIndex]);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePlayBroadcast = (broadcast: Broadcast) => {
    console.log('Play broadcast clicked:', broadcast.title);
    
    if (selectedBroadcast?.id === broadcast.id) {
      // If same broadcast, toggle play/pause
      setIsPlaying(!isPlaying);
      console.log('Toggling play/pause for current broadcast:', !isPlaying);
    } else {
      // If different broadcast, select it and start playing
      console.log('Selecting new broadcast:', broadcast.title);
      setSelectedBroadcast(broadcast);
      setIsPlaying(true);
      setError(null);
      
      // Force a small delay to ensure state updates
      setTimeout(() => {
        console.log('Setting isPlaying to true after delay');
        setIsPlaying(true);
      }, 100);
    }
  };

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsPlaying(false);
  };

  const handleRetry = () => {
    setError(null);
    // Reload broadcasts from JSON with proper date conversion
    const broadcastsWithDates = broadcastsData.map(broadcast => ({
      ...broadcast,
      createdAt: new Date(broadcast.createdAt)
    })) as Broadcast[];
    setBroadcasts(broadcastsWithDates);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header totalBroadcasts={broadcasts.length} />
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Streaming Player - Main Content */}
        <div className="flex-1 pb-20 lg:pb-0">
          <StreamingPlayer
            broadcast={selectedBroadcast}
            onNext={handleNext}
            onPrevious={handlePrevious}
            broadcasts={broadcasts}
            isPlaying={isPlaying}
            onTogglePlay={handleTogglePlay}
          />
        </div>

        {/* Broadcast List - Sidebar */}
        <BroadcastList
          broadcasts={broadcasts}
          selectedBroadcast={selectedBroadcast}
          onSelectBroadcast={handleSelectBroadcast}
          onPlayBroadcast={handlePlayBroadcast}
          isPlaying={isPlaying}
          isLoading={isLoading}
        />
      </div>

      <MobileControls
        broadcast={selectedBroadcast}
        isPlaying={isPlaying}
        onTogglePlay={handleTogglePlay}
        onNext={handleNext}
      />

      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        onRetry={handleRetry}
        error={error || ""}
      />

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
