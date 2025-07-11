import { useState } from "react";
import { Broadcast } from "@/types/broadcast";
import { FileAudio, FileVideo, ChevronDown, Play, Pause } from "lucide-react";
import { format } from "date-fns";
import { WaveformVisualizer } from "./WaveformVisualizer";

interface BroadcastListProps {
  broadcasts: Broadcast[];
  selectedBroadcast: Broadcast | null;
  onSelectBroadcast: (broadcast: Broadcast) => void;
  onPlayBroadcast: (broadcast: Broadcast) => void;
  isPlaying: boolean;
  isLoading: boolean;
}

export function BroadcastList({
  broadcasts,
  selectedBroadcast,
  onSelectBroadcast,
  onPlayBroadcast,
  isPlaying,
  isLoading,
}: BroadcastListProps) {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(20);

  const years = Array.from(
    new Set([...broadcasts.map((b) => new Date(b.date).getFullYear()), 2025])
  ).sort((a, b) => b - a);

  const filteredBroadcasts = broadcasts.filter((broadcast) => {
    if (yearFilter === "all") return true;
    return new Date(broadcast.date).getFullYear().toString() === yearFilter;
  });

  const displayedBroadcasts = filteredBroadcasts.slice(0, displayCount);

  const getFileIcon = (title: string) => {
    if (title.toLowerCase().includes(".mp4")) {
      return <FileVideo className="text-cousin-light-gray" size={16} />;
    }
    return <FileAudio className="text-cousin-light-gray" size={16} />;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <aside className="w-full lg:w-80 xl:w-96 bg-cousin-gray border-r border-gray-700 overflow-y-auto">
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4"></div>
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-full lg:w-80 xl:w-96 bg-black/90 backdrop-blur-sm border-r border-gray-800 overflow-y-auto">
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-xl font-bold mb-6 text-white">CousinFM Archive</h2>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setYearFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              yearFilter === "all"
                ? "bg-cousin-orange text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            All Years
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setYearFilter(year.toString())}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                yearFilter === year.toString()
                  ? "bg-cousin-orange text-black"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {displayedBroadcasts.map((broadcast, index) => (
          <div
            key={broadcast.id}
            className={`group relative rounded-xl transition-all duration-300 cursor-pointer hover:scale-105 ${
              selectedBroadcast?.id === broadcast.id
                ? "bg-gradient-to-r from-cousin-orange/20 to-orange-600/20 border-2 border-cousin-orange"
                : "bg-gray-900/50 border border-gray-700 hover:bg-gray-800/50 hover:border-gray-600"
            }`}
          >
            <div className="p-4">
              <div className="flex items-start space-x-4">
                {/* Large Artwork */}
                <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden shadow-lg">
                  <img
                    src={broadcast.imageCid ? `/attached_assets/${broadcast.imageCid}` : '/attached_assets/Distributed by CousinFM San Francisco, CA 94133_1752216719267.png'}
                    alt={broadcast.title}
                    className="w-full h-full object-cover scale-110"
                    onError={(e) => {
                      e.currentTarget.src = '/attached_assets/Distributed by CousinFM San Francisco, CA 94133_1752216719267.png';
                    }}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white text-lg leading-tight mb-2 line-clamp-2">
                    {broadcast.title}
                  </h3>
                  
                  <div className="flex items-center space-x-3 text-sm text-gray-400 mb-3">
                    {getFileIcon(broadcast.title)}
                    <span>{formatDate(broadcast.date)}</span>
                    <span>•</span>
                    <span>{broadcast.fileSizeMB} MB</span>
                  </div>

                  {/* Progress indicator if playing */}
                  {selectedBroadcast?.id === broadcast.id && isPlaying && (
                    <div className="mb-3">
                      <WaveformVisualizer
                        isPlaying={true}
                        barCount={16}
                        className="rounded opacity-60"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Play button overlay */}
              <div className="absolute top-4 right-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectBroadcast(broadcast);
                    onPlayBroadcast(broadcast);
                  }}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    selectedBroadcast?.id === broadcast.id && isPlaying
                      ? "bg-cousin-orange text-black"
                      : "bg-white/20 text-white hover:bg-white/30"
                  } opacity-0 group-hover:opacity-100 hover:scale-110`}
                >
                  {selectedBroadcast?.id === broadcast.id && isPlaying ? (
                    <Pause size={20} />
                  ) : (
                    <Play size={20} />
                  )}
                </button>
              </div>
            </div>
            
            {/* Click overlay for selecting broadcast */}
            <div
              className="absolute inset-0 cursor-pointer rounded-xl"
              onClick={() => onSelectBroadcast(broadcast)}
            />
          </div>
        ))}

        {filteredBroadcasts.length > displayCount && (
          <button
            onClick={() => setDisplayCount(prev => prev + 20)}
            className="w-full py-4 text-cousin-orange hover:text-white transition-colors border-2 border-cousin-orange/30 rounded-xl hover:bg-cousin-orange/10 flex items-center justify-center space-x-2 font-medium"
          >
            <ChevronDown size={20} />
            <span>Load More ({filteredBroadcasts.length - displayCount} remaining)</span>
          </button>
        )}
      </div>
    </aside>
  );
}
