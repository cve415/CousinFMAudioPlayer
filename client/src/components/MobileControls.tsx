import { Broadcast } from "@/types/broadcast";
import { Play, Pause, SkipForward } from "lucide-react";

interface MobileControlsProps {
  broadcast: Broadcast | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
}

export function MobileControls({
  broadcast,
  isPlaying,
  onTogglePlay,
  onNext,
}: MobileControlsProps) {
  if (!broadcast) return null;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cousin-gray/95 backdrop-blur-sm border-t border-gray-700 mobile-padding z-50">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          <div className="touch-target bg-cousin-orange rounded-lg flex items-center justify-center flex-shrink-0">
            {isPlaying ? (
              <Pause className="text-white" size={18} />
            ) : (
              <Play className="text-white" size={18} />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-white font-medium text-responsive-sm truncate">
              {broadcast.title}
            </h3>
            <p className="text-cousin-light-gray text-responsive-xs">
              {new Date(broadcast.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button 
            onClick={onTogglePlay} 
            className="touch-target flex items-center justify-center rounded-lg hover:bg-gray-600/50 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="text-white" size={20} />
            ) : (
              <Play className="text-white" size={20} />
            )}
          </button>
          <button 
            onClick={onNext} 
            className="touch-target flex items-center justify-center rounded-lg hover:bg-gray-600/50 transition-colors"
            aria-label="Next broadcast"
          >
            <SkipForward className="text-cousin-light-gray" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
