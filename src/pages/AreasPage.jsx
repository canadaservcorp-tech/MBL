import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const AreasPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [areas, setAreas] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', type: 'common', floor: '', category: '', notes: '' });

  const loadData = async () => {
    try {
      const data = await apiFetch('/api/areas');
      setAreas(data.areas || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiFetch('/api/areas', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          floor: form.floor ? Number(form.floor) : null,
        }),
      });
      setForm({ name: '', type: 'common', floor: '', category: '', notes: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('areas')}</h2>
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {areas.map(area => (
          <div key={area.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{area.name}</p>
                <p className="text-xs text-gray-500">{area.type} · {area.category || ''}</p>
              </div>
              <span className="text-xs text-gray-500">{area.floor ? `Floor ${area.floor}` : ''}</span>
            </div>
          </div>
        ))}
        {areas.length === 0 && (
          <div className="px-6 py-6 text-sm text-gray-500">No areas yet.</div>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
          <h3 className="font-semibold mb-4">{t('addArea')}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder={t('name')}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="grid md:grid-cols-2 gap-3">
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-2 py-2"
              >
                <option value="common">Common</option>
                <option value="service">Service</option>
              </select>
              <input
                name="floor"
                value={form.floor}
                onChange={handleChange}
                placeholder="Floor"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder={t('category')}
              className="w-full border rounded-lg px-3 py-2"
            />
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder={t('notes')}
              className="w-full border rounded-lg px-3 py-2"
              rows={3}
            />
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              {t('save')}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AreasPage;
