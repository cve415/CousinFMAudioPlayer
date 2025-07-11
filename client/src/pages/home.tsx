import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Broadcast } from "@/types/broadcast";
import { Header } from "@/components/Header";
import { BroadcastList } from "@/components/BroadcastList";
import { MediaPlayer } from "@/components/MediaPlayer";
import { ErrorModal } from "@/components/ErrorModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { MobileControls } from "@/components/MobileControls";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    data: broadcasts = [],
    isLoading,
    error: queryError,
    refetch,
  } = useQuery<Broadcast[]>({
    queryKey: ["/api/broadcasts"],
  });

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

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setIsPlaying(false);
  };

  const handleRetry = () => {
    setError(null);
    refetch();
  };

  if (queryError) {
    return (
      <div className="min-h-screen bg-cousin-dark flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Failed to load broadcasts</h2>
          <p className="text-cousin-light-gray mb-4">
            Please check your connection and try again.
          </p>
          <button
            onClick={handleRetry}
            className="bg-cousin-orange text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cousin-dark text-white">
      <Header totalBroadcasts={broadcasts.length} />
      
      <div className="flex flex-col lg:flex-row">
        <BroadcastList
          broadcasts={broadcasts}
          selectedBroadcast={selectedBroadcast}
          onSelectBroadcast={handleSelectBroadcast}
          isLoading={isLoading}
        />
        
        <MediaPlayer
          broadcast={selectedBroadcast}
          onNext={handleNext}
          onPrevious={handlePrevious}
          broadcasts={broadcasts}
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
