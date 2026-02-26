const DEFAULT_FILTER = 'all';
const FILTER_KEYS = ['all', 'active', 'completed'];
const FILTERS = new Map([
  ['all', (tasks) => tasks],
  ['active', (tasks) => tasks.filter((task) => !task.completed)],
  ['completed', (tasks) => tasks.filter((task) => task.completed)],
]);
const FILTER_SET = new Set(FILTER_KEYS);

const nowIso = () => new Date().toISOString();

const makeId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

const normalizeTasks = (tasks) => (Array.isArray(tasks) ? [...tasks] : []);

const createState = (tasks, filter) => ({
  tasks: normalizeTasks(tasks),
  filter: FILTER_SET.has(filter) ? filter : DEFAULT_FILTER,
});

const addTask = (tasks, text) => {
  const trimmed = String(text || '').trim();
  if (!trimmed) {
    return [...tasks];
  }
  const nextTask = {
    id: makeId(),
    text: trimmed,
    completed: false,
    createdAt: nowIso(),
  };
  return [...tasks, nextTask];
};

const toggleTask = (tasks, id) =>
  tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task));

const removeTask = (tasks, id) => tasks.filter((task) => task.id !== id);

const removeCompleted = (tasks) => tasks.filter((task) => !task.completed);

const setFilter = (state, candidate) => {
  if (!FILTER_SET.has(candidate)) {
    return state;
  }
  return { ...state, filter: candidate };
};

const applyFilter = (tasks, filter) => {
  const resolver = FILTERS.get(filter) || FILTERS.get(DEFAULT_FILTER);
  return resolver(tasks);
};

const toTaskMap = (tasks) => new Map(tasks.map((task) => [task.id, task]));

const buildSummary = (tasks) =>
  tasks.reduce(
    (map, task) => {
      const bucket = task.completed ? 'completed' : 'active';
      map.set(bucket, (map.get(bucket) || 0) + 1);
      return map;
    },
    new Map([
      ['active', 0],
      ['completed', 0],
    ])
  );

const summaryMap = (tasks) => {
  const counts = buildSummary(tasks);
  counts.set('total', tasks.length);
  return counts;
};

export {
  DEFAULT_FILTER,
  FILTER_KEYS,
  createState,
  addTask,
  toggleTask,
  removeTask,
  removeCompleted,
  setFilter,
  applyFilter,
  summaryMap,
  toTaskMap,
};
