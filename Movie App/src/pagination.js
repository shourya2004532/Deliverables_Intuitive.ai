import { API_PAGE_SIZE } from "./config.js";
import { el } from "./dom.js";

export function buildCacheKey(query, type, year, apiPage) {
  return `${query}::${type}::${year}::${apiPage}`;
}
// clinet page x wich api page 
export function getApiPageForClientPage(clientPage, pageSize) {
  return Math.floor(((clientPage - 1) * pageSize) / API_PAGE_SIZE) + 1;
}
// client page x which slice of api page 
export function getSliceForClientPage(clientPage, pageSize) {
  const start = ((clientPage - 1) * pageSize) % API_PAGE_SIZE;
  return { start, end: start + pageSize };
}

export function renderPagination(state, onPageChange) {
  el.pages.innerHTML = "";
  const { page, totalPages } = state;
  const windowSize = 5;
  const start = Math.max(1, page - Math.floor(windowSize / 2));
  const end = Math.min(totalPages, start + windowSize - 1);
  for (let p = start; p <= end; p += 1) {
    const btn = document.createElement("button");
    btn.className = `page-btn${p === page ? " active" : ""}`;
    btn.textContent = String(p);
    btn.addEventListener("click", () => onPageChange(p));
    el.pages.appendChild(btn);
  }
  el.prev.disabled = page <= 1;
  el.next.disabled = page >= totalPages;
}
