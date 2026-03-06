
import { persistState, restoreState } from '../src/storage.js';


const baseTasks = [
  { text: 'one', completed: false },
  { text: 'two', completed: true },
];

describe('todoStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('persists and restores state from localStorage', () => {
    const state = { tasks: baseTasks, filter: 'completed' };
    persistState(state);
    expect(restoreState()).toEqual(state);
  });

  it('returns null when storage is empty', () => {
    expect(restoreState()).toBeNull();
  });

  it('ignores invalid JSON when restoring', () => {
    localStorage.setItem('immutable-todo-app-state', '{not:valid');
    expect(restoreState()).toBeNull();
  });
});
