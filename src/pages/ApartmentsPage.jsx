import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const ApartmentsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [apartments, setApartments] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ floor: '', number: '', label: '' });

  const loadData = async () => {
    try {
      const data = await apiFetch('/api/apartments');
      setApartments(data.apartments || []);
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
      await apiFetch('/api/apartments', {
        method: 'POST',
        body: JSON.stringify({
          floor: Number(form.floor),
          number: Number(form.number),
          label: form.label,
        }),
      });
      setForm({ floor: '', number: '', label: '' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const resetApartments = async () => {
    if (!window.confirm(t('confirmReset'))) {
      return;
    }
    try {
      await apiFetch('/api/apartments/reset', { method: 'POST' });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const grouped = apartments.reduce((acc, apt) => {
    acc[apt.floor] = acc[apt.floor] || [];
    acc[apt.floor].push(apt);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{t('apartments')}</h2>
        {isAdmin && (
          <button
            type="button"
            onClick={resetApartments}
            className="px-3 py-2 text-sm border rounded-lg"
          >
            {t('resetApartments')}
          </button>
        )}
      </div>
      {error && <div className="text-red-600">{error}</div>}

      {Object.keys(grouped).map(floor => (
        <div key={floor} className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="font-semibold mb-3">Floor {floor}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {grouped[floor].map(apartment => (
              <div key={apartment.id} className="border rounded-lg px-3 py-2 text-sm">
                {apartment.label}
              </div>
            ))}
          </div>
        </div>
      ))}

      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-md">
          <h3 className="font-semibold mb-4">{t('addApartment')}</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              name="floor"
              value={form.floor}
              onChange={handleChange}
              placeholder="Floor"
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="number"
              value={form.number}
              onChange={handleChange}
              placeholder="Number"
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="label"
              value={form.label}
              onChange={handleChange}
              placeholder="Label (ex: 1-01)"
              className="w-full border rounded-lg px-3 py-2"
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

export default ApartmentsPage;
