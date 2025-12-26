
export enum AppLanguage {
  HINDI = 'hi',
  ENGLISH = 'en',
  SPANISH = 'es',
  FRENCH = 'fr',
  ARABIC = 'ar',
  JAPANESE = 'ja',
  GERMAN = 'de',
  RUSSIAN = 'ru',
  PORTUGUESE = 'pt'
}

export interface IPTVChannel {
  id: string;
  name: string;
  logo: string;
  url: string;
  category: string;
  quality?: string;
  country?: string;
  language?: string;
}

export interface AppState {
  isLoaded: boolean;
  isAdmin: boolean;
  language: AppLanguage;
  channels: IPTVChannel[];
  favorites: string[];
  currentChannel: IPTVChannel | null;
  loadingProgress: number;
}
