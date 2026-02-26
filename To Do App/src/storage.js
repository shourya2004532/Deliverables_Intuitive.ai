const STORAGE_KEY = 'immutable-todo-app-state';

const hasStorage = () => {
  try {
    return typeof window !== 'undefined' && 'localStorage' in window && window.localStorage;
  } catch (error) {
    console.warn('LocalStorage not available', error);
    return null;
  }
};

const retrieveStorage = () => hasStorage();

const restoreState = () => {
  const storage = retrieveStorage();
  if (!storage) {
    return null;
  }
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Unable to parse saved state', error);
    return null;
  }
};

const persistState = (state) => {
  const storage = retrieveStorage();
  if (!storage) {
    return state;
  }
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('Unable to persist state', error);
  }
  return state;
};

export { restoreState, persistState };
