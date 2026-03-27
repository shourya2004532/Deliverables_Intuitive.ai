import React from 'react';
export function MainTaskCard({
  task,
  isExpanded,
  completionPercentage,
  subtaskTitle,
  onExpandToggle,
  onSubtaskTitleChange,
  onAddSubtask,
  onDeleteTask,
  onToggleSubtask,
  onDeleteSubtask,
  onCompleteAllSubtasks,
  onUndoComplete,
  getBoundaryColor
}) {
  return (
    <div
      className={`bg-gradient-to-br from-gray-800 to-gray-700 p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-[-2px] border-l-4 ${getBoundaryColor(task.dueDate)}`}
    >
      {/* Task Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex-1">
          <h3 className={`text-2xl font-bold transition-all ${
            completionPercentage === 100
              ? 'line-through text-gray-500'
              : 'text-white'
          }`}>
            {task.title}
          </h3>
          <p className={`text-sm mt-2 transition-all ${
            completionPercentage === 100
              ? 'text-gray-500 line-through'
              : 'text-gray-400'
          }`}>
            📅 Due: {new Date(task.dueDate).toLocaleDateString()} 
            {(() => {
              const daysUntil = Math.ceil((new Date(task.dueDate) - new Date()) / (1000 * 60 * 60 * 24));
              if (daysUntil < 0) return ' (🔴 Overdue!)';
              if (daysUntil === 0) return ' (🔴 Today!)';
              if (daysUntil === 1) return ' (🟡 Tomorrow!)';
              return ` (${daysUntil} days left)`;
            })()}
          </p>
        </div>
        <button
          onClick={() => onDeleteTask(task.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/20 p-2 rounded-lg transition"
        >
          ✕
        </button>
      </div>

      {/* 2 Bars one full grey and one colored based on completion */}
      <div className="mb-6">
        <div className="flex justify-between text-sm font-semibold text-gray-300 mb-2">
          <span>Progress</span>
          <span className={`${completionPercentage === 100 ? 'text-green-400' : 'text-blue-400'}`}>
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              completionPercentage === 100
                ? 'bg-gradient-to-r from-green-500 to-green-400'
                : 'bg-gradient-to-r from-blue-500 to-blue-400'
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Complete Task Checkbox */}
      <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/50 rounded-lg flex items-center gap-3">
        <input
          type="checkbox"
          checked={completionPercentage === 100}
          onChange={(e) => {
            if (e.target.checked) {
              onCompleteAllSubtasks(task.id);
            } else {
              onUndoComplete(task.id);
            }
          }}
          className="w-6 h-6 cursor-pointer accent-blue-500 rounded"
        />
        <label className="cursor-pointer text-white font-semibold flex-1">
          {completionPercentage === 100 ? '✅ Task Completed' : 'Mark Task as Done'}
        </label>
      </div>

      {/* Subtasks Toggle */}
      <button
        onClick={() => 
        {
          isExpanded = !isExpanded;
          if(isExpanded) {
            onExpandToggle(task.id);
          }
          else
          {
            onExpandToggle(null);
          }
        }
        }
        className="text-blue-400 hover:text-blue-300 font-semibold text-sm mb-4 flex items-center gap-2 transition"
      >
        {isExpanded ? '▼' : '▶'} 
        Subtasks ({task.subtasks.length})
      </button>

      {/* Subtasks List */}
      {isExpanded && (
        <div className="space-y-2 mt-5 p-4 bg-gray-700/50 rounded-xl border border-gray-600">
          {task.subtasks.map(subtask => (
            <div
              key={subtask.id}
              className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
            >
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => onToggleSubtask(task.id, subtask.id)}
                className="w-5 h-5 cursor-pointer accent-blue-500"
              />
              <span
                className={`flex-1 font-medium ${
                  subtask.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-100'
                }`}
              >
                {subtask.title}
              </span>
              <button
                onClick={() => onDeleteSubtask(task.id, subtask.id)}
                className="text-red-400 hover:text-red-300 text-sm hover:bg-red-500/20 px-2 py-1 rounded transition"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Add Subtask Form */}
          <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
            <input
              type="text"
              placeholder="Add subtask..."
              value={subtaskTitle}
              onChange={(e) => onSubtaskTitleChange(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  onAddSubtask(task.id);
                }
              }}
              className="flex-1 px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 text-sm transition"
            />
            <button
              onClick={() => onAddSubtask(task.id)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold text-sm"
            >
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
