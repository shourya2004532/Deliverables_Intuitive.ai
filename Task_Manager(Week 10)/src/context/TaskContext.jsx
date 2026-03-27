import { createContext, useState, useEffect } from 'react';

export const TaskContext = createContext();

export function TaskProvider({ children }) {
  // Main Tasks State - Initialize from localStorage 
  const [mainTasks, setMainTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('mainTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading mainTasks:', error);
      return [];
    }
  });
  
  // Daily Tasks State - Initialize from localStorage 
  const [dailyTasks, setDailyTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('dailyTasks');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading dailyTasks:', error);
      return [];
    }
  });
  
  // Persist mainTasks
  useEffect(() => {
    localStorage.setItem('mainTasks', JSON.stringify(mainTasks));
  }, [mainTasks]);
  
  // Persist dailyTasks
  useEffect(() => {
    localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
  }, [dailyTasks]);
  
  // Main Tasks Functions
  const addMainTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      subtasks: [],
      completed: false,
      createdAt: new Date().toISOString()
    };
    setMainTasks([...mainTasks, newTask]);
    return newTask.id;
  };
  
  const deleteMainTask = (id) => {
    setMainTasks(mainTasks.filter(task => task.id !== id));
  };
  
  const addSubtask = (taskId, subtask) => {
    setMainTasks(mainTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: [...task.subtasks, { id: Date.now(), ...subtask, completed: false }]
        };
      }
      return task;
    }));
  };
  
  const toggleSubtask = (taskId, subtaskId) => {
    setMainTasks(mainTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st => 
            st.id === subtaskId ? { ...st, completed: !st.completed } : st
          )
        };
      }
      return task;
    }));
  };
  
  const deleteSubtask = (taskId, subtaskId) => {
    setMainTasks(mainTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.filter(st => st.id !== subtaskId)
        };
      }
      return task;
    }));
  };

  const completeAllSubtasks = (taskId) => {
    setMainTasks(mainTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st => ({ ...st, completed: true })),
          completed: true
        };
      }
      return task;
    }));
  };

  const undoCompleteTask = (taskId) => {
    setMainTasks(mainTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          subtasks: task.subtasks.map(st => ({ ...st, completed: false })),
          completed: false
        };
      }
      return task;
    }));
  };
  
  // Daily Tasks Functions
  const addDailyTask = (task) => {
    const today = new Date().toISOString().split('T')[0];
    const newTask = {
      id: Date.now(),
      ...task,
      date: today,
      value: 0,
      excluded: false,
      threshold: task.threshold
    };
    setDailyTasks([...dailyTasks, newTask]);
  };
  
  const updateDailyTaskValue = (taskId, date, value) => {
    setDailyTasks(dailyTasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          date,
          value: parseFloat(value) || 0
        };
      }
      return task;
    }));
  };
  
  const toggleExcludeDate = (taskId, date, excluded) => {
    const existingEntry = dailyTasks.find(t => t.id === taskId && t.date === date);
    if (existingEntry) {
      setDailyTasks(dailyTasks.map(task => 
        task.id === taskId && task.date === date ? { ...task, excluded } : task
      ));
    } else {
      // If no entry exists, create one with excluded flag
      setDailyTasks([...dailyTasks, {
        id: taskId,
        date,
        value: 0,
        excluded,
        threshold: getTaskThreshold(taskId)
      }]);
    }
  };
  
  const updateDailyTaskValueForDate = (taskId, date, value) => {
    const existingEntry = dailyTasks.find(t => t.id === taskId && t.date === date);
    if (existingEntry) {
      setDailyTasks(dailyTasks.map(task => 
        task.id === taskId && task.date === date ? { ...task, value: parseFloat(value) || 0 } : task
      ));
    } else {
      setDailyTasks([...dailyTasks, {
        id: taskId,
        date,
        value: parseFloat(value) || 0,
        excluded: false,
        threshold: getTaskThreshold(taskId)
      }]);
    }
  };
  
  const deleteDailyTask = (id) => {
    setDailyTasks(dailyTasks.filter(task => task.id !== id));
  };
  
  const getTaskThreshold = (taskId) => {
    const task = dailyTasks.find(t => t.id === taskId);
    return task?.threshold || 0;
  };
  

  // Get daily tasks for a specific task over a date range (e.g., last 7 days)
  const getDailyTasksByRange = (taskId, days = 7) => {
    const today = new Date();
    const range = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      range.push(date.toISOString().split('T')[0]);
    }
    
    return range.map(date => {
      const entry = dailyTasks.find(t => t.id === taskId && t.date === date);
      return {
        date,
        value: entry?.value || 0,
        excluded: entry?.excluded || false
      };
    });
  };

  const value = {
    // Main Tasks
    mainTasks,
    addMainTask,
    deleteMainTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    completeAllSubtasks,
    undoCompleteTask,
    
    // Daily Tasks
    dailyTasks,
    addDailyTask,
    updateDailyTaskValue,
    toggleExcludeDate,
    updateDailyTaskValueForDate,
    deleteDailyTask,
    getDailyTasksByRange,
    getTaskThreshold
  };
  
  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}
