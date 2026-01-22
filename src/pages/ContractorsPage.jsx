import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const ContractorsPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [contractors, setContractors] = useState([]);
  const [reviews, setReviews] = useState({});
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    specialties: '',
    notes: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ contractorId: '', rating: '5', comment: '' });

  const loadContractors = async () => {
    try {
      const data = await apiFetch('/api/contractors');
      setContractors(data.contractors || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadContractors();
  }, []);

  const handleChange = (event) => {
    setForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleReviewChange = (event) => {
    setReviewForm(prev => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editingId) {
        await apiFetch(`/api/contractors/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch('/api/contractors', {
          method: 'POST',
          body: JSON.stringify(form),
        });
      }
      setForm({ name: '', company: '', email: '', phone: '', specialties: '', notes: '' });
      setEditingId(null);
      loadContractors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReviewSubmit = async (event) => {
    event.preventDefault();
    try {
      await apiFetch(`/api/contractors/${reviewForm.contractorId}/reviews`, {
        method: 'POST',
        body: JSON.stringify({
          rating: Number(reviewForm.rating),
          comment: reviewForm.comment,
        }),
      });
      setReviewForm({ contractorId: '', rating: '5', comment: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const loadReviews = async (contractorId) => {
    try {
      const data = await apiFetch(`/api/contractors/${contractorId}/reviews`);
      setReviews(prev => ({ ...prev, [contractorId]: data.reviews || [] }));
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (contractor) => {
    setEditingId(contractor.id);
    setForm({
      name: contractor.name || '',
      company: contractor.company || '',
      email: contractor.email || '',
      phone: contractor.phone || '',
      specialties: contractor.specialty || contractor.specialties || '',
      notes: contractor.notes || '',
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('contractors')}</h2>
      {error && <div className="text-red-600">{error}</div>}

      <div className="bg-white rounded-xl shadow-sm divide-y">
        {contractors.map(contractor => (
          <div key={contractor.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{contractor.name}</p>
                <p className="text-xs text-gray-500">{contractor.company || ''}</p>
                <p className="text-xs text-gray-500">{contractor.email} · {contractor.phone}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => loadReviews(contractor.id)}
                  className="text-sm text-blue-600"
                >
                  {t('reviewContractor')}
                </button>
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => startEdit(contractor)}
                    className="text-sm text-gray-600"
                  >
                    {t('edit')}
                  </button>
                )}
              </div>
            </div>
            {reviews[contractor.id] && (
              <div className="mt-3 space-y-2">
                {reviews[contractor.id].map(review => (
                  <div key={review.id} className="text-sm text-gray-600">
                    <strong>{review.reviewer_name}</strong>: {review.comment} ({review.rating}/5)
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {contractors.length === 0 && (
          <div className="px-6 py-6 text-sm text-gray-500">No contractors yet.</div>
        )}
      </div>

      {isAdmin && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">{editingId ? t('edit') : t('addContractor')}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('name')}
                required
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="Company"
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('email')}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder={t('phone')}
                className="w-full border rounded-lg px-3 py-2"
              />
              <input
                name="specialties"
                value={form.specialties}
                onChange={handleChange}
                placeholder="Specialties"
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

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4">{t('reviewContractor')}</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <select
                name="contractorId"
                value={reviewForm.contractorId}
                onChange={handleReviewChange}
                required
                className="w-full border rounded-lg px-2 py-2"
              >
                <option value="">Select contractor</option>
                {contractors.map(contractor => (
                  <option key={contractor.id} value={contractor.id}>{contractor.name}</option>
                ))}
              </select>
              <select
                name="rating"
                value={reviewForm.rating}
                onChange={handleReviewChange}
                className="w-full border rounded-lg px-2 py-2"
              >
                <option value="5">5</option>
                <option value="4">4</option>
                <option value="3">3</option>
                <option value="2">2</option>
                <option value="1">1</option>
              </select>
              <textarea
                name="comment"
                value={reviewForm.comment}
                onChange={handleReviewChange}
                placeholder={t('notes')}
                className="w-full border rounded-lg px-3 py-2"
                rows={3}
              />
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                {t('save')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractorsPage;
