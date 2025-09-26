'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Briefcase, User } from 'lucide-react';

const TaskTypeSelector = () => {
  const { state, dispatch } = useApp();

  const selectTaskType = (type: 'client' | 'personal') => {
    dispatch({ type: 'SET_TASK_TYPE', payload: type });
    dispatch({ type: 'SET_EDITING_TASK', payload: null });
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: true });
    hideSelector();
  };

  const hideSelector = () => {
    dispatch({ type: 'SET_SHOW_TASK_TYPE_SELECTOR', payload: false });
  };

  if (!state.showTaskTypeSelector) return null;

  return (
    <div id="task-type-selector" className="task-type-selector">
      <div
        className="task-type-option"
        onClick={() => selectTaskType('client')}
      >
        <Briefcase className="w-5 h-5 text-blue-600" />
        <span className="font-medium">Client Task</span>
      </div>
      <div
        className="task-type-option"
        onClick={() => selectTaskType('personal')}
      >
        <User className="w-5 h-5 text-green-600" />
        <span className="font-medium">Personal Task</span>
      </div>
    </div>
  );
};

export default TaskTypeSelector;