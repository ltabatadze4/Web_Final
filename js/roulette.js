// roulette.js — ბედის ბორბალი page logic

const OL_BASE   = "https://openlibrary.org";
const OL_COVERS = "https://covers.openlibrary.org/b/id";
const PLACEHOLDER = "assets/cover-placeholder.svg";

const SUBJECT_MAP = {
  any:        "fiction",
  fantasy:    "fantasy",
  mystery:    "mystery_and_detective_stories",
  romance:    "romance",
  historical: "historical_fiction",
  philosophy: "philosophy",
  adventure:  "adventure_stories",
};

const MOOD_SUBJECT_MAP = {
  fun:       "humorous_stories",
  emotional: "love_stories",
};

const GENRE_LABELS = {
  any:        "წიგნი",
  fantasy:    "ფანტასტიკა",
  mystery:    "კრიმინალი",
  romance:    "სიყვარული",
  historical: "ისტორიული",
  philosophy: "ფილოსოფია",
  adventure:  "სათავგადასავლო",
};

function buildSubject(genre, mood) {
  if (genre !== "any") return SUBJECT_MAP[genre] || "fiction";
  return MOOD_SUBJECT_MAP[mood] || "fiction";
}

async function fetchBooks(subject, era) {
  const offset = Math.floor(Math.random() * 8) * 20;
  const url = `${OL_BASE}/subjects/${subject}.json?limit=40&offset=${offset}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();

  let works = data.works || [];

  if (era === "classic") works = works.filter(w => w.first_publish_year && w.first_publish_year <= 1950);
  if (era === "modern")  works = works.filter(w => w.first_publish_year && w.first_publish_year > 1950);

  // Prefer books with covers but don't require them
  const withCover    = works.filter(w => w.cover_id);
  const withoutCover = works.filter(w => !w.cover_id);
  return [...withCover, ...withoutCover];
}

async function fetchDescription(workKey) {
  try {
    const res = await fetch(`${OL_BASE}${workKey}.json`);
    if (!res.ok) return null;
    const data = await res.json();
    let desc = null;
    if (typeof data.description === "string") desc = data.description;
    else if (data.description?.value) desc = data.description.value;
    if (desc && desc.length > 450) desc = desc.slice(0, 447).trimEnd() + "…";
    return desc;
  } catch {
    return null;
  }
}

function coverUrl(coverId) {
  return `${OL_COVERS}/${coverId}-L.jpg`;
}

function buildDetailUrl(work) {
  const author = work.authors?.[0]?.name || "უცნობი ავტორი";
  const params = new URLSearchParams({
    key:    work.key,
    title:  work.title,
    author,
    year:   work.first_publish_year || "",
    cover:  work.cover_id || "",
  });
  return `detail.html?${params.toString()}`;
}

// ── UI references ──────────────────────────────────────────────
const idleEl     = document.getElementById("rq-idle");
const idleMsgEl  = document.getElementById("rq-idle-msg");
const loadingEl  = document.getElementById("rq-loading");
const cardEl     = document.getElementById("rq-card");
const spinBtn    = document.getElementById("rq-spin-btn");
const spinBtnR   = document.getElementById("rq-spin-btn-r");
const anotherBtn = document.getElementById("rq-another-btn");

function showIdle(msg) {
  if (msg) idleMsgEl.textContent = msg;
  idleEl.hidden    = false;
  loadingEl.hidden = true;
  cardEl.hidden    = true;
}

function showLoading() {
  idleEl.hidden    = true;
  loadingEl.hidden = false;
  cardEl.hidden    = true;
}

function showBook(work, genre) {
  const author = work.authors?.[0]?.name || "უცნობი ავტორი";

  const coverImg = cardEl.querySelector(".rq-book__cover");
  if (work.cover_id) {
    coverImg.src = coverUrl(work.cover_id);
    coverImg.alt = `ყდა — ${work.title}`;
  } else {
    coverImg.src = PLACEHOLDER;
    coverImg.alt = `ყდის გარეშე — ${work.title}`;
  }

  cardEl.querySelector("#rq-genre-tag").textContent  = GENRE_LABELS[genre] || "წიგნი";
  cardEl.querySelector("#rq-book-title").textContent = work.title;
  cardEl.querySelector("#rq-book-meta").textContent  =
    author + (work.first_publish_year ? ` · ${work.first_publish_year}` : "");
  cardEl.querySelector("#rq-book-desc").textContent  = "აღწერა იტვირთება…";
  cardEl.querySelector("#rq-detail-link").href       = buildDetailUrl(work);

  idleEl.hidden    = true;
  loadingEl.hidden = true;
  cardEl.hidden    = false;

  // Async description load
  fetchDescription(work.key).then(desc => {
    cardEl.querySelector("#rq-book-desc").textContent =
      desc || "ამ წიგნისთვის აღწერა ვერ მოიძებნა.";
  });
}

// ── Main spin logic ────────────────────────────────────────────
async function spin() {
  const genre = document.querySelector('input[name="genre"]:checked')?.value || "any";
  const mood  = document.querySelector('input[name="mood"]:checked')?.value  || "any";
  const era   = document.querySelector('input[name="era"]:checked')?.value   || "any";

  const subject = buildSubject(genre, mood);

  showLoading();
  spinBtn.disabled = true;
  spinBtn.classList.add("rq-spin-btn--loading");
  if (spinBtnR) spinBtnR.disabled = true;

  try {
    const works = await fetchBooks(subject, era);

    if (!works.length) {
      showIdle("ამ ფილტრებით წიგნი ვერ მოიძებნა — სცადე სხვა კომბინაცია.");
      return;
    }

    const work = works[Math.floor(Math.random() * works.length)];
    showBook(work, genre);
  } catch (err) {
    console.error(err);
    showIdle("Open Library-ს ვერ მივწვდით. შეამოწმე ინტერნეტ კავშირი.");
  } finally {
    spinBtn.disabled = false;
    spinBtn.classList.remove("rq-spin-btn--loading");
    if (spinBtnR) spinBtnR.disabled = false;
  }
}

spinBtn.addEventListener("click", spin);
anotherBtn.addEventListener("click", spin);
if (spinBtnR) spinBtnR.addEventListener("click", spin);
