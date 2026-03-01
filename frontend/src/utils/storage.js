// utils/storage.js

const KEY = "calmzone_user_stats";

export function loadStats() {
  const raw = localStorage.getItem(KEY);
  return raw
    ? JSON.parse(raw)
    : { streak: 0, totalSessions: 0, lastSessionDate: null };
}

export function saveStats(stats) {
  localStorage.setItem(KEY, JSON.stringify(stats));
}
