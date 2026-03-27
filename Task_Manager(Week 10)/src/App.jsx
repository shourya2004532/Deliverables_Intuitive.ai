import { useState } from 'react'
import { TaskProvider } from './context/TaskContext'
import { MainTasks } from './pages/MainTasks'
import { DailyTasks } from './pages/DailyTasks'
import './App.css'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('main') // 'main' or 'daily'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-2xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-white">Task Manager</h1>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage('main')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentPage === 'main'
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'text-white hover:bg-blue-500'
                  }`}
                >
                  <span>📋</span> Main Tasks
                </button>
                <button
                  onClick={() => setCurrentPage('daily')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
                    currentPage === 'daily'
                      ? 'bg-white text-blue-600 shadow-lg scale-105'
                      : 'text-white hover:bg-blue-500'
                  }`}
                >
                  <span>📅</span> Daily Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>


      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        {currentPage === 'main' ? <MainTasks /> : <DailyTasks />}
      </main>
    </div>
  )
}

function App() {
  return (
    <TaskProvider>
      <AppContent />
    </TaskProvider>
  )
}

export default App
