import {
  DEFAULT_FILTER,
  createState,
  addTask,
  toggleTask,
  removeTask,
  removeCompleted,
  setFilter,
  applyFilter,
  summaryMap,
  toTaskMap,
} from '../src/state.js';
import { persistState, restoreState } from '../src/storage.js';

const baseTasks = [
  { id: 'a', text: 'one', completed: false },
  { id: 'b', text: 'two', completed: true },
];

describe('todoState', () => {
  it('creates state with default filter and copies tasks', () => {
    const state = createState(baseTasks, 'unknown');
    expect(state.filter).toBe(DEFAULT_FILTER);
    expect(state.tasks).not.toBe(baseTasks);
    expect(state.tasks).toEqual(baseTasks);
  });

  it('adds tasks immutably and trims input', () => {
    const next = addTask(baseTasks, '  new item  ');
    expect(next).toHaveLength(3);
    expect(next[2].text).toBe('new item');
    expect(next).not.toBe(baseTasks);
  });

  it('does not add empty tasks', () => {
    const next = addTask(baseTasks, '   ');
    expect(next).toEqual(baseTasks);
  });

  it('toggles task completion without mutating other items', () => {
    const next = toggleTask(baseTasks, 'a');
    expect(next.find((t) => t.id === 'a').completed).toBe(true);
    expect(next.find((t) => t.id === 'b').completed).toBe(true);
  });

  it('removes tasks and completed tasks', () => {
    const pruned = removeTask(baseTasks, 'b');
    expect(pruned).toHaveLength(1);
    expect(pruned.find((t) => t.id === 'b')).toBeUndefined();
    const remaining = removeCompleted(baseTasks);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].completed).toBe(false);
  });

  it('honors valid filters and rejects invalid ones', () => {
    const state = createState(baseTasks, 'active');
    expect(state.filter).toBe('active');
    const switched = setFilter(state, 'completed');
    expect(switched.filter).toBe('completed');
    const unchanged = setFilter(state, 'spam');
    expect(unchanged.filter).toBe('active');
  });

  it('applies filters via Map of handlers', () => {
    const all = applyFilter(baseTasks, 'all');
    const active = applyFilter(baseTasks, 'active');
    const completed = applyFilter(baseTasks, 'completed');
    expect(all).toHaveLength(2);
    expect(active).toHaveLength(1);
    expect(completed).toHaveLength(1);
  });

  it('summaries tasks into a Map with total count', () => {
    const summary = summaryMap(baseTasks);
    expect(summary).toBeInstanceOf(Map);
    expect(summary.get('active')).toBe(1);
    expect(summary.get('completed')).toBe(1);
    expect(summary.get('total')).toBe(2);
  });

  it('builds lookup Maps for tasks', () => {
    const lookup = toTaskMap(baseTasks);
    expect(lookup.get('a').text).toBe('one');
  });
});

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
