// ui.js - წიგნების ბარათების HTML-ში გამოტანა

import { coverUrl } from "./api.js";
import { t } from "./i18n.js";

const PLACEHOLDER = "assets/cover-placeholder.svg";

function buildCard(book, onOpen) {
  const card = document.createElement("article");
  card.className = "card";

  const img = document.createElement("img");
  img.className = "card__cover";
  img.loading   = "lazy";

  const url = coverUrl(book.coverId);
  if (url) {
    img.src = url;
    img.alt = book.title;
  } else {
    img.src = PLACEHOLDER;
    img.alt = book.title;
  }

  const body = document.createElement("div");
  body.className = "card__body";

  const title = document.createElement("h3");
  title.className   = "card__title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className   = "card__author";
  author.textContent = book.author;

  const year = document.createElement("span");
  year.className = "card__year";
  year.textContent = book.year || t("js.year.unknown");

  body.appendChild(title);
  body.appendChild(author);
  body.appendChild(year);

  card.appendChild(img);
  card.appendChild(body);

  card.addEventListener("click", function() {
    onOpen(book);
  });

  return card;
}

export function renderBooks(container, books, onOpen) {
  container.innerHTML = "";

  if (books.length === 0) {
    const p = document.createElement("p");
    p.className   = "empty";
    p.textContent = t("js.no.books");
    container.appendChild(p);
    return;
  }

  for (let i = 0; i < books.length; i++) {
    container.appendChild(buildCard(books[i], onOpen));
  }
}

export function showError(el, msg) {
  const div = document.createElement("div");
  div.className = "status status--error";
  div.setAttribute("role", "alert");
  div.textContent = msg;
  el.innerHTML = "";
  el.appendChild(div);
}
