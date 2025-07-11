import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

export function AudioTest() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testAudio = async () => {
    if (!audioRef.current) return;
    
    const testUrl = "https://gateway.pinata.cloud/ipfs/Qma9YJpugNaorhBnYwRWVTYnCbCzcZt8M6tcAbUzxupT88";
    
    try {
      addLog("Setting audio source...");
      audioRef.current.src = testUrl;
      audioRef.current.load();
      
      addLog("Attempting to play...");
      await audioRef.current.play();
      setIsPlaying(true);
      addLog("Play successful!");
    } catch (err: any) {
      addLog(`Play failed: ${err.message}`);
      setError(err.message);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
      addLog("Audio stopped");
    }
  };

  return (
    <div className="bg-cousin-gray p-6 rounded-lg max-w-md mx-auto">
      <h3 className="text-white text-lg font-semibold mb-4">Audio Test</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={testAudio}
            disabled={isPlaying}
            className="bg-cousin-orange hover:bg-orange-600"
          >
            Test Audio
          </Button>
          <Button 
            onClick={stopAudio}
            disabled={!isPlaying}
            variant="outline"
          >
            Stop
          </Button>
        </div>
        
        {error && (
          <div className="text-red-400 text-sm">
            Error: {error}
          </div>
        )}
        
        <div className="text-sm text-cousin-light-gray">
          <div className="font-semibold">Debug Logs:</div>
          <div className="max-h-32 overflow-y-auto bg-gray-800 p-2 rounded mt-2">
            {logs.map((log, index) => (
              <div key={index} className="text-xs">{log}</div>
            ))}
          </div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
        crossOrigin="anonymous"
        preload="metadata"
        onLoadStart={() => addLog("Load start")}
        onLoadedMetadata={() => addLog("Metadata loaded")}
        onCanPlay={() => addLog("Can play")}
        onError={(e) => {
          const error = e.currentTarget.error;
          addLog(`Audio error: ${error?.code} - ${error?.message}`);
          setError(`Audio error: ${error?.code} - ${error?.message}`);
        }}
        onPlay={() => addLog("Play event")}
        onPause={() => addLog("Pause event")}
      />
    </div>
  );
}