
import React, { useEffect, useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:3000/tasks'; // Adjust if your middleware runs on a different port or route

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      // Handle error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTask })
    });
    if (res.ok) {
      setNewTask('');
      fetchTasks();
    }
  };

  const toggleTask = async (id: number, completed: boolean) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !completed })
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
    <div style={{ maxWidth: 480, margin: '3rem auto', fontFamily: 'Inter, sans-serif', background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', padding: 32 }}>
      <h1 style={{ textAlign: 'center', color: '#2d3748', marginBottom: 24, letterSpacing: 1 }}>📝 Task Tracker</h1>
      <form onSubmit={addTask} style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: '10px 14px',
            border: '1px solid #e2e8f0',
            borderRadius: 8,
            fontSize: 16,
            outline: 'none',
            background: '#f7fafc',
            transition: 'border 0.2s',
          }}
        />
        <button type="submit" style={{
          background: '#3182ce',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          fontWeight: 600,
          fontSize: 16,
          cursor: 'pointer',
          transition: 'background 0.2s',
        }}>Add</button>
      </form>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#718096' }}>Loading...</p>
      ) : tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a0aec0' }}>No tasks yet. Add your first task!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {tasks.map(task => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                margin: '10px 0',
                background: '#f7fafc',
                borderRadius: 8,
                padding: '10px 14px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                border: task.completed ? '1.5px solid #38a169' : '1.5px solid #e2e8f0',
                opacity: task.completed ? 0.7 : 1,
                transition: 'border 0.2s, opacity 0.2s',
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                style={{ width: 20, height: 20, accentColor: '#3182ce', cursor: 'pointer' }}
              />
              <span
                style={{
                  textDecoration: task.completed ? 'line-through' : undefined,
                  color: task.completed ? '#38a169' : '#2d3748',
                  fontSize: 17,
                  flex: 1,
                  wordBreak: 'break-word',
                  fontWeight: 500,
                }}
              >
                {task.title}
              </span>
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: '#e53e3e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 14px',
                  fontWeight: 500,
                  fontSize: 15,
                  cursor: 'pointer',
                  marginLeft: 8,
                  transition: 'background 0.2s',
                }}
                title="Delete task"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
