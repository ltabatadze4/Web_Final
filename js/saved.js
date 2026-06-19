// saved.js - შენახული წიგნების გვერდი

import { getShelf, removeFromShelf, updateStatus, isLoggedIn, getAuth } from "./storage.js";

if (!isLoggedIn()) {
  window.location.href = "login.html?next=saved.html";
  throw new Error("login required");
}

const STATUS_LABELS = { want: "გადასაკითხი", reading: "ვკითხულობ", read: "წავიკითხე" };

const auth    = getAuth();
const greetEl = document.querySelector("#shelf-greeting-name");
if (greetEl) greetEl.textContent = auth.displayName || auth.email.split("@")[0];

const grid       = document.querySelector("#saved-grid");
const filterBtns = document.querySelectorAll("[data-filter]");
let activeFilter = "all";

for (let i = 0; i < filterBtns.length; i++) {
  filterBtns[i].addEventListener("click", function() {
    activeFilter = this.dataset.filter;
    for (let j = 0; j < filterBtns.length; j++) filterBtns[j].classList.remove("filter-tab--active");
    this.classList.add("filter-tab--active");
    draw();
  });
}

function drawStats(shelf) {
  let want = 0, reading = 0, read = 0;
  for (let i = 0; i < shelf.length; i++) {
    if (shelf[i].status === "want")    want++;
    if (shelf[i].status === "reading") reading++;
    if (shelf[i].status === "read")    read++;
  }
  document.querySelector("#stat-total").textContent   = shelf.length;
  document.querySelector("#stat-want").textContent    = want;
  document.querySelector("#stat-reading").textContent = reading;
  document.querySelector("#stat-read").textContent    = read;
}

function buildCard(book) {
  const card = document.createElement("article");
  card.className = "shelf-card";

  const link = document.createElement("a");
  link.className = "shelf-card__link";
  link.href = "detail.html?" + new URLSearchParams({
    key: book.key, title: book.title, author: book.author,
    year: book.year || "", cover: book.coverId || ""
  }).toString();

  const img = document.createElement("img");
  img.className = "shelf-card__cover"; img.loading = "lazy";
  img.src = book.coverId
    ? "https://covers.openlibrary.org/b/id/" + book.coverId + "-M.jpg"
    : "assets/cover-placeholder.svg";
  img.alt = book.title;

  const body = document.createElement("div");
  body.className = "shelf-card__body";
  const h3 = document.createElement("h3");
  h3.className = "shelf-card__title"; h3.textContent = book.title;
  const p = document.createElement("p");
  p.className = "shelf-card__author"; p.textContent = book.author;
  const badge = document.createElement("span");
  badge.className = "shelf-card__badge shelf-card__badge--" + book.status;
  badge.textContent = STATUS_LABELS[book.status] || book.status;
  body.appendChild(h3); body.appendChild(p); body.appendChild(badge);
  link.appendChild(img); link.appendChild(body);

  const actions = document.createElement("div");
  actions.className = "shelf-card__actions";

  const select = document.createElement("select");
  select.className = "select";
  [["want","გადასაკითხი"],["reading","ვკითხულობ"],["read","წავიკითხე"]].forEach(function(o) {
    const opt = document.createElement("option");
    opt.value = o[0]; opt.textContent = o[1];
    if (o[0] === book.status) opt.selected = true;
    select.appendChild(opt);
  });
  select.addEventListener("click",  function(e) { e.stopPropagation(); });
  select.addEventListener("change", function(e) { e.stopPropagation(); updateStatus(book.key, select.value); draw(); });

  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn--danger btn--small";
  removeBtn.textContent = "წაშლა"; removeBtn.type = "button";
  removeBtn.addEventListener("click", function(e) { e.stopPropagation(); removeFromShelf(book.key); draw(); });

  actions.appendChild(select); actions.appendChild(removeBtn);
  card.appendChild(link); card.appendChild(actions);
  return card;
}

function draw() {
  const shelf   = getShelf();
  const visible = activeFilter === "all"
    ? shelf
    : shelf.filter(function(b) { return b.status === activeFilter; });

  drawStats(shelf);
  grid.innerHTML = "";

  if (visible.length === 0) {
    const div = document.createElement("div");
    div.className = "empty";
    div.innerHTML = '<p class="empty__title">თარო ცარიელია</p><p>ძიებიდან დაამატე წიგნები.</p><a class="btn empty__action" href="index.html">ძიება</a>';
    grid.appendChild(div);
    return;
  }
  for (let i = 0; i < visible.length; i++) grid.appendChild(buildCard(visible[i]));
}

draw();
