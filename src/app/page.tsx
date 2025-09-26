'use client';

import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import FirstTimeModal from '@/components/modals/FirstTimeModal';
import Header from '@/components/Header';
import { Sidebar } from 'lucide-react';
import MainContent from '@/components/MainContent';
import InboxModal from '@/components/modals/InboxModal';
import TaskTypeSelector from '@/components/ui/TaskTypeSelector';
import TaskModal from '@/components/modals/TaskModal';
import SettingsModal from '@/components/modals/SettingsModal';
import NotificationsPanel from '@/components/ui/NotificationsPanel';
import QuickAddButton from '@/components/ui/QuickAddButton';
import ToastContainer from '@/components/ui/ToastContainer';

const HomePage = () => {
  const { state, dispatch } = useApp();

  useEffect(() => {
    if (state.isFirstTimeUser) {
      // Show first time modal
    }
  }, [state.isFirstTimeUser]);

  return (
    <div id="app" className="bg-gray-50 min-h-screen">
      <FirstTimeModal />
      <Header />
      <div className="flex max-w-7xl mx-auto" id="main-app">
        <Sidebar />
        <MainContent />
      </div>
      <InboxModal />
      <TaskModal />
      <TaskTypeSelector />
      <SettingsModal />
      <NotificationsPanel />
      <QuickAddButton />
      <ToastContainer />
    </div>
  );
};

export default HomePage;