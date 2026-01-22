import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const DashboardPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [overview, setOverview] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        if (isAdmin) {
          const data = await apiFetch('/api/overview');
          setOverview(data);
        }
        const taskData = await apiFetch('/api/tasks');
        setTasks(taskData.tasks || []);
      } catch (err) {
        setError(err.message);
      }
    };
    load();
  }, [isAdmin]);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: t('open'), value: overview.totals.open_count },
            { label: t('inProgress'), value: overview.totals.in_progress_count },
            { label: t('completed'), value: overview.totals.completed_count },
            { label: t('blocked'), value: overview.totals.blocked_count },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {overview && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: t('totalBuilding'), value: overview.total_cost },
            { label: t('totalApartments'), value: overview.apartments_cost },
            { label: t('totalCommonAreas'), value: overview.common_areas_cost },
          ].map((item) => (
            <div key={item.label} className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="text-2xl font-bold">${Number(item.value || 0).toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold mb-4">{t('tasks')}</h3>
        <div className="space-y-3">
          {tasks.slice(0, 6).map(task => (
            <div key={task.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{task.title}</p>
                <p className="text-xs text-gray-500">{task.due_date || t('dueDate')}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{task.status}</span>
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="text-sm text-gray-500">No tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
