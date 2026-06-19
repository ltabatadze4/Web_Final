// home.js - მთავარი გვერდი (ძიება)

import { searchBooks } from "./api.js";
import { getLastSearch, saveLastSearch } from "./storage.js";
import { renderBooks, showError } from "./ui.js";
import { debounce, escapeHtml } from "./utils.js";
import { t } from "./i18n.js";

const form  = document.querySelector("#search-form");
const input = document.querySelector("#search-input");
const grid  = document.querySelector("#results");

function openBook(book) {
  const params = new URLSearchParams({
    key:    book.key,
    title:  book.title,
    author: book.author,
    year:   book.year    || "",
    cover:  book.coverId || ""
  });
  window.location.href = "detail.html?" + params.toString();
}

async function runSearch(query) {
  const q = query.trim();
  if (!q) { showError(grid, t("js.home.empty")); return; }
  saveLastSearch(q);
  grid.innerHTML = `<div class="status status--loading"><span class="spinner"></span>${t("js.home.searching", { q: escapeHtml(q) })}</div>`;
  try {
    const books = await searchBooks(q);
    renderBooks(grid, books, openBook);
  } catch (err) {
    showError(grid, t("js.home.error"));
    console.error(err);
  }
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const q = input.value.trim();
  if (!q) { showError(grid, t("js.home.empty")); return; }
  runSearch(input.value);
});

const debouncedSearch = debounce(function(val) { runSearch(val); }, 500);

input.addEventListener("input", function(e) {
  if (e.target.value.trim().length >= 3) debouncedSearch(e.target.value);
});

input.addEventListener("keydown", function(e) {
  if (e.key === "Escape") {
    input.value = "";
    grid.innerHTML = "";
  }
});

const last = getLastSearch();
input.value = last;
runSearch(last || "classic literature");
