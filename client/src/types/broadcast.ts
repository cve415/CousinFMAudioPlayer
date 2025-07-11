export interface Broadcast {
  id: number;
  cid: string;
  title: string;
  fileSizeMB: number;
  date: string;
  imageCid?: string;
  createdAt: Date;
}

export interface MediaPlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLoading: boolean;
  error: string | null;
}
