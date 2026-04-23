import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic } from 'lucide-react';

export const PLAYLIST = [
  {
    id: 1,
    title: "Neon Horizon",
    artist: "Synthwave Engine",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/synthwave1/400/400?blur=1"
  },
  {
    id: 2,
    title: "Cybernetic Pulse",
    artist: "AI Overlord",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/cyberpunk3/400/400"
  },
  {
    id: 3,
    title: "Digital Rain",
    artist: "The Construct",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/matrix5/400/400"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const track = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
    setProgress(0);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
    setProgress(0);
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration) {
        setProgress((current / duration) * 100);
      }
    }
  };

  const handleSeek = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setProgress(val);
    if (audioRef.current) {
      audioRef.current.currentTime = (val / 100) * (audioRef.current.duration || 0);
    }
  };

  return (
    <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md rounded-xl border border-neutral-800 p-4 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
      <audio 
        ref={audioRef} 
        src={track.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={nextTrack}
        loop={false}
      />
      
      {/* Track Info */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.3)]">
           <img src={track.cover} alt={track.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
           {isPlaying && (
             <div className="absolute inset-0 bg-pink-500/20 mix-blend-overlay"></div>
           )}
        </div>
        <div className="flex-1 min-w-0">
           <h3 className="text-pink-400 font-bold truncate tracking-wide">{track.title}</h3>
           <p className="text-neutral-400 text-sm truncate">{track.artist}</p>
        </div>
        <button 
          onClick={() => setShowPlaylist(!showPlaylist)}
          className={`p-2 rounded-full transition-colors ${showPlaylist ? 'bg-neutral-800 text-pink-400' : 'text-neutral-500 hover:text-white'}`}
        >
          <ListMusic size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 group">
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={progress} 
          onChange={handleSeek}
          className="w-full h-1.5 bg-neutral-800 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:bg-pink-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(236,72,153,0.8)]"
          style={{
            background: `linear-gradient(to right, #ec4899 ${progress}%, #262626 ${progress}%)`
          }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
         <button onClick={toggleMute} className="p-2 text-neutral-400 hover:text-pink-400 transition-colors">
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
         </button>
         
         <div className="flex items-center gap-4">
            <button onClick={prevTrack} className="p-2 text-neutral-300 hover:text-pink-400 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] transition-all">
              <SkipBack size={24} fill="currentColor" />
            </button>
            <button onClick={togglePlay} className="p-3 bg-pink-500 text-black rounded-full hover:bg-pink-400 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all transform hover:scale-105 active:scale-95">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
            </button>
            <button onClick={nextTrack} className="p-2 text-neutral-300 hover:text-pink-400 hover:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] transition-all">
              <SkipForward size={24} fill="currentColor" />
            </button>
         </div>
         
         <div className="w-9"></div> {/* Balancer for mute button */}
      </div>

      {/* Playlist Toggle */}
      {showPlaylist && (
         <div className="mt-4 pt-4 border-t border-neutral-800 max-h-48 overflow-y-auto pr-1">
           {PLAYLIST.map((t, idx) => (
              <button 
                key={t.id} 
                onClick={() => {
                  setCurrentTrackIndex(idx);
                  setIsPlaying(true);
                  setProgress(0);
                }}
                className={`w-full flex items-center gap-3 p-2 rounded text-left transition-colors ${idx === currentTrackIndex ? 'bg-pink-500/10 text-pink-400 border border-pink-500/30' : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'}`}
              >
                 <img src={t.cover} alt="" className="w-8 h-8 rounded shrink-0" referrerPolicy="no-referrer" />
                 <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="truncate text-xs opacity-75">{t.artist}</p>
                 </div>
                 {idx === currentTrackIndex && isPlaying && (
                    <div className="flex items-end gap-0.5 h-3 opacity-80">
                      <div className="w-1 h-full bg-pink-500 animate-pulse"></div>
                      <div className="w-1 h-2/3 bg-pink-500 animate-pulse delay-75"></div>
                      <div className="w-1 h-4/5 bg-pink-500 animate-pulse delay-150"></div>
                    </div>
                 )}
              </button>
           ))}
         </div>
      )}
    </div>
  );
}
