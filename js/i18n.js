// i18n.js - ქართული / ინგლისური ენის გადამრთველი

const TRANSLATIONS = {
  ka: {
    "nav.search":       "ძიება",
    "nav.adaptations":  "ეკრანიზაციები",
    "nav.roulette":     "ბედის ბორბალი",
    "nav.library":      "ჩემი ბიბლიოთეკა",
    "nav.login":        "შესვლა",
    "nav.logout":       "გასვლა",
    "nav.menu":         "მენიუ",
    "nav.lang":         "EN",

    "home.hero":                'მოძებნე მილიონობით წიგნი Open Library-ის საშუალებით. <br /><em>შეინახე ფავორიტები პირად თაროზე.</em>',
    "home.search.label":        "ძიება სათაურით, ავტორით ან თემით",
    "home.search.placeholder":  "სათაური, ავტორი ან თემა…",
    "home.search.btn":          "ძიება",

    "adapt.hero.title":         "ეკრანიზაციები",
    "adapt.hero.sub":           "შეიყვანე წიგნის სათაური და ნახე შესაბამისი ფილმები აღწერით.",
    "adapt.search.placeholder": "მაგ. Pride and Prejudice, Harry Potter…",
    "adapt.search.btn":         "ძიება",

    "saved.hero.title":         "ჩემი ბიბლიოთეკა",
    "saved.greeting.before":    "გამარჯობა, ",
    "saved.greeting.after":     " — აქ არის შენი შენახული წიგნები.",
    "saved.stats.total":        "სულ",
    "saved.stats.want":         "გადასაკითხი",
    "saved.stats.reading":      "ვკითხულობ",
    "saved.stats.read":         "წავიკითხე",
    "saved.filter.all":         "ყველა",
    "saved.filter.want":        "გადასაკითხი",
    "saved.filter.reading":     "ვკითხულობ",
    "saved.filter.read":        "წავიკითხე",

    "roulette.hero.title":      "ბედის ბორბალი",
    "roulette.hero.sub":        "უპასუხე 3 კითხვას — ჩვენ შენთვის სრულყოფილ წიგნს ავარჩევთ",
    "roulette.quiz.title":      "შენი გემოვნება",
    "roulette.genre.label":     "რა ჟანრი გიყვარს?",
    "roulette.genre.any":       "ნებისმიერი",
    "roulette.genre.fantasy":   "ფანტასტიკა",
    "roulette.genre.mystery":   "კრიმინალი",
    "roulette.genre.romance":   "სასიყვარულო",
    "roulette.genre.historical":"ისტორიული",
    "roulette.genre.philosophy":"ფილოსოფია",
    "roulette.genre.adventure": "სათავგადასავლო",
    "roulette.mood.label":      "რა განწყობა გაქვს?",
    "roulette.mood.any":        "არაფერი განსაკუთრებული",
    "roulette.mood.fun":        "კაი ხასიათზე ვარ",
    "roulette.mood.serious":    "ცოტა მოწყენილი ვარ",
    "roulette.mood.emotional":  "ემოციებში ვარ",
    "roulette.era.label":       "რომელი ეპოქა?",
    "roulette.era.any":         "ნებისმიერი",
    "roulette.era.classic":     "კლასიკური (–1950)",
    "roulette.era.modern":      "თანამედროვე (1950+)",
    "roulette.spin.btn":        "ამომირჩიე წიგნი!",
    "roulette.another.btn":     "სხვა წიგნი",
    "roulette.detail.link":     "დეტალების ნახვა →",
    "roulette.loading":         "ვეძებ…",

    "detail.status.label":      "სტატუსი:",
    "detail.status.want":       "გადასაკითხი მაქვს",
    "detail.status.reading":    "ვკითხულობ",
    "detail.status.read":       "უკვე წავიკითხე",
    "detail.add.btn":           "თაროზე დამატება",
    "detail.remove.btn":        "თაროდან წაშლა",
    "detail.back":              "← ძიებაზე დაბრუნება",

    "login.back":               "← საიტზე დაბრუნება",
    "login.heading":            "კეთილი იყოს შენი მობრძანება",
    "login.sub":                "შედი, რომ გამოიყენო პირადი თარო და ფავორიტები.",
    "login.welcome.sub":        "შენი პირადი ბიბლიოთეკა გელოდება.",
    "login.welcome.library":    "ჩემი ბიბლიოთეკა →",
    "login.welcome.search":     "ძიება",
    "login.name.label":         "სახელი",
    "login.name.placeholder":   "მაგ. ლუკა",
    "login.email.label":        "ელფოსტა",
    "login.password.label":     "პაროლი",
    "login.password.placeholder":"მინიმუმ 6 სიმბოლო",
    "login.remember":           "დამიმახსოვრე",
    "login.submit":             "შესვლა",

    "footer": "იმედია საიტი მოგწონთ (მე კეთებისას ძალიან გავერთე) · Tabata's Library · 2026",
    "me.corner": "გამარჯობა! 👋",

    "js.year.unknown":          "წელი უცნობია",
    "js.no.books":              "წიგნები ვერ მოიძებნა. სცადე სხვა საძიებო სიტყვა.",
    "js.home.empty":            "შეიყვანე საძიებო სიტყვა.",
    "js.home.searching":        'იძებნება „{q}"…',
    "js.home.error":            "Open Library-ს ვერ მივწვდით. შეამოწმე ინტერნეტი.",
    "js.status.want":           "გადასაკითხი",
    "js.status.reading":        "ვკითხულობ",
    "js.status.read":           "წავიკითხე",
    "js.remove":                "წაშლა",
    "js.shelf.empty.title":     "თარო ცარიელია",
    "js.shelf.empty.sub":       "ძიებიდან დაამატე წიგნები.",
    "js.shelf.empty.action":    "ძიება",
    "js.roulette.book":         "წიგნი",
    "js.roulette.no.books":     "ამ ფილტრებით წიგნი ვერ მოიძებნა — სცადე სხვა კომბინაცია.",
    "js.roulette.network":      "Open Library-ს ვერ მივწვდით. შეამოწმე ინტერნეტ კავშირი.",
    "js.roulette.loading.desc": "იტვირთება…",
    "js.roulette.no.desc":      "ამ წიგნისთვის აღწერა ვერ მოიძებნა.",
    "js.roulette.unknown.author":"უცნობი ავტორი",
    "js.adapt.loading":         'ეკრანიზაციების ძიება „{q}"…',
    "js.adapt.error":           "ფილმების ძიება ვერ მოხერხდა. სცადე თავიდან.",
    "js.adapt.no.films":        '„{title}"-ის ეკრანიზაცია ვერ მოიძებნა.',
    "js.adapt.imdb":            "IMDb-ზე ნახვა →",
    "js.detail.unknown.title":  "უსათაურო",
    "js.detail.unknown.author": "უცნობი ავტორი",
    "js.detail.loading":        "იტვირთება…",
    "js.detail.load.error":     "წიგნი ვერ ჩაიტვირთა.",
    "js.detail.desc.loading":   "<span class=\"spinner\"></span> იტვირთება…",
    "js.detail.desc.error":     "აღწერა ვერ ჩაიტვირთა.",
    "js.detail.saved":          "შენახულია! სულ {count} წიგნი დაამატე.",
    "js.detail.removed":        "წიგნი თაროდან წაიშალა.",
    "js.detail.will.save":      'შეინახება როგორც „{label}".',
    "js.detail.gutenberg":      "<p class=\"form__hint\"><span class=\"spinner\"></span> ვეძებ უფასო ვერსიას…</p>",
    "js.detail.gutenberg.found":"უფასო ვერსია ხელმისაწვდომია Project Gutenberg-ზე.",
    "js.detail.gutenberg.open": "Gutenberg-ზე გახსნა",
    "js.login.name.error":      "სახელი უნდა იყოს მინიმუმ 2 სიმბოლო.",
    "js.login.email.error":     "შეიყვანე სწორი ელფოსტა.",
    "js.login.password.error":  "პაროლი უნდა იყოს მინიმუმ 6 სიმბოლო.",
    "js.login.logout":          "გამოხვედი სისტემიდან.",
    "js.login.welcome":         "გამარჯობა, {name}! გადამისამართება…",
  },

  en: {
    "nav.search":       "Search",
    "nav.adaptations":  "Adaptations",
    "nav.roulette":     "Book Roulette",
    "nav.library":      "My Library",
    "nav.login":        "Log In",
    "nav.logout":       "Log Out",
    "nav.menu":         "Menu",
    "nav.lang":         "KA",

    "home.hero":                'Search millions of books via Open Library. <br /><em>Save your favorites to a personal shelf.</em>',
    "home.search.label":        "Search by title, author, or subject",
    "home.search.placeholder":  "Title, author, or subject…",
    "home.search.btn":          "Search",

    "adapt.hero.title":         "Book Adaptations",
    "adapt.hero.sub":           "Enter a book title to see matching film adaptations with descriptions.",
    "adapt.search.placeholder": "e.g. Pride and Prejudice, Harry Potter…",
    "adapt.search.btn":         "Search",

    "saved.hero.title":         "My Library",
    "saved.greeting.before":    "Hello, ",
    "saved.greeting.after":     " — here are your saved books.",
    "saved.stats.total":        "Total",
    "saved.stats.want":         "To Read",
    "saved.stats.reading":      "Reading",
    "saved.stats.read":         "Read",
    "saved.filter.all":         "All",
    "saved.filter.want":        "To Read",
    "saved.filter.reading":     "Reading",
    "saved.filter.read":        "Read",

    "roulette.hero.title":      "Book Roulette",
    "roulette.hero.sub":        "Answer 3 questions — we'll pick the perfect book for you",
    "roulette.quiz.title":      "Your Taste",
    "roulette.genre.label":     "What genre do you like?",
    "roulette.genre.any":       "Any",
    "roulette.genre.fantasy":   "Fantasy",
    "roulette.genre.mystery":   "Mystery",
    "roulette.genre.romance":   "Romance",
    "roulette.genre.historical":"Historical",
    "roulette.genre.philosophy":"Philosophy",
    "roulette.genre.adventure": "Adventure",
    "roulette.mood.label":      "What's your mood?",
    "roulette.mood.any":        "Nothing special",
    "roulette.mood.fun":        "I'm in a good mood",
    "roulette.mood.serious":    "I'm a bit bored",
    "roulette.mood.emotional":  "I'm feeling emotional",
    "roulette.era.label":       "Which era?",
    "roulette.era.any":         "Any",
    "roulette.era.classic":     "Classic (–1950)",
    "roulette.era.modern":      "Modern (1950+)",
    "roulette.spin.btn":        "Pick a book for me!",
    "roulette.another.btn":     "Another book",
    "roulette.detail.link":     "View details →",
    "roulette.loading":         "Searching…",

    "detail.status.label":      "Status:",
    "detail.status.want":       "Want to read",
    "detail.status.reading":    "Currently reading",
    "detail.status.read":       "Already read",
    "detail.add.btn":           "Add to shelf",
    "detail.remove.btn":        "Remove from shelf",
    "detail.back":              "← Back to search",

    "login.back":               "← Back to site",
    "login.heading":            "Welcome",
    "login.sub":                "Log in to use your personal shelf and favorites.",
    "login.welcome.sub":        "Your personal library awaits.",
    "login.welcome.library":    "My Library →",
    "login.welcome.search":     "Search",
    "login.name.label":         "Name",
    "login.name.placeholder":   "e.g. Luka",
    "login.email.label":        "Email",
    "login.password.label":     "Password",
    "login.password.placeholder":"At least 6 characters",
    "login.remember":           "Remember me",
    "login.submit":             "Log In",

    "footer": "Hope you enjoy the site (I had so much fun making it) · Tabata's Library · 2026",
    "me.corner": "Hello! 👋",

    "js.year.unknown":          "Year unknown",
    "js.no.books":              "No books found. Try a different search term.",
    "js.home.empty":            "Please enter a search term.",
    "js.home.searching":        'Searching "{q}"…',
    "js.home.error":            "Could not reach Open Library. Check your internet connection.",
    "js.status.want":           "To Read",
    "js.status.reading":        "Reading",
    "js.status.read":           "Read",
    "js.remove":                "Remove",
    "js.shelf.empty.title":     "Shelf is empty",
    "js.shelf.empty.sub":       "Add books from search.",
    "js.shelf.empty.action":    "Search",
    "js.roulette.book":         "Book",
    "js.roulette.no.books":     "No books found with these filters — try a different combination.",
    "js.roulette.network":      "Could not reach Open Library. Check your internet connection.",
    "js.roulette.loading.desc": "Loading…",
    "js.roulette.no.desc":      "No description found for this book.",
    "js.roulette.unknown.author":"Unknown author",
    "js.adapt.loading":         'Searching adaptations for "{q}"…',
    "js.adapt.error":           "Could not search for films. Please try again.",
    "js.adapt.no.films":        'No adaptation found for "{title}".',
    "js.adapt.imdb":            "View on IMDb →",
    "js.detail.unknown.title":  "Untitled",
    "js.detail.unknown.author": "Unknown author",
    "js.detail.loading":        "Loading…",
    "js.detail.load.error":     "Could not load book.",
    "js.detail.desc.loading":   '<span class="spinner"></span> Loading…',
    "js.detail.desc.error":     "Could not load description.",
    "js.detail.saved":          "Saved! You've added {count} book(s) total.",
    "js.detail.removed":        "Book removed from shelf.",
    "js.detail.will.save":      'Will be saved as "{label}".',
    "js.detail.gutenberg":      '<p class="form__hint"><span class="spinner"></span> Searching for free version…</p>',
    "js.detail.gutenberg.found":"Free version available on Project Gutenberg.",
    "js.detail.gutenberg.open": "Open on Gutenberg",
    "js.login.name.error":      "Name must be at least 2 characters.",
    "js.login.email.error":     "Please enter a valid email address.",
    "js.login.password.error":  "Password must be at least 6 characters.",
    "js.login.logout":          "You have been logged out.",
    "js.login.welcome":         "Hello, {name}! Redirecting…",
  }
};

let currentLang = localStorage.getItem("tl-lang") || "ka";

export function getLang() { return currentLang; }

export function t(key, vars) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.ka;
  let str = dict[key] !== undefined ? dict[key] : (TRANSLATIONS.ka[key] !== undefined ? TRANSLATIONS.ka[key] : key);
  if (vars) {
    for (const k in vars) str = str.replaceAll("{" + k + "}", vars[k]);
  }
  return str;
}

export function applyTranslations() {
  document.documentElement.lang = currentLang;

  const btn = document.getElementById("lang-toggle");
  if (btn) btn.textContent = t("nav.lang");

  document.querySelectorAll("[data-i18n]").forEach(function(el) {
    el.textContent = t(el.getAttribute("data-i18n"));
  });

  document.querySelectorAll("[data-i18n-html]").forEach(function(el) {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(function(el) {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });

  document.querySelectorAll("[data-i18n-title]").forEach(function(el) {
    el.title = t(el.getAttribute("data-i18n-title"));
  });

  document.querySelectorAll("[data-i18n-aria-label]").forEach(function(el) {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria-label")));
  });
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem("tl-lang", lang);
  applyTranslations();
  window.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

applyTranslations();
