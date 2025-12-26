
import React, { useState } from 'react';
import { Search, Sparkles, BrainCircuit, Globe, Loader2, ArrowRight, AlertTriangle } from 'lucide-react';
import { searchGrounding, complexReasoning, QuotaError } from '../services/geminiService';
import { IPTVChannel } from '../types';

interface AISearchProps {
  onChannelSelect: (c: IPTVChannel) => void;
}

const AISearch: React.FC<AISearchProps> = ({ onChannelSelect }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiResponse, setAiResponse] = useState<{ text: string; sources: any[] } | null>(null);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const result = await searchGrounding(query);
      setAiResponse(result);
    } catch (e: any) {
      if (e instanceof QuotaError) {
        setError("AI सेवा वर्तमान में व्यस्त है (Quota Exhausted). कृपया कुछ देर बाद प्रयास करें।");
      } else {
        setError("खोज में त्रुटि हुई। कृपया पुन: प्रयास करें।");
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeepThink = async () => {
    if (!query) return;
    setLoading(true);
    setError(null);
    try {
      const result = await complexReasoning(query);
      setAiResponse({ text: result, sources: [] });
    } catch (e: any) {
      if (e instanceof QuotaError) {
        setError("AI सेवा वर्तमान में व्यस्त है (Quota Exhausted). कृपया कुछ देर बाद प्रयास करें।");
      } else {
        setError("प्रोसेसिंग में त्रुटि हुई। कृपया पुन: प्रयास करें।");
      }
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="glass-card rounded-[40px] p-8 lg:p-12 text-center border-[#FF6B35]/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF6B35]/10 blur-[100px] -z-10"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#00C9A7]/10 blur-[100px] -z-10"></div>
        
        <Sparkles className="mx-auto mb-6 text-[#FF6B35] animate-pulse" size={48} />
        <h2 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">AI Content Discovery</h2>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">Ask Gemini for news, specific matches, or movie recommendations across our global network.</p>
        
        <div className="relative group">
          <input 
            type="text" 
            placeholder="e.g., Which sports channel is broadcasting the Indian Premier League tonight?"
            className="w-full bg-white/5 border-2 border-white/10 rounded-3xl px-8 py-6 text-xl focus:outline-none focus:border-[#FF6B35] transition-all pr-40"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
            <button 
              onClick={handleSearch}
              className="px-6 py-3 bg-[#FF6B35] rounded-2xl font-bold hover:bg-[#FF8C66] transition-all flex items-center gap-2"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
            <button 
               onClick={handleDeepThink}
               title="Deep Thinking Mode"
               className="p-3 bg-white/10 rounded-2xl hover:bg-white/20 transition-all text-[#00C9A7]"
               disabled={loading}
            >
              <BrainCircuit size={24} />
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 glass rounded-2xl border-red-500/30 text-red-400 flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertTriangle size={18} />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {['Cricket Match today', 'Top Bollywood movies', 'Live News in Hindi', 'Documentary about space'].map(suggestion => (
            <button 
              key={suggestion}
              onClick={() => { setQuery(suggestion); }}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm text-gray-400 hover:text-white transition-all border border-white/5"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {aiResponse && (
        <div className="glass-card rounded-3xl p-8 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-[#FF6B35] mb-4">
            <Sparkles size={18} />
            <span className="font-bold text-sm uppercase tracking-wider">AI Analysis</span>
          </div>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
            {aiResponse.text.split('\n').map((para, i) => <p key={i} className="mb-4">{para}</p>)}
          </div>
          
          {aiResponse.sources.length > 0 && (
            <div className="mt-8 pt-6 border-t border-white/5">
              <h4 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                <Globe size={14} /> GROUNDING SOURCES
              </h4>
              <div className="flex flex-wrap gap-3">
                {aiResponse.sources.map((src, i) => (
                  <a 
                    key={i} 
                    href={src.web?.uri} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-medium transition-all"
                  >
                    {src.web?.title || 'Source'} <ArrowRight size={10} />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AISearch;
