import { Radio } from "lucide-react";

interface HeaderProps {
  totalBroadcasts: number;
}

export function Header({ totalBroadcasts }: HeaderProps) {
  return (
    <header className="bg-cousin-gray border-b border-gray-700 mobile-padding py-3 sm:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="touch-target bg-cousin-orange rounded-full flex items-center justify-center">
            <Radio className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-responsive-xl sm:text-responsive-2xl font-bold text-white">
              <span className="block sm:hidden">CousinFM</span>
              <span className="hidden sm:block">CousinFM Audio Player</span>
            </h1>
            <p className="text-cousin-light-gray text-responsive-xs sm:text-responsive-sm">
              Radio Broadcasts
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <span className="text-cousin-light-gray text-responsive-xs sm:text-responsive-sm">
            <span className="hidden sm:inline">{totalBroadcasts} Total Broadcasts</span>
            <span className="sm:hidden">{totalBroadcasts}</span>
          </span>
        </div>
      </div>
    </header>
  );
}
