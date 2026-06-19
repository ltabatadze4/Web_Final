// roulette.js - შემთხვევითი წიგნის შეთავაზება

const OL     = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org/b/id";

const GENRES = {
  any:        { subject: "fiction",                    label: "წიგნი" },
  fantasy:    { subject: "fantasy",                    label: "ფანტასტიკა" },
  mystery:    { subject: "mystery_and_detective_stories", label: "კრიმინალი" },
  romance:    { subject: "romance",                    label: "სიყვარული" },
  historical: { subject: "historical_fiction",         label: "ისტორიული" },
  philosophy: { subject: "philosophy",                 label: "ფილოსოფია" },
  adventure:  { subject: "adventure_stories",          label: "სათავგადასავლო" }
};

const MOOD_SUBJECT = { fun: "humorous_stories", emotional: "love_stories" };

async function fetchBooks(genre, mood, era) {
  let subject = GENRES[genre] ? GENRES[genre].subject : "fiction";
  if (genre === "any" && MOOD_SUBJECT[mood]) subject = MOOD_SUBJECT[mood];

  const offset = Math.floor(Math.random() * 8) * 20;
  const res    = await fetch(OL + "/subjects/" + subject + ".json?limit=40&offset=" + offset);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data   = await res.json();
  let works    = data.works || [];

  if (era === "classic") works = works.filter(function(w) { return w.first_publish_year && w.first_publish_year <= 1950; });
  if (era === "modern")  works = works.filter(function(w) { return w.first_publish_year && w.first_publish_year > 1950; });

  const withCover    = works.filter(function(w) { return  w.cover_id; });
  const withoutCover = works.filter(function(w) { return !w.cover_id; });
  return withCover.concat(withoutCover);
}

async function fetchDescription(workKey) {
  try {
    const res  = await fetch(OL + workKey + ".json");
    if (!res.ok) return null;
    const data = await res.json();
    let desc   = typeof data.description === "string" ? data.description : (data.description && data.description.value) || null;
    if (desc && desc.length > 450) desc = desc.slice(0, 447) + "…";
    return desc;
  } catch (e) { return null; }
}

// გვერდის ელემენტები
const idleEl     = document.getElementById("rq-idle");
const idleMsgEl  = document.getElementById("rq-idle-msg");
const loadingEl  = document.getElementById("rq-loading");
const cardEl     = document.getElementById("rq-card");
const spinBtn    = document.getElementById("rq-spin-btn");
const anotherBtn = document.getElementById("rq-another-btn");

function showIdle(msg) {
  if (msg) idleMsgEl.textContent = msg;
  idleEl.hidden = false; loadingEl.hidden = true; cardEl.hidden = true;
}

function showLoading() {
  idleEl.hidden = true; loadingEl.hidden = false; cardEl.hidden = true;
}

function showBook(work, genre) {
  let author = "უცნობი ავტორი";
  if (work.authors && work.authors[0]) author = work.authors[0].name || author;

  const coverImg = cardEl.querySelector(".rq-book__cover");
  if (work.cover_id) {
    coverImg.src = COVERS + "/" + work.cover_id + "-L.jpg";
    coverImg.alt = "ყდა — " + work.title;
  } else {
    coverImg.src = "assets/cover-placeholder.svg";
    coverImg.alt = work.title;
  }

  cardEl.querySelector("#rq-genre-tag").textContent  = GENRES[genre] ? GENRES[genre].label : "წიგნი";
  cardEl.querySelector("#rq-book-title").textContent = work.title;
  cardEl.querySelector("#rq-book-meta").textContent  = author + (work.first_publish_year ? " · " + work.first_publish_year : "");
  cardEl.querySelector("#rq-book-desc").textContent  = "იტვირთება…";
  cardEl.querySelector("#rq-detail-link").href = "detail.html?" + new URLSearchParams({
    key: work.key, title: work.title, author: author,
    year: work.first_publish_year || "", cover: work.cover_id || ""
  }).toString();

  idleEl.hidden = true; loadingEl.hidden = true; cardEl.hidden = false;

  fetchDescription(work.key).then(function(desc) {
    cardEl.querySelector("#rq-book-desc").textContent = desc || "ამ წიგნისთვის აღწერა ვერ მოიძებნა.";
  });
}

async function spin() {
  const genreInput = document.querySelector('input[name="genre"]:checked');
  const moodInput  = document.querySelector('input[name="mood"]:checked');
  const eraInput   = document.querySelector('input[name="era"]:checked');

  const genre = genreInput ? genreInput.value : "any";
  const mood  = moodInput  ? moodInput.value  : "any";
  const era   = eraInput   ? eraInput.value   : "any";

  showLoading();
  spinBtn.disabled = true;
  spinBtn.classList.add("rq-spin-btn--loading");

  try {
    const works = await fetchBooks(genre, mood, era);
    if (works.length === 0) {
      showIdle("ამ ფილტრებით წიგნი ვერ მოიძებნა — სცადე სხვა კომბინაცია.");
      return;
    }
    showBook(works[Math.floor(Math.random() * works.length)], genre);
  } catch (err) {
    console.error(err);
    showIdle("Open Library-ს ვერ მივწვდით. შეამოწმე ინტერნეტ კავშირი.");
  } finally {
    spinBtn.disabled = false;
    spinBtn.classList.remove("rq-spin-btn--loading");
  }
}

spinBtn.addEventListener("click", spin);
anotherBtn.addEventListener("click", spin);
