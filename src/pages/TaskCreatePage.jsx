import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const TaskCreatePage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category_id: '',
    task_type: 'reactive',
    status: 'pending',
    priority: 'medium',
    due_date: '',
    assigned_to: '',
    apartment_id: '',
    area_id: '',
    hours_spent: '',
    estimated_cost: '',
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, categoryData, apartmentData, areaData] = await Promise.all([
          apiFetch('/api/users'),
          apiFetch('/api/categories'),
          apiFetch('/api/apartments'),
          apiFetch('/api/areas'),
        ]);
        setUsers(userData.users || []);
        setCategories(categoryData.categories || []);
        setApartments(apartmentData.apartments || []);
        setAreas(areaData.areas || []);
      } catch (err) {
        setError(err.message);
      }
    };
    if (isAdmin) {
      load();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return <div className="text-gray-600">{t('accessDenied')}</div>;
  }

  const handleChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          hours_spent: form.hours_spent ? Number(form.hours_spent) : null,
          estimated_cost: form.estimated_cost ? Number(form.estimated_cost) : null,
          apartment_id: form.apartment_id || null,
          area_id: form.area_id || null,
        }),
      });
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
      <h2 className="text-xl font-semibold mb-4">{t('newTask')}</h2>
      {error && <div className="text-red-600 mb-3">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">{t('name')}</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-gray-500">{t('notes')}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-2"
            rows={3}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">{t('category')}</label>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="">Select</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('assignedTo')}</label>
            <select
              name="assigned_to"
              value={form.assigned_to}
              onChange={handleChange}
              required
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="">Select</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">{t('type')}</label>
            <select
              name="task_type"
              value={form.task_type}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="preventive">{t('preventive')}</option>
              <option value="reactive">{t('corrective')}</option>
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('priority')}</label>
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">{t('dueDate')}</label>
            <input
              type="date"
              name="due_date"
              value={form.due_date}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('status')}</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="pending">{t('pending')}</option>
              <option value="in_progress">{t('inProgress')}</option>
              <option value="completed">{t('completed')}</option>
              <option value="cancelled">{t('cancelled')}</option>
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">{t('apartments')}</label>
            <select
              name="apartment_id"
              value={form.apartment_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="">None</option>
              {apartments.map(apartment => (
                <option key={apartment.id} value={apartment.id}>{apartment.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('areas')}</label>
            <select
              name="area_id"
              value={form.area_id}
              onChange={handleChange}
              className="w-full border rounded-lg px-2 py-2"
            >
              <option value="">None</option>
              {areas.map(area => (
                <option key={area.id} value={area.id}>{area.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">{t('hoursSpent')}</label>
            <input
              type="number"
              name="hours_spent"
              value={form.hours_spent}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="text-sm text-gray-500">{t('cost')}</label>
            <input
              type="number"
              name="estimated_cost"
              value={form.estimated_cost}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm"
        >
          {t('save')}
        </button>
      </form>
    </div>
  );
};

export default TaskCreatePage;
