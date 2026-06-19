// detail.js - წიგნის დეტალური გვერდი

import { getBookDetails, findFreeRead } from "./api.js";
import { addToShelf, removeFromShelf, isSaved } from "./storage.js";

const params = new URLSearchParams(window.location.search);
const book = {
  key:     params.get("key"),
  title:   params.get("title")  || "უსათაურო",
  author:  params.get("author") || "უცნობი ავტორი",
  year:    params.get("year")   || "",
  coverId: params.get("cover")  || null
};

const STATUS_LABELS = { want: "გადასაკითხი მაქვს", reading: "ვკითხულობ", read: "უკვე წავიკითხე" };
let addedCount = 0;

document.title = book.title + " — Tabata's Library";
document.querySelector("#detail-title").textContent  = book.title;
document.querySelector("#detail-author").textContent = book.author;

const cover = document.querySelector("#detail-cover");
if (book.coverId) {
  cover.src = "https://covers.openlibrary.org/b/id/" + book.coverId + "-L.jpg";
  cover.alt = "ყდა — " + book.title;
} else {
  cover.src = "assets/cover-placeholder.svg";
  cover.alt = "ყდა არ არის";
}

// აღწერის ჩატვირთვა
const descEl     = document.querySelector("#detail-desc");
const subjectsEl = document.querySelector("#detail-subjects");

(async function() {
  if (!book.key) { descEl.textContent = "წიგნი ვერ ჩაიტვირთა."; return; }
  descEl.innerHTML = `<span class="spinner"></span> იტვირთება…`;
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
    descEl.textContent = "აღწერა ვერ ჩაიტვირთა.";
  }
})();

// თარო
const statusSelect = document.querySelector("#status-select");
const addBtn       = document.querySelector("#add-btn");
const feedback     = document.querySelector("#shelf-feedback");

function refreshShelfBtn() {
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

addBtn.addEventListener("click", function() {
  if (isSaved(book.key)) {
    removeFromShelf(book.key);
    feedback.textContent = "წიგნი თაროდან წაიშალა.";
    feedback.className   = "feedback";
  } else {
    addToShelf(book, statusSelect.value);
    addedCount++;
    feedback.textContent = "შენახულია! სულ " + addedCount + " წიგნი დაამატე.";
    feedback.className   = "feedback feedback--ok";
  }
  refreshShelfBtn();
});

statusSelect.addEventListener("change", function() {
  if (!isSaved(book.key)) {
    const label = STATUS_LABELS[statusSelect.value] || statusSelect.value;
    feedback.textContent = `შეინახება როგორც „${label}".`;
    feedback.className   = "feedback";
  }
});

refreshShelfBtn();

// Gutenberg - უფასო ვერსია
const freeBox = document.querySelector("#free-read");
freeBox.innerHTML = `<p class="form__hint"><span class="spinner"></span> ვეძებ უფასო ვერსიას…</p>`;

(async function() {
  try {
    const free = await findFreeRead(book.title);
    freeBox.innerHTML = "";
    if (free) {
      const div = document.createElement("div");
      div.className = "free-read";
      const p = document.createElement("p");
      p.className   = "free-read__label";
      p.textContent = "უფასო ვერსია ხელმისაწვდომია Project Gutenberg-ზე.";
      const row = document.createElement("div");
      row.className = "free-read__row";
      const a = document.createElement("a");
      a.className = "btn"; a.href = free.readUrl;
      a.target = "_blank"; a.rel = "noopener noreferrer";
      a.textContent = "Gutenberg-ზე გახსნა";
      row.appendChild(a);
      div.appendChild(p); div.appendChild(row);
      freeBox.appendChild(div);
    }
  } catch (e) {
    // ვერ მოიძებნა - ჩუმად ვარჩევ
  }
})();
