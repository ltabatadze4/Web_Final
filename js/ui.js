// ui.js — DOM rendering helpers

import { coverUrl } from "./api.js";
import { escapeHtml } from "./utils.js";

const PLACEHOLDER = "assets/cover-placeholder.svg";

function buildCard(book, onOpen) {
  const card = document.createElement("article");
  card.className = "card";

  const img = document.createElement("img");
  img.className = "card__cover";
  const url = coverUrl(book.coverId);
  img.src     = url || PLACEHOLDER;
  img.alt     = url ? `ყდა — ${book.title}` : `ყდის გარეშე — ${book.title}`;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "card__body";

  const title = document.createElement("h3");
  title.className   = "card__title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className   = "card__author";
  author.textContent = book.author;

  const year = document.createElement("span");
  year.className   = "card__year";
  year.textContent = book.year ? String(book.year) : "წელი უცნობია";

  body.appendChild(title);
  body.appendChild(author);
  body.appendChild(year);
  card.appendChild(img);
  card.appendChild(body);
  card.addEventListener("click", () => onOpen(book));
  return card;
}

export function renderBooks(container, books, onOpen) {
  container.innerHTML = "";
  if (!books.length) {
    const p = document.createElement("p");
    p.className   = "empty";
    p.textContent = "წიგნები ვერ მოიძებნა. სცადე სხვა საძიებო სიტყვა.";
    container.appendChild(p);
    return;
  }
  books.forEach((book) => container.appendChild(buildCard(book, onOpen)));
}

export function showError(el, msg) {
  const div = document.createElement("div");
  div.className = "status status--error";
  div.setAttribute("role", "alert");
  div.textContent = msg;
  el.innerHTML = "";
  el.appendChild(div);
}
