'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Mail } from 'lucide-react';

const InboxModal = () => {
  const { state, dispatch } = useApp();

  const markAsRead = (id: number) => {
    const updatedMessages = state.messages.map(m =>
      m.id === id ? { ...m, read: true } : m
    );
    dispatch({ type: 'SET_MESSAGES', payload: updatedMessages });
  };

  const closeModal = () => {
    dispatch({ type: 'SET_SHOW_INBOX_MODAL', payload: false });
  };

  if (!state.showInboxModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Inbox
          </h2>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div id="inbox-content">
          {state.messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No messages yet</p>
            </div>
          ) : (
            state.messages.map(message => (
              <div
                key={message.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  !message.read ? 'bg-blue-50' : ''
                }`}
                onClick={() => markAsRead(message.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{message.subject}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(message.date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">From: {message.from}</p>
                <p className="text-sm text-gray-700 line-clamp-2">{message.body}</p>
                {!message.read && (
                  <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    New
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default InboxModal;