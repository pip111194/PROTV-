
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { 
  Home, Search, Heart, User, Menu, Settings, LogOut, 
  Tv, Shield, Sparkles, X, Loader2, Radio, MoreVertical
} from 'lucide-react';
import { IPTVChannel, AppLanguage, AppState } from './types';
import { ADMIN_PASSWORD, UI_LABELS, MOCK_CHANNELS } from './constants';
import { fetchAndParseM3U } from './services/iptvService';
import ChannelCard from './components/ChannelCard';
import VideoPlayer from './components/VideoPlayer';
import AdminDashboard from './components/AdminDashboard';
import AISearch from './components/AISearch';
import SubscriptionPlans from './components/SubscriptionPlans';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    isLoaded: false,
    isAdmin: false,
    language: (localStorage.getItem('app_lang') as AppLanguage) || AppLanguage.HINDI,
    channels: [],
    favorites: JSON.parse(localStorage.getItem('fav_channels') || '[]'),
    currentChannel: null,
    loadingProgress: 0
  });

  const [activeTab, setActiveTab] = useState<'home' | 'radio' | 'search' | 'favorites' | 'profile' | 'admin'>('home');
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(24);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Exact 1-second Splash Screen as requested
    const splashTimer = setTimeout(() => setIsSplashVisible(false), 1000);
    
    const loadData = async () => {
      const fetchedChannels = await fetchAndParseM3U((p) => {
        setState(prev => ({ ...prev, loadingProgress: p }));
      });
      setState(prev => ({ 
        ...prev, 
        channels: fetchedChannels.length > 0 ? fetchedChannels : MOCK_CHANNELS,
        isLoaded: true 
      }));
    };
    loadData();
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && state.isLoaded) {
          setVisibleCount(prev => prev + 24);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => observer.disconnect();
  }, [state.isLoaded]);

  const label = (key: string) => UI_LABELS[state.language]?.[key] || UI_LABELS['en'][key];

  const handleAdminLogin = () => {
    if (adminPass === ADMIN_PASSWORD) {
      setState(prev => ({ ...prev, isAdmin: true }));
      setShowAdminModal(false);
      setAdminPass('');
      setActiveTab('admin');
    } else {
      alert('Invalid Password');
    }
  };

  if (isSplashVisible) {
    return (
      <div className="fixed inset-0 bg-[#0F1419] flex flex-col items-center justify-center z-[200]">
        <div className="w-24 h-24 bg-[#FF6B35] rounded-[2rem] flex items-center justify-center shadow-[0_0_50px_rgba(255,107,53,0.3)] animate-pulse mb-6">
          <Tv size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-black tracking-[0.2em] uppercase text-white">Pro<span className="text-[#FF6B35]">Tv</span> Premium</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1419] text-white overflow-x-hidden font-sans">
      {/* Sidebar - Desktop & Tablet */}
      <aside className={`fixed top-0 bottom-0 left-0 w-72 glass border-r border-white/5 z-[100] transition-transform duration-500 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-[#FF6B35] rounded-xl flex items-center justify-center"><Tv size={20} /></div>
             <span className="font-black text-xl tracking-tight">ProTv</span>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-gray-500"><X /></button>
        </div>
        
        <nav className="px-6 space-y-2">
          {['home', 'radio', 'search', 'favorites', 'profile'].map((id) => (
            <button 
              key={id} 
              onClick={() => { setActiveTab(id as any); setIsSidebarOpen(false); }}
              className={`w-full h-14 flex items-center gap-4 px-6 rounded-2xl transition-all ${activeTab === id ? 'bg-[#FF6B35] text-white shadow-lg shadow-[#FF6B35]/20' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
            >
              {id === 'home' ? <Home size={20}/> : id === 'radio' ? <Radio size={20}/> : id === 'search' ? <Search size={20}/> : id === 'favorites' ? <Heart size={20}/> : <User size={20}/>}
              <span className="text-xs font-bold uppercase tracking-widest">{label(id)}</span>
            </button>
          ))}
          
          <div className="my-8 h-px bg-white/5 mx-6"></div>
          
          <button 
            onClick={() => { state.isAdmin ? setActiveTab('admin') : setShowAdminModal(true); setIsSidebarOpen(false); }}
            className={`w-full h-14 flex items-center gap-4 px-6 rounded-2xl transition-all ${activeTab === 'admin' ? 'bg-[#FF6B35] text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
          >
            <Shield size={20}/>
            <span className="text-xs font-bold uppercase tracking-widest">{state.isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
          </button>
        </nav>
      </aside>

      <div className="lg:pl-72 min-h-screen">
        {/* Header Mobile */}
        <header className="lg:hidden sticky top-0 z-[80] glass border-b border-white/5 px-6 py-4 flex items-center justify-between">
           <button onClick={() => setIsSidebarOpen(true)} className="p-3 bg-white/5 rounded-xl"><Menu size={20}/></button>
           <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-[#FF6B35] rounded-lg flex items-center justify-center"><Tv size={16}/></div>
             <span className="font-black text-sm uppercase tracking-tighter">ProTv</span>
           </div>
           <button onClick={() => setActiveTab('profile')} className="p-3 bg-white/5 rounded-xl"><User size={20}/></button>
        </header>

        <main className="p-6 md:p-10 lg:p-14 max-w-[1440px] mx-auto">
          {state.currentChannel ? (
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <VideoPlayer 
                channel={state.currentChannel} 
                language={state.language} 
                onClose={() => setState(prev => ({ ...prev, currentChannel: null }))} 
              />
            </div>
          ) : null}

          {activeTab === 'home' && (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                   <h1 className="text-4xl font-black mb-2">Live Entertainment</h1>
                   <p className="text-gray-500 font-medium">Over {state.channels.length} channels loaded in background.</p>
                </div>
                <div className="relative group min-w-[300px]">
                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                   <input 
                    type="text" placeholder="Search channels..." 
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 focus:outline-none focus:border-[#FF6B35] transition-all font-bold"
                    value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                   />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-8">
                {state.channels
                  .filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .slice(0, visibleCount)
                  .map(ch => (
                    <ChannelCard 
                      key={ch.id} 
                      channel={ch} 
                      isFavorite={state.favorites.includes(ch.id)}
                      onToggleFavorite={() => {
                        const newFavs = state.favorites.includes(ch.id) ? state.favorites.filter(f => f !== ch.id) : [...state.favorites, ch.id];
                        localStorage.setItem('fav_channels', JSON.stringify(newFavs));
                        setState(prev => ({ ...prev, favorites: newFavs }));
                      }}
                      onClick={() => setState(prev => ({ ...prev, currentChannel: ch }))}
                    />
                  ))}
              </div>
              <div ref={observerTarget} className="h-20 flex items-center justify-center">
                 {visibleCount < state.channels.length && <Loader2 className="animate-spin text-[#FF6B35]" size={32} />}
              </div>
            </div>
          )}

          {activeTab === 'radio' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {state.channels.filter(c => c.category.toLowerCase().includes('radio')).map(ch => (
                 <ChannelCard key={ch.id} channel={ch} isFavorite={state.favorites.includes(ch.id)} onToggleFavorite={() => {}} onClick={() => setState(prev => ({ ...prev, currentChannel: ch }))} />
               ))}
            </div>
          )}

          {activeTab === 'search' && <AISearch onChannelSelect={(c) => setState(prev => ({ ...prev, currentChannel: c }))} />}
          
          {activeTab === 'favorites' && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
               {state.channels.filter(c => state.favorites.includes(c.id)).map(ch => (
                 <ChannelCard key={ch.id} channel={ch} isFavorite={true} onToggleFavorite={() => {}} onClick={() => setState(prev => ({ ...prev, currentChannel: ch }))} />
               ))}
               {state.favorites.length === 0 && (
                 <div className="col-span-full py-40 text-center glass rounded-[3rem] opacity-50 border border-white/5">
                    <Heart size={48} className="mx-auto mb-4 text-gray-700" />
                    <p className="font-bold text-gray-600">No favorites yet.</p>
                 </div>
               )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-12">
               <div className="glass-card p-12 rounded-[4rem] text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-[#FF6B35] p-2 mx-auto mb-6">
                    <img src="user-avatar-placeholder-transparent.dim_100x100.png" className="w-full h-full rounded-full object-cover" onError={(e) => e.currentTarget.src = 'https://picsum.photos/200'} />
                  </div>
                  <h2 className="text-3xl font-black mb-2">{label('guestUser')}</h2>
                  <p className="text-[#00C9A7] font-bold text-xs uppercase tracking-widest">{label('activeSub')}</p>
               </div>
               <SubscriptionPlans />
            </div>
          )}

          {activeTab === 'admin' && state.isAdmin && <AdminDashboard />}
        </main>
      </div>

      {/* Admin Login Modal - Password Only */}
      {showAdminModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[200] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
           <div className="glass-card w-full max-w-sm p-12 rounded-[3.5rem] text-center border-[#FF6B35]/20">
              <div className="w-16 h-16 bg-[#FF6B35] rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl"><Shield size={32}/></div>
              <h3 className="text-2xl font-black mb-8 uppercase tracking-tighter">Admin Authentication</h3>
              <input 
                type="password" placeholder="Passcode" 
                className="w-full h-16 bg-white/5 border border-white/10 rounded-2xl px-6 text-center text-3xl font-black tracking-widest focus:outline-none focus:border-[#FF6B35] mb-8"
                value={adminPass} onChange={(e) => setAdminPass(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                autoFocus
              />
              <div className="flex gap-4">
                 <button onClick={() => setShowAdminModal(false)} className="flex-1 h-14 bg-white/5 rounded-2xl font-bold uppercase text-[10px] tracking-widest">Cancel</button>
                 <button onClick={handleAdminLogin} className="flex-1 h-14 bg-[#FF6B35] rounded-2xl font-bold uppercase text-[10px] tracking-widest shadow-xl shadow-[#FF6B35]/20">Unlock</button>
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/5 px-6 py-4 flex justify-between items-center z-[90]">
        {['home', 'radio', 'search', 'favorites', 'profile'].map(id => {
          const Icon = id === 'home' ? Home : id === 'radio' ? Radio : id === 'search' ? Search : id === 'favorites' ? Heart : User;
          return (
            <button key={id} onClick={() => setActiveTab(id as any)} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === id ? 'text-[#FF6B35]' : 'text-gray-500'}`}>
              <Icon size={22} strokeWidth={activeTab === id ? 3 : 2} />
              <span className="text-[8px] font-black uppercase tracking-widest">{label(id)}</span>
            </button>
          );
        })}
      </nav>

      <style>{`
        .glass { background: rgba(15, 20, 25, 0.85); backdrop-filter: blur(30px); }
        .glass-card { background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255,255,255,0.05); }
      `}</style>
    </div>
  );
};

export default App;
