// main.js — entry point for all pages

import { searchBooks, getBookDetails, findFreeRead, searchFilmAdaptations } from "./api.js";
import {
  getShelf, addToShelf, removeFromShelf, updateStatus, isSaved,
  getLastSearch, saveLastSearch,
  getAuth, saveAuth, clearAuth, isLoggedIn,
} from "./storage.js";
import { renderBooks, showError } from "./ui.js";
import { debounce, createCounter, escapeHtml } from "./utils.js";

let searchResults = [];

const addCounter = createCounter();

const STATUS_LABELS = {
  want: "გადასაკითხი მაქვს",
  reading: "ვკითხულობ",
  read: "უკვე წავიკითხე",
};

const page = document.body.dataset.page;
setupNavAuth();
setActiveNavLink();

if      (page === "home")     initHome();
else if (page === "detail")   initDetail();
else if (page === "saved")    initSaved();
else if (page === "login")        initLogin();
else if (page === "adaptations")  initAdaptations();

function setActiveNavLink() {
  const pageToHref = {
    home:        "index.html",
    detail:      "index.html",
    adaptations: "adaptations.html",
    saved:       "saved.html",
    login:       "login.html",
    roulette:    "roulette.html",
  };
  const target = pageToHref[page];
  if (!target) return;

  document.querySelectorAll(".nav__link").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("nav__link--active", href === target);
  });

  document.querySelectorAll(".login-split__nav-link").forEach((a) => {
    const href = a.getAttribute("href");
    a.classList.toggle("login-split__nav-link--active", href === target);
  });
}

function setupNavAuth() {
  const guestNav  = document.querySelector("#nav-guest");
  const userNav   = document.querySelector("#nav-user");
  const userName  = document.querySelector("#nav-user-name");
  const logoutBtn = document.querySelector("#nav-logout");
  if (!guestNav || !userNav) return;

  const auth = getAuth();
  if (auth) {
    const name = auth.displayName || auth.email.split("@")[0];
    guestNav.hidden = true;
    userNav.hidden  = false;
    if (userName) userName.textContent = name;
  } else {
    guestNav.hidden = false;
    userNav.hidden  = true;
  }

  if (logoutBtn && !logoutBtn.dataset.bound) {
    logoutBtn.dataset.bound = "1";
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      window.location.href = "index.html";
    });
  }
}

function initHome() {
  const form  = document.querySelector("#search-form");
  const input = document.querySelector("#search-input");
  const grid  = document.querySelector("#results");

  function openBook(book) {
    const params = new URLSearchParams({
      key:    book.key,
      title:  book.title,
      author: book.author,
      year:   book.year    || "",
      cover:  book.coverId || "",
    });
    window.location.href = `detail.html?${params.toString()}`;
  }

  async function runSearch(query) {
    const q = query.trim();
    if (!q) {
      showError(grid, "შეიყვანე საძიებო სიტყვა.");
      return;
    }
    saveLastSearch(q);
    grid.innerHTML = `<div class="status status--loading"><span class="spinner"></span>იძებნება „${escapeHtml(q)}"…</div>`;
    try {
      searchResults = await searchBooks(q);
      renderBooks(grid, searchResults, openBook);
    } catch (err) {
      showError(grid, "Open Library-ს ვერ მივწვდით. შეამოწმე ინტერნეტი და სცადე თავიდან.");
      console.error(err);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runSearch(input.value);
  });

  const debouncedSearch = debounce((value) => runSearch(value), 500);
  input.addEventListener("input", (e) => {
    if (e.target.value.trim().length >= 3) debouncedSearch(e.target.value);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      input.value = "";
      grid.innerHTML = "";
    }
  });

  const last = getLastSearch();
  input.value = last;
  runSearch(last || "classic literature");
}

function initDetail() {
  const params = new URLSearchParams(window.location.search);
  const book = {
    key:     params.get("key"),
    title:   params.get("title")  || "უსათაურო",
    author:  params.get("author") || "უცნობი ავტორი",
    year:    params.get("year")   || "",
    coverId: params.get("cover")  || null,
  };

  document.title = `${book.title} — Tabata's Library`;
  document.querySelector("#detail-title").textContent  = book.title;
  document.querySelector("#detail-author").textContent = book.author;

  const cover = document.querySelector("#detail-cover");
  if (book.coverId) {
    cover.src = `https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`;
    cover.alt = `წიგნის ყდა — ${book.title}`;
  } else {
    cover.src = "assets/cover-placeholder.svg";
    cover.alt = `ყდის გარეშე — ${book.title}`;
  }

  const descEl     = document.querySelector("#detail-desc");
  const subjectsEl = document.querySelector("#detail-subjects");

  (async () => {
    if (!book.key) {
      descEl.textContent = "წიგნი ვერ ჩაიტვირთა.";
      return;
    }
    descEl.innerHTML = `<span class="spinner"></span> აღწერა იტვირთება…`;
    try {
      const details = await getBookDetails(book.key);
      descEl.textContent = details.description;
      subjectsEl.innerHTML = "";
      details.subjects.forEach((s) => {
        const li = document.createElement("li");
        li.className = "subjects__tag";
        li.textContent = s;
        subjectsEl.appendChild(li);
      });
    } catch {
      descEl.textContent = "აღწერის ჩატვირთვა ვერ მოხერხდა.";
    }
  })();

  setupShelfBox(book);
  setupFreeRead(book);
}

function setupShelfBox(book) {
  const statusSelect = document.querySelector("#status-select");
  const addBtn       = document.querySelector("#add-btn");
  const feedback     = document.querySelector("#shelf-feedback");

  function refresh() {
    if (isSaved(book.key)) {
      addBtn.textContent = "თაროდან წაშლა";
      addBtn.classList.add("btn--danger");
      statusSelect.disabled = true;
    } else {
      addBtn.textContent = "თაროზე დამატება";
      addBtn.classList.remove("btn--danger");
      statusSelect.disabled = false;
    }
  }

  addBtn.addEventListener("click", () => {
    if (isSaved(book.key)) {
      removeFromShelf(book.key);
      feedback.textContent = "წიგნი თაროდან წაიშალა.";
      feedback.className   = "feedback";
    } else {
      addToShelf(book, statusSelect.value);
      const total = addCounter.add();
      feedback.textContent = `შენახულია! ამ სესიაში ${total} წიგნი დაამატე.`;
      feedback.className   = "feedback feedback--ok";
    }
    refresh();
  });

  statusSelect.addEventListener("change", () => {
    if (!isSaved(book.key)) {
      const label = STATUS_LABELS[statusSelect.value] || statusSelect.value;
      feedback.textContent = `შეინახება როგორც „${label}".`;
      feedback.className   = "feedback";
    }
  });

  refresh();
}

function setupFreeRead(book) {
  const box = document.querySelector("#free-read");
  box.innerHTML = `<p class="form__hint"><span class="spinner"></span> უფასო გამოცემის ძიება…</p>`;

  (async () => {
    try {
      const free = await findFreeRead(book.title);
      box.innerHTML = "";

      if (free) {
        const section = document.createElement("div");
        section.className = "free-read";

        const label = document.createElement("p");
        label.className   = "free-read__label";
        label.textContent = "უფასო საჯარო დომენის გამოცემა ხელმისაწვდომია Project Gutenberg-ზე.";

        const row = document.createElement("div");
        row.className = "free-read__row";

        const extLink = document.createElement("a");
        extLink.className   = "btn";
        extLink.href        = free.readUrl;
        extLink.target      = "_blank";
        extLink.rel         = "noopener noreferrer";
        extLink.textContent = "Gutenberg-ზე გახსნა";

        row.appendChild(extLink);
        section.appendChild(label);
        section.appendChild(row);
        box.appendChild(section);
      }
    } catch (err) {
      const p = document.createElement("p");
      p.className   = "form__hint";
      p.textContent = "Gutenberg-ის შემოწმება ვერ მოხერხდა.";
      box.appendChild(p);
      console.error(err);
    }
  })();
}

function initSaved() {
  if (!isLoggedIn()) {
    window.location.href = "login.html?next=saved.html";
    return;
  }

  const auth    = getAuth();
  const greetEl = document.querySelector("#shelf-greeting-name");
  if (greetEl) greetEl.textContent = auth.displayName || auth.email.split("@")[0];

  const grid       = document.querySelector("#saved-grid");
  const filterBtns = document.querySelectorAll("[data-filter]");
  let   activeFilter = "all";

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      activeFilter = btn.dataset.filter;
      filterBtns.forEach((b) => b.classList.toggle("filter-tab--active", b === btn));
      draw();
    });
  });

  function draw() {
    const shelf   = getShelf();
    const visible = activeFilter === "all" ? shelf : shelf.filter((b) => b.status === activeFilter);

    drawStats(shelf);
    grid.innerHTML = "";

    if (!visible.length) {
      const empty = document.createElement("div");
      empty.className = "empty";

      const title = document.createElement("p");
      title.className   = "empty__title";
      title.textContent = "თარო ცარიელია";

      const hint = document.createElement("p");
      hint.textContent = "ძიების გვერდიდან დაამატე წიგნები თაროზე.";

      const action = document.createElement("a");
      action.className   = "btn empty__action";
      action.href        = "index.html";
      action.textContent = "ძიება";

      empty.appendChild(title);
      empty.appendChild(hint);
      empty.appendChild(action);
      grid.appendChild(empty);
      return;
    }

    visible.forEach((book) => grid.appendChild(buildSavedCard(book, draw)));
  }

  draw();
}

function drawStats(shelf) {
  const counts = { want: 0, reading: 0, read: 0 };
  shelf.forEach((b) => {
    if (counts[b.status] !== undefined) counts[b.status] += 1;
  });
  document.querySelector("#stat-total").textContent   = shelf.length;
  document.querySelector("#stat-want").textContent    = counts.want;
  document.querySelector("#stat-reading").textContent = counts.reading;
  document.querySelector("#stat-read").textContent    = counts.read;
}

function buildDetailUrl(book) {
  const params = new URLSearchParams({
    key:    book.key,
    title:  book.title,
    author: book.author,
    year:   book.year    || "",
    cover:  book.coverId || "",
  });
  return `detail.html?${params.toString()}`;
}

function buildSavedCard(book, onChange) {
  const card = document.createElement("article");
  card.className = "shelf-card";

  const link = document.createElement("a");
  link.className = "shelf-card__link";
  link.href      = buildDetailUrl(book);

  const img = document.createElement("img");
  img.className = "shelf-card__cover";
  img.src       = book.coverId
    ? `https://covers.openlibrary.org/b/id/${book.coverId}-M.jpg`
    : "assets/cover-placeholder.svg";
  img.alt     = book.coverId ? `ყდა — ${book.title}` : `ყდის გარეშე — ${book.title}`;
  img.loading = "lazy";

  const body = document.createElement("div");
  body.className = "shelf-card__body";

  const title = document.createElement("h3");
  title.className   = "shelf-card__title";
  title.textContent = book.title;

  const author = document.createElement("p");
  author.className   = "shelf-card__author";
  author.textContent = book.author;

  const badge = document.createElement("span");
  badge.className   = `shelf-card__badge shelf-card__badge--${book.status}`;
  badge.textContent = STATUS_LABELS[book.status] || book.status;

  body.appendChild(title);
  body.appendChild(author);
  body.appendChild(badge);
  link.appendChild(img);
  link.appendChild(body);

  const actions = document.createElement("div");
  actions.className = "shelf-card__actions";

  const select = document.createElement("select");
  select.className = "select";
  [["want", "გადასაკითხი"], ["reading", "ვკითხულობ"], ["read", "წავიკითხე"]].forEach(([val, label]) => {
    const opt = document.createElement("option");
    opt.value = val;
    opt.textContent = label;
    if (val === book.status) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("click", (e) => e.stopPropagation());
  select.addEventListener("change", (e) => {
    e.stopPropagation();
    updateStatus(book.key, select.value);
    onChange();
  });

  const remove = document.createElement("button");
  remove.className   = "btn btn--danger btn--small";
  remove.textContent = "წაშლა";
  remove.type        = "button";
  remove.addEventListener("click", (e) => {
    e.stopPropagation();
    removeFromShelf(book.key);
    onChange();
  });

  actions.appendChild(select);
  actions.appendChild(remove);

  card.appendChild(link);
  card.appendChild(actions);
  return card;
}

function initLogin() {
  const form        = document.querySelector("#login-form");
  const formWrap    = document.querySelector("#login-form-wrap");
  const loggedPanel = document.querySelector("#logged-in-panel");
  const loggedName  = document.querySelector("#logged-in-name");
  const logoutBtn   = document.querySelector("#logout-btn");
  const feedback    = document.querySelector("#login-feedback");

  const next = new URLSearchParams(window.location.search).get("next") || "index.html";

  function renderLoginState() {
    const auth = getAuth();
    if (auth) {
      if (formWrap)    formWrap.hidden    = true;
      if (form)        form.hidden        = true;
      loggedPanel.hidden = false;
      loggedName.textContent = auth.displayName || auth.email;
      setupNavAuth();
    } else {
      if (formWrap)    formWrap.hidden    = false;
      if (form)        form.hidden        = false;
      loggedPanel.hidden = true;
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      renderLoginState();
      feedback.textContent = "გამოხვედი სისტემიდან.";
      feedback.className   = "feedback";
    });
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const displayName = form.displayName.value.trim();
    const email       = form.email.value.trim();
    const password    = form.password.value;

    if (displayName.length < 2)
      return showFormError(feedback, "სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.");
    if (!email.includes("@"))
      return showFormError(feedback, "შეიყვანე სწორი ელფოსტა.");
    if (password.length < 6)
      return showFormError(feedback, "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.");

    saveAuth({ displayName, email, remember: form.remember.checked, signedInAt: Date.now() });
    feedback.textContent = `გამარჯობა, ${displayName}! გადამისამართება…`;
    feedback.className   = "feedback feedback--ok";
    setTimeout(() => { window.location.href = next; }, 900);
  });

  form.addEventListener("input", () => {
    if (feedback.classList.contains("feedback--err")) {
      feedback.textContent = "";
      feedback.className   = "feedback";
    }
  });

  renderLoginState();
}

function showFormError(el, msg) {
  el.textContent = msg;
  el.className   = "feedback feedback--err";
}

/* ================================================================
   ADAPTATIONS — წიგნის ეკრანიზაციების ძიება
   ================================================================ */

function initAdaptations() {
  const form  = document.querySelector("#adapt-form");
  const input = document.querySelector("#adapt-input");
  const grid  = document.querySelector("#films");
  const picks = document.querySelector("#adapt-picks");

  renderShelfPicks(picks, input, () => runAdaptSearch(input.value));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    runAdaptSearch(input.value);
  });

  const fromUrl = new URLSearchParams(window.location.search).get("book");
  if (fromUrl) {
    input.value = fromUrl;
    runAdaptSearch(fromUrl);
  }
}

function renderShelfPicks(container, input, onSearch) {
  if (!container) return;
  const shelf = getShelf();
  if (!shelf.length) return;

  container.hidden = false;
  shelf.slice(0, 6).forEach((book) => {
    const btn = document.createElement("button");
    btn.className   = "adapt-picks__btn";
    btn.type        = "button";
    btn.textContent = book.title;
    btn.addEventListener("click", () => {
      input.value = book.title;
      onSearch();
    });
    container.appendChild(btn);
  });
}

async function runAdaptSearch(bookTitle) {
  const grid = document.querySelector("#films");
  const q    = bookTitle.trim();
  if (!q) return;

  grid.innerHTML = `<div class="status status--loading"><span class="spinner"></span>ეკრანიზაციების ძიება „${escapeHtml(q)}"…</div>`;

  try {
    const films = await searchFilmAdaptations(q);
    renderFilms(grid, films, q);
  } catch (err) {
    showError(grid, "ფილმების ძიება ვერ მოხერხდა. სცადე თავიდან.");
    console.error(err);
  }
}

function renderFilms(container, films, bookTitle) {
  container.innerHTML = "";

  if (!films.length) {
    const empty = document.createElement("p");
    empty.className   = "empty";
    empty.textContent = `„${bookTitle}"-ის ეკრანიზაცია ვერ მოიძებნა. სცადე სხვა სათაური.`;
    container.appendChild(empty);
    return;
  }

  films.forEach((film) => container.appendChild(buildFilmCard(film)));
}

function buildFilmCard(film) {
  const card = document.createElement("article");
  card.className = "film-card";

  const posterWrap = document.createElement("div");
  posterWrap.className = "film-card__poster-wrap";

  if (film.poster) {
    const img = document.createElement("img");
    img.className = "film-card__poster";
    img.src       = film.poster;
    img.alt       = `პოსტერი — ${film.title}`;
    img.loading   = "lazy";
    posterWrap.appendChild(img);
  } else {
    const placeholder = document.createElement("div");
    placeholder.className   = "film-card__poster-placeholder";
    placeholder.textContent = "🎬";
    posterWrap.appendChild(placeholder);
  }

  card.appendChild(posterWrap);

  const body = document.createElement("div");
  body.className = "film-card__body";

  const title = document.createElement("h3");
  title.className   = "film-card__title";
  title.textContent = film.year ? `${film.title} (${film.year})` : film.title;

  const meta = document.createElement("p");
  meta.className   = "film-card__meta";
  meta.textContent = film.actors || "";

  const desc = document.createElement("p");
  desc.className   = "film-card__desc";
  desc.textContent = film.description;

  body.appendChild(title);
  body.appendChild(meta);
  body.appendChild(desc);

  if (film.imdbUrl) {
    const link = document.createElement("a");
    link.className   = "film-card__link";
    link.href        = film.imdbUrl;
    link.target      = "_blank";
    link.rel         = "noopener noreferrer";
    link.textContent = "IMDb-ზე ნახვა →";
    body.appendChild(link);
  }

  card.appendChild(body);
  return card;
}

