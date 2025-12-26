
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  /* Added Tv to imports */
  X, Play, Pause, Volume2, Maximize, Minimize, Settings, 
  Activity, Loader2, Check, Music, ChevronRight, Monitor,
  SkipForward, SkipBack, Share2, AlertTriangle, RefreshCcw, Headphones, Globe, Tv
} from 'lucide-react';
import Hls from 'hls.js';
import { IPTVChannel, AppLanguage } from '../types';
import { UI_LABELS } from '../constants';

interface VideoPlayerProps {
  channel: IPTVChannel;
  language: AppLanguage;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ channel, language, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [quality, setQuality] = useState('Auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isHindiDubActive, setIsHindiDubActive] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useProxy, setUseProxy] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  
  const [activeMenu, setActiveMenu] = useState<'main' | 'quality' | 'speed' | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const loadingTimeoutRef = useRef<number | null>(null);

  const label = (key: string) => UI_LABELS[language]?.[key] || UI_LABELS['en'][key] || key;

  // Added toggleHindiDub function fix
  const toggleHindiDub = () => setIsHindiDubActive(prev => !prev);

  // Added changeQuality function fix to handle HLS quality switching
  const changeQuality = (newQuality: string) => {
    setQuality(newQuality);
    if (hlsRef.current) {
      if (newQuality === 'Auto') {
        hlsRef.current.currentLevel = -1;
      } else {
        const levelIndex = availableQualities.indexOf(newQuality) - 1;
        if (levelIndex >= 0) {
          hlsRef.current.currentLevel = levelIndex;
        }
      }
    }
    setActiveMenu(null);
  };

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) window.clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (!activeMenu) setShowControls(false);
    }, 3500);
  }, [activeMenu]);

  const initPlayer = useCallback((forceProxy = false) => {
    const video = videoRef.current;
    if (!video) return;

    setError(null);
    setIsBuffering(true);
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);

    // Set a 12-second timeout to stop the infinite "Rounding/Loading" symbol
    loadingTimeoutRef.current = window.setTimeout(() => {
      if (isBuffering && !error) {
        if (!forceProxy && !useProxy) {
          console.log("Stream taking too long, trying proxy...");
          setUseProxy(true);
          initPlayer(true);
        } else {
          setError("Stream is unresponsive. The link might be broken or offline.");
          setIsBuffering(false);
        }
      }
    }, 12000);

    if (hlsRef.current) hlsRef.current.destroy();

    // Use CORS Proxy if enabled or forced
    // This fixes most "Loading but not playing" issues caused by browser security
    const streamUrl = (forceProxy || useProxy) 
      ? `https://corsproxy.io/?${encodeURIComponent(channel.url)}` 
      : channel.url;

    if (Hls.isSupported()) {
      const hls = new Hls({ 
        enableWorker: true, 
        lowLatencyMode: true,
        backBufferLength: 90,
        manifestLoadingTimeOut: 15000,
        fragLoadingTimeOut: 15000,
        xhrSetup: (xhr) => {
          xhr.withCredentials = false;
        }
      });
      hlsRef.current = hls;
      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (e, data) => {
        setAvailableQualities(['Auto', ...data.levels.map(l => `${l.height}p`)]);
        if (isPlaying) video.play().catch(() => setIsPlaying(false));
        setIsBuffering(false);
        if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              if (retryCount < 2) {
                setRetryCount(prev => prev + 1);
                hls.startLoad();
              } else if (!useProxy) {
                setUseProxy(true);
                setRetryCount(0);
              } else {
                setError("Network Error: Stream server is not responding.");
                setIsBuffering(false);
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              setError("This channel format is not supported by your browser.");
              setIsBuffering(false);
              hls.destroy();
              break;
          }
        }
      });

      video.onplaying = () => {
        setIsBuffering(false);
        if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
      };
      video.onwaiting = () => setIsBuffering(true);
      video.onerror = () => {
        if (!useProxy) setUseProxy(true);
        else setError("Stream playback failed.");
      };

    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native Safari/iOS support
      video.src = streamUrl;
      video.onloadedmetadata = () => video.play();
      video.onerror = () => {
        if (!useProxy) setUseProxy(true);
        else setError("Native playback not supported for this link.");
      };
    }
  }, [channel.url, useProxy, retryCount]);

  useEffect(() => {
    initPlayer();
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => { 
      hlsRef.current?.destroy(); 
      document.removeEventListener('fullscreenchange', handleFs); 
      if (loadingTimeoutRef.current) window.clearTimeout(loadingTimeoutRef.current);
    };
  }, [channel.url]); // Re-init only when channel changes

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) { videoRef.current.pause(); setIsPlaying(false); }
    else { videoRef.current.play(); setIsPlaying(true); }
  };

  const retryWithProxy = () => {
    setUseProxy(true);
    setRetryCount(0);
    initPlayer(true);
  };

  return (
    <div 
      ref={containerRef} 
      className="relative w-full aspect-video bg-black rounded-[2rem] lg:rounded-[4rem] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] border border-white/5 group" 
      onMouseMove={resetControlsTimeout}
    >
      <video ref={videoRef} playsInline className="w-full h-full object-contain" />
      
      {/* Loading Shimmer/Spinner Overlay */}
      {isBuffering && !error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md z-30 transition-all">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-[#FF6B35] animate-spin" strokeWidth={3} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Tv size={24} className="text-white/50" />
            </div>
          </div>
          <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-[#FF6B35] animate-pulse">
            Connecting Stream...
          </p>
          {useProxy && (
            <span className="mt-2 text-[10px] text-white/40 uppercase font-bold flex items-center gap-2">
              <Globe size={12} /> Using Secure Proxy Mode
            </span>
          )}
        </div>
      )}

      {/* Error View */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F1419]/95 z-[35] text-center px-10 animate-in fade-in duration-500">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="text-red-500" size={40} />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight mb-2">Stream Error</h3>
          <p className="text-gray-500 text-sm mb-8 max-w-md">{error}</p>
          <div className="flex gap-4">
            <button 
              onClick={() => { setUseProxy(false); initPlayer(); }} 
              className="h-14 px-8 bg-white/5 border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-white/10"
            >
              <RefreshCcw size={16} /> Standard Retry
            </button>
            <button 
              onClick={retryWithProxy} 
              className="h-14 px-8 bg-[#FF6B35] rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2 active:scale-95"
            >
              <Globe size={16} /> Proxy Mode
            </button>
          </div>
        </div>
      )}
      
      {/* Top Overlay */}
      <div className={`absolute top-0 left-0 right-0 p-8 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 z-20 flex items-center justify-between ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center gap-4 max-w-[70%]">
          <div className="w-14 h-14 bg-white/5 rounded-2xl p-2.5 border border-white/10 shadow-2xl flex-shrink-0">
            <img src={channel.logo} className="w-full h-full object-contain" onError={(e) => e.currentTarget.src = 'channel-placeholder.dim_150x150.png'} />
          </div>
          <div>
            <h2 className="text-xl font-black truncate tracking-tight">{channel.name}</h2>
            <div className="flex items-center gap-3 mt-1">
              <span className="px-2 py-0.5 bg-[#FF6B35] text-white text-[8px] font-black rounded-lg uppercase animate-pulse">Live</span>
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{channel.category}</span>
              {useProxy && <span className="text-[10px] text-[#00C9A7] font-bold uppercase tracking-widest flex items-center gap-1"><Globe size={10}/> Proxy</span>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button onClick={toggleHindiDub} className={`h-12 px-6 flex items-center gap-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${isHindiDubActive ? 'bg-[#FF6B35] border-[#FF6B35] shadow-lg' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}>
             <Headphones size={16} /> {label('hindiDub')}
           </button>
           <button onClick={onClose} className="h-12 w-12 flex items-center justify-center bg-white/5 hover:bg-red-500 rounded-2xl transition-all"><X size={20}/></button>
        </div>
      </div>

      {/* Center Interaction */}
      {!isPlaying && !error && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <button onClick={togglePlay} className="h-24 w-24 bg-[#FF6B35] rounded-full shadow-[0_0_80px_rgba(255,107,53,0.4)] flex items-center justify-center border-4 border-white/10 transform active:scale-90 transition-transform">
            <Play size={44} fill="white" className="ml-2" />
          </button>
        </div>
      )}

      {/* Bottom Controls */}
      <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-500 z-20 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <button onClick={togglePlay} className="text-white hover:text-[#FF6B35] transition-all">
              {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" />}
            </button>
            <div className="hidden lg:flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Signal</span>
                <span className="text-[10px] font-bold text-[#00C9A7]">Stable 4K</span>
                <div className="w-[1px] h-4 bg-white/10"></div>
                <span className="text-[10px] font-bold text-white">60 FPS</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setActiveMenu(activeMenu === 'quality' ? null : 'quality')} 
              className={`h-12 px-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${activeMenu === 'quality' ? 'bg-[#FF6B35] border-[#FF6B35]' : 'bg-white/5 border-white/10'}`}
            >
              {quality}
            </button>
            <button 
              onClick={() => setActiveMenu(activeMenu === 'speed' ? null : 'speed')} 
              className={`h-12 px-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border ${activeMenu === 'speed' ? 'bg-[#FF6B35] border-[#FF6B35]' : 'bg-white/5 border-white/10'}`}
            >
              {playbackSpeed}x
            </button>
            <button onClick={() => videoRef.current?.requestPictureInPicture()} className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              <Monitor size={18}/>
            </button>
            <button onClick={() => !document.fullscreenElement ? containerRef.current?.requestFullscreen() : document.exitFullscreen()} className="h-12 w-12 flex items-center justify-center bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
              {isFullscreen ? <Minimize size={20}/> : <Maximize size={20}/>}
            </button>
          </div>
        </div>
      </div>

      {/* Submenus */}
      {activeMenu === 'quality' && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
           <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-10">Select Quality</h4>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl px-10">
              {availableQualities.map(q => (
                <button key={q} onClick={() => changeQuality(q)} className={`h-16 rounded-3xl text-sm font-black border transition-all ${quality === q ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{q}</button>
              ))}
           </div>
           <button onClick={() => setActiveMenu(null)} className="mt-12 p-5 bg-white/5 rounded-full"><X size={24}/></button>
        </div>
      )}

      {activeMenu === 'speed' && (
        <div className="absolute inset-0 z-40 bg-black/90 backdrop-blur-xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-300">
           <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-10">Playback Speed</h4>
           <div className="flex flex-wrap justify-center gap-4 w-full max-w-2xl px-10">
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                <button key={s} onClick={() => { setPlaybackSpeed(s); if(videoRef.current) videoRef.current.playbackRate = s; setActiveMenu(null); }} className={`h-16 w-32 rounded-3xl text-sm font-black border transition-all ${playbackSpeed === s ? 'bg-[#FF6B35] border-[#FF6B35] text-white' : 'bg-white/5 border-white/10 text-gray-500'}`}>{s}x</button>
              ))}
           </div>
           <button onClick={() => setActiveMenu(null)} className="mt-12 p-5 bg-white/5 rounded-full"><X size={24}/></button>
        </div>
      )}
    </div>
  );
};
export default VideoPlayer;
