'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bell } from 'lucide-react';

const NotificationsPanel = () => {
  const { state, dispatch } = useApp();

  const markAsRead = (id: number) => {
    const updatedNotifications = state.notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    );
    dispatch({ type: 'SET_NOTIFICATIONS', payload: updatedNotifications });
  };

  const clearAll = () => {
    dispatch({ type: 'SET_NOTIFICATIONS', payload: [] });
  };

  const markAllAsRead = () => {
    const updatedNotifications = state.notifications.map(n => ({ ...n, read: true }));
    dispatch({ type: 'SET_NOTIFICATIONS', payload: updatedNotifications });
  };

  if (!state.showNotificationsPanel) return null;

  return (
    <div id="notifications-panel" className="fixed top-16 right-4 w-80 bg-white shadow-xl rounded-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <Bell className="w-5 h-5 mr-2" />
          Notifications
        </h3>
        <div className="flex gap-2">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Mark all read
          </button>
          <button
            onClick={clearAll}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear all
          </button>
        </div>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {state.notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No notifications
          </div>
        ) : (
          state.notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{notification.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.date).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;