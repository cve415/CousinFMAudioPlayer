import { useState, useRef, useEffect } from "react";
import { Broadcast, MediaPlayerState } from "@/types/broadcast";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Info,
  Share,
  Download,
  Shuffle,
  Repeat,
  Rewind,
  FastForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { useToast } from "@/hooks/use-toast";

interface StreamingPlayerProps {
  broadcast: Broadcast | null;
  onNext: () => void;
  onPrevious: () => void;
  broadcasts: Broadcast[];
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function StreamingPlayer({ broadcast, onNext, onPrevious, isPlaying, onTogglePlay }: StreamingPlayerProps) {
  const [playerState, setPlayerState] = useState<MediaPlayerState>({
    isPlaying: isPlaying,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
    isMuted: false,
    isLoading: false,
    error: null,
  });

  const [shuffleMode, setShuffleMode] = useState(false);
  const [repeatMode, setRepeatMode] = useState(false);

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

  // Sync with parent isPlaying state
  useEffect(() => {
    if (mediaRef.current && broadcast) {
      if (isPlaying && mediaRef.current.paused) {
        console.log("Playing audio due to parent state change");
        mediaRef.current.play().catch(error => {
          console.error("Auto-play error:", error);
          setPlayerState(prev => ({ ...prev, error: error.message }));
        });
      } else if (!isPlaying && !mediaRef.current.paused) {
        console.log("Pausing audio due to parent state change");
        mediaRef.current.pause();
      }
    }
    setPlayerState(prev => ({ ...prev, isPlaying }));
  }, [isPlaying, broadcast]);

  const togglePlay = async () => {
    if (!mediaRef.current || !broadcast) {
      console.error("No media ref or broadcast available");
      return;
    }

    try {
      console.log("Toggle play - current state:", isPlaying, "media paused:", mediaRef.current.paused);
      
      if (isPlaying) {
        mediaRef.current.pause();
        console.log("Paused playback");
      } else {
        // Ensure the media is loaded before playing
        if (mediaRef.current.readyState < 3) {
          console.log("Media not ready, loading...");
          mediaRef.current.load();
          await new Promise((resolve) => {
            mediaRef.current!.addEventListener('canplay', resolve, { once: true });
          });
        }
        await mediaRef.current.play();
        console.log("Started playback");
      }
      onTogglePlay();
    } catch (error) {
      console.error("Playback error:", error);
      setPlayerState(prev => ({ ...prev, error: error.message }));
      toast({
        title: "Playback Error",
        description: `Unable to play the broadcast: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const seek = (seconds: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime += seconds;
    }
  };

  const toggleMute = () => {
    if (mediaRef.current) {
      mediaRef.current.muted = !mediaRef.current.muted;
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const shareHandler = () => {
    if (broadcast) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied",
        description: "Broadcast link copied to clipboard!",
      });
    }
  };

  const downloadHandler = () => {
    if (broadcast) {
      const link = document.createElement("a");
      link.href = `https://gateway.pinata.cloud/ipfs/${broadcast.cid}`;
      link.download = broadcast.title;
      link.click();
    }
  };

  return (
    <div className="relative bg-gradient-to-br from-cousin-gray via-gray-900 to-black text-white overflow-hidden">
      {broadcast ? (
        <div className="relative">
          {/* Hero Section with Large Artwork */}
          <div className="relative h-[70vh] min-h-[500px] flex items-end">
            {/* Background Image/Video */}
            <div className="absolute inset-0">
              <img
                src={broadcast.imageCid ? `/attached_assets/${broadcast.imageCid}` : '/attached_assets/Distributed by CousinFM San Francisco, CA 94133_1752216719267.png'}
                alt={broadcast.title}
                className="w-full h-full object-cover scale-110"
                onError={(e) => {
                  e.currentTarget.src = '/attached_assets/Distributed by CousinFM San Francisco, CA 94133_1752216719267.png';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 w-full p-8 pb-12">
              <div className="max-w-4xl">
                {/* Metadata */}
                <div className="flex items-center space-x-4 mb-4">
                  <Badge variant="secondary" className="bg-cousin-orange text-black font-semibold">
                    {isVideo ? "Video" : "Audio"}
                  </Badge>
                  <span className="text-sm text-gray-300">
                    {new Date(broadcast.date).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-300">•</span>
                  <span className="text-sm text-gray-300">{broadcast.fileSizeMB} MB</span>
                </div>

                {/* Title */}
                <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                  {broadcast.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4 mb-8">
                  <Button
                    onClick={togglePlay}
                    className="bg-white text-black hover:bg-gray-200 text-lg px-8 py-3 rounded-lg font-semibold"
                    disabled={playerState.isLoading}
                  >
                    {playerState.isLoading ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-black mr-2" />
                    ) : isPlaying ? (
                      <Pause className="mr-2" size={24} />
                    ) : (
                      <Play className="mr-2" size={24} />
                    )}
                    {isPlaying ? 'Pause' : 'Play'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="bg-gray-800/80 border-gray-600 text-white hover:bg-gray-700 px-6 py-3"
                  >
                    <Info className="mr-2" size={20} />
                    More Info
                  </Button>
                </div>

                {/* Waveform Visualizer */}
                {isPlaying && (
                  <div className="mb-6">
                    <WaveformVisualizer
                      isPlaying={isPlaying}
                      className="rounded-lg opacity-80"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Player Controls Section */}
          <div className="relative z-10 bg-black/90 backdrop-blur-sm p-6 border-t border-gray-800">
            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>{formatTime(playerState.currentTime)}</span>
                <span>{formatTime(playerState.duration)}</span>
              </div>
              <Slider
                value={[playerState.duration > 0 ? (playerState.currentTime / playerState.duration) * 100 : 0]}
                onValueChange={(value) => {
                  if (mediaRef.current && playerState.duration > 0) {
                    mediaRef.current.currentTime = (value[0] / 100) * playerState.duration;
                  }
                }}
                max={100}
                step={0.1}
                className="w-full cursor-pointer"
              />
            </div>

            {/* Control Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShuffleMode(!shuffleMode)}
                  className={shuffleMode ? 'text-cousin-orange' : 'text-gray-400 hover:text-white'}
                >
                  <Shuffle size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onPrevious}
                  disabled={playerState.isLoading}
                  className="text-gray-400 hover:text-white"
                >
                  <SkipBack size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => seek(-10)}
                  disabled={playerState.isLoading}
                  className="text-gray-400 hover:text-white"
                >
                  <Rewind size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => seek(10)}
                  disabled={playerState.isLoading}
                  className="text-gray-400 hover:text-white"
                >
                  <FastForward size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onNext}
                  disabled={playerState.isLoading}
                  className="text-gray-400 hover:text-white"
                >
                  <SkipForward size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setRepeatMode(!repeatMode)}
                  className={repeatMode ? 'text-cousin-orange' : 'text-gray-400 hover:text-white'}
                >
                  <Repeat size={20} />
                </Button>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={shareHandler}
                  className="text-gray-400 hover:text-white"
                >
                  <Share size={20} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={downloadHandler}
                  className="text-gray-400 hover:text-white"
                >
                  <Download size={20} />
                </Button>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-gray-400 hover:text-white"
                  >
                    {playerState.isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </Button>
                  <div className="w-20">
                    <Slider
                      value={[playerState.isMuted ? 0 : playerState.volume * 100]}
                      onValueChange={(value) => {
                        if (mediaRef.current) {
                          mediaRef.current.volume = value[0] / 100;
                        }
                      }}
                      max={100}
                      step={1}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Hidden Media Elements */}
          <audio
            ref={audioRef}
            style={{ display: 'none' }}
            onLoadStart={() => {
              console.log("Audio load start");
              setPlayerState(prev => ({ ...prev, isLoading: true }));
            }}
            onCanPlay={() => {
              console.log("Audio can play");
              setPlayerState(prev => ({ ...prev, isLoading: false }));
            }}
            onPlay={() => {
              console.log("Audio play event");
              // Don't set local state, let parent handle it
            }}
            onPause={() => {
              console.log("Audio pause event");
              // Don't set local state, let parent handle it
            }}
            onTimeUpdate={() => {
              const media = audioRef.current;
              if (media) {
                setPlayerState(prev => ({ 
                  ...prev, 
                  currentTime: media.currentTime,
                  duration: media.duration || 0
                }));
              }
            }}
            onVolumeChange={() => {
              const media = audioRef.current;
              if (media) {
                setPlayerState(prev => ({ 
                  ...prev, 
                  volume: media.volume,
                  isMuted: media.muted
                }));
              }
            }}
            onError={(e) => {
              console.error("Audio error:", e);
              setPlayerState(prev => ({ 
                ...prev, 
                error: "Failed to load audio",
                isLoading: false
              }));
            }}
          />

          {isVideo && (
            <video
              ref={videoRef}
              className="hidden"
              onLoadStart={() => {
                console.log("Video load start");
                setPlayerState(prev => ({ ...prev, isLoading: true }));
              }}
              onCanPlay={() => {
                console.log("Video can play");
                setPlayerState(prev => ({ ...prev, isLoading: false }));
              }}
              onPlay={() => {
                console.log("Video play event");
                // Don't set local state, let parent handle it
              }}
              onPause={() => {
                console.log("Video pause event");
                // Don't set local state, let parent handle it
              }}
              onTimeUpdate={() => {
                const media = videoRef.current;
                if (media) {
                  setPlayerState(prev => ({ 
                    ...prev, 
                    currentTime: media.currentTime,
                    duration: media.duration || 0
                  }));
                }
              }}
              onVolumeChange={() => {
                const media = videoRef.current;
                if (media) {
                  setPlayerState(prev => ({ 
                    ...prev, 
                    volume: media.volume,
                    isMuted: media.muted
                  }));
                }
              }}
              onError={(e) => {
                console.error("Video error:", e);
                setPlayerState(prev => ({ 
                  ...prev, 
                  error: "Failed to load video",
                  isLoading: false
                }));
              }}
            />
          )}

          {/* Error Display */}
          {playerState.error && (
            <div className="absolute bottom-4 left-4 right-4 bg-red-900/90 text-white p-4 rounded-lg backdrop-blur-sm">
              <p className="font-semibold">Playback Error</p>
              <p className="text-sm text-red-200">{playerState.error}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="relative h-[70vh] min-h-[500px] flex items-end">
          {/* Default San Francisco Background */}
          <div className="absolute inset-0">
            <img
              src="/attached_assets/Distributed by CousinFM San Francisco, CA 94133_1752215712592.png"
              alt="CousinFM San Francisco"
              className="w-full h-full object-cover scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          </div>

          {/* Content Overlay */}
          <div className="relative z-10 w-full p-8 pb-12">
            <div className="max-w-4xl">
              <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
                CousinFM
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Select a broadcast from our archives
              </p>
              <div className="mt-8">
                <WaveformVisualizer
                  isPlaying={false}
                  className="opacity-30"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}