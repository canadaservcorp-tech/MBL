import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { ClipboardList, LayoutDashboard, LogOut, Users, Building, Wrench, Box, UserSquare2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const AppLayout = () => {
  const { user, logout, isAdmin } = useAuth();
  const { t, toggleLanguage, language } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/tasks', label: t('tasks'), icon: ClipboardList },
    { to: '/assets', label: t('assets'), icon: Wrench },
    { to: '/contractors', label: t('contractors'), icon: UserSquare2 },
    { to: '/apartments', label: t('apartments'), icon: Building },
    { to: '/areas', label: t('areas'), icon: Box },
  ];

  if (isAdmin) {
    navItems.push({ to: '/users', label: t('users'), icon: Users });
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="px-6 py-6 border-b">
          <p className="text-xs text-gray-500 uppercase tracking-wide">La Maison Benoit Labre</p>
          <h1 className="text-xl font-bold text-gray-900">{t('appName')}</h1>
        </div>
        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `flex items-center px-3 py-2 rounded-lg text-sm font-medium ${
                isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon size={18} className="mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t">
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut size={16} className="mr-2" />
            {t('signOut')}
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{t('overview')}</h2>
            <p className="text-sm text-gray-500">{user?.name} · {user?.role}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLanguage}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              {language === 'fr' ? 'EN' : 'FR'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
