'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, MoreHorizontal, Calendar, DollarSign, User } from 'lucide-react';

const KairoBoard = () => {
  const { state, dispatch } = useApp();
  const [draggedTask, setDraggedTask] = useState<any>(null);

  const columns = [
    { id: 'not-started', title: 'Not Started', color: 'bg-gray-100 border-gray-300' },
    { id: 'started', title: 'Started', color: 'bg-blue-100 border-blue-300' },
    { id: 'processing', title: 'Processing', color: 'bg-yellow-100 border-yellow-300' },
    { id: 'review', title: 'Review', color: 'bg-purple-100 border-purple-300' },
    { id: 'review-correction', title: 'Review Correction', color: 'bg-orange-100 border-orange-300' },
    { id: 'completed', title: 'Completed', color: 'bg-green-100 border-green-300' }
  ];

  const getTasksForColumn = (status: string) => {
    return [...state.clientTasks, ...state.personalTasks].filter(task => task.status === status);
  };

  const showTaskModal = (task?: any) => {
    if (task) {
      dispatch({ type: 'SET_EDITING_TASK', payload: task });
    } else {
      dispatch({ type: 'SET_EDITING_TASK', payload: null });
    }
    dispatch({ type: 'SET_TASK_TYPE', payload: task?.clientName ? 'client' : 'personal' });
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: true });
  };

  const handleDragStart = (e: React.DragEvent, task: any) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const isClientTask = state.clientTasks.some(t => t.id === draggedTask.id);
    const updatedTask = { ...draggedTask, status: newStatus };

    if (isClientTask) {
      const updatedTasks = state.clientTasks.map(task =>
        task.id === draggedTask.id ? updatedTask : task
      );
      dispatch({ type: 'SET_CLIENT_TASKS', payload: updatedTasks });
    } else {
      const updatedTasks = state.personalTasks.map(task =>
        task.id === draggedTask.id ? updatedTask : task
      );
      dispatch({ type: 'SET_PERSONAL_TASKS', payload: updatedTasks });
    }

    setDraggedTask(null);
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-orange-100 text-orange-800',
      'Urgent': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Kairo Board</h1>
        <button
          onClick={() => showTaskModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 overflow-x-auto">
        {columns.map(column => (
          <div
            key={column.id}
            className={`min-h-[600px] ${column.color} border-2 rounded-lg p-4`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.title)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">{column.title}</h3>
              <span className="bg-white bg-opacity-50 px-2 py-1 rounded-full text-sm font-medium">
                {getTasksForColumn(column.title).length}
              </span>
            </div>

            <div className="space-y-3">
              {getTasksForColumn(column.title).map(task => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900 text-sm leading-tight">
                      {task.projectName}
                    </h4>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {task.clientName && (
                    <div className="flex items-center gap-1 mb-2">
                      <User className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{task.clientName}</span>
                    </div>
                  )}

                  {task.description && (
                    <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                    {task.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>

                  {task.totalAmount && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-600">{task.totalAmount}</span>
                    </div>
                  )}

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                      {task.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                          +{task.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {getTasksForColumn(column.title).length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">No tasks</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KairoBoard;