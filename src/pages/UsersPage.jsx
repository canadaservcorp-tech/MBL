import React, { useEffect, useState } from 'react';
import { apiFetch } from '../api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const UsersPage = () => {
  const { isAdmin } = useAuth();
  const { t } = useLanguage();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'staff', password: '' });

  const loadUsers = async () => {
    try {
      const data = await apiFetch('/api/users');
      setUsers(data.users || []);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
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
      await apiFetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      setForm({ name: '', email: '', phone: '', role: 'staff', password: '' });
      loadUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">{t('users')}</h2>
      {error && <div className="text-red-600">{error}</div>}
      <div className="bg-white rounded-xl shadow-sm divide-y">
        {users.map(user => (
          <div key={user.id} className="px-6 py-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email} · {user.phone}</p>
            </div>
            <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">{user.role}</span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 max-w-xl">
        <h3 className="font-semibold mb-4">{t('addUser')}</h3>
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
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder={t('email')}
            required
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
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder={t('password')}
            required
            className="w-full border rounded-lg px-3 py-2"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg px-2 py-2"
          >
            <option value="staff">{t('staff')}</option>
            <option value="admin">{t('admin')}</option>
          </select>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
            {t('save')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UsersPage;
