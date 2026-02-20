import { STORAGE } from "./config.js";

export function getLocal(key, fallback = "") {
  const value = localStorage.getItem(key);
  return value === null ? fallback : value;
}

export function setLocal(key, value) {
  localStorage.setItem(key, value);
}
// cache is stored in session storage because we want it to be cleared when the tab is closed
// which is basically api response for a particular query and page.
export function loadCache() {
  const raw = sessionStorage.getItem(STORAGE.cache);
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveCache(cache) {
  sessionStorage.setItem(STORAGE.cache, JSON.stringify(cache));
}

export function getRecentList() {
  const raw = localStorage.getItem(STORAGE.recent);
  return raw ? JSON.parse(raw) : [];
}

export function setRecentList(list) {
  localStorage.setItem(STORAGE.recent, JSON.stringify(list));
}
