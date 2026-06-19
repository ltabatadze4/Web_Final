// login.js - შესვლის/რეგისტრაციის გვერდი

import { getAuth, saveAuth, clearAuth } from "./storage.js";
import { t } from "./i18n.js";

const form        = document.querySelector("#login-form");
const formWrap    = document.querySelector("#login-form-wrap");
const loggedPanel = document.querySelector("#logged-in-panel");
const loggedName  = document.querySelector("#logged-in-name");
const logoutBtn   = document.querySelector("#logout-btn");
const feedback    = document.querySelector("#login-feedback");
const next        = new URLSearchParams(window.location.search).get("next") || "index.html";

function showFormError(msg) {
  feedback.textContent = msg;
  feedback.className   = "feedback feedback--err";
}

function renderState() {
  const auth = getAuth();
  if (auth) {
    if (formWrap) formWrap.hidden = true;
    if (form)     form.hidden     = true;
    loggedPanel.hidden     = false;
    loggedName.textContent = auth.displayName || auth.email;
  } else {
    if (formWrap) formWrap.hidden = false;
    if (form)     form.hidden     = false;
    loggedPanel.hidden = true;
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    clearAuth();
    renderState();
    feedback.textContent = t("js.login.logout");
    feedback.className   = "feedback";
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  const displayName = form.displayName.value.trim();
  const email       = form.email.value.trim();
  const password    = form.password.value;

  if (displayName.length < 2) return showFormError(t("js.login.name.short"));
  if (!email.includes("@"))   return showFormError(t("js.login.email.invalid"));
  if (password.length < 6)    return showFormError(t("js.login.password.short"));

  saveAuth({ displayName, email, remember: form.remember.checked, signedInAt: Date.now() });
  feedback.textContent = t("js.login.success", { name: displayName });
  feedback.className   = "feedback feedback--ok";
  setTimeout(function() { window.location.href = next; }, 900);
});

form.addEventListener("input", function() {
  if (feedback.classList.contains("feedback--err")) {
    feedback.textContent = "";
    feedback.className   = "feedback";
  }
});

renderState();
