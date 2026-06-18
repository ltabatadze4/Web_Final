// roulette.js - შემთხვევითი წიგნის შეთავაზება

const OL_BASE     = "https://openlibrary.org";
const OL_COVERS   = "https://covers.openlibrary.org/b/id";
const PLACEHOLDER = "assets/cover-placeholder.svg";

const SUBJECT_MAP = {
  any:        "fiction",
  fantasy:    "fantasy",
  mystery:    "mystery_and_detective_stories",
  romance:    "romance",
  historical: "historical_fiction",
  philosophy: "philosophy",
  adventure:  "adventure_stories"
};

const MOOD_SUBJECT_MAP = {
  fun:       "humorous_stories",
  emotional: "love_stories"
};

const GENRE_LABELS = {
  any:        "წიგნი",
  fantasy:    "ფანტასტიკა",
  mystery:    "კრიმინალი",
  romance:    "სიყვარული",
  historical: "ისტორიული",
  philosophy: "ფილოსოფია",
  adventure:  "სათავგადასავლო"
};

function buildSubject(genre, mood) {
  if (genre !== "any") {
    return SUBJECT_MAP[genre] || "fiction";
  }
  return MOOD_SUBJECT_MAP[mood] || "fiction";
}

async function fetchBooks(subject, era) {
  const offset = Math.floor(Math.random() * 8) * 20;
  const url = OL_BASE + "/subjects/" + subject + ".json?limit=40&offset=" + offset;

  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  const data = await res.json();

  let works = data.works || [];

  if (era === "classic") {
    const filtered = [];
    for (let i = 0; i < works.length; i++) {
      if (works[i].first_publish_year && works[i].first_publish_year <= 1950) {
        filtered.push(works[i]);
      }
    }
    works = filtered;
  }
  if (era === "modern") {
    const filtered = [];
    for (let i = 0; i < works.length; i++) {
      if (works[i].first_publish_year && works[i].first_publish_year > 1950) {
        filtered.push(works[i]);
      }
    }
    works = filtered;
  }

  // ჯერ ვაკეთებთ ყდის მქონე წიგნებს
  const withCover    = [];
  const withoutCover = [];
  for (let i = 0; i < works.length; i++) {
    if (works[i].cover_id) {
      withCover.push(works[i]);
    } else {
      withoutCover.push(works[i]);
    }
  }

  return withCover.concat(withoutCover);
}

async function fetchDescription(workKey) {
  try {
    const res = await fetch(OL_BASE + workKey + ".json");
    if (!res.ok) return null;
    const data = await res.json();

    let desc = null;
    if (typeof data.description === "string") {
      desc = data.description;
    } else if (data.description && data.description.value) {
      desc = data.description.value;
    }

    if (desc && desc.length > 450) {
      desc = desc.slice(0, 447) + "…";
    }
    return desc;
  } catch (e) {
    return null;
  }
}

function buildDetailUrl(work) {
  let author = "უცნობი ავტორი";
  if (work.authors && work.authors[0] && work.authors[0].name) {
    author = work.authors[0].name;
  }

  const params = new URLSearchParams({
    key:    work.key,
    title:  work.title,
    author: author,
    year:   work.first_publish_year || "",
    cover:  work.cover_id           || ""
  });
  return "detail.html?" + params.toString();
}

// გვერდის ელემენტები
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
  let author = "უცნობი ავტორი";
  if (work.authors && work.authors[0] && work.authors[0].name) {
    author = work.authors[0].name;
  }

  const coverImg = cardEl.querySelector(".rq-book__cover");
  if (work.cover_id) {
    coverImg.src = OL_COVERS + "/" + work.cover_id + "-L.jpg";
    coverImg.alt = "ყდა — " + work.title;
  } else {
    coverImg.src = PLACEHOLDER;
    coverImg.alt = "ყდის გარეშე — " + work.title;
  }

  cardEl.querySelector("#rq-genre-tag").textContent  = GENRE_LABELS[genre] || "წიგნი";
  cardEl.querySelector("#rq-book-title").textContent = work.title;

  let meta = author;
  if (work.first_publish_year) {
    meta = meta + " · " + work.first_publish_year;
  }
  cardEl.querySelector("#rq-book-meta").textContent = meta;
  cardEl.querySelector("#rq-book-desc").textContent = "აღწერა იტვირთება…";
  cardEl.querySelector("#rq-detail-link").href      = buildDetailUrl(work);

  idleEl.hidden    = true;
  loadingEl.hidden = true;
  cardEl.hidden    = false;

  fetchDescription(work.key).then(function(desc) {
    if (desc) {
      cardEl.querySelector("#rq-book-desc").textContent = desc;
    } else {
      cardEl.querySelector("#rq-book-desc").textContent = "ამ წიგნისთვის აღწერა ვერ მოიძებნა.";
    }
  });
}

async function spin() {
  const genreInput = document.querySelector('input[name="genre"]:checked');
  const moodInput  = document.querySelector('input[name="mood"]:checked');
  const eraInput   = document.querySelector('input[name="era"]:checked');

  const genre = genreInput ? genreInput.value : "any";
  const mood  = moodInput  ? moodInput.value  : "any";
  const era   = eraInput   ? eraInput.value   : "any";

  const subject = buildSubject(genre, mood);

  showLoading();
  spinBtn.disabled = true;
  spinBtn.classList.add("rq-spin-btn--loading");
  if (spinBtnR) spinBtnR.disabled = true;

  try {
    const works = await fetchBooks(subject, era);

    if (works.length === 0) {
      showIdle("ამ ფილტრებით წიგნი ვერ მოიძებნა — სცადე სხვა კომბინაცია.");
      return;
    }

    const randomIndex = Math.floor(Math.random() * works.length);
    showBook(works[randomIndex], genre);
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
