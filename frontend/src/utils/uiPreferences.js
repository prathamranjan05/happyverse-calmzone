// src/utils/uiPreferences.js

const KEY = "calmzone-ui";

export function loadUIPreferences() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { themeName: "meadow", dark: false };
    return JSON.parse(raw);
  } catch {
    return { themeName: "meadow", dark: false };
  }
}

export function saveUIPreferences(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}
