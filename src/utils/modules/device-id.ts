const DEVICE_ID_STORAGE_KEY = 'order-food-device-id';
let cachedDeviceId: string | null = null;

export function getOrCreateDeviceId(): string {
  if (cachedDeviceId) return cachedDeviceId;

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(DEVICE_ID_STORAGE_KEY);
    if (stored) {
      cachedDeviceId = stored;
      return stored;
    }
  }

  const deviceId = globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
  cachedDeviceId = deviceId;

  try {
    window.localStorage.setItem(DEVICE_ID_STORAGE_KEY, deviceId);
  } catch {
    // Keep the generated identifier in memory when storage is unavailable.
  }

  return deviceId;
}
