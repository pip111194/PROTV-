
import React from 'react';
import { Heart, Play, Trophy, Star, Music, Radio, Tv } from 'lucide-react';
import { IPTVChannel } from '../types';

interface ChannelCardProps {
  channel: IPTVChannel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, isFavorite, onToggleFavorite, onClick }) => {
  const name = channel.name.toLowerCase();
  const cat = channel.category.toLowerCase();
  
  const isCricket = name.includes('cricket') || name.includes('ipl') || name.includes('match') || name.includes('t20');
  const isIndia = cat.includes('india') || (channel as any).country === 'India' || name.includes('hindi');
  const isRadio = cat.includes('radio') || (channel as any).isRadio;
  
  const hasValidLogo = channel.logo && !channel.logo.includes('picsum.photos') && channel.logo !== '';

  return (
    <div className={`group relative glass-card rounded-[2.5rem] p-4 cursor-pointer hover:shadow-[0_40px_80px_rgba(0,0,0,0.6)] transition-all duration-700 border border-white/5 flex flex-col h-[320px] ${isCricket ? 'hover:border-[#FF6B35]/50 shadow-[0_0_20px_rgba(255,107,53,0.05)]' : ''}`}>
      <div className="relative aspect-square rounded-[2rem] overflow-hidden mb-5 bg-[#0D1117] border border-white/5 shadow-inner flex items-center justify-center">
        {hasValidLogo ? (
          <img 
            src={channel.logo} 
            alt={channel.name}
            className="w-full h-full object-contain p-6 transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '';
              (e.target as HTMLImageElement).classList.add('hidden');
            }}
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-gray-700">
             {isRadio ? <Radio size={48} className="opacity-50" /> : <Tv size={48} className="opacity-50" />}
             <span className="text-[10px] font-black uppercase tracking-widest opacity-30 px-4 text-center">{channel.name}</span>
          </div>
        )}
        
        {/* Sleek Dynamic Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {isCricket && (
            <div className="px-3 py-1 bg-[#FF6B35] text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5 animate-pulse">
              <Trophy size={10} strokeWidth={3} /> Match
            </div>
          )}
          {isRadio && (
            <div className="px-3 py-1 bg-blue-500 text-white rounded-xl text-[8px] font-black uppercase tracking-widest shadow-xl flex items-center gap-1.5">
              <Music size={10} strokeWidth={3} /> Radio
            </div>
          )}
        </div>

        {/* Hover Interaction */}
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center transition-all duration-500 opacity-0 group-hover:opacity-100 z-20">
          <div onClick={(e) => { e.stopPropagation(); onClick(); }} className="w-16 h-16 bg-[#FF6B35] rounded-full flex items-center justify-center shadow-2xl transform translate-y-6 group-hover:translate-y-0 transition-all duration-700 border-2 border-white/10">
            <Play fill="white" size={30} className="ml-1" />
          </div>
        </div>
        
        {/* Quality Indicator */}
        {channel.quality && (
          <div className="absolute bottom-4 left-4 px-2.5 py-1 bg-black/60 backdrop-blur-xl rounded-xl text-[8px] font-black text-[#00C9A7] border border-white/10 uppercase tracking-widest z-10">
            {channel.quality}
          </div>
        )}
        
        {/* Favorite Trigger */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
          className={`absolute top-4 right-4 h-10 w-10 flex items-center justify-center rounded-2xl backdrop-blur-xl transition-all z-30 border ${isFavorite ? 'bg-red-500 border-red-500 text-white shadow-xl scale-110' : 'bg-black/40 border-white/10 text-white/40 hover:text-red-400 hover:scale-110'}`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={3} />
        </button>
      </div>
      
      {/* Labeling - Perfectly Aligned */}
      <div onClick={onClick} className="flex-1 flex flex-col justify-start px-2">
        <h3 className="text-sm font-black text-white/90 group-hover:text-[#FF6B35] transition-colors leading-tight mb-2 uppercase tracking-wide truncate">{channel.name}</h3>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isCricket ? 'bg-[#FF6B35] animate-ping' : 'bg-[#00C9A7]'}`}></div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] truncate">{channel.category}</p>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
