'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  Home,
  CheckSquare,
  User,
  Calendar,
  BarChart3,
  Info,
  Inbox,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const { state, dispatch } = useApp();

  const setCurrentPage = (page: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  const toggleSidebar = () => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: { ...state.settings, sidebarCollapsed: !state.settings.sidebarCollapsed }
    });
  };

  const showInbox = () => {
    dispatch({ type: 'SET_SHOW_INBOX_MODAL', payload: true });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'client', label: 'Client Tasks', icon: CheckSquare },
    { id: 'personal', label: 'Personal Tasks', icon: User },
    { id: 'due-soon', label: 'Due Soon', icon: Calendar },
    { id: 'kairo-board', label: 'Kairo Board', icon: BarChart3 },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'about', label: 'About Kairo', icon: Info },
  ];

  const totalTasks = state.clientTasks.length + state.personalTasks.length;
  const completedTasks = [...state.clientTasks, ...state.personalTasks].filter(t => t.status === 'Completed').length;
  const overdueTasks = [...state.clientTasks, ...state.personalTasks].filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;

  return (
    <nav
      id="sidebar"
      className={`w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen transition-all duration-300 ${
        state.settings.sidebarCollapsed ? 'sidebar-collapsed' : ''
      }`}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-800 sidebar-text">Kairo</h2>
          <button
            id="sidebar-toggle"
            onClick={toggleSidebar}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {state.settings.sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <div className="space-y-2 quick-stats">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Total Tasks</div>
            <div id="stat-total" className="text-2xl font-bold text-blue-600">{totalTasks}</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Completed</div>
            <div id="stat-completed" className="text-2xl font-bold text-green-600">{completedTasks}</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg">
            <div className="text-sm text-gray-600">Overdue</div>
            <div id="stat-overdue" className="text-2xl font-bold text-red-600">{overdueTasks}</div>
          </div>
        </div>

        <div className="mt-8 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`nav-button w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  state.currentPage === item.id ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="sidebar-text">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8">
          <button
            id="inbox-button"
            onClick={showInbox}
            className="nav-button w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors text-gray-700 hover:bg-gray-100 relative"
          >
            <Inbox className="w-5 h-5 flex-shrink-0" />
            <span className="sidebar-text">Inbox</span>
            {state.messages.filter((m) => !m.read).length > 0 && (
              <span
                id="inbox-count"
                className="absolute right-3 top-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {state.messages.filter((m) => !m.read).length}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;