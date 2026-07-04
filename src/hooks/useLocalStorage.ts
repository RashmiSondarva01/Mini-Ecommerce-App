/**
 * Plain read/write helpers rather than a useState-backed hook, because
 * CartContext needs them inside a reducer's lazy initializer and a
 * post-dispatch effect, not inside a component body.
 */
export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, quota exceeded) — cart still
    // works for the current session, it just won't persist.
  }
}
