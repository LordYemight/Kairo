'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, Trash2 } from 'lucide-react';

const TaskModal = () => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    clientName: '',
    startDate: '',
    dueDate: '',
    status: 'Not Started',
    priority: 'Medium',
    category: '',
    totalAmount: '',
    amountPaid: '',
    outstandingAmount: '',
    files: [] as string[],
  });
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (state.editingTask) {
      setFormData({
        projectName: state.editingTask.projectName || '',
        description: state.editingTask.description || '',
        clientName: state.editingTask.clientName || '',
        startDate: state.editingTask.startDate || '',
        dueDate: state.editingTask.dueDate || '',
        status: state.editingTask.status || 'Not Started',
        priority: state.editingTask.priority || 'Medium',
        category: state.editingTask.category || '',
        totalAmount: state.editingTask.totalAmount || '',
        amountPaid: state.editingTask.amountPaid || '',
        outstandingAmount: state.editingTask.outstandingAmount || '',
        files: state.editingTask.files || [],
      });
      setTags(state.editingTask.tags || []);
    } else {
      setFormData({
        projectName: '',
        description: '',
        clientName: '',
        startDate: '',
        dueDate: '',
        status: 'Not Started',
        priority: 'Medium',
        category: '',
        totalAmount: '',
        amountPaid: '',
        outstandingAmount: '',
        files: [],
      });
      setTags([]);
    }
  }, [state.editingTask]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const taskData = {
      ...formData,
      tags,
      createdAt: state.editingTask?.createdAt || new Date().toISOString(),
    };

    if (state.editingTask) {
      // Update existing task
      if (state.taskType === 'client') {
        const updatedTasks = state.clientTasks.map(task =>
          task.id === state.editingTask!.id ? { ...task, ...taskData } : task
        );
        dispatch({ type: 'SET_CLIENT_TASKS', payload: updatedTasks });
      } else {
        const updatedTasks = state.personalTasks.map(task =>
          task.id === state.editingTask!.id ? { ...task, ...taskData } : task
        );
        dispatch({ type: 'SET_PERSONAL_TASKS', payload: updatedTasks });
      }
    } else {
      // Add new task
      const newTask = {
        id: Date.now(),
        ...taskData,
      };

      if (state.taskType === 'client') {
        dispatch({ type: 'SET_CLIENT_TASKS', payload: [...state.clientTasks, newTask] });
      } else {
        dispatch({ type: 'SET_PERSONAL_TASKS', payload: [...state.personalTasks, newTask] });
      }
    }

    // Close modal
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: false });
    dispatch({ type: 'SET_EDITING_TASK', payload: null });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const closeModal = () => {
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: false });
    dispatch({ type: 'SET_EDITING_TASK', payload: null });
  };

  // Don't render if modal is not shown
  if (!state.showTaskModal) return null;

  const isClient = state.taskType === 'client' || (state.editingTask && state.clientTasks.some(t => t.id === state.editingTask!.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">
            {state.editingTask ? 'Edit' : 'Add'} {isClient ? 'Client' : 'Personal'} Task
          </h2>
          <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Project Name *
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {isClient && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Not Started</option>
                <option>Started</option>
                <option>Processing</option>
                <option>Review</option>
                <option>Review Correction</option>
                <option>Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Add a tag"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:bg-blue-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
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
              {state.editingTask ? 'Update' : 'Create'} Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;