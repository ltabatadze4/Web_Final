// adaptations.js - ეკრანიზაციების ძიება

import { searchFilmAdaptations } from "./api.js";
import { getShelf } from "./storage.js";
import { showError } from "./ui.js";
import { escapeHtml } from "./utils.js";

const form  = document.querySelector("#adapt-form");
const input = document.querySelector("#adapt-input");
const grid  = document.querySelector("#films");
const picks = document.querySelector("#adapt-picks");

// თაროდან წინადადებები
const shelf = getShelf();
if (shelf.length > 0 && picks) {
  picks.hidden = false;
  for (let i = 0; i < Math.min(6, shelf.length); i++) {
    const book = shelf[i];
    const btn  = document.createElement("button");
    btn.className = "adapt-picks__btn"; btn.type = "button";
    btn.textContent = book.title;
    btn.addEventListener("click", function() { input.value = book.title; runSearch(book.title); });
    picks.appendChild(btn);
  }
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  runSearch(input.value);
});

const fromUrl = new URLSearchParams(window.location.search).get("book");
if (fromUrl) { input.value = fromUrl; runSearch(fromUrl); }

async function runSearch(bookTitle) {
  const q = bookTitle.trim();
  if (!q) return;
  grid.innerHTML = `<div class="status status--loading"><span class="spinner"></span>ეკრანიზაციების ძიება „${escapeHtml(q)}"…</div>`;
  try {
    const films = await searchFilmAdaptations(q);
    renderFilms(films, q);
  } catch (err) {
    showError(grid, "ფილმების ძიება ვერ მოხერხდა. სცადე თავიდან.");
    console.error(err);
  }
}

function renderFilms(films, bookTitle) {
  grid.innerHTML = "";
  if (films.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = `„${bookTitle}"-ის ეკრანიზაცია ვერ მოიძებნა.`;
    grid.appendChild(p); return;
  }
  for (let i = 0; i < films.length; i++) grid.appendChild(buildFilmCard(films[i]));
}

function buildFilmCard(film) {
  const card = document.createElement("article");
  card.className = "film-card";

  const pw = document.createElement("div");
  pw.className = "film-card__poster-wrap";
  if (film.poster) {
    const img = document.createElement("img");
    img.className = "film-card__poster"; img.src = film.poster;
    img.alt = "პოსტერი — " + film.title; img.loading = "lazy";
    pw.appendChild(img);
  } else {
    const ph = document.createElement("div");
    ph.className = "film-card__poster-placeholder"; ph.textContent = "🎬";
    pw.appendChild(ph);
  }
  card.appendChild(pw);

  const body = document.createElement("div");
  body.className = "film-card__body";
  const h3 = document.createElement("h3");
  h3.className = "film-card__title";
  h3.textContent = film.year ? film.title + " (" + film.year + ")" : film.title;
  const meta = document.createElement("p");
  meta.className = "film-card__meta"; meta.textContent = film.actors || "";
  const desc = document.createElement("p");
  desc.className = "film-card__desc"; desc.textContent = film.description;
  body.appendChild(h3); body.appendChild(meta); body.appendChild(desc);

  if (film.imdbUrl) {
    const a = document.createElement("a");
    a.className = "film-card__link"; a.href = film.imdbUrl;
    a.target = "_blank"; a.rel = "noopener noreferrer";
    a.textContent = "IMDb-ზე ნახვა →";
    body.appendChild(a);
  }
  card.appendChild(body);
  return card;
}
