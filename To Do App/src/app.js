import {
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
} from './state.js';
import { persistState, restoreState } from './storage.js';

const elements = {
  form: document.querySelector('[data-todo-form]'),
  input: document.querySelector('[data-task-input]'),
  list: document.querySelector('[data-task-list]'),
  filters: document.querySelector('[data-filter-group]'),
  status: document.querySelector('[data-status-count]'),
  clear: document.querySelector('[data-clear-completed]'),
};

if (!elements.form || !elements.input || !elements.list || !elements.filters) {
  throw new Error('Todo shell missing expected DOM structure');
}

let appState = createState([], DEFAULT_FILTER);
const persisted = restoreState();
if (persisted && Array.isArray(persisted.tasks)) {
  appState = createState(persisted.tasks, persisted.filter);
}

const renderFilters = () => {
  elements.filters.innerHTML = '';
  FILTER_KEYS.forEach((filter) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = filter;
    button.dataset.filter = filter;
    button.classList.toggle('active', appState.filter === filter);
    elements.filters.appendChild(button);
  });
};

const renderList = () => {
  elements.list.innerHTML = '';
  const filtered = applyFilter(appState.tasks, appState.filter);
  filtered.forEach((task) => {
    const item = document.createElement('li');
    item.className = 'todo-item';

    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', () => {
      dispatch((current) => ({
        ...current,
        tasks: toggleTask(current.tasks, task.id),
      }));
    });

    const span = document.createElement('span');
    span.textContent = task.text;
    if (task.completed) {
      span.classList.add('completed');
    }

    label.append(checkbox, span);

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => {
      dispatch((current) => ({
        ...current,
        tasks: removeTask(current.tasks, task.id),
      }));
    });

    item.append(label, deleteButton);
    elements.list.appendChild(item);
  });
};

const renderStatus = () => {
  const counts = summaryMap(appState.tasks);
  const total = counts.get('total') || 0;
  const active = counts.get('active') || 0;
  elements.status.textContent = `${active} of ${total} remaining`;
};

const render = () => {
  renderFilters();
  renderList();
  renderStatus();
};

const dispatch = (updater) => {
  appState = updater(appState);
  persistState(appState);
  render();
};

elements.form.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = elements.input.value;
  if (!value.trim()) {
    return;
  }
  dispatch((current) => ({
    ...current,
    tasks: addTask(current.tasks, value),
  }));
  elements.input.value = '';
});

elements.filters.addEventListener('click', (event) => {
  const button = event.target.closest('button[data-filter]');
  if (!button) {
    return;
  }
  const filter = button.dataset.filter;
  if (!filter || appState.filter === filter) {
    return;
  }
  dispatch((current) => setFilter(current, filter));
});

if (elements.clear) {
  elements.clear.addEventListener('click', () => {
    dispatch((current) => ({
      ...current,
      tasks: removeCompleted(current.tasks),
    }));
  });
}

render();
