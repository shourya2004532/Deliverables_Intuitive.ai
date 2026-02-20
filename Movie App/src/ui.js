import { PLACEHOLDER_POSTER } from "./config.js";
import { el } from "./dom.js";

export function setMessage(text, tone = "") {
  el.message.textContent = text;
  el.message.className = tone ? `message ${tone}` : "message";
}

export function setStats(text) {
  el.stats.textContent = text;
}

export function renderResults(items) {
  el.results.innerHTML = "";
  if (!items.length) {
    setMessage("No results. Try a different search.");
    return;
  }
  items.forEach((movie) => {
    const card = document.createElement("article");
    card.className = "card";
    const poster =
      movie.Poster && movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER_POSTER;
    card.innerHTML = `
      <img class="poster" src="${poster}" alt="${movie.Title}" loading="lazy" />
      <span class="tag">${movie.Type.toUpperCase()}</span>
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;
    el.results.appendChild(card);
  });
}

export function renderRecent(list, onSelect) {
  el.recent.innerHTML = "";
  list.forEach((item) => {
    const btn = document.createElement("button");
    btn.textContent = item;
    btn.type = "button";
    btn.addEventListener("click", () => onSelect(item));
    el.recent.appendChild(btn);
  });
}
