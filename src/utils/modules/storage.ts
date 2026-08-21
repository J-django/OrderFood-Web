export function readPersistedStoreState<TState>(
  name: string,
  schemaVersion: number,
): Partial<TState> | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(name);
    if (!value) return null;
    const parsed = JSON.parse(value) as { state?: unknown; version?: unknown };
    if (parsed.version !== schemaVersion || !parsed.state || typeof parsed.state !== 'object') {
      return null;
    }
    return parsed.state as Partial<TState>;
  } catch {
    return null;
  }
}
