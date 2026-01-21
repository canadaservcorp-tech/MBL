import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import AppLayout from './components/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TasksPage from './pages/TasksPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TaskCreatePage from './pages/TaskCreatePage';
import AssetsPage from './pages/AssetsPage';
import ContractorsPage from './pages/ContractorsPage';
import ApartmentsPage from './pages/ApartmentsPage';
import AreasPage from './pages/AreasPage';
import UsersPage from './pages/UsersPage';

const App = () => (
  <BrowserRouter>
    <LanguageProvider>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<AppLayout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="tasks/new" element={<TaskCreatePage />} />
              <Route path="tasks/:taskId" element={<TaskDetailPage />} />
              <Route path="assets" element={<AssetsPage />} />
              <Route path="contractors" element={<ContractorsPage />} />
              <Route path="apartments" element={<ApartmentsPage />} />
              <Route path="areas" element={<AreasPage />} />
              <Route path="users" element={<UsersPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </LanguageProvider>
  </BrowserRouter>
);

export default App;
