import { useContext, useState } from 'react';
import { TaskContext } from '../context/TaskContext';
import { DailyTaskCard } from '../components/DailyTaskCard';

export function DailyTasks() {
  const context = useContext(TaskContext);
  const { dailyTasks, addDailyTask, deleteDailyTask, updateDailyTaskValueForDate, toggleExcludeDate, getDailyTasksByRange, getTaskThreshold } = context;
  
  const [showForm, setShowForm] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [thresholdValue, setThresholdValue] = useState('');
  const [todayValue, setTodayValue] = useState('');
  const [editingDate, setEditingDate] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  
  const handleAddTask = () => {
    if (taskName.trim() && thresholdValue) {
      addDailyTask({ name: taskName, threshold: parseFloat(thresholdValue) });
      setTaskName('');
      setThresholdValue('');
      setShowForm(false);
    }
  };
  
  const handleRecordValue = (taskId) => {
    if (todayValue !== '') {
      const today = new Date().toISOString().split('T')[0];
      updateDailyTaskValueForDate(taskId, today, todayValue);
      setTodayValue('');
    }
  };
  
  const handleEditPastDate = (taskId, date, value) => {
    if (editingValue !== '') {
      updateDailyTaskValueForDate(taskId, date, editingValue);
      setEditingDate(null);
      setEditingValue('');
    }
  };
  
  const calculateStreak = (taskId) => {
    const data = getDailyTasksByRange(taskId, 7);
    let streak = 0;
    
    for (let i = data.length - 1; i >= 0; i--) {
      const entry = data[i];
      
      // If excluded count it as meeting the threshold ( i mean continue the streak)
      if (entry.excluded) {
        streak++;
        continue;
      }
      
      // Check if this date has data
      const entryData = dailyTasks.find(t => t.id === taskId && t.date === entry.date);
      
      if (entryData && entryData.value >= getTaskThreshold(taskId)) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const getStatus = (streak) => {
    if (streak < 2) return { label: 'Poor', color: 'text-red-600', bgColor: 'bg-red-50' };
    if (streak < 4) return { label: 'Good', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    if (streak < 7) return { label: 'Excellent', color: 'text-green-600', bgColor: 'bg-green-50' };
    return { label: 'Outstanding', color: 'text-blue-600', bgColor: 'bg-blue-50' };
  };
  
  const getUniqueTasks = () => {
    const unique = {};
    dailyTasks.forEach(task => {
      if (!unique[task.id]) {
        unique[task.id] = task;
      }
    });
    return Object.values(unique);
  };
  
  const uniqueTasks = getUniqueTasks();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-black text-white mb-2">Daily Tasks</h1>
            <p className="text-gray-400 text-lg">Track your daily progress with streaks and goals</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 transform hover:scale-105 ${
              showForm
                ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/50'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-600/50'
            }`}
          >
            {showForm ? '✕ Cancel' : '+ New Daily Task'}
          </button>
        </div>

        
        {showForm && (
          <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-8 rounded-2xl shadow-2xl mb-8 border border-gray-600 animate-slideDown">
            <h2 className="text-2xl font-bold mb-6 text-white">Create New Daily Task</h2>
            <div className="space-y-4">
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition"
              />
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Daily Threshold Value
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10 (for 10 minutes, 10 pages, etc.)"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(e.target.value)}
                  className="w-full px-5 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition"
                />
              </div>
              <button
                onClick={handleAddTask}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-bold shadow-lg hover:shadow-xl hover:shadow-green-600/50"
              >
                Create Task
              </button>
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="space-y-4">
          {uniqueTasks.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-800 to-gray-700 p-12 text-center rounded-2xl shadow-xl border border-gray-600">
              <p className="text-gray-400 text-lg font-medium">✨ No daily tasks yet. Create one to get started!</p>
            </div>
          ) : (
            uniqueTasks.map(task => {
              const streak = calculateStreak(task.id);
              const status = getStatus(streak);
              const isExpanded = expandedTaskId === task.id;
              
              return (
                <DailyTaskCard
                  key={task.id}
                  task={task}
                  isExpanded={isExpanded}
                  streak={streak}
                  status={status}
                  dailyTasks={dailyTasks}
                  todayValue={todayValue}
                  editingDate={editingDate}
                  editingValue={editingValue}
                  onExpandToggle={(taskId) => setExpandedTaskId(taskId)}
                  onTodayValueChange={setTodayValue}
                  onRecordValue={handleRecordValue}
                  onEditDateClick={(key, value) => {
                    setEditingDate(key);
                    setEditingValue(value);
                  }}
                  onEditValueChange={setEditingValue}
                  onSaveEdit={handleEditPastDate}
                  onToggleExclude={toggleExcludeDate}
                  onDeleteTask={(taskId) => {
                    if (confirm('Delete this daily task and all its data?')) {
                      deleteDailyTask(taskId);
                      setExpandedTaskId(null);
                    }
                  }}
                  getDailyTasksByRange={getDailyTasksByRange}
                  getTaskThreshold={getTaskThreshold}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
