// utils.js - სხვადასხვა დამხმარე ფუნქციები

// ძიების დაყოვნება, რომ ყოველ ასოზე API-ს არ ვეძახოთ
export function debounce(fn, delay) {
  let timer;
  return function() {
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(function() {
      fn.apply(null, args);
    }, delay);
  };
}

// HTML სიმბოლოების გარდაქმნა, XSS-ის თავიდან ასაცილებლად
export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = String(str);
  return div.innerHTML;
}
