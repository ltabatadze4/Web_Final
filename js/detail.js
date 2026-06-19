// detail.js - წიგნის დეტალური გვერდი

import { getBookDetails, findFreeRead } from "./api.js";
import { addToShelf, removeFromShelf, isSaved } from "./storage.js";
import { t } from "./i18n.js";

const params = new URLSearchParams(window.location.search);
const book = {
  key:     params.get("key"),
  title:   params.get("title")  || t("js.detail.unknown.title"),
  author:  params.get("author") || t("js.detail.unknown.author"),
  year:    params.get("year")   || "",
  coverId: params.get("cover")  || null
};

function getStatusLabel(s) { return t("detail.status." + s) || s; }
let addedCount = 0;

document.title = book.title + " — Tabata's Library";
document.querySelector("#detail-title").textContent  = book.title;
document.querySelector("#detail-author").textContent = book.author;

const cover = document.querySelector("#detail-cover");
if (book.coverId) {
  cover.src = "https://covers.openlibrary.org/b/id/" + book.coverId + "-L.jpg";
  cover.alt = book.title;
} else {
  cover.src = "assets/cover-placeholder.svg";
  cover.alt = book.title;
}

// აღწერის ჩატვირთვა
const descEl     = document.querySelector("#detail-desc");
const subjectsEl = document.querySelector("#detail-subjects");

(async function() {
  if (!book.key) { descEl.textContent = t("js.detail.loading"); return; }
  descEl.innerHTML = `<span class="spinner"></span> ${t("js.roulette.loading.desc")}`;
  try {
    const d = await getBookDetails(book.key);
    descEl.textContent = d.description;
    for (let i = 0; i < d.subjects.length; i++) {
      const li = document.createElement("li");
      li.className = "subjects__tag";
      li.textContent = d.subjects[i];
      subjectsEl.appendChild(li);
    }
  } catch (e) {
    descEl.textContent = t("js.detail.desc.error");
  }
})();

// თარო
const statusSelect = document.querySelector("#status-select");
const addBtn       = document.querySelector("#add-btn");
const feedback     = document.querySelector("#shelf-feedback");

function refreshShelfBtn() {
  if (isSaved(book.key)) {
    addBtn.textContent = t("js.detail.remove.btn");
    addBtn.classList.add("btn--danger");
    statusSelect.disabled = true;
  } else {
    addBtn.textContent = t("js.detail.add.btn");
    addBtn.classList.remove("btn--danger");
    statusSelect.disabled = false;
  }
}

addBtn.addEventListener("click", function() {
  if (isSaved(book.key)) {
    removeFromShelf(book.key);
    feedback.textContent = t("js.detail.remove.feedback");
    feedback.className   = "feedback";
  } else {
    addToShelf(book, statusSelect.value);
    addedCount++;
    feedback.textContent = t("js.detail.add.feedback", { count: addedCount });
    feedback.className   = "feedback feedback--ok";
  }
  refreshShelfBtn();
});

statusSelect.addEventListener("change", function() {
  if (!isSaved(book.key)) {
    feedback.textContent = t("js.detail.will.save", { label: getStatusLabel(statusSelect.value) });
    feedback.className   = "feedback";
  }
});

refreshShelfBtn();

// Gutenberg - უფასო ვერსია
const freeBox = document.querySelector("#free-read");
freeBox.innerHTML = `<p class="form__hint"><span class="spinner"></span> ${t("js.detail.free.searching")}</p>`;

(async function() {
  try {
    const free = await findFreeRead(book.title);
    freeBox.innerHTML = "";
    if (free) {
      const div = document.createElement("div");
      div.className = "free-read";
      const p = document.createElement("p");
      p.className   = "free-read__label";
      p.textContent = t("js.detail.free.available");
      const row = document.createElement("div");
      row.className = "free-read__row";
      const a = document.createElement("a");
      a.className = "btn"; a.href = free.readUrl;
      a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = t("js.detail.free.open");
      row.appendChild(a);
      div.appendChild(p); div.appendChild(row);
      freeBox.appendChild(div);
    }
  } catch (e) {
    // ვერ მოიძებნა - ჩუმად ვარჩევ
  }
})();
