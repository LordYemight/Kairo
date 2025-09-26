'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckSquare, User, Calendar, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const { state, dispatch } = useApp();

  const totalTasks = state.clientTasks.length + state.personalTasks.length;
  const completedTasks = [...state.clientTasks, ...state.personalTasks].filter(t => t.status === 'Completed').length;
  const overdueTasks = [...state.clientTasks, ...state.personalTasks].filter(t =>
    t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'Completed'
  ).length;
  const dueSoonTasks = [...state.clientTasks, ...state.personalTasks].filter(t => t.status !== 'Completed');

  const recentClientTasks = [...state.clientTasks].sort((a, b) => new Date(b.createdAt || b.id).getTime() - new Date(a.createdAt || a.id).getTime()).slice(0, 3);
  const recentPersonalTasks = [...state.personalTasks].sort((a, b) => new Date(b.createdAt || b.id).getTime() - new Date(a.createdAt || a.id).getTime()).slice(0, 3);

  const showTaskModal = (type: 'client' | 'personal') => {
    dispatch({ type: 'SET_TASK_TYPE', payload: type });
    dispatch({ type: 'SET_EDITING_TASK', payload: null });
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: true });
  };

  const setCurrentPage = (page: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', payload: page });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <CheckSquare className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completedTasks}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <Calendar className="w-8 h-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Due Soon</p>
              <p className="text-2xl font-bold text-gray-900">{dueSoonTasks.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">!</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdueTasks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              id="add-client-task"
              onClick={() => showTaskModal('client')}
              className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 text-blue-600 mr-3" />
                <span className="font-medium text-blue-900">Add Client Task</span>
              </div>
            </button>
            <button
              id="add-personal-task"
              onClick={() => showTaskModal('personal')}
              className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <User className="w-5 h-5 text-green-600 mr-3" />
                <span className="font-medium text-green-900">Add Personal Task</span>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentClientTasks.slice(0, 2).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.projectName}</p>
                  <p className="text-sm text-gray-600">Client Task</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
            {recentPersonalTasks.slice(0, 1).map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{task.projectName}</p>
                  <p className="text-sm text-gray-600">Personal Task</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                  task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View All Links */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentPage('client')}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          View All Client Tasks →
        </button>
        <button
          onClick={() => setCurrentPage('personal')}
          className="text-green-600 hover:text-green-800 font-medium"
        >
          View All Personal Tasks →
        </button>
      </div>
    </div>
  );
};

export default Dashboard;