


import React, { useEffect, useState, useCallback } from 'react';
import type { FormEvent, ChangeEvent, KeyboardEvent } from 'react';

// Types
interface Task {
  id: number;
  title: string;
  completed: boolean;
}
type Filter = 'all' | 'active' | 'completed';

// Constants
const API_URL = 'http://localhost:3000/tasks'; // Adjust if your middleware runs on a different port or route

const App: React.FC = () => {
  // State
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');


  // Fetch tasks from API (optimized: only update if changed)
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data: Task[] = await res.json();
      setTasks(prev => {
        // Only update if data actually changed (shallow compare)
        if (prev.length === data.length && prev.every((t, i) => t.id === data[i].id && t.title === data[i].title && t.completed === data[i].completed)) {
          return prev;
        }
        return data;
      });
    } catch (err) {
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Add a new task (optimized: optimistic UI update)
  const addTask = useCallback(async (e: FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const optimisticTask: Task = {
      id: Date.now(),
      title: newTask,
      completed: false
    };
    setTasks(prev => [optimisticTask, ...prev]);
    setNewTask('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: optimisticTask.title })
      });
      if (res.ok) {
        fetchTasks();
      } else {
        // Rollback if failed
        setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
      }
    } catch {
      setTasks(prev => prev.filter(t => t.id !== optimisticTask.id));
    }
  }, [newTask, fetchTasks]);


  // Toggle task completion (optimized: optimistic UI update)
  const toggleTask = useCallback(async (id: number, completed: boolean) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !completed })
      });
      fetchTasks();
    } catch {
      // Rollback if needed (optional)
    }
  }, [fetchTasks]);


  // Delete a task (optimized: optimistic UI update)
  const deleteTask = useCallback(async (id: number) => {
    const prevTasks = tasks;
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch {
      setTasks(prevTasks); // Rollback if failed
    }
  }, [fetchTasks, tasks]);

  // Edit a task title
  const startEdit = (id: number, title: string) => {
    setEditingId(id);
    setEditingTitle(title);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const handleEditChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEditingTitle(e.target.value);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') saveEdit(id);
    if (e.key === 'Escape') cancelEdit();
  };


  // Save edit (optimized: optimistic UI update)
  const saveEdit = async (id: number) => {
    if (!editingTitle.trim()) return;
    const prevTasks = tasks;
    setTasks(prev => prev.map(t => t.id === id ? { ...t, title: editingTitle } : t));
    setEditingId(null);
    setEditingTitle('');
    try {
      await fetch(`${API_URL}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editingTitle })
      });
      fetchTasks();
    } catch {
      setTasks(prevTasks); // Rollback if failed
    }
  };


  // Clear completed tasks (optimized: optimistic UI update)
  const clearCompleted = useCallback(async () => {
    const completedIds = tasks.filter(t => t.completed).map(t => t.id);
    const prevTasks = tasks;
    setTasks(prev => prev.filter(t => !t.completed));
    try {
      await Promise.all(completedIds.map(id => fetch(`${API_URL}/${id}`, { method: 'DELETE' })));
      fetchTasks();
    } catch {
      setTasks(prevTasks); // Rollback if failed
    }
  }, [tasks, fetchTasks]);

  // Filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="max-w-xl mx-auto mt-12 font-sans bg-gradient-to-br from-slate-50 to-blue-100 rounded-2xl shadow-2xl p-9 border border-slate-200 min-h-[480px]">
      <h1 className="text-center text-blue-600 mb-7 tracking-wide font-bold text-3xl drop-shadow">📝 Task Tracker</h1>
      <form onSubmit={addTask} className="flex gap-3.5 mb-7 bg-white rounded-xl shadow p-2 border border-slate-200">
        <input
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-3 border-none rounded-lg text-lg outline-none bg-slate-100 font-medium text-slate-800 shadow-sm"
        />
        <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white border-none rounded-lg px-7 py-3 font-bold text-lg cursor-pointer shadow transition-colors">Add</button>
      </form>
      {/* Filter Buttons */}
      <div className="flex justify-center gap-3 mb-4.5">
        <button type="button" onClick={() => setFilter('all')} className={`px-4 py-1.5 rounded-md font-semibold text-sm cursor-pointer border-none ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}>All</button>
        <button type="button" onClick={() => setFilter('active')} className={`px-4 py-1.5 rounded-md font-semibold text-sm cursor-pointer border-none ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}>Active</button>
        <button type="button" onClick={() => setFilter('completed')} className={`px-4 py-1.5 rounded-md font-semibold text-sm cursor-pointer border-none ${filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800'}`}>Completed</button>
      </div>
      {/* Clear Completed Button */}
      <div className="flex justify-end mb-2.5">
        <button
          type="button"
          onClick={clearCompleted}
          className={`bg-red-600 text-white border-none rounded-md px-4 py-1.5 font-semibold text-sm cursor-pointer transition-opacity ${tasks.some(t => t.completed) ? '' : 'opacity-50 pointer-events-none'}`}
        >
          Clear Completed
        </button>
      </div>
      {loading ? (
        <p className="text-center text-slate-500 font-medium text-lg">Loading...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center text-slate-400 font-medium text-lg">No tasks found for this filter.</p>
      ) : (
        <ul className="list-none p-0 m-0">
          {filteredTasks.map(task => (
            <li
              key={task.id}
              className={`flex items-center gap-3.5 my-3 bg-white rounded-xl py-3 px-4 shadow border-2 transition-all ${task.completed ? 'bg-gradient-to-r from-teal-100 to-green-50 border-green-500 opacity-70' : 'border-slate-200'} `}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id, task.completed)}
                className="w-[22px] h-[22px] accent-blue-600 cursor-pointer"
              />
              {editingId === task.id ? (
                <>
                  <input
                    value={editingTitle}
                    onChange={handleEditChange}
                    onKeyDown={e => handleEditKeyDown(e, task.id)}
                    autoFocus
                    className="flex-1 text-lg border border-slate-300 rounded px-2 py-1 mr-2"
                  />
                  <button onClick={() => saveEdit(task.id)} className="bg-green-600 text-white border-none rounded px-3 py-1 font-medium text-sm cursor-pointer mr-1">Save</button>
                  <button onClick={cancelEdit} className="bg-slate-200 text-slate-800 border-none rounded px-3 py-1 font-medium text-sm cursor-pointer">Cancel</button>
                </>
              ) : (
                <span
                  className={`flex-1 break-words font-semibold tracking-wide text-lg cursor-pointer ${task.completed ? 'line-through text-green-600' : 'text-slate-800'}`}
                  onDoubleClick={() => startEdit(task.id, task.title)}
                  title="Double click to edit"
                >
                  {task.title}
                </span>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="bg-gradient-to-r from-red-400 to-yellow-300 text-white border-none rounded-md px-4 py-1.5 font-semibold text-sm cursor-pointer ml-2 shadow transition-colors"
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
