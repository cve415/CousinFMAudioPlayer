import { Radio } from "lucide-react";

interface HeaderProps {
  totalBroadcasts: number;
}

export function Header({ totalBroadcasts }: HeaderProps) {
  return (
    <header className="bg-cousin-gray border-b border-gray-700 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-cousin-orange rounded-full flex items-center justify-center">
            <Radio className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">CousinFM Audio Player</h1>
            <p className="text-cousin-light-gray text-sm">Radio Broadcasts</p>
          </div>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-cousin-light-gray text-sm">
            {totalBroadcasts} Total Broadcasts
          </span>
        </div>
      </div>
    </header>
  );
}
