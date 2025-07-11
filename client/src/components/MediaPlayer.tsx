import { useState, useRef, useEffect } from "react";
import { Broadcast, MediaPlayerState } from "@/types/broadcast";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Share,
  Download,
  Shuffle,
  Repeat,
  Rewind,
  FastForward,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MediaPlayerProps {
  broadcast: Broadcast | null;
  onNext: () => void;
  onPrevious: () => void;
  broadcasts: Broadcast[];
}

export function MediaPlayer({ broadcast, onNext, onPrevious }: MediaPlayerProps) {
  const [playerState, setPlayerState] = useState<MediaPlayerState>({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isLoading: false,
    error: null,
  });

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const isVideo = broadcast?.title.toLowerCase().includes(".mp4");
  const mediaRef = isVideo ? videoRef : audioRef;

  useEffect(() => {
    if (broadcast && mediaRef.current) {
      const streamUrl = `https://gateway.pinata.cloud/ipfs/${broadcast.cid}`;
      setPlayerState(prev => ({ ...prev, isLoading: true, error: null }));
      
      console.log("Loading broadcast:", broadcast.title, "URL:", streamUrl);
      
      mediaRef.current.src = streamUrl;
      mediaRef.current.crossOrigin = "anonymous";
      mediaRef.current.preload = "metadata";
      mediaRef.current.load();
    }
  }, [broadcast]);

  const togglePlay = async () => {
    if (!mediaRef.current || !broadcast) return;

    try {
      if (playerState.isPlaying) {
        mediaRef.current.pause();
      } else {
        await mediaRef.current.play();
      }
    } catch (error) {
      console.error("Playback error:", error);
      toast({
        title: "Playback Error",
        description: "Unable to play the broadcast. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTimeUpdate = () => {
    if (mediaRef.current) {
      setPlayerState(prev => ({
        ...prev,
        currentTime: mediaRef.current!.currentTime,
        duration: mediaRef.current!.duration || 0,
      }));
    }
  };

  const handleLoadedMetadata = () => {
    setPlayerState(prev => ({ ...prev, isLoading: false }));
  };

  const handleError = (e: any) => {
    console.error("Media error:", e);
    setPlayerState(prev => ({
      ...prev,
      isLoading: false,
      error: "Failed to load broadcast",
    }));
    toast({
      title: "Loading Error",
      description: "Unable to load the broadcast. Please check your connection.",
      variant: "destructive",
    });
  };

  const handlePlay = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: true }));
  };

  const handlePause = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: false }));
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mediaRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newTime = percentage * playerState.duration;
    mediaRef.current.currentTime = newTime;
  };

  const handleVolumeChange = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mediaRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = (e.clientX - rect.left) / rect.width;
    const newVolume = Math.max(0, Math.min(1, percentage));
    
    mediaRef.current.volume = newVolume;
    setPlayerState(prev => ({ ...prev, volume: newVolume }));
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage = playerState.duration 
    ? (playerState.currentTime / playerState.duration) * 100 
    : 0;

  const volumePercentage = playerState.volume * 100;

  if (!broadcast) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center text-cousin-light-gray">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play size={24} />
          </div>
          <p>Select a broadcast to start listening</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col">
      <div className="bg-cousin-gray border-b border-gray-700 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-cousin-orange rounded-xl flex items-center justify-center shadow-lg">
                {playerState.isPlaying ? (
                  <Pause className="text-white" size={32} />
                ) : (
                  <Play className="text-white" size={32} />
                )}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {broadcast.title}
                </h2>
                <p className="text-cousin-light-gray text-lg">
                  {new Date(broadcast.date).toLocaleDateString()}
                </p>
                <p className="text-cousin-light-gray text-sm mt-1">
                  {broadcast.fileSizeMB} MB • {isVideo ? "Video" : "Audio"}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
                <Share className="text-cousin-light-gray" size={24} />
              </button>
              <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
                <Download className="text-cousin-light-gray" size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-12">
        <div className="max-w-6xl w-full">
          {isVideo ? (
            <div className="mb-12">
              <video
                ref={videoRef}
                className="w-full max-w-4xl mx-auto rounded-2xl shadow-2xl"
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onError={handleError}
                onPlay={handlePlay}
                onPause={handlePause}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <div className="mb-12 text-center">
              <div className="w-full max-w-2xl mx-auto h-48 bg-gray-800 rounded-2xl flex items-end justify-center space-x-2 p-6 shadow-xl">
                {[...Array(24)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 rounded-full ${
                      i % 3 === 0 ? "bg-cousin-orange" : "bg-gray-600"
                    }`}
                    style={{
                      height: `${Math.random() * 100 + 30}px`,
                      animation: playerState.isPlaying ? `pulse ${Math.random() * 2 + 1}s infinite` : "none",
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="bg-cousin-gray rounded-3xl p-8 shadow-2xl">
            <div className="mb-8">
              <div className="flex justify-between text-lg text-cousin-light-gray mb-4">
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.duration)}</span>
              </div>
              <div 
                className="w-full bg-gray-700 rounded-full h-3 cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="bg-cousin-orange h-3 rounded-full transition-all duration-200"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center space-x-8 mb-8">
              <button
                onClick={onPrevious}
                className="p-4 hover:bg-gray-700 rounded-full transition-colors"
              >
                <SkipBack className="text-cousin-light-gray" size={32} />
              </button>
              <button className="p-4 hover:bg-gray-700 rounded-full transition-colors">
                <Rewind className="text-cousin-light-gray" size={28} />
              </button>
              <button
                onClick={togglePlay}
                className="w-20 h-20 bg-cousin-orange hover:bg-orange-600 rounded-full flex items-center justify-center transition-colors shadow-lg"
                disabled={playerState.isLoading}
              >
                {playerState.isLoading ? (
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white" />
                ) : playerState.isPlaying ? (
                  <Pause className="text-white" size={36} />
                ) : (
                  <Play className="text-white" size={36} />
                )}
              </button>
              <button className="p-4 hover:bg-gray-700 rounded-full transition-colors">
                <FastForward className="text-cousin-light-gray" size={28} />
              </button>
              <button
                onClick={onNext}
                className="p-4 hover:bg-gray-700 rounded-full transition-colors"
              >
                <SkipForward className="text-cousin-light-gray" size={32} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
                  <Shuffle className="text-cousin-light-gray" size={24} />
                </button>
                <button className="p-3 hover:bg-gray-700 rounded-full transition-colors">
                  <Repeat className="text-cousin-light-gray" size={24} />
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <Volume2 className="text-cousin-light-gray" size={24} />
                <div
                  className="w-32 bg-gray-700 rounded-full h-2 cursor-pointer"
                  onClick={handleVolumeChange}
                >
                  <div
                    className="bg-cousin-orange h-2 rounded-full"
                    style={{ width: `${volumePercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-cousin-gray rounded-2xl p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-cousin-light-gray text-base">File Size</p>
                <p className="text-white font-bold text-lg">{broadcast.fileSizeMB} MB</p>
              </div>
              <div>
                <p className="text-cousin-light-gray text-base">Duration</p>
                <p className="text-white font-bold text-lg">{formatTime(playerState.duration)}</p>
              </div>
              <div>
                <p className="text-cousin-light-gray text-base">Broadcast #</p>
                <p className="text-white font-bold text-lg">{broadcast.id}</p>
              </div>
              <div>
                <p className="text-cousin-light-gray text-sm">Format</p>
                <p className="text-white font-semibold">
                  {isVideo ? "MP4" : "MP3"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={handleError}
        onPlay={handlePlay}
        onPause={handlePause}
        onCanPlay={() => console.log("Audio can play")}
        onLoadStart={() => console.log("Audio load start")}
        onWaiting={() => console.log("Audio waiting")}
      />
    </main>
  );
}
