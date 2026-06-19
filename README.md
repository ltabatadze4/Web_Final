# 📚 Tabata's Library

> პერსონალური წიგნის თარო — ძიება, აღმოჩენა, შენახვა.

ვებ-აპლიკაცია წიგნების მოსაძიებლად, ეკრანიზაციების გასაცნობად და პირადი თაროს სამართავად. აგებულია **სუფთა Vanilla JavaScript-ით** (ES Modules) — ბანდლერის, ფრეიმვორქის და build ინსტრუმენტების გარეშე.

---

## ✨ ფუნქციები

| ფუნქცია | აღწერა |
|---|---|
| 🔍 **წიგნის ძიება** | სახელით, ავტორით ან ISBN-ით (Open Library API), debounce-ით |
| 🎬 **ეკრანიზაციები** | წიგნის სერიის ეკრანული ადაპტაციები IMDb + Wikipedia-დან |
| 🎲 **წიგნის რულეტი** | 3-ნაბიჯიანი ფილტრი ჟანრით, ეპოქით და განწყობით |
| 📖 **დეტალური გვერდი** | ავტორი, გამოცემა, სინოფსისი და უფასო ჩამოტვირთვა Gutenberg-იდან |
| 🗂️ **პირადი თარო** | სტატუსების მინიჭება: *წასაკითხი / ვკითხულობ / წაკითხული* |
| 👤 **ავტორიზაცია** | მარტივი login (localStorage-ზე დაფუძნებული) |
| 🌍 **i18n** | ქართული 🇬🇪 / English 🇬🇧 — გადართვა ნებისმიერ გვერდზე |
| 📱 **რეაგირებადი დიზაინი** | Burger მენიუ მობილური ეკრანისთვის |

---

## 🛠️ ტექნოლოგიები

| კატეგორია | გამოყენებული |
|---|---|
| ენა | Vanilla JavaScript (ES2020+ Modules) |
| სტრუქტურა | Semantic HTML5 |
| სტილი | CSS3 — Custom Properties, Grid, Flexbox |
| შრიფტები | Inter (ტექსტი) + Fraunces (სათაური) |
| მონაცემთა შენახვა | `localStorage` |
| Build tools | არ გამოიყენება — სუფთა ბრაუზერის APIs |

---

## 🔌 API-ები

| API | გამოყენება |
|---|---|
| [Open Library](https://openlibrary.org/developers/api) | წიგნების ძიება, მეტადეტა, ყდა |
| [Gutendex](https://gutendex.com) | Project Gutenberg-ის უფასო ჩამოტვირთვები |
| IMDb (unofficial) | ეკრანიზაციების ძიება |
| [Wikipedia REST](https://en.wikipedia.org/api/rest_v1/) | ფილმების მოკლე აღწერა |

---

## 📁 ფაილების სტრუქტურა

```
tabatas-library/
├── index.html              # მთავარი — წიგნების ძიება
├── adaptations.html        # ეკრანიზაციები
├── roulette.html           # წიგნის რულეტი
├── saved.html              # პირადი თარო
├── detail.html             # წიგნის დეტალური გვერდი
├── login.html              # შესვლა
│
├── css/
│   └── style.css           # გლობალური სტილი (CSS-ცვლადები + ლეიაუთი)
│
├── js/
│   ├── main.js             # nav, auth, burger + dynamic page import
│   ├── api.js              # ყველა API-ს ცენტრალური wrapper
│   ├── storage.js          # localStorage (თარო, auth, ბოლო ძიება)
│   ├── i18n.js             # ქართული/English თარგმანი
│   ├── ui.js               # წიგნის ბარათების რენდერი
│   ├── utils.js            # debounce, escapeHtml
│   ├── home.js             # მთავარი გვერდის ლოგიკა
│   ├── adaptations.js      # ეკრანიზაციების ლოგიკა
│   ├── roulette.js         # რულეტის ლოგიკა
│   ├── saved.js            # თაროს ლოგიკა
│   ├── detail.js           # დეტალური გვერდის ლოგიკა
│   └── login.js            # შესვლის ლოგიკა
│
└── assets/
    ├── logo.svg
    ├── me.png
    ├── cover-placeholder.svg
    └── ekranizaciis.jpg
    ├── loginis_foto.png
    ├── bg-shelf-dark.jpg
    ├── bg-shelf-warm.jpg
    ├── img-laptop-books.png
    ├── img-phone-book.png
    └── biblioteka.jpg
```

---

## 🚀 გაშვება

პროექტი ES Modules-ს იყენებს — **`file://` პროტოკოლი არ მუშაობს** CORS-ის გამო. ჩართე ლოკალური სერვერი:

**VS Code Live Server (პირველი არჩევანი)**
```
დააინსტალირე "Live Server" გაფართოება → click index.html → "Open with Live Server"
```

**Python**
```bash
python -m http.server 8000
# გახსენი http://localhost:8000
```

**Node**
```bash
npx serve
```

---

## 💾 localStorage გასაღებები

| Key | შინაარსი |
|---|---|
| `tabata_library_shelf` | შენახული წიგნები სტატუსებით |
| `tabata_library_auth` | ავტორიზებული მომხმარებლის სესია |
| `tabata_library_last_search` | ბოლო საძიებო სიტყვა |
| `tl-lang` | ენის პარამეტრი (`ka` / `en`) |

> ⚠️ ყველა მონაცემი **ლოკალური და კერძოა** — სერვერზე არ იგზავნება. გასუფთავება: DevTools → Application → Local Storage.

---

## 🌍 i18n — ახალი გასაღების დამატება

ახალი სტრიქონი `i18n.js`-ში:

```js
"my.new.key": { ka: "ქართული ტექსტი", en: "English text" }
```

HTML-ში:

```html
<h1 data-i18n="my.new.key">ქართული ტექსტი</h1>
```

ხელმისაწვდომი ატრიბუტები: `data-i18n` (ტექსტი) · `data-i18n-html` (HTML) · `data-i18n-placeholder` · `data-i18n-title`

---

## ⚙️ არქიტექტურა

`main.js` — ყველა HTML გვერდის ერთადერთი entry point. ის კითხულობს `<body data-page="...">` ატრიბუტს და dynamic import-ით ჩართავს შესაბამის მოდულს:

```js
const PAGE_MODULES = {
  home:        "./home.js",
  adaptations: "./adaptations.js",
  saved:       "./saved.js",
  roulette:    "./roulette.js",
  detail:      "./detail.js",
  login:       "./login.js"
};
if (PAGE_MODULES[page]) import(PAGE_MODULES[page]);
```

ამის წყალობით, მხოლოდ საჭირო გვერდის კოდი იტვირთება.

---
