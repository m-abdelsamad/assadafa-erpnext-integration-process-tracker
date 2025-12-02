// src/utils/localStorageUtils.ts
export function safeGetItem<T>(key: string): T | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    return JSON.parse(raw) as T;
  } catch {
    // Malformed JSON or access error – treat as missing
    return null;
  }
}

export function safeSetItem<T>(key: string, value: T | null | undefined): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    if (value === null || value === undefined) {
      window.localStorage.removeItem(key);
      return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota exceeded or other storage problems – fail silently
  }
}

export function safeRemoveItem(key: string): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
