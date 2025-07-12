import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { Broadcast } from "@/types/broadcast";
import { StreamingPlayer } from "@/components/StreamingPlayer";
import { ShareButtons } from "@/components/ShareButtons";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Pause, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import broadcastsData from "@/data/broadcasts.json";
import { format } from "date-fns";

export default function BroadcastPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("No broadcast ID provided");
      setIsLoading(false);
      return;
    }

    const foundBroadcast = (broadcastsData as Broadcast[]).find(
      b => b.id === parseInt(id)
    );

    if (!foundBroadcast) {
      setError("Broadcast not found");
      setIsLoading(false);
      return;
    }

    setBroadcast(foundBroadcast);
    setIsLoading(false);
    
    // Update document title for SEO
    document.title = `${foundBroadcast.title} - CousinFM`;
  }, [id]);

  const handlePlayBroadcast = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    if (!broadcast) return;
    const sortedBroadcasts = (broadcastsData as Broadcast[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const currentIndex = sortedBroadcasts.findIndex(b => b.id === broadcast.id);
    const nextIndex = (currentIndex + 1) % sortedBroadcasts.length;
    setLocation(`/broadcast/${sortedBroadcasts[nextIndex].id}`);
  };

  const handlePrevious = () => {
    if (!broadcast) return;
    const sortedBroadcasts = (broadcastsData as Broadcast[]).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    const currentIndex = sortedBroadcasts.findIndex(b => b.id === broadcast.id);
    const prevIndex = currentIndex === 0 ? sortedBroadcasts.length - 1 : currentIndex - 1;
    setLocation(`/broadcast/${sortedBroadcasts[prevIndex].id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  const getFileIcon = (title: string) => {
    return title.toLowerCase().includes(".mp4") ? "🎥" : "🎵";
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading broadcast..." />;
  }

  if (error || !broadcast) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            {error || "Broadcast not found"}
          </h1>
          <Link href="/">
            <Button variant="outline" className="text-white border-white hover:bg-white hover:text-black">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to CousinFM
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/broadcast/${broadcast.id}`;
  const shareTitle = `${broadcast.title} - CousinFM`;
  const shareDescription = `Listen to this broadcast from CousinFM San Francisco: ${broadcast.title} (${formatDate(broadcast.date)})`;

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Meta Tags */}
      <head>
        <meta name="description" content={shareDescription} />
        <meta property="og:title" content={shareTitle} />
        <meta property="og:description" content={shareDescription} />
        <meta property="og:url" content={shareUrl} />
        <meta property="og:type" content="music.song" />
        {broadcast.imageCid && (
          <meta property="og:image" content={`${window.location.origin}/attached_assets/${broadcast.imageCid}`} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={shareTitle} />
        <meta name="twitter:description" content={shareDescription} />
        {broadcast.imageCid && (
          <meta name="twitter:image" content={`${window.location.origin}/attached_assets/${broadcast.imageCid}`} />
        )}
      </head>

      {/* Navigation Header */}
      <div className="relative z-10 p-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Archive
            </Button>
          </Link>
          <div className="flex items-center space-x-4">
            <ShareButtons
              url={shareUrl}
              title={shareTitle}
              description={shareDescription}
            />
            <Button
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-black"
              onClick={() => window.open(`https://gateway.pinata.cloud/ipfs/${broadcast.cid}`, '_blank')}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Direct Link
            </Button>
          </div>
        </div>
      </div>

      {/* Main Player */}
      <StreamingPlayer
        broadcast={broadcast}
        onNext={handleNext}
        onPrevious={handlePrevious}
        broadcasts={[broadcast]}
      />

      {/* Broadcast Details */}
      <div className="relative z-10 bg-black/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                {broadcast.title}
              </h1>
              <div className="flex items-center space-x-4 text-gray-400 mb-4">
                <span className="flex items-center">
                  <span className="mr-2 text-lg">{getFileIcon(broadcast.title)}</span>
                  {formatDate(broadcast.date)}
                </span>
                <span>•</span>
                <span>{broadcast.fileSizeMB} MB</span>
              </div>
            </div>
            <Button
              onClick={handlePlayBroadcast}
              className="bg-cousin-orange text-black hover:bg-cousin-orange/90 px-8 py-3 text-lg"
            >
              {isPlaying ? (
                <>
                  <Pause className="mr-2 h-5 w-5" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Play Broadcast
                </>
              )}
            </Button>
          </div>

          {/* Share Section */}
          <div className="border-t border-gray-800 pt-6">
            <h2 className="text-xl font-semibold text-white mb-4">Share this broadcast</h2>
            <div className="flex flex-wrap gap-4">
              <ShareButtons
                url={shareUrl}
                title={shareTitle}
                description={shareDescription}
                showLabels={true}
              />
            </div>
            <div className="mt-4 p-4 bg-gray-900 rounded-lg">
              <p className="text-gray-400 text-sm mb-2">Direct link:</p>
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="w-full bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm"
                onClick={(e) => e.currentTarget.select()}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}