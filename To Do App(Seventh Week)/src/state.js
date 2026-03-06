const DEFAULT_FILTER = 'all';
const FILTER_KEYS = ['all', 'active', 'completed'];
const FILTERS = new Map([
  ['all', (tasks) => tasks],
  ['active', (tasks) => tasks.filter((task) => !task.completed)],
  ['completed', (tasks) => tasks.filter((task) => task.completed)],
]);
const FILTER_SET = new Set(FILTER_KEYS);

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
    text: trimmed,
    completed: false,
  };
  return [...tasks, nextTask];
};
// ...tasks spans all properties .
const toggleTask = (tasks, index) =>
  tasks.map((task, i) => (i === index ? { ...task, completed: !task.completed } : task));

const removeTask = (tasks, index) => tasks.filter((_, i) => i !== index);

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
// .reduce has 2 attr first is accumulator and the second is the current value. 
// .reduce( (acc,curr)=>{},intial value);
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
};
