import { API_KEY, STORAGE } from "./config.js";
import { el } from "./dom.js";
import { throttle } from "./utils.js";
import { getLocal, setLocal } from "./storage.js";

export const state = {
  apiKey: API_KEY,
  query: "",
  type: "movie",// movie, series
  year: "",
  page: 1,// UI page number, not API page number(IMP)
  pageSize: 10,
  totalResults: 0,
  totalPages: 0,
  isLoading: false
};

//  saves every 500ms 
// current state so that we can get it back when we reloads the site or after closing it.
function persistState() {
  setLocal(STORAGE.query, state.query);
  setLocal(STORAGE.type, state.type);
  setLocal(STORAGE.year, state.year);
  setLocal(STORAGE.page, String(state.page));
  setLocal(STORAGE.pageSize, String(state.pageSize));
}

export const persistStateThrottled = throttle(persistState, 500);

export function restoreState() {
  state.apiKey = API_KEY;
  state.query = getLocal(STORAGE.query, "");
  state.type = getLocal(STORAGE.type, "movie");
  state.year = getLocal(STORAGE.year, "");
  state.page = Number(getLocal(STORAGE.page, 1));
  state.pageSize = Number(getLocal(STORAGE.pageSize, 10));

  el.query.value = state.query;
  el.type.value = state.type;
  el.year.value = state.year;
  el.pageSize.value = String(state.pageSize);
}
