// api.js — network calls

const OL_BASE   = "https://openlibrary.org";
const OL_COVERS = "https://covers.openlibrary.org/b/id";
const GUTENDEX  = "https://gutendex.com";
const IMDB_API  = "https://imdb.iamidiotareyoutoo.com";
const WIKI_API  = "https://en.wikipedia.org/api/rest_v1/page/summary";

export async function searchBooks(query) {
  const url =
    `${OL_BASE}/search.json?q=${encodeURIComponent(query)}` +
    `&limit=24&fields=key,title,author_name,first_publish_year,cover_i,edition_count`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library responded with ${res.status}`);
  const data = await res.json();
  return data.docs.map(normaliseBook);
}

function normaliseBook(doc) {
  return {
    key:      doc.key,
    title:    doc.title || "უსათაურო",
    author:   doc.author_name ? doc.author_name[0] : "უცნობი ავტორი",
    year:     doc.first_publish_year || null,
    coverId:  doc.cover_i || null,
    editions: doc.edition_count || 0,
  };
}

export function coverUrl(coverId, size = "M") {
  if (!coverId) return null;
  return `${OL_COVERS}/${coverId}-${size}.jpg`;
}

export async function getBookDetails(workKey) {
  const res = await fetch(`${OL_BASE}${workKey}.json`);
  if (!res.ok) throw new Error(`Could not load book details (${res.status})`);
  const data = await res.json();

  let description = "ამ წიგნისთვის აღწერა არ არის ხელმისაწვდომი.";
  if (typeof data.description === "string") description = data.description;
  else if (data.description?.value) description = data.description.value;

  if (description.length > 600) {
    description = description.slice(0, 597).trimEnd() + "…";
  }

  return {
    title:    data.title || "უსათაურო",
    description,
    subjects: Array.isArray(data.subjects) ? data.subjects.slice(0, 6) : [],
  };
}

export async function findFreeRead(title) {
  const res = await fetch(`${GUTENDEX}/books?search=${encodeURIComponent(title)}`);
  if (!res.ok) throw new Error(`Gutendex responded with ${res.status}`);
  const data = await res.json();
  if (!data.results?.length) return null;

  const book = data.results[0];
  const f    = book.formats || {};
  const readUrl = f["text/html"] || f["text/html; charset=utf-8"]
    || f["text/plain; charset=utf-8"] || f["text/plain"] || null;
  if (!readUrl) return null;

  return { id: book.id, title: book.title, readUrl };
}

/** Search IMDb for film adaptations of a book title. */
export async function searchFilmAdaptations(bookTitle) {
  const res = await fetch(`${IMDB_API}/search?q=${encodeURIComponent(bookTitle)}`);
  if (!res.ok) throw new Error(`IMDb API responded with ${res.status}`);
  const data = await res.json();
  if (!data.ok || !data.description?.length) return [];

  const films = data.description.slice(0, 6).map(normaliseFilm);

  await Promise.all(films.map(async (film) => {
    film.description = await fetchFilmDescription(film.title, film.year, film.actors);
  }));

  return films;
}

function normaliseFilm(item) {
  return {
    title:       item["#TITLE"] || "უსათაურო",
    year:        item["#YEAR"] || null,
    actors:      item["#ACTORS"] || "",
    poster:      item["#IMG_POSTER"] || null,
    imdbUrl:     item["#IMDB_URL"] || null,
    description: "",
  };
}

async function fetchFilmDescription(title, year, actors) {
  const attempts = [];
  if (year) attempts.push(`${title} (${year} film)`);
  attempts.push(`${title} (film)`, title);

  for (const pageTitle of attempts) {
    try {
      const slug = encodeURIComponent(pageTitle.replace(/ /g, "_"));
      const res  = await fetch(`${WIKI_API}/${slug}`);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.extract) {
        const text = data.extract;
        return text.length > 320 ? text.slice(0, 317).trimEnd() + "…" : text;
      }
    } catch { /* try next */ }
  }

  return actors ? `მსახიობები: ${actors}` : "აღწერა ვერ მოიძებნა.";
}
