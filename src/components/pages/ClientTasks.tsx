'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Plus, Edit, Trash2, Calendar, DollarSign } from 'lucide-react';

const ClientTasks = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredTasks = useMemo(() => {
    return state.clientTasks.filter(task => {
      const matchesSearch = task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.clientName && task.clientName.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [state.clientTasks, searchTerm, statusFilter, priorityFilter]);

  const showTaskModal = (task?: any) => {
    if (task) {
      dispatch({ type: 'SET_EDITING_TASK', payload: task });
    } else {
      dispatch({ type: 'SET_EDITING_TASK', payload: null });
    }
    dispatch({ type: 'SET_TASK_TYPE', payload: 'client' });
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: true });
  };

  const deleteTask = (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'SET_CLIENT_TASKS', payload: state.clientTasks.filter(t => t.id !== taskId) });
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Not Started': 'bg-gray-100 text-gray-800',
      'Started': 'bg-blue-100 text-blue-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Review': 'bg-purple-100 text-purple-800',
      'Review Correction': 'bg-orange-100 text-orange-800',
      'Completed': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors: { [key: string]: string } = {
      'Low': 'text-green-600',
      'Medium': 'text-yellow-600',
      'High': 'text-orange-600',
      'Urgent': 'text-red-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const calculateDaysBetween = (task: any) => {
    if (!task.startDate || !task.dueDate) return null;
    const start = new Date(task.startDate);
    const due = new Date(task.dueDate);
    const diffTime = due.getTime() - start.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const remainingTime = due.getTime() - new Date().getTime();
    const remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
    return { totalDays: diffDays, remainingDays: remainingDays };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Client Tasks</h1>
        <button
          onClick={() => showTaskModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Client Task
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option>Not Started</option>
            <option>Started</option>
            <option>Processing</option>
            <option>Review</option>
            <option>Review Correction</option>
            <option>Completed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
            <option>Urgent</option>
          </select>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No client tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const daysData = calculateDaysBetween(task);
            return (
              <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{task.projectName}</h3>
                    {task.clientName && (
                      <p className="text-sm text-gray-600 mb-2">Client: {task.clientName}</p>
                    )}
                    {task.description && (
                      <p className="text-sm text-gray-700 mb-3">{task.description}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => showTaskModal(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                  <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority} Priority
                  </span>
                  {task.dueDate && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                  )}
                  {task.totalAmount && (
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      {task.totalAmount}
                    </div>
                  )}
                </div>

                {daysData && (
                  <div className="text-sm text-gray-600">
                    Duration: {daysData.totalDays} days
                    {daysData.remainingDays !== null && (
                      <span className={`ml-2 ${daysData.remainingDays < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ({daysData.remainingDays > 0 ? `${daysData.remainingDays} days left` :
                          daysData.remainingDays === 0 ? 'Due today' : `${Math.abs(daysData.remainingDays)} days overdue`})
                      </span>
                    )}
                  </div>
                )}

                {task.tags && task.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {task.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientTasks;