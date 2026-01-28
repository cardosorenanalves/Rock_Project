
const MAX_STORAGE_CHARS = 2000000; // ~2MB (Safe margin for typical 5MB limit)

export const setSessionStorageSafe = (key: string, value: string) => {
  if (typeof window === 'undefined') return;
  
  if (value.length > MAX_STORAGE_CHARS) {
    console.warn(`Value for ${key} is too large to save in sessionStorage (${value.length} chars). Skipping.`);
    return;
  }
  
  try {
    sessionStorage.setItem(key, value);
  } catch (e) {
    console.warn(`Failed to save ${key} to sessionStorage:`, e);
  }
};

export const getSessionStorageSafe = (key: string): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return sessionStorage.getItem(key);
  } catch (e) {
    console.warn(`Failed to read ${key} from sessionStorage:`, e);
    return null;
  }
};
