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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-cousin-gray border-t border-gray-700 p-4 z-40">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-cousin-orange rounded-lg flex items-center justify-center">
            {isPlaying ? (
              <Pause className="text-white" size={18} />
            ) : (
              <Play className="text-white" size={18} />
            )}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm truncate max-w-32">
              {broadcast.title}
            </h3>
            <p className="text-cousin-light-gray text-xs">
              {new Date(broadcast.date).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={onTogglePlay} className="p-2">
            {isPlaying ? (
              <Pause className="text-white" size={20} />
            ) : (
              <Play className="text-white" size={20} />
            )}
          </button>
          <button onClick={onNext} className="p-2">
            <SkipForward className="text-cousin-light-gray" size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
