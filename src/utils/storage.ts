export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = uni.getStorageSync(key)
    if (raw) return JSON.parse(raw) as T
  } catch {
    // ignore parse errors
  }
  return fallback
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    uni.setStorageSync(key, JSON.stringify(data))
  } catch {
    // ignore storage errors
  }
}
