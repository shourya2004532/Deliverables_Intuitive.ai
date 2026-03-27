import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { MainTaskCard } from '../components/MainTaskCard';

export function MainTasks() {
  const context = useContext(TaskContext);
  const { mainTasks, addMainTask, deleteMainTask, addSubtask, toggleSubtask, deleteSubtask, completeAllSubtasks, undoCompleteTask } = context;
  
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [expandedTask, setExpandedTask] = useState(null);
  const [subtaskTitle, setSubtaskTitle] = useState('');
  const [filter, setFilter] = useState('all');
  
  const handleAddTask = () => {
    if (taskTitle.trim() && taskDueDate) {
      const newTaskId = addMainTask({ title: taskTitle, dueDate: taskDueDate });
      setTaskTitle('');
      setTaskDueDate('');
      setShowForm(false);
      setExpandedTask(newTaskId);
    }
  };
  
  const handleAddSubtask = (taskId) => {
    if (subtaskTitle.trim()) {
      addSubtask(taskId, { title: subtaskTitle });
      setSubtaskTitle('');
    }
  };

  const handleCompleteAllSubtasks = (taskId) => {
    completeAllSubtasks(taskId);
  };

  const handleUndoComplete = (taskId) => {
    undoCompleteTask(taskId);
  };
  
  const getCompletionPercentage = (subtasks) => {
    if (subtasks.length === 0) return 0;
    const completed = subtasks.filter(st => st.completed).length;
    return Math.round((completed / subtasks.length) * 100);
  };
  
  const getBoundaryColor = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const daysUntil = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return 'border-black';
    if (daysUntil === 0) return 'border-red-600';
    if (daysUntil === 1) return 'border-red-500';
    if (daysUntil <= 3) return 'border-orange-500';
    return 'border-green-500';
  };
  
  const getFilteredTasks = () => {
    return mainTasks.filter(task => {
      if (filter === 'completed') {
        return task.completed || (task.subtasks.length > 0 && 
               task.subtasks.every(st => st.completed));
      }
      if (filter === 'active') {
        return !task.completed && (task.subtasks.length === 0 || 
               task.subtasks.some(st => !st.completed));
      }
      return true;
    });
  };
  
  const filteredTasks = getFilteredTasks();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Main Tasks</h1>
            <p className="text-gray-400 text-lg">Organize your goals with subtasks and track progress</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-4 rounded-xl font-bold text-white transform hover:scale-105 ${
              showForm
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 '
            }`}
          >
            {showForm ? '✕ Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Add Task Form */}
        {showForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl shadow-2xl mb-8 border border-gray-600 animate-slideDown">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Task title..."
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white transition"
                />
              </div>
              <button
                onClick={handleAddTask}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-bold shadow-lg hover:shadow-xl hover:shadow-green-600/50"
              >
                 Add Task
              </button>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-3 mb-8 flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            All Tasks
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'active'
                ? 'bg-gradient-to-r from-yellow-600 to-yellow-700 text-white shadow-lg shadow-yellow-600/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              filter === 'completed'
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-600/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Tasks List */}
        <div className="space-y-5">
          {filteredTasks.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-12 text-center rounded-2xl shadow-xl border border-gray-600">
              <p className="text-gray-400 text-lg font-medium">✨ No tasks here yet. Create one to get started!</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const completionPercentage = task.completed ? 100 : getCompletionPercentage(task.subtasks);
              const isExpanded = expandedTask === task.id;
              
              return (
                <MainTaskCard
                  key={task.id}
                  task={task}
                  isExpanded={isExpanded}
                  completionPercentage={completionPercentage}
                  subtaskTitle={subtaskTitle}
                  onExpandToggle={(taskId) => setExpandedTask(taskId)}
                  onSubtaskTitleChange={setSubtaskTitle}
                  onAddSubtask={handleAddSubtask}
                  onDeleteTask={deleteMainTask}
                  onToggleSubtask={toggleSubtask}
                  onDeleteSubtask={deleteSubtask}
                  onCompleteAllSubtasks={handleCompleteAllSubtasks}
                  onUndoComplete={handleUndoComplete}
                  getBoundaryColor={getBoundaryColor}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
