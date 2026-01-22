import React, { createContext, useContext, useMemo, useState } from 'react';

const LanguageContext = createContext(null);

const translations = {
  en: {
    appName: 'LMB Maintenance Hub',
    dashboard: 'Dashboard',
    tasks: 'Tasks',
    expenses: 'Expenses',
    newTask: 'New Task',
    taskDetails: 'Task Details',
    assets: 'Assets',
    contractors: 'Contractors',
    apartments: 'Apartments',
    areas: 'Common & Service Areas',
    users: 'Users',
    signIn: 'Sign In',
    signOut: 'Sign Out',
    email: 'Email',
    password: 'Password',
    name: 'Name',
    phone: 'Phone',
    role: 'Role',
    admin: 'Admin',
    staff: 'Staff',
    dueDate: 'Due Date',
    status: 'Status',
    priority: 'Priority',
    category: 'Category',
    type: 'Type',
    preventive: 'Preventive',
    corrective: 'Corrective',
    save: 'Save',
    cancel: 'Cancel',
    remarks: 'Remarks',
    addRemark: 'Add Remark',
    cost: 'Cost',
    hoursSpent: 'Hours Spent',
    assignedTo: 'Assigned To',
    loading: 'Loading...',
    accessDenied: 'Access denied',
    overview: 'Overview',
    open: 'Pending',
    inProgress: 'In progress',
    completed: 'Completed',
    blocked: 'Cancelled',
    pending: 'Pending',
    cancelled: 'Cancelled',
    addContractor: 'Add Contractor',
    reviewContractor: 'Review Contractor',
    addAsset: 'Add Asset',
    addArea: 'Add Area',
    addApartment: 'Add Apartment',
    addUser: 'Add User',
    notes: 'Notes',
    edit: 'Edit',
    serialNumber: 'Serial Number',
    amount: 'Amount',
    spentOn: 'Spent on',
    contractor: 'Contractor',
    addExpense: 'Add Expense',
    totalBuilding: 'Total building',
    totalApartments: 'Apartment total',
    totalCommonAreas: 'Common areas total',
    totalServiceAreas: 'Service areas total',
    resetApartments: 'Reset apartments list',
    confirmReset: 'This will replace all apartments. Continue?',
  },
  fr: {
    appName: 'Centre Maintenance LMB',
    dashboard: 'Tableau de bord',
    tasks: 'Taches',
    expenses: 'Depenses',
    newTask: 'Nouvelle tache',
    taskDetails: 'Details de la tache',
    assets: 'Equipements',
    contractors: 'Fournisseurs',
    apartments: 'Appartements',
    areas: 'Zones communes et services',
    users: 'Utilisateurs',
    signIn: 'Connexion',
    signOut: 'Deconnexion',
    email: 'Courriel',
    password: 'Mot de passe',
    name: 'Nom',
    phone: 'Telephone',
    role: 'Role',
    admin: 'Admin',
    staff: 'Personnel',
    dueDate: 'Date limite',
    status: 'Statut',
    priority: 'Priorite',
    category: 'Categorie',
    type: 'Type',
    preventive: 'Preventif',
    corrective: 'Correctif',
    save: 'Enregistrer',
    cancel: 'Annuler',
    remarks: 'Remarques',
    addRemark: 'Ajouter une remarque',
    cost: 'Cout',
    hoursSpent: 'Heures',
    assignedTo: 'Assigne a',
    loading: 'Chargement...',
    accessDenied: 'Acces refuse',
    overview: 'Apercu',
    open: 'En attente',
    inProgress: 'En cours',
    completed: 'Termine',
    blocked: 'Annule',
    pending: 'En attente',
    cancelled: 'Annule',
    addContractor: 'Ajouter un fournisseur',
    reviewContractor: 'Evaluer le fournisseur',
    addAsset: 'Ajouter un equipement',
    addArea: 'Ajouter une zone',
    addApartment: 'Ajouter un appartement',
    addUser: 'Ajouter un utilisateur',
    notes: 'Notes',
    edit: 'Modifier',
    serialNumber: 'Numero de serie',
    amount: 'Montant',
    spentOn: 'Date',
    contractor: 'Fournisseur',
    addExpense: 'Ajouter une depense',
    totalBuilding: 'Total batiment',
    totalApartments: 'Total appartements',
    totalCommonAreas: 'Total zones communes',
    totalServiceAreas: 'Total zones service',
    resetApartments: 'Reinitialiser les appartements',
    confirmReset: 'Cette action remplace tous les appartements. Continuer?',
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => (
    localStorage.getItem('lmb_lang') || 'fr'
  ));

  const toggleLanguage = () => {
    const next = language === 'fr' ? 'en' : 'fr';
    setLanguage(next);
    localStorage.setItem('lmb_lang', next);
  };

  const t = (key) => translations[language]?.[key] || key;

  const value = useMemo(() => ({
    language,
    toggleLanguage,
    t,
  }), [language]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
