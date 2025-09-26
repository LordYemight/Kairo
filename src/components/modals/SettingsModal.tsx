'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Upload } from 'lucide-react';

const SettingsModal = () => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    userName: '',
    notifyOverdue: true,
    notifyUpcoming: true,
    notifyUpdates: true,
    notifyPayments: true,
  });

  useEffect(() => {
    setFormData({
      userName: state.settings.userName,
      notifyOverdue: state.settings.notifications.overdue,
      notifyUpcoming: state.settings.notifications.upcoming,
      notifyUpdates: state.settings.notifications.updates,
      notifyPayments: state.settings.notifications.payments,
    });
  }, [state.settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({
      type: 'SET_SETTINGS',
      payload: {
        ...state.settings,
        userName: formData.userName,
        notifications: {
          overdue: formData.notifyOverdue,
          upcoming: formData.notifyUpcoming,
          updates: formData.notifyUpdates,
          payments: formData.notifyPayments,
        }
      }
    });
    // Close modal
  };

  const selectTheme = (theme: string) => {
    dispatch({
      type: 'SET_SETTINGS',
      payload: { ...state.settings, theme }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        dispatch({
          type: 'SET_SETTINGS',
          payload: { ...state.settings, logo: e.target?.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const closeModal = () => {
    dispatch({ type: 'SET_SHOW_SETTINGS_MODAL', payload: false });
  };

  if (!state.showSettingsModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              User Name
            </label>
            <input
              type="text"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center gap-4">
              {state.settings.logo && (
                <img
                  src={state.settings.logo}
                  alt="Logo"
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                <Upload className="w-4 h-4" />
                Upload Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Theme
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['blue', 'purple', 'green', 'orange', 'pink'].map(theme => (
                <button
                  key={theme}
                  type="button"
                  onClick={() => selectTheme(theme)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    state.settings.theme === theme
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`h-4 rounded bg-gradient-to-r ${
                    theme === 'blue' ? 'from-blue-600 to-blue-800' :
                    theme === 'purple' ? 'from-purple-600 to-purple-800' :
                    theme === 'green' ? 'from-green-600 to-green-800' :
                    theme === 'orange' ? 'from-orange-600 to-orange-800' :
                    'from-pink-600 to-pink-800'
                  }`}></div>
                  <span className="text-sm mt-1 capitalize">{theme}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Notifications
            </label>
            <div className="space-y-3">
              {[
                { key: 'notifyOverdue', label: 'Overdue tasks' },
                { key: 'notifyUpcoming', label: 'Upcoming deadlines' },
                { key: 'notifyUpdates', label: 'Task updates' },
                { key: 'notifyPayments', label: 'Payment reminders' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center">
                  <input
                    type="checkbox"
                    name={key}
                    checked={formData[key as keyof typeof formData] as boolean}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsModal;