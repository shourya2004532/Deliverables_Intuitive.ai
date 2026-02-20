export const API_URL = "https://www.omdbapi.com/";
export const API_KEY = "4f32e4a8";
export const API_PAGE_SIZE = 10;
export const CACHE_TTL_MS = 1000 * 60 * 10;
export const PLACEHOLDER_POSTER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='600'%3E%3Crect width='100%25' height='100%25' fill='%231b2744'/%3E%3Ctext x='50%25' y='50%25' font-size='32' text-anchor='middle' fill='%239fc0ff' font-family='Arial'%3ENo%20Poster%3C/text%3E%3C/svg%3E";
export const STORAGE = {
  query: "movieApp.query",
  type: "movieApp.type",
  year: "movieApp.year",
  page: "movieApp.page",
  pageSize: "movieApp.pageSize",
  recent: "movieApp.recent",
  cache: "movieApp.cache"
};
