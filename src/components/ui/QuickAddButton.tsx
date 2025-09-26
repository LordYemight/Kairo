'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Plus } from 'lucide-react';

const QuickAddButton = () => {
  const { dispatch } = useApp();

  const showTaskTypeSelector = () => {
    dispatch({ type: 'SET_SHOW_TASK_TYPE_SELECTOR', payload: true });
  };

  return (
    <button
      id="quick-add-button"
      onClick={showTaskTypeSelector}
      className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center hover:bg-blue-700 transition-colors z-40"
    >
      <Plus className="w-6 h-6" />
    </button>
  );
};

export default QuickAddButton;