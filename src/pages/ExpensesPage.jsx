import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const ExpensesPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [summary, setSummary] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    scope: 'apartment',
    apartment_id: '',
    area_id: '',
    contractor_id: '',
    amount: '',
    spent_on: '',
    description: '',
  });

  const loadData = async () => {
    try {
      const [summaryData, expenseData, apartmentData, areaData, contractorData] = await Promise.all([
        apiFetch('/api/expenses/summary'),
        apiFetch('/api/expenses'),
        apiFetch('/api/apartments'),
        apiFetch('/api/areas'),
        apiFetch('/api/contractors'),
      ]);
      setSummary(summaryData);
      setExpenses(expenseData.expenses || []);
      setApartments(apartmentData.apartments || []);
      setAreas(areaData.areas || []);
      setContractors(contractorData.contractors || []);
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
      await apiFetch('/api/expenses', {
        method: 'POST',
        body: JSON.stringify({
          apartment_id: form.scope === 'apartment' ? form.apartment_id : null,
          area_id: form.scope === 'area' ? form.area_id : null,
          contractor_id: form.contractor_id || null,
          amount: Number(form.amount),
          spent_on: form.spent_on || null,
          description: form.description || null,
        }),
      });
      setForm({
        scope: 'apartment',
        apartment_id: '',
        area_id: '',
        contractor_id: '',
        amount: '',
        spent_on: '',
        description: '',
      });
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('expenses')}</h2>
      {error && <div className="text-red-600">{error}</div>}

      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{t('totalBuilding')}</p>
            <p className="text-2xl font-bold">${summary.total_building.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{t('totalApartments')}</p>
            <p className="text-2xl font-bold">${summary.total_apartments.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{t('totalCommonAreas')}</p>
            <p className="text-2xl font-bold">${summary.total_common_areas.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-sm text-gray-500">{t('totalServiceAreas')}</p>
            <p className="text-2xl font-bold">${summary.total_service_areas.toFixed(2)}</p>
          </div>
        </div>
      )}

      {isAdmin && (
        <div className="bg-white rounded-xl shadow-sm p-6 max-w-3xl">
          <h3 className="font-semibold mb-4">{t('addExpense')}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <select
                name="scope"
                value={form.scope}
                onChange={handleChange}
                className="w-full border rounded-lg px-2 py-2"
              >
                <option value="apartment">{t('apartments')}</option>
                <option value="area">{t('areas')}</option>
              </select>
              {form.scope === 'apartment' ? (
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
              ) : (
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
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder={t('amount')}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                type="date"
                name="spent_on"
                value={form.spent_on}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
              <select
                name="contractor_id"
                value={form.contractor_id}
                onChange={handleChange}
                className="w-full border rounded-lg px-2 py-2"
              >
                <option value="">{t('contractor')}</option>
                {contractors.map(contractor => (
                  <option key={contractor.id} value={contractor.id}>{contractor.name}</option>
                ))}
              </select>
            </div>
            <textarea
              name="description"
              value={form.description}
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

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {expenses.map(expense => (
          <div key={expense.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  {expense.apartment_label || expense.area_name || t('expenses')}
                </p>
                <p className="text-xs text-gray-500">{expense.spent_on || ''} · {expense.contractor_name || ''}</p>
              </div>
              <span className="text-sm font-semibold">${Number(expense.amount).toFixed(2)}</span>
            </div>
            {expense.description && (
              <p className="text-sm text-gray-600 mt-2">{expense.description}</p>
            )}
          </div>
        ))}
        {expenses.length === 0 && (
          <div className="px-6 py-6 text-sm text-gray-500">No expenses yet.</div>
        )}
      </div>
    </div>
  );
};

export default ExpensesPage;
