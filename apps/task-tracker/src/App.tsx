

import React, { useEffect, useState, useCallback } from 'react';

// Import Google Font once in index.html or main entry, not in component

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://localhost:3000/tasks'; // Adjust if your middleware runs on a different port or route



type Filter = 'all' | 'active' | 'completed';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  // Fetch tasks from API
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Add a new task
  const addTask = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTask })
      });
      if (res.ok) {
        setNewTask('');
        fetchTasks();
      }
    } catch {}
  }, [newTask, fetchTasks]);

  // Toggle task completion
  const toggleTask = useCallback(async (id: number, completed: boolean) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      fetchTasks();
    } catch {}
  }, [fetchTasks]);

  // Delete a task
  const deleteTask = useCallback(async (id: number) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch {}
  }, [fetchTasks]);

  // Edit a task title
  const startEdit = (id: number, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEdit = async (id: number) => {
    if (!editingTitle.trim()) return;
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle })
      });
      setEditingId(null);
      setEditingTitle('');
      fetchTasks();
    } catch {}
  };

  // Clear completed tasks
  const clearCompleted = async () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    await Promise.all(completedIds.map(id => fetch(`${API_URL}/${id}`, { method: 'DELETE' })));
    fetchTasks();
  };

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div style={{
      maxWidth: 520,
      margin: '3rem auto',
      fontFamily: 'Inter, sans-serif',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      borderRadius: 20,
      boxShadow: '0 8px 32px rgba(44,62,80,0.10)',
      padding: 36,
      border: '1.5px solid #e2e8f0',
      minHeight: 480,
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2563eb',
        marginBottom: 28,
        letterSpacing: 1,
        fontWeight: 700,
        fontSize: 32,
        textShadow: '0 2px 8px rgba(49,130,206,0.08)'
      }}>📝 Task Tracker</h1>
      <form onSubmit={addTask} style={{
        display: 'flex',
        gap: 14,
        marginBottom: 28,
        background: '#fff',
        borderRadius: 10,
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
        padding: 8,
        border: '1px solid #e2e8f0',
      }}>
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: '12px 16px',
            border: 'none',
            borderRadius: 8,
            fontSize: 17,
            outline: 'none',
            background: '#f1f5f9',
            fontWeight: 500,
            color: '#2d3748',
            boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
          }}
        />
        <button type="submit" style={{
          background: 'linear-gradient(90deg, #2563eb 60%, #60a5fa 100%)',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 28px',
          fontWeight: 700,
          fontSize: 17,
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(49,130,206,0.10)',
          transition: 'background 0.2s',
        }}>Add</button>
      </form>
      {/* Filter Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 18 }}>
        <button type="button" onClick={() => setFilter('all')} style={{
          background: filter === 'all' ? '#2563eb' : '#e2e8f0',
          color: filter === 'all' ? '#fff' : '#2d3748',
          border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        }}>All</button>
        <button type="button" onClick={() => setFilter('active')} style={{
          background: filter === 'active' ? '#2563eb' : '#e2e8f0',
          color: filter === 'active' ? '#fff' : '#2d3748',
          border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        }}>Active</button>
        <button type="button" onClick={() => setFilter('completed')} style={{
          background: filter === 'completed' ? '#2563eb' : '#e2e8f0',
          color: filter === 'completed' ? '#fff' : '#2d3748',
          border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
        }}>Completed</button>
      </div>
      {/* Clear Completed Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
        <button type="button" onClick={clearCompleted} style={{
          background: '#e53e3e', color: '#fff', border: 'none', borderRadius: 7, padding: '7px 18px', fontWeight: 600, fontSize: 15, cursor: 'pointer',
          opacity: tasks.some(t => t.completed) ? 1 : 0.5,
          pointerEvents: tasks.some(t => t.completed) ? 'auto' : 'none',
        }}>Clear Completed</button>
      </div>
      {loading ? (
        <p style={{ textAlign: 'center', color: '#64748b', fontWeight: 500, fontSize: 18 }}>Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#a0aec0', fontWeight: 500, fontSize: 18 }}>No tasks found for this filter.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredTasks.map(task => (
            <li
              key={task.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                margin: '12px 0',
                background: task.completed ? 'linear-gradient(90deg, #e6fffa 0%, #f0fff4 100%)' : '#fff',
                borderRadius: 10,
                padding: '12px 16px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                border: task.completed ? '2px solid #38a169' : '2px solid #e2e8f0',
                opacity: task.completed ? 0.7 : 1,
                transition: 'border 0.2s, opacity 0.2s',
              }}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                style={{ width: 22, height: 22, accentColor: '#2563eb', cursor: 'pointer' }}
              />
              {editingId === task.id ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEdit(task.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    autoFocus
                    style={{
                      flex: 1,
                      fontSize: 18,
                      border: '1px solid #cbd5e1',
                      borderRadius: 6,
                      padding: '6px 10px',
                      marginRight: 8,
                    }}
                  />
                  <button onClick={() => saveEdit(task.id)} style={{ background: '#38a169', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, fontSize: 15, cursor: 'pointer', marginRight: 4 }}>Save</button>
                  <button onClick={cancelEdit} style={{ background: '#e2e8f0', color: '#2d3748', border: 'none', borderRadius: 6, padding: '6px 14px', fontWeight: 500, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
                </>
              ) : (
                <span
                  style={{
                    textDecoration: task.completed ? 'line-through' : undefined,
                    color: task.completed ? '#38a169' : '#2d3748',
                    fontSize: 18,
                    flex: 1,
                    wordBreak: 'break-word',
                    fontWeight: 600,
                    letterSpacing: 0.2,
                    cursor: 'pointer',
                  }}
                  onDoubleClick={() => startEdit(task.id, task.title)}
                  title="Double click to edit"
                >
                  {task.title}
                </span>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: 'linear-gradient(90deg, #f87171 60%, #fbbf24 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 7,
                  padding: '7px 18px',
                  fontWeight: 600,
                  fontSize: 15,
                  cursor: 'pointer',
                  marginLeft: 8,
                  boxShadow: '0 1px 4px rgba(251,191,36,0.10)',
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
