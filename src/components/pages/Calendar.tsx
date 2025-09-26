'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';

const Calendar = () => {
  const { state, dispatch } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());

  const showTaskModal = (task?: any) => {
    if (task) {
      dispatch({ type: 'SET_EDITING_TASK', payload: task });
    } else {
      dispatch({ type: 'SET_EDITING_TASK', payload: null });
    }
    dispatch({ type: 'SET_TASK_TYPE', payload: task?.clientName ? 'client' : 'personal' });
    dispatch({ type: 'SET_SHOW_TASK_MODAL', payload: true });
  };

  const getTasksForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return [...state.clientTasks, ...state.personalTasks].filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate).toISOString().split('T')[0];
      return taskDate === dateString;
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          Calendar
        </h1>
        <button
          onClick={() => showTaskModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </div>

      {/* Calendar Header */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center font-medium text-gray-700 text-sm">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((date, index) => {
            const tasksForDate = date ? getTasksForDate(date) : [];
            const hasTasks = tasksForDate.length > 0;

            return (
              <div
                key={index}
                className={`min-h-[100px] p-2 border border-gray-200 ${
                  date && isToday(date) ? 'bg-blue-50 border-blue-300' : 'bg-white'
                } ${date && !isCurrentMonth(date) ? 'text-gray-400' : 'text-gray-900'}`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium mb-1 ${isToday(date) ? 'text-blue-600' : ''}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {tasksForDate.slice(0, 3).map(task => (
                        <div
                          key={task.id}
                          onClick={() => showTaskModal(task)}
                          className={`text-xs p-1 rounded cursor-pointer hover:opacity-80 ${
                            task.clientName ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                          }`}
                          title={task.projectName}
                        >
                          <div className="truncate">{task.projectName}</div>
                          {task.clientName && (
                            <div className="text-xs opacity-75 truncate">({task.clientName})</div>
                          )}
                        </div>
                      ))}
                      {tasksForDate.length > 3 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{tasksForDate.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks Summary */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Tasks</h3>
        <div className="space-y-2">
          {[...state.clientTasks, ...state.personalTasks]
            .filter(task => task.dueDate && new Date(task.dueDate) >= new Date())
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 5)
            .map(task => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{task.projectName}</h4>
                  {task.clientName && (
                    <p className="text-sm text-gray-600">Client: {task.clientName}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(task.dueDate!).toLocaleDateString()}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">{task.priority} Priority</p>
                </div>
              </div>
            ))}
          {[...state.clientTasks, ...state.personalTasks].filter(task => task.dueDate && new Date(task.dueDate) >= new Date()).length === 0 && (
            <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;