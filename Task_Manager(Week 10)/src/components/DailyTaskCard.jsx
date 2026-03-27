import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

// Component for individual daily task card 
export function DailyTaskCard({
  task,
  isExpanded,
  streak,
  status,
  dailyTasks,
  todayValue,
  editingDate,
  editingValue,
  onExpandToggle,
  onTodayValueChange,
  onRecordValue,
  onEditDateClick,
  onEditValueChange,
  onSaveEdit,
  onToggleExclude,
  onDeleteTask,
  getDailyTasksByRange,
  getTaskThreshold
}) {
  const data = getDailyTasksByRange(task.id, 7);
  const chartData = data
    .filter(d => !d.excluded)
    .map(d => {
      const entry = dailyTasks.find(t => t.id === task.id && t.date === d.date);
      return {
        date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: d.value,
        threshold: task.threshold,
        excluded: d.excluded
      };
    });

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-2xl shadow-xl overflow-hidden border border-gray-600 transition-all duration-300 hover:shadow-2xl">
      {/* Collapsed Header */}
      <button
        onClick={() => 
        {
          isExpanded = !isExpanded;
          if(isExpanded)
          {
            onExpandToggle(task.id);
          }
          else
          {
            onExpandToggle(null);
          }
        }
        }
        className="w-full p-6 hover:bg-gray-700/50 transition flex justify-between items-center cursor-pointer group"
      >
        <div className="flex items-center gap-6 text-left flex-1">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition">{task.name}</h3>
            <p className="text-sm text-gray-400 mt-1">
              🎯 Threshold: <span className="font-semibold text-gray-300">{task.threshold}</span>
            </p>
          </div>
          <div className="text-right mr-4">
            <div className={`text-4xl font-black ${
              streak < 2 ? 'text-red-400' :
              streak < 4 ? 'text-yellow-400' :
              streak < 7 ? 'text-green-400' :
              'text-blue-400'
            }`}>
              {streak}
            </div>
            <p className="text-xs text-gray-400 mt-1">Day Streak</p>
          </div>
        </div>
        <button className={`text-3xl text-gray-500 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} onclick="isExpanded = !isExpanded">
          ▼
        </button>
      </button>

      
      {isExpanded && (
        <>
          <div className={`px-6 pt-4 pb-6 border-t border-gray-600 bg-gradient-to-r ${
            streak < 2 ? 'from-red-900/30 to-red-800/30' :
            streak < 4 ? 'from-yellow-900/30 to-yellow-800/30' :
            streak < 7 ? 'from-green-900/30 to-green-800/30' :
            'from-blue-900/30 to-blue-800/30'
          }`}>
            <span className={`inline-block px-6 py-3 rounded-full font-bold text-white ${
              streak < 2 ? 'bg-red-600' :
              streak < 4 ? 'bg-yellow-600' :
              streak < 7 ? 'bg-green-600' :
              'bg-blue-600'
            }`}>
              {status.label} Performance
            </span>
          </div>

         
          <div className="p-6 border-b border-gray-600">
            <h4 className="text-lg font-bold text-white mb-4">📊 Last 7 Days Progress</h4>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #4b5563' }}
                  formatter={(value, name) => {
                    if (name === 'value') return [value, 'Your Value'];
                    if (name === 'threshold') return [value, 'Threshold'];
                    return value;
                  }}
                />
               
                <ReferenceLine 
                  y={task.threshold} 
                  stroke="#f59e0b" 
                  strokeDasharray="5 5"
                  label={{ value: 'Threshold', position: 'right', fill: '#f59e0b' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  dot={{ fill: '#3b82f6', r: 5 }}
                  isAnimationActive={true}
                  name="Your Value"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-6 border-b border-gray-600 bg-gray-700/50">
            <h4 className="text-lg font-bold text-white mb-4">📝 Record Today's Value</h4>
            <div className="flex gap-3">
              <input
                type="number"
                placeholder="Enter today's value..."
                value={todayValue}
                onChange={(e) => onTodayValueChange(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 transition"
              />
              <button
                onClick={() => onRecordValue(task.id)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-green-800 transition font-bold shadow-lg hover:shadow-xl hover:shadow-green-600/50"
              >
                Record
              </button>
            </div>
          </div>

          {/* Past 7 Days Data Entry */}
          <div className="p-6 border-b border-gray-600">
            <h4 className="text-lg font-bold text-white mb-4">📅 Edit Past Values (Last 7 Days)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((entry, idx) => {
                const entryData = dailyTasks.find(t => t.id === task.id && t.date === entry.date);
                const dateObj = new Date(entry.date);
                const isToday = entry.date === new Date().toISOString().split('T')[0];
                const isExcluded = entry.excluded;
                const editingKey = `${entry.date}-${task.id}`;
                
                return (
                  <div
                    key={idx}
                    className={`p-5 rounded-xl border-2 transition duration-200 ${
                      isExcluded
                        ? 'border-gray-600 bg-gray-700/50'
                        : entryData && entry.value >= task.threshold
                        ? 'border-green-500/60 bg-green-900/20'
                        : 'border-red-600 bg-red-700/30'
                    }`}
                  >
                    <p className="text-sm font-bold text-gray-300 mb-3">
                      {dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      {isToday && <span className="ml-2 text-blue-400 font-black">(Today)</span>}
                    </p>
                    
                    {editingDate === editingKey ? (
                      <div className="space-y-2">
                        <input
                          type="number"
                          value={editingValue}
                          onChange={(e) => onEditValueChange(e.target.value)}
                          step="0.1"
                          className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => onSaveEdit(task.id, entry.date, editingValue)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-bold transition"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className={`text-3xl font-black mb-3 ${
                          isExcluded ? 'text-gray-500' : 'text-white'
                        }`}>
                          {isExcluded ? '-' : entry?.value || 0}
                        </p>
                        
                        {!isExcluded && (
                          <button
                            onClick={() => onEditDateClick(editingKey, entry.value)}
                            className="w-full bg-gray-600 hover:bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-semibold transition mb-2"
                          >
                            ✎ Edit
                          </button>
                        )}
                        
                        <button
                          onClick={() => onToggleExclude(task.id, entry.date, !isExcluded)}
                          className={`w-full px-3 py-2 rounded-lg text-sm transition font-bold ${
                            isExcluded
                              ? 'bg-yellow-600/50 hover:bg-yellow-600/70 text-yellow-300 border border-yellow-500/50'
                              : 'bg-gray-600 hover:bg-gray-500 text-white'
                          }`}
                        >
                          {isExcluded ? 'Include' : 'Exclude'}
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          
          <div className="p-6 bg-red-900/20 border-t border-gray-600">
            <button
              onClick={() => onDeleteTask(task.id)}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg transition font-bold shadow-lg hover:shadow-xl hover:shadow-red-600/50"
            >
              🗑️ Delete Task
            </button>
          </div>
        </>
      )}
    </div>
  );
}
