// api.js - გარე სერვისებიდან მონაცემების მოტანა

const OL_BASE   = "https://openlibrary.org";
const OL_COVERS = "https://covers.openlibrary.org/b/id";
const GUTENDEX  = "https://gutendex.com";
const IMDB_API  = "https://imdb.iamidiotareyoutoo.com";
const WIKI_API  = "https://en.wikipedia.org/api/rest_v1/page/summary";

export async function searchBooks(query) {
  const url = OL_BASE + "/search.json?q=" + encodeURIComponent(query) +
    "&limit=24&fields=key,title,author_name,first_publish_year,cover_i,edition_count";
  const res  = await fetch(url);
  if (!res.ok) throw new Error("Open Library error: " + res.status);
  const data = await res.json();
  const books = [];
  for (let i = 0; i < data.docs.length; i++) {
    const doc = data.docs[i];
    books.push({
      key:      doc.key,
      title:    doc.title || "უსათაურო",
      author:   doc.author_name ? doc.author_name[0] : "უცნობი ავტორი",
      year:     doc.first_publish_year || null,
      coverId:  doc.cover_i || null,
      editions: doc.edition_count || 0
    });
  }
  return books;
}

export function coverUrl(coverId, size) {
  if (!coverId) return null;
  if (!size) size = "M";
  return OL_COVERS + "/" + coverId + "-" + size + ".jpg";
}

export async function getBookDetails(workKey) {
  const res  = await fetch(OL_BASE + workKey + ".json");
  if (!res.ok) throw new Error("დეტალები ვერ ჩაიტვირთა: " + res.status);
  const data = await res.json();
  let description = "ამ წიგნისთვის აღწერა არ არის ხელმისაწვდომი.";
  if (typeof data.description === "string") {
    description = data.description;
  } else if (data.description && data.description.value) {
    description = data.description.value;
  }
  if (description.length > 600) description = description.slice(0, 597) + "…";
  return {
    title:       data.title || "უსათაურო",
    description: description,
    subjects:    Array.isArray(data.subjects) ? data.subjects.slice(0, 6) : []
  };
}

export async function findFreeRead(title) {
  const res  = await fetch(GUTENDEX + "/books?search=" + encodeURIComponent(title));
  if (!res.ok) throw new Error("Gutendex error: " + res.status);
  const data = await res.json();
  if (!data.results || data.results.length === 0) return null;
  const book    = data.results[0];
  const formats = book.formats || {};
  const readUrl = formats["text/html"] || formats["text/html; charset=utf-8"]
    || formats["text/plain; charset=utf-8"] || formats["text/plain"] || null;
  if (!readUrl) return null;
  return { id: book.id, title: book.title, readUrl: readUrl };
}

export async function searchFilmAdaptations(bookTitle) {
  const res  = await fetch(IMDB_API + "/search?q=" + encodeURIComponent(bookTitle));
  if (!res.ok) throw new Error("IMDb error: " + res.status);
  const data = await res.json();
  if (!data.ok || !data.description || data.description.length === 0) return [];
  const list  = data.description.slice(0, 6);
  const films = [];
  for (let i = 0; i < list.length; i++) {
    const item = list[i];
    films.push({
      title:       item["#TITLE"]      || "უსათაურო",
      year:        item["#YEAR"]       || null,
      actors:      item["#ACTORS"]     || "",
      poster:      item["#IMG_POSTER"] || null,
      imdbUrl:     item["#IMDB_URL"]   || null,
      description: ""
    });
  }
  for (let j = 0; j < films.length; j++) {
    films[j].description = await getFilmDescription(films[j].title, films[j].year, films[j].actors);
  }
  return films;
}

async function getFilmDescription(title, year, actors) {
  const searches = year ? [title + " (" + year + " film)", title + " (film)", title] : [title + " (film)", title];
  for (let i = 0; i < searches.length; i++) {
    try {
      const slug = encodeURIComponent(searches[i].replace(/ /g, "_"));
      const res  = await fetch(WIKI_API + "/" + slug);
      if (!res.ok) continue;
      const data = await res.json();
      if (data.extract) {
        let text = data.extract;
        if (text.length > 320) text = text.slice(0, 317) + "…";
        return text;
      }
    } catch (e) { /* ვცდი შემდეგ ვარიანტს */ }
  }
  return actors ? "მსახიობები: " + actors : "აღწერა ვერ მოიძებნა.";
}
