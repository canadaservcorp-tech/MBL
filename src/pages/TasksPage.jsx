import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const TasksPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const loadTasks = async () => {
    try {
      const query = statusFilter ? `?status=${statusFilter}` : '';
      const data = await apiFetch(`/api/tasks${query}`);
      setTasks(data.tasks || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('tasks')}</h2>
        {isAdmin && (
          <Link
            to="/tasks/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
          >
            {t('newTask')}
          </Link>
        )}
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm text-gray-500">{t('status')}</label>
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="border rounded-lg px-2 py-1 text-sm"
        >
          <option value="">All</option>
          <option value="open">{t('open')}</option>
          <option value="in_progress">{t('inProgress')}</option>
          <option value="completed">{t('completed')}</option>
          <option value="blocked">{t('blocked')}</option>
        </select>
      </div>

      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {tasks.map(task => (
          <Link
            key={task.id}
            to={`/tasks/${task.id}`}
            className="block px-6 py-4 hover:bg-gray-50"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">{task.assigned_name} · {task.due_date || t('dueDate')}</p>
              </div>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{task.status}</span>
            </div>
          </Link>
        ))}
        {tasks.length === 0 && (
          <div className="px-6 py-6 text-sm text-gray-500">No tasks found.</div>
        )}
      </div>
    </div>
  );
};

export default TasksPage;
