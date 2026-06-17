// storage.js — localStorage helpers

const SHELF_KEY       = "tabata_library_shelf";
const LAST_SEARCH_KEY = "tabata_library_last_search";
const AUTH_KEY        = "tabata_library_auth";

export function getShelf() {
  const raw = localStorage.getItem(SHELF_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
}

function saveShelf(books) {
  localStorage.setItem(SHELF_KEY, JSON.stringify(books));
}

export function addToShelf(book, status = "want") {
  const shelf = getShelf();
  if (shelf.some((b) => b.key === book.key)) return false;
  shelf.push({ ...book, status, addedAt: Date.now() });
  saveShelf(shelf);
  return true;
}

export function removeFromShelf(key) {
  saveShelf(getShelf().filter((b) => b.key !== key));
}

export function updateStatus(key, status) {
  saveShelf(getShelf().map((b) => (b.key === key ? { ...b, status } : b)));
}

export function isSaved(key) {
  return getShelf().some((b) => b.key === key);
}

export function getLastSearch() {
  return localStorage.getItem(LAST_SEARCH_KEY) || "";
}

export function saveLastSearch(q) {
  localStorage.setItem(LAST_SEARCH_KEY, q);
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn() {
  return getAuth() !== null;
}
