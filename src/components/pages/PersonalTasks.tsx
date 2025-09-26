'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, Filter, Plus, Edit, Trash2, Calendar, CheckCircle, Circle } from 'lucide-react';

const PersonalTasks = () => {
  const { state, dispatch } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const filteredTasks = useMemo(() => {
    return state.personalTasks.filter(task => {
      const matchesSearch = task.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = !statusFilter || task.status === statusFilter;
      const matchesPriority = !priorityFilter || task.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [state.personalTasks, searchTerm, statusFilter, priorityFilter]);

  const showTaskModal = (task?: any) => {
    if (task) {
      dispatch({ type: 'SET_EDITING_TASK', payload: task });
    } else {
      dispatch({ type: 'SET_EDITING_TASK', payload: null });
    }
    dispatch({ type: 'SET_TASK_TYPE', payload: 'personal' });
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: true });
  };

  const deleteTask = (taskId: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      dispatch({ type: 'SET_PERSONAL_TASKS', payload: state.personalTasks.filter(t => t.id !== taskId) });
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    const updatedTasks = state.personalTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    dispatch({ type: 'SET_PERSONAL_TASKS', payload: updatedTasks });
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Not Started': 'bg-gray-100 text-gray-800',
      'In Progress': 'bg-blue-100 text-blue-800',
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Personal Tasks</h1>
        <button
          onClick={() => showTaskModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Personal Task
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
            <option>In Progress</option>
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
            <p>No personal tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <div key={task.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTaskCompletion(task.id)}
                  className="mt-1"
                >
                  {task.completed ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.projectName}
                    </h3>
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

                  {task.description && (
                    <p className={`text-sm mb-3 ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {task.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-4 mb-3">
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
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {task.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PersonalTasks;