
import { IPTVChannel } from '../types';
import { DEFAULT_M3U_URL } from '../constants';

const CACHE_KEY = 'iptv_channels_v5_cache';
const MAX_CHANNELS = 4000; // Increased capacity for iptv-org

export const fetchAndParseM3U = async (onProgress: (progress: number) => void): Promise<IPTVChannel[]> => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const data = JSON.parse(cached);
      if (Array.isArray(data) && data.length > 0) {
        onProgress(100);
        return data;
      }
    }

    // Using a more reliable way to fetch the massive iptv-org list
    const response = await fetch(DEFAULT_M3U_URL);
    if (!response.ok) throw new Error("M3U Source Unavailable");
    
    const text = await response.text();
    const lines = text.split('\n');
    const channels: IPTVChannel[] = [];
    let currentChannel: any = {};

    // Efficient one-pass parsing for massive files
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      if (line.startsWith('#EXTINF')) {
        const nameMatch = line.match(/,(.*)$/);
        const logoMatch = line.match(/tvg-logo="(.*?)"/);
        const groupMatch = line.match(/group-title="(.*?)"/);
        const countryMatch = line.match(/tvg-country="(.*?)"/);
        
        currentChannel = {
          id: `ch-${i}`,
          name: nameMatch ? nameMatch[1].trim() : 'Unknown Station',
          logo: logoMatch ? logoMatch[1] : '',
          category: groupMatch ? groupMatch[1] : 'General',
          country: countryMatch ? countryMatch[1] : '',
          quality: 'HD'
        };
      } else if (line.startsWith('http')) {
        currentChannel.url = line;
        
        // Basic filtering to keep only non-adult and potentially working streams
        if (currentChannel.name && !currentChannel.name.includes('XXX')) {
          // Add quality markers if present in the URL or name
          if (line.includes('1080') || currentChannel.name.includes('1080')) currentChannel.quality = 'FHD';
          if (line.includes('4k') || currentChannel.name.includes('4K')) currentChannel.quality = '4K';
          
          channels.push(currentChannel as IPTVChannel);
        }
        currentChannel = {};
      }

      if (channels.length >= MAX_CHANNELS) break;
      
      // Update progress every 1000 lines to maintain UI responsiveness
      if (i % 1000 === 0) {
        onProgress(Math.floor((i / lines.length) * 100));
        await new Promise(r => setTimeout(r, 0)); // Yield to main thread
      }
    }

    // Sort: Verified Logos First -> Indian Channels -> Alphabetical
    const finalized = channels.sort((a, b) => {
      const hasLogoA = a.logo && a.logo.startsWith('http') ? 1 : 0;
      const hasLogoB = b.logo && b.logo.startsWith('http') ? 1 : 0;
      
      if (hasLogoA !== hasLogoB) return hasLogoB - hasLogoA;
      
      const isIndiaA = a.country === 'IN' || a.category.includes('India') || a.name.toLowerCase().includes('india') ? 1 : 0;
      const isIndiaB = b.country === 'IN' || b.category.includes('India') || b.name.toLowerCase().includes('india') ? 1 : 0;
      
      if (isIndiaA !== isIndiaB) return isIndiaB - isIndiaA;
      
      return a.name.localeCompare(b.name);
    });

    localStorage.setItem(CACHE_KEY, JSON.stringify(finalized));
    onProgress(100);
    return finalized;
  } catch (error) {
    console.error("IPTV Loader Critical Error:", error);
    // If fail, try to return mock data so app doesn't break
    return [];
  }
};
