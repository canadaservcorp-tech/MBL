import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const AssetsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    category: '',
    area_type: 'area',
    area_id: '',
    apartment_id: '',
    next_due_date: '',
    interval_days: '',
    notes: '',
  });
  const [areas, setAreas] = useState([]);
  const [apartments, setApartments] = useState([]);

  const loadData = async () => {
    try {
      const [assetData, areaData, apartmentData] = await Promise.all([
        apiFetch('/api/assets'),
        apiFetch('/api/areas'),
        apiFetch('/api/apartments'),
      ]);
      setAssets(assetData.assets || []);
      setAreas(areaData.areas || []);
      setApartments(apartmentData.apartments || []);
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
      await apiFetch('/api/assets', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          interval_days: form.interval_days ? Number(form.interval_days) : null,
          area_id: form.area_id || null,
          apartment_id: form.apartment_id || null,
        }),
      });
      setForm({
        name: '',
        category: '',
        area_type: 'area',
        area_id: '',
        apartment_id: '',
        next_due_date: '',
        interval_days: '',
        notes: '',
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('assets')}</h2>
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {assets.map(asset => (
          <div key={asset.id} className="px-6 py-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{asset.name}</p>
              <p className="text-xs text-gray-500">{asset.category} · {asset.next_due_date || '-'}</p>
            </div>
            <span className="text-xs text-gray-500">{asset.contractor_name || ''}</span>
          </div>
        ))}
        {assets.length === 0 && (
          <div className="px-6 py-6 text-sm text-gray-500">No assets yet.</div>
        )}
      </div>

      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-2xl">
          <h3 className="font-semibold mb-4">{t('addAsset')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Asset name"
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder={t('category')}
              required
              className="w-full border rounded-lg px-3 py-2"
            />
            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="area_type"
                value={form.area_type}
                onChange={handleChange}
                className="w-full border rounded-lg px-2 py-2"
              >
                <option value="area">{t('areas')}</option>
                <option value="apartment">{t('apartments')}</option>
              </select>
              {form.area_type === 'area' ? (
                <select
                  name="area_id"
                  value={form.area_id}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-2 py-2"
                >
                  <option value="">Select area</option>
                  {areas.map(area => (
                    <option key={area.id} value={area.id}>{area.name}</option>
                  ))}
                </select>
              ) : (
                <select
                  name="apartment_id"
                  value={form.apartment_id}
                  onChange={handleChange}
                  className="w-full border rounded-lg px-2 py-2"
                >
                  <option value="">Select apartment</option>
                  {apartments.map(apartment => (
                    <option key={apartment.id} value={apartment.id}>{apartment.label}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="date"
                name="next_due_date"
                value={form.next_due_date}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="number"
                name="interval_days"
                value={form.interval_days}
                onChange={handleChange}
                placeholder="Interval days"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
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

export default AssetsPage;
