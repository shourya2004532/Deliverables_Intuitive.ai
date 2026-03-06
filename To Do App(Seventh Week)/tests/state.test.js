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
} from '../src/state.js';


const baseTasks = [
  { text: 'one', completed: false },
  { text: 'two', completed: true },
];

describe('todoState', () => {
  it('creates state with default filter and copies tasks', () => {
    const state = createState(baseTasks, 'unknown');
    expect(state.filter).toBe(DEFAULT_FILTER);
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
    let  f = baseTasks[0].completed;
    const next = toggleTask(baseTasks, 0);
    expect(next[0].completed).toBe(!f);
    expect(next[1].completed).toBe(baseTasks[1].completed);
  });

  it('removes tasks and completed tasks', () => {
    let l = baseTasks.length;
    const pruned = removeTask(baseTasks, 1);
    expect(pruned).toHaveLength(l-1);
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

});
