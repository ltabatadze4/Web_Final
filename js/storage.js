// storage.js - localStorage-ში მონაცემების შენახვა და წაკითხვა

const SHELF_KEY       = "tabata_library_shelf";
const LAST_SEARCH_KEY = "tabata_library_last_search";
const AUTH_KEY        = "tabata_library_auth";

export function getShelf() {
  const raw = localStorage.getItem(SHELF_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function saveShelf(books) {
  localStorage.setItem(SHELF_KEY, JSON.stringify(books));
}

export function addToShelf(book, status) {
  if (!status) status = "want";
  const shelf = getShelf();

  // ვამოწმებთ, ამ წიგნს ხომ არ ვინახავთ უკვე
  for (let i = 0; i < shelf.length; i++) {
    if (shelf[i].key === book.key) return false;
  }

  const entry = {
    key:      book.key,
    title:    book.title,
    author:   book.author,
    year:     book.year,
    coverId:  book.coverId,
    editions: book.editions,
    status:   status,
    addedAt:  Date.now()
  };
  shelf.push(entry);
  saveShelf(shelf);
  return true;
}

export function removeFromShelf(key) {
  const shelf   = getShelf();
  const updated = [];
  for (let i = 0; i < shelf.length; i++) {
    if (shelf[i].key !== key) {
      updated.push(shelf[i]);
    }
  }
  saveShelf(updated);
}

export function updateStatus(key, newStatus) {
  const shelf = getShelf();
  for (let i = 0; i < shelf.length; i++) {
    if (shelf[i].key === key) {
      shelf[i].status = newStatus;
    }
  }
  saveShelf(shelf);
}

export function isSaved(key) {
  const shelf = getShelf();
  for (let i = 0; i < shelf.length; i++) {
    if (shelf[i].key === key) return true;
  }
  return false;
}

export function getLastSearch() {
  return localStorage.getItem(LAST_SEARCH_KEY) || "";
}

export function saveLastSearch(q) {
  localStorage.setItem(LAST_SEARCH_KEY, q);
}

export function getAuth() {
  const raw = localStorage.getItem(AUTH_KEY);
  if (!raw) return null;
  return JSON.parse(raw);
}

export function saveAuth(auth) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn() {
  const auth = getAuth();
  if (auth === null) return false;
  return true;
}
