import { useState, useCallback, useEffect } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { ChatBox } from './components/ChatBox';
import { ExpenseTracker } from './components/ExpenseTracker';
import { InventoryManagement } from './components/InventoryManagement';
import { QuizSystem } from './components/QuizSystem';
import { EventRegistration } from './components/EventRegistration';
import { SimpleCRM } from './components/SimpleCRM';
import { useRealtimeTasks } from './hooks/useRealtimeTasks';
import { apiFetch } from './lib/api';
import type { Task } from './types';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'tasks' | 'attendance' | 'expenses' | 'inventory' | 'quiz' | 'event' | 'simple' | 'chat'>('tasks');

  const handleTaskChange = useCallback((newTasks: Task[]) => {
    setTasks(newTasks);
    setLoading(false);
  }, []);

  const { refetch } = useRealtimeTasks(handleTaskChange);

  // Initial fetch via API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await apiFetch('/api/tasks');
        if (res.ok) {
          const data = await res.json();
          setTasks(data);
        }
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  return (
    <div className="app">
      {/* Background decoration */}
      <div className="bg-decoration">
        <div className="bg-orb bg-orb-1"></div>
        <div className="bg-orb bg-orb-2"></div>
        <div className="bg-orb bg-orb-3"></div>
      </div>

      {/* Header */}
      <header className="app-header" id="app-header">
        <div className="header-content">
          <div className="logo">
            <span className="logo-icon">✅</span>
            <div>
              <h1>Devops</h1>
              <p className="header-subtitle">Hệ thống tổng hợp</p>
            </div>
          </div>
          <nav className="tab-nav" id="tab-nav">
            <button
              className={`tab-btn ${activeTab === 'tasks' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('tasks')}
              id="tab-tasks"
            >
              📋 Tasks
            </button>

            <button
              className={`tab-btn ${activeTab === 'attendance' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('attendance')}
              id="tab-attendance"
            >
              📋 Attendance
            </button>

            <button
              className={`tab-btn ${activeTab === 'expenses' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('expenses')}
              id="tab-expenses"
            >
              📋Expenses
            </button>

            <button
              className={`tab-btn ${activeTab === 'inventory' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('inventory')}
              id="tab-inventory"
            >
              📋Inventory
            </button>

            <button
              className={`tab-btn ${activeTab === 'quiz' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('quiz')}
              id="tab-quiz"
            >
              📋Quiz
            </button>

            <button
              className={`tab-btn ${activeTab === 'event' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('event')}
              id="tab-event"
            >
              📋Event
            </button>

            <button
              className={`tab-btn ${activeTab === 'simple' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('simple')}
              id="tab-simple"
            >
              📋Simple
            </button>

            <button
              className={`tab-btn ${activeTab === 'chat' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('chat')}
              id="tab-chat"
            >
              💬 Chat
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {activeTab === 'tasks' ? (
          <div className="orders-layout">
            <aside className="orders-sidebar">
              <TaskForm onTaskCreated={refetch} />
            </aside>
            <section className="orders-content">
              <TaskList tasks={tasks} onTaskUpdated={refetch} loading={loading} />
            </section>
          </div>
        ) : activeTab === 'chat' ? (
          <div className="chat-layout">
            <ChatBox />
          </div>
        ) : activeTab === 'expenses' ? (
          <ExpenseTracker />
        ) : activeTab === 'inventory' ? (
          <InventoryManagement />
        ) : activeTab === 'quiz' ? (
          <QuizSystem />
        ) : activeTab === 'event' ? (
          <EventRegistration />
        ) : activeTab === 'simple' ? (
          <SimpleCRM />
        ) : (
          <div className="placeholder-layout" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2>Đang phát triển chức năng: {activeTab}</h2>
            <p>Tính năng này đang được xây dựng và sẽ sớm hoàn thiện.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Order Tracking System — DevOps Lab © 2026</p>
      </footer>
    </div>
  );
}

export default App;