'use client';

import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Settings, Sun, Moon, User } from 'lucide-react';

const Header = () => {
  const { state, dispatch } = useApp();

  const toggleDarkMode = () => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: { ...state.settings, darkMode: !state.settings.darkMode }
    });
  };

  const showNotifications = () => {
    dispatch({ type: 'SET_SHOW_NOTIFICATIONS_PANEL', payload: !state.showNotificationsPanel });
  };

  const showSettings = () => {
    dispatch({ type: 'SET_SHOW_SETTINGS_MODAL', payload: true });
  };

  const themes = {
    blue: 'from-blue-600 to-blue-800',
    purple: 'from-purple-600 to-purple-800',
    green: 'from-green-600 to-green-800',
    orange: 'from-orange-600 to-orange-800',
    pink: 'from-pink-600 to-pink-800'
  };

  return (
    <header
      id="header"
      className={`bg-gradient-to-r ${themes[state.settings.theme as keyof typeof themes]} text-white p-4 shadow-lg`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {state.settings.logo && (
            <img id="user-logo" src={state.settings.logo} alt="Logo" className="h-8 w-8 rounded-full" />
          )}
          <h1 id="welcome-text" className="text-xl font-semibold">
            Welcome back, {state.settings.userName}!
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button
            id="notifications-button"
            onClick={showNotifications}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {state.notifications.filter((n) => !n.read).length > 0 && (
              <span
                id="notification-count"
                className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
              >
                {state.notifications.filter((n) => !n.read).length}
              </span>
            )}
          </button>
          <button
            id="settings-button"
            onClick={showSettings}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            id="dark-mode-toggle"
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {state.settings.darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;