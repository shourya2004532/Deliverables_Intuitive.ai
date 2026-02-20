import { API_URL, CACHE_TTL_MS } from "./config.js";
import { el } from "./dom.js";
import { debounce, throttle } from "./utils.js";
import { loadCache, saveCache, getRecentList, setRecentList } from "./storage.js";
import { state, restoreState, persistStateThrottled } from "./state.js";
import {
  buildCacheKey,
  getApiPageForClientPage,
  getSliceForClientPage,
  renderPagination
} from "./pagination.js";
import {
  setMessage,
  setStats,
  renderResults,
  renderRecent
} from "./ui.js";

let controller = null;
let cache = loadCache();
const saveCacheThrottled = throttle(() => saveCache(cache), 500);

function updateRecentUI() {
  renderRecent(getRecentList(), (item) => {
    el.query.value = item;
    state.query = item;
    state.page = 1;
    persistStateThrottled();
    triggerSearch();
  });
}

function addRecentSearch(query) {
  if (!query) return;
  const list = getRecentList();
  const updated = [query, ...list.filter((item) => item !== query)].slice(0, 6);
  setRecentList(updated); // for storing in local storage
  updateRecentUI();// for showing it in the UI
}

function handleResponse(data, apiPage) {
  if (data.Response === "False") {
    setMessage(data.Error || "No results found.");
    setStats("");
    el.results.innerHTML = "";
    state.totalResults = 0;
    state.totalPages = 0;
    renderPagination(state, onPageChange);
    return;
  }

  state.totalResults = Number(data.totalResults || 0);
  state.totalPages = Math.ceil(state.totalResults / state.pageSize);
  const slice = getSliceForClientPage(state.page, state.pageSize);
  const items = (data.Search || []).slice(slice.start, slice.end);
  const startResult = (state.page - 1) * state.pageSize + 1;
  const endResult = startResult + items.length - 1;

  setMessage(`Results for "${state.query}"`);
  setStats(`${startResult}-${endResult} of ${state.totalResults} results`);
  renderResults(items);
  renderPagination(state, onPageChange);
}

async function fetchMovies() {
  if (!state.apiKey) {
    setMessage("Add an OMDb API key to start searching.", "warn");
    return;
  }
  if (!state.query || state.query.trim().length < 2) {
    setMessage("Type at least 2 characters to search.");
    return;
  }
// controller.abort(); cancels the previous fetch before starting a new one. 
// That prevents older slower responses from arriving later and overwriting the latest results.
  if (controller) controller.abort();
  controller = new AbortController();

  state.isLoading = true;
  setMessage("Searching...");
  setStats("");

  const apiPage = getApiPageForClientPage(state.page, state.pageSize);
  const cacheKey = buildCacheKey(state.query, state.type, state.year, apiPage);
  const cached = cache[cacheKey];
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    handleResponse(cached.data, apiPage);
    state.isLoading = false;
    return;
  }

  const url = new URL(API_URL);
  url.searchParams.set("apikey", state.apiKey);
  url.searchParams.set("s", state.query.trim());
  url.searchParams.set("type", state.type);
  if (state.year) url.searchParams.set("y", state.year);
  url.searchParams.set("page", String(apiPage));

  try {
    const response = await fetch(url.toString(), { signal: controller.signal });
    if (!response.ok) throw new Error("Network error");
    const data = await response.json();
    cache[cacheKey] = { timestamp: Date.now(), data };
    saveCacheThrottled();
    handleResponse(data, apiPage);
    addRecentSearch(state.query.trim());
  } catch (error) {
    if (error.name === "AbortError") return;
    setMessage("Something went wrong. Try again.", "error");
    el.results.innerHTML = "";
  } finally {
    state.isLoading = false;
  }
}

const triggerSearch = debounce(() => {
  persistStateThrottled();
  fetchMovies();
}, 500);

function onPageChange(page) {
    if (page === state.page) return;
  state.page = page;
  persistStateThrottled();
  fetchMovies();
}

el.query.addEventListener("input", (event) => {
  state.query = event.target.value;
  state.page = 1;
  setMessage("Waiting for you to finish typing...");
  triggerSearch();
});

el.type.addEventListener("change", (event) => {
  state.type = event.target.value;
  state.page = 1;
  persistStateThrottled();
  fetchMovies();
});

el.year.addEventListener("input", (event) => {
  state.year = event.target.value;
  state.page = 1;
  persistStateThrottled();
  triggerSearch();
});

el.pageSize.addEventListener("change", (event) => {
  state.pageSize = Number(event.target.value);
  state.page = 1;
  persistStateThrottled();
  fetchMovies();
});

el.prev.addEventListener("click", () => {
  if (state.page <= 1) return;
  onPageChange(state.page - 1);
});

el.next.addEventListener("click", () => {
  if (state.page >= state.totalPages) return;
  onPageChange(state.page + 1);
});

restoreState();
updateRecentUI();

if (state.query) {
  fetchMovies();
} else {
  setMessage("Type a movie title to begin.");
}
