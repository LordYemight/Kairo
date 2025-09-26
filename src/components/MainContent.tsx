'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import Calendar from './pages/Calendar';
import Dashboard from './pages/Dashboard';
import ClientTasks from './pages/ClientTasks';
import PersonalTasks from './pages/PersonalTasks';
import DueSoon from './pages/DueSoon';
import KairoBoard from './pages/KairoBoard';
import Analytics from './pages/Analytics';
import AboutKairo from './pages/AboutKairo';

const MainContent = () => {
  const { state } = useApp();

  const renderContent = () => {
    switch (state.currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'client':
        return <ClientTasks />;
      case 'personal':
        return <PersonalTasks />;
      case 'due-soon':
        return <DueSoon />;
      case 'kairo-board':
        return <KairoBoard />;
      case 'calendar':
        return <Calendar />;
      case 'analytics':
        return <Analytics />;
      case 'about':
        return <AboutKairo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <main id="main-content" className="flex-1 p-6 transition-all duration-300">
      {renderContent()}
    </main>
  );
};

export default MainContent;