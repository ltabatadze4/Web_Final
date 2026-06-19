// main.js - nav, auth და burger ყველა გვერდისთვის

import { getAuth, clearAuth } from "./storage.js";
import { getLang, setLang } from "./i18n.js";
import { getLang, setLang } from "./i18n.js";

const page      = document.body.dataset.page;
const guestNav  = document.querySelector("#nav-guest");
const userNav   = document.querySelector("#nav-user");
const loginItem = document.querySelector("#nav-login-item");
const userName  = document.querySelector("#nav-user-name");
const logoutBtn = document.querySelector("#nav-logout");

// ავტორიზაციის მდგომარეობა
if (guestNav && userNav) {
  const auth = getAuth();
  if (auth) {
    let name = auth.displayName || auth.email.split("@")[0];
    guestNav.hidden = false;
    userNav.hidden  = false;
    if (loginItem) loginItem.hidden = true;
    if (userName)  userName.textContent = name;
  } else {
    guestNav.hidden = false;
    userNav.hidden  = true;
    if (loginItem) loginItem.hidden = false;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function() {
      clearAuth();
      window.location.href = "index.html";
    });
  }
}

// active nav link
const pageMap = {
  home: "index.html",
  detail: "index.html",
  adaptations: "adaptations.html",
  saved: "saved.html",
  login: "login.html",
  roulette: "roulette.html"
};
const target = pageMap[page];
if (target) {
  document.querySelectorAll(".nav__link").forEach(function(a) {
    a.classList.toggle("nav__link--active", a.getAttribute("href") === target);
  });
  document.querySelectorAll(".login-split__nav-link").forEach(function(a) {
    a.classList.toggle("login-split__nav-link--active", a.getAttribute("href") === target);
  });
}

// burger menu
const burger = document.getElementById("nav-burger");
const nav    = burger && burger.closest(".nav");
if (burger && nav) {
  burger.addEventListener("click", function() {
    const isOpen = nav.classList.toggle("nav--open");
    burger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
  document.addEventListener("click", function(e) {
    if (!nav.contains(e.target)) {
      nav.classList.remove("nav--open");
      burger.setAttribute("aria-expanded", "false");
    }
  });
  nav.querySelectorAll(".nav__link, .nav__logout").forEach(function(el) {
    el.addEventListener("click", function() {
      nav.classList.remove("nav--open");
      burger.setAttribute("aria-expanded", "false");
    });
  });
}

// ენის გადართვა
const langToggle = document.getElementById("lang-toggle");
if (langToggle) {
  langToggle.addEventListener("click", function() {
    setLang(getLang() === "ka" ? "en" : "ka");
  });
}

// გვერდის მოდულების dynamic import — ამის გამო HTML-ში მხოლოდ ეს ერთი script ტეგია საჭირო
const PAGE_MODULES = {
  home:         "./home.js",
  adaptations:  "./adaptations.js",
  saved:        "./saved.js",
  roulette:     "./roulette.js",
  detail:       "./detail.js",
  login:        "./login.js"
};
if (PAGE_MODULES[page]) {
  import(PAGE_MODULES[page]);
}
