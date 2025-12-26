
import React from 'react';

export const ADMIN_PASSWORD = 'pranshu8787';
export const DEFAULT_M3U_URL = 'https://iptv-org.github.io/iptv/index.m3u';

export const APP_THEME = {
  background: '#0F1419',
  card: '#1A202C',
  primary: '#FF6B35',
  secondary: '#00C9A7',
  text: '#FFFFFF',
  textSecondary: '#A0AEC0',
  glass: 'rgba(26, 32, 44, 0.7)',
  glassBorder: 'rgba(255, 255, 255, 0.05)'
};

export const WORLD_LANGUAGES = [
  { code: 'Hindi', label: 'हिन्दी' },
  { code: 'English', label: 'English' },
  { code: 'Spanish', label: 'Español' },
  { code: 'French', label: 'Français' },
  { code: 'Arabic', label: 'العربية' }
];

export const UI_LABELS: Record<string, Record<string, string>> = {
  hi: {
    home: 'होम',
    radio: 'रेडियो',
    search: 'खोजें',
    favorites: 'पसंदीदा',
    profile: 'प्रोफाइल',
    adminLogin: 'एडमिन लॉगिन',
    addChannel: 'चैनल जोड़ें',
    subscription: 'सब्सक्रिप्शन',
    hindiDub: 'हिंदी डब',
    loading: 'लोड हो रहा है...',
    quality: 'गुणवत्ता',
    speed: 'गति',
    logout: 'लॉगआउट',
    settings: 'सेटिंग्स',
    addPlan: 'नया प्लान जोड़ें',
    activeSub: 'सक्रिय',
    guestUser: 'अतिथि'
  },
  en: {
    home: 'Home',
    radio: 'Radio',
    search: 'Search',
    favorites: 'Favorites',
    profile: 'Profile',
    adminLogin: 'Admin Login',
    addChannel: 'Add Channel',
    subscription: 'Subscription',
    hindiDub: 'Hindi Dub',
    loading: 'Loading...',
    quality: 'Quality',
    speed: 'Speed',
    logout: 'Logout',
    settings: 'Settings',
    addPlan: 'Add Plan',
    activeSub: 'Active',
    guestUser: 'Guest'
  }
};

export const PLANS = [
  { id: 'basic', name: 'Basic', price: '₹199/mo', features: ['HD Quality', '1 Device', 'Basic Channels'], icon: 'plan-basic-transparent.dim_64x64.png' },
  { id: 'standard', name: 'Standard', price: '₹499/mo', features: ['Full HD Quality', '2 Devices', 'All Channels', 'No Ads'], icon: 'plan-standard-transparent.dim_64x64.png' },
  { id: 'premium', name: 'Premium', price: '₹999/mo', features: ['4K Ultra HD', '4 Devices', 'Premium Sports', 'Hindi Dub Enabled'], icon: 'plan-premium-transparent.dim_64x64.png' },
  { id: 'family', name: 'Family', price: '₹1499/mo', features: ['4K Ultra HD', '6 Devices', 'Parental Controls', 'Hindi Dub Enabled'], icon: 'plan-family-transparent.dim_64x64.png' }
];

export const MOCK_CHANNELS: any[] = [
  { id: 's1', name: 'Star Sports 1', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/Star_Sports_logo.svg/200px-Star_Sports_logo.svg.png', url: 'https://demo.unified-streaming.com/k8s/live/stable/scte35.isml/.m3u8', category: 'Sports', quality: '4K' },
  { id: 's2', name: 'CNN News', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg', url: 'https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-91d5-4704-8b5d-005c0731336a.m3u8', category: 'News', quality: '1080p' }
];
