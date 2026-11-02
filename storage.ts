import { BirthdayConfig, WishNote } from '../types';

const CONFIG_KEY = 'birthday_config_v1';
const WISHES_KEY = 'birthday_wishes_v1';

export const DEFAULT_CONFIG: BirthdayConfig = {
  name: 'Alex',
  age: 20,
  message:
    "Wishing you the most magical birthday yet! Thank you for always bringing so much laughter, warmth, and adventure into my life. Here's to chasing big dreams, eating extra cake, and making unforgettable memories together this year! ✨🎂",
  birthdayDate: new Date().toISOString().split('T')[0],
  photoUrl: null,
  theme: 'Pink',
};

export const INITIAL_SAMPLE_WISHES: WishNote[] = [
  {
    id: 'wish-1',
    author: 'Sam',
    message: 'Happy Birthday to my favorite human! May your day be as radiant as your smile! 💖🎉',
    color: '#fef08a', // pastel yellow
    rotation: -2,
    timestamp: Date.now() - 3600000 * 4,
    likes: 8,
  },
  {
    id: 'wish-2',
    author: 'Jordan',
    message: 'Another year older, wiser, and even more fabulous! Can’t wait to celebrate! 🥂✨',
    color: '#fed7aa', // pastel orange/peach
    rotation: 1.5,
    timestamp: Date.now() - 3600000 * 2,
    likes: 5,
  },
  {
    id: 'wish-3',
    author: 'Taylor',
    message: 'Wishing you endless joy, giant slices of cake, and all the success in the world! 🎂🚀',
    color: '#bbf7d0', // pastel green/mint
    rotation: -1,
    timestamp: Date.now() - 3600000 * 1,
    likes: 6,
  },
  {
    id: 'wish-4',
    author: 'Maya',
    message: 'So lucky to have you as a friend. Keep shining bright! ✨🌟',
    color: '#e9d5ff', // pastel purple
    rotation: 2.2,
    timestamp: Date.now() - 1800000,
    likes: 4,
  },
];

export function saveConfigToStorage(config: BirthdayConfig): boolean {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
    return true;
  } catch (err) {
    console.warn('Unable to save birthday config to localStorage:', err);
    // If quota exceeded due to large photo, try saving without photo
    if (config.photoUrl) {
      try {
        const withoutPhoto = { ...config, photoUrl: null };
        localStorage.setItem(CONFIG_KEY, JSON.stringify(withoutPhoto));
        return true;
      } catch (nestedErr) {
        console.warn('Fallback save without photo also failed:', nestedErr);
      }
    }
    return false;
  }
}

export function loadConfigFromStorage(): BirthdayConfig | null {
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.name === 'string') {
      return parsed as BirthdayConfig;
    }
  } catch (err) {
    console.warn('Error reading birthday config from localStorage:', err);
  }
  return null;
}

export function saveWishesToStorage(wishes: WishNote[]): void {
  try {
    localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
  } catch (err) {
    console.warn('Unable to save wishes to localStorage:', err);
  }
}

export function loadWishesFromStorage(): WishNote[] {
  try {
    const raw = localStorage.getItem(WISHES_KEY);
    if (!raw) return INITIAL_SAMPLE_WISHES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.warn('Error reading wishes from localStorage:', err);
  }
  return INITIAL_SAMPLE_WISHES;
}

export function encodeConfigToUrl(config: BirthdayConfig): string {
  try {
    // Exclude oversized photo from share URL to prevent URL length limits (>4KB)
    const shareableData = {
      ...config,
      photoUrl: config.photoUrl && config.photoUrl.length < 2000 ? config.photoUrl : null,
    };
    const jsonStr = JSON.stringify(shareableData);
    const encoded = encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
    const url = new URL(window.location.href);
    url.hash = `surprise=${encoded}`;
    return url.toString();
  } catch (e) {
    console.warn('Error encoding config to URL:', e);
    return window.location.href;
  }
}

export function decodeConfigFromUrl(): BirthdayConfig | null {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('surprise=')) return null;
    const match = hash.match(/surprise=([^&]+)/);
    if (!match || !match[1]) return null;
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(match[1]))));
    const parsed = JSON.parse(jsonStr);
    if (parsed && typeof parsed.name === 'string') {
      return parsed as BirthdayConfig;
    }
  } catch (e) {
    console.warn('Error decoding config from URL:', e);
  }
  return null;
}
