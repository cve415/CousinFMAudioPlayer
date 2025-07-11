import { useState } from "react";
import { Broadcast } from "@/types/broadcast";
import { FileAudio, FileVideo, ChevronDown } from "lucide-react";
import { format } from "date-fns";

interface BroadcastListProps {
  broadcasts: Broadcast[];
  selectedBroadcast: Broadcast | null;
  onSelectBroadcast: (broadcast: Broadcast) => void;
  isLoading: boolean;
}

export function BroadcastList({
  broadcasts,
  selectedBroadcast,
  onSelectBroadcast,
  isLoading,
}: BroadcastListProps) {
  const [yearFilter, setYearFilter] = useState<string>("all");
  const [displayCount, setDisplayCount] = useState(20);

  const years = Array.from(
    new Set(broadcasts.map((b) => new Date(b.date).getFullYear()))
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
    <aside className="w-full lg:w-80 xl:w-96 bg-cousin-gray border-r border-gray-700 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-4 text-white">Broadcast Library</h2>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setYearFilter("all")}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              yearFilter === "all"
                ? "bg-cousin-orange text-white"
                : "bg-gray-700 text-cousin-light-gray hover:bg-gray-600"
            }`}
          >
            All
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setYearFilter(year.toString())}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                yearFilter === year.toString()
                  ? "bg-cousin-orange text-white"
                  : "bg-gray-700 text-cousin-light-gray hover:bg-gray-600"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-gray-700">
        {displayedBroadcasts.map((broadcast, index) => (
          <div
            key={broadcast.id}
            onClick={() => onSelectBroadcast(broadcast)}
            className={`p-4 hover:bg-gray-700 cursor-pointer transition-colors ${
              selectedBroadcast?.id === broadcast.id
                ? "border-l-4 border-cousin-orange bg-gray-700"
                : "border-l-4 border-transparent"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  selectedBroadcast?.id === broadcast.id
                    ? "bg-cousin-orange"
                    : "bg-gray-600"
                }`}
              >
                <span className="text-white text-sm font-bold">
                  {index + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-white truncate">
                  {broadcast.title}
                </h3>
                <p className="text-cousin-light-gray text-sm mt-1">
                  {formatDate(broadcast.date)}
                </p>
                <div className="flex items-center space-x-2 mt-2 text-xs text-cousin-light-gray">
                  <span>{broadcast.fileSizeMB} MB</span>
                  <span>•</span>
                  {getFileIcon(broadcast.title)}
                </div>
              </div>
            </div>
          </div>
        ))}

        {displayedBroadcasts.length < filteredBroadcasts.length && (
          <div className="p-4 text-center">
            <button
              onClick={() => setDisplayCount(displayCount + 20)}
              className="text-cousin-orange hover:text-orange-400 text-sm font-medium transition-colors"
            >
              Load More Broadcasts <ChevronDown className="inline ml-1" size={16} />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
