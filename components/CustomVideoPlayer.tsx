
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, Minimize, 
  Settings, Subtitles, Repeat, SkipForward, SkipBack,
  Loader2, Monitor, ChevronDown
} from './Icons';

interface CustomVideoPlayerProps {
  thumbnail: string;
  title: string;
  autoPlayNext?: boolean;
}

const CustomVideoPlayer: React.FC<CustomVideoPlayerProps> = ({ thumbnail, title, autoPlayNext = false }) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Playback State
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isBuffering, setIsBuffering] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isLooping, setIsLooping] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const [quality, setQuality] = useState('1080p');

  // UI State
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number | null>(null);
  const [controlsTimeout, setControlsTimeout] = useState<ReturnType<typeof setTimeout> | null>(null);
  
  // Gestures
  const [lastTap, setLastTap] = useState(0);
  const [showDoubleTapOverlay, setShowDoubleTapOverlay] = useState<'forward' | 'backward' | null>(null);

  // Mock Video Source (Big Buck Bunny for demo purposes)
  const videoSrc = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

  // --- Helpers ---
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // --- Event Handlers ---

  const togglePlay = useCallback(() => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      // Show controls briefly on interaction
      resetControlsTimeout();
    }
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
      if (newMuted) setVolume(0);
      else setVolume(1);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      videoRef.current.muted = newVolume === 0;
    }
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      videoContainerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
      
      // Visual Feedback
      setShowDoubleTapOverlay(seconds > 0 ? 'forward' : 'backward');
      setTimeout(() => setShowDoubleTapOverlay(null), 500);
    }
  };

  const changeSpeed = (speed: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
      setShowSettings(false);
    }
  };

  // --- Listeners ---

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Calculate Buffer
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        setBuffered((bufferedEnd / video.duration) * 100);
      }
    };

    const onDurationChange = () => setDuration(video.duration);
    const onWaiting = () => setIsBuffering(true);
    const onCanPlay = () => setIsBuffering(false);
    const onEnded = () => setIsPlaying(false);

    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('durationchange', onDurationChange);
    video.addEventListener('waiting', onWaiting);
    video.addEventListener('canplay', onCanPlay);
    video.addEventListener('ended', onEnded);

    return () => {
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('durationchange', onDurationChange);
      video.removeEventListener('waiting', onWaiting);
      video.removeEventListener('canplay', onCanPlay);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 'm':
          toggleMute();
          break;
        case 'arrowleft':
        case 'j':
          skip(-10);
          break;
        case 'arrowright':
        case 'l':
          skip(10);
          break;
        case 'arrowup':
          if (videoRef.current) {
             const v = Math.min(videoRef.current.volume + 0.1, 1);
             videoRef.current.volume = v;
             setVolume(v);
          }
          break;
        case 'arrowdown':
          if (videoRef.current) {
             const v = Math.max(videoRef.current.volume - 0.1, 0);
             videoRef.current.volume = v;
             setVolume(v);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay]);

  // --- Scrubbing Logic ---

  const handleScrub = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!videoRef.current || !progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    const percent = pos / rect.width;
    videoRef.current.currentTime = percent * duration;
    setCurrentTime(percent * duration);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsScrubbing(true);
    handleScrub(e);
  };

  useEffect(() => {
    const handleMouseUp = () => setIsScrubbing(false);
    const handleMouseMove = (e: MouseEvent) => {
      if (isScrubbing) handleScrub(e);
    };

    if (isScrubbing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isScrubbing, duration]);

  // Hover Preview Logic
  const handleProgressMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const pos = Math.min(Math.max(0, e.clientX - rect.left), rect.width);
    setHoverPosition(pos);
    setHoverTime((pos / rect.width) * duration);
  };

  const handleProgressMouseLeave = () => {
    setHoverPosition(null);
    setHoverTime(null);
  };

  // --- Controls Visibility ---
  
  const resetControlsTimeout = () => {
    setShowControls(true);
    if (controlsTimeout) clearTimeout(controlsTimeout);
    if (!videoRef.current?.paused) {
      const timeout = setTimeout(() => setShowControls(false), 3000);
      setControlsTimeout(timeout);
    }
  };

  const handleContainerMouseMove = () => {
    resetControlsTimeout();
  };

  const handleContainerClick = (e: React.MouseEvent) => {
    // Simple tap toggles play, double tap handled below
    const now = Date.now();
    if (now - lastTap < 300) {
      // Double tap logic
      const width = videoContainerRef.current?.offsetWidth || 0;
      const x = e.nativeEvent.offsetX;
      if (x < width / 3) skip(-10);
      else if (x > (width * 2) / 3) skip(10);
      else toggleFullscreen();
    } else {
      togglePlay();
    }
    setLastTap(now);
  };

  return (
    <div 
      ref={videoContainerRef}
      className="relative group aspect-video bg-black rounded-xl overflow-hidden shadow-2xl select-none"
      onMouseMove={handleContainerMouseMove}
      onMouseLeave={() => !videoRef.current?.paused && setShowControls(false)}
      onClick={handleContainerClick}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        poster={thumbnail}
        className="w-full h-full object-contain"
        loop={isLooping}
        playsInline
      />

      {/* Loading Spinner */}
      {isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <Loader2 className="w-16 h-16 text-white animate-spin opacity-80" />
        </div>
      )}

      {/* Double Tap Overlay Animations */}
      {showDoubleTapOverlay && (
        <div className={`absolute inset-y-0 ${showDoubleTapOverlay === 'forward' ? 'right-0' : 'left-0'} w-1/3 flex items-center justify-center bg-white/10 backdrop-blur-[2px] z-20 rounded-xl animate-pulse`}>
          <div className="flex flex-col items-center text-white">
            {showDoubleTapOverlay === 'forward' ? <SkipForward className="w-12 h-12" /> : <SkipBack className="w-12 h-12" />}
            <span className="text-sm font-bold">{showDoubleTapOverlay === 'forward' ? '+10s' : '-10s'}</span>
          </div>
        </div>
      )}

      {/* Main Play/Pause Center Overlay (Only when paused and no controls) */}
      {!isPlaying && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-20 h-20 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
            <Play className="w-10 h-10 text-white fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Controls Overlay */}
      <div 
        className={`absolute inset-0 flex flex-col justify-between bg-gradient-to-b from-black/60 via-transparent to-black/80 transition-opacity duration-300 ${
          showControls || !isPlaying ? 'opacity-100' : 'opacity-0 cursor-none'
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent click through to video toggle
      >
        {/* Top Overlay */}
        <div className="p-4 flex justify-between items-start">
          <div className="flex flex-col">
             <h2 className="text-white font-semibold text-lg line-clamp-1 drop-shadow-md">{title}</h2>
             <div className="flex items-center gap-2 mt-1">
               {/* <span className="text-xs bg-gray-800 text-gray-200 px-1.5 py-0.5 rounded">4K</span> */}
             </div>
          </div>
          
          <div className="relative">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-white/20 rounded-full transition-colors text-white"
            >
               <Settings className={`w-6 h-6 transition-transform duration-300 ${showSettings ? 'rotate-90' : ''}`} />
            </button>
            
            {/* Settings Menu */}
            {showSettings && (
              <div className="absolute right-0 top-12 bg-[#1F1F1F]/95 backdrop-blur-md border border-[#3F3F3F] rounded-xl p-2 w-64 shadow-2xl animate-in fade-in slide-in-from-top-2 z-30">
                 <div className="py-2 border-b border-[#3F3F3F] mb-2">
                    <div className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Playback Speed</div>
                    <div className="flex justify-between px-2">
                       {[0.5, 1, 1.5, 2].map(speed => (
                         <button 
                           key={speed}
                           onClick={() => changeSpeed(speed)}
                           className={`text-xs px-3 py-1 rounded hover:bg-[#3F3F3F] ${playbackSpeed === speed ? 'bg-wetube-red text-white' : 'text-gray-300'}`}
                         >
                           {speed}x
                         </button>
                       ))}
                    </div>
                 </div>
                 <div>
                   <div className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Quality</div>
                   {['4K', '1080p', '720p', '480p', 'Auto'].map(q => (
                     <button 
                        key={q}
                        onClick={() => { setQuality(q); setShowSettings(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-white hover:bg-[#3F3F3F] flex justify-between items-center"
                     >
                        {q} {quality === q && <span className="w-2 h-2 bg-wetube-red rounded-full" />}
                     </button>
                   ))}
                 </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="px-4 pb-4 pt-12">
          {/* Progress Bar */}
          <div 
            className="group/progress relative h-1 bg-gray-600/50 cursor-pointer hover:h-1.5 transition-all duration-200 mb-4 rounded-full"
            ref={progressRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleProgressMouseMove}
            onMouseLeave={handleProgressMouseLeave}
          >
            {/* Buffer Bar */}
            <div 
               className="absolute top-0 left-0 h-full bg-gray-400/50 rounded-full transition-all duration-500"
               style={{ width: `${buffered}%` }}
            />
            {/* Playback Bar */}
            <div 
              className="absolute top-0 left-0 h-full bg-wetube-red rounded-full relative"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            >
               {/* Scrubber Handle */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 bg-wetube-red rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-md border-2 border-white" />
            </div>

            {/* Hover Preview Bubble */}
            {hoverTime !== null && hoverPosition !== null && (
              <div 
                className="absolute bottom-4 -translate-x-1/2 bg-black/90 border border-[#333] rounded-lg p-1 flex flex-col items-center shadow-xl pointer-events-none z-20"
                style={{ left: hoverPosition }}
              >
                <div className="w-32 h-20 bg-gray-800 rounded mb-1 overflow-hidden relative">
                   {/* In a real app, this would be a sprite sheet based on timestamp */}
                   <img src={thumbnail} className="w-full h-full object-cover opacity-80" alt="Preview" />
                   <div className="absolute inset-0 flex items-center justify-center text-xs font-mono bg-black/20">{formatTime(hoverTime)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                 {/* Previous / Play / Next */}
                 <button className="text-gray-300 hover:text-white transition-colors hidden sm:block">
                    <SkipBack className="w-5 h-5" />
                 </button>
                 <button 
                    onClick={togglePlay} 
                    className="text-white hover:scale-110 transition-transform"
                 >
                    {isPlaying ? <Pause className="w-8 h-8 fill-white" /> : <Play className="w-8 h-8 fill-white" />}
                 </button>
                 <button className="text-gray-300 hover:text-white transition-colors hidden sm:block">
                    <SkipForward className="w-5 h-5" />
                 </button>
              </div>

              {/* Volume */}
              <div className="group/vol flex items-center gap-2">
                <button onClick={toggleMute} className="text-white hover:text-gray-200">
                  {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                </button>
                <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 flex items-center">
                   <input 
                     type="range" 
                     min="0" 
                     max="1" 
                     step="0.1" 
                     value={volume} 
                     onChange={handleVolumeChange}
                     className="w-20 h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-white" 
                   />
                </div>
              </div>

              <div className="text-white text-sm font-medium tabular-nums ml-2">
                {formatTime(currentTime)} <span className="text-gray-400 mx-1">/</span> {formatTime(duration || 0)}
              </div>
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1">
                 {autoPlayNext && (
                    <button className="p-2 hover:bg-white/10 rounded-full text-gray-300 hover:text-white" title="Autoplay is on">
                       <div className="relative w-4 h-4 border-2 border-gray-400 rounded-full flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-white rounded-full" />
                          <div className="absolute -right-1 -top-1 w-2 h-2 bg-wetube-red rounded-full border border-[#1F1F1F]" />
                       </div>
                    </button>
                 )}
                 
                 <button 
                   onClick={() => setCaptionsEnabled(!captionsEnabled)}
                   className={`p-2 hover:bg-white/10 rounded-full transition-colors ${captionsEnabled ? 'text-wetube-red border-b-2 border-wetube-red' : 'text-gray-300 hover:text-white'}`}
                 >
                    <Subtitles className="w-5 h-5" />
                 </button>
                 
                 <button 
                   onClick={() => setIsLooping(!isLooping)}
                   className={`p-2 hover:bg-white/10 rounded-full transition-colors hidden sm:block ${isLooping ? 'text-wetube-red' : 'text-gray-300 hover:text-white'}`}
                 >
                    <Repeat className="w-5 h-5" />
                 </button>

                 <button className="p-2 hover:bg-white/10 rounded-full text-gray-300 hover:text-white hidden sm:block">
                    <Monitor className="w-5 h-5" />
                 </button>
               </div>

               <button 
                  onClick={toggleFullscreen}
                  className="text-white hover:scale-110 transition-transform p-1"
               >
                  {isFullscreen ? <Minimize className="w-6 h-6" /> : <Maximize className="w-6 h-6" />}
               </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Captions Overlay */}
      {captionsEnabled && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-1 rounded text-sm md:text-lg pointer-events-none transition-all duration-200">
           (Background music playing...)
        </div>
      )}
    </div>
  );
};

export default CustomVideoPlayer;
