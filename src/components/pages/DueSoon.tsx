'use client';

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Calendar, AlertTriangle, Clock } from 'lucide-react';

const DueSoon = () => {
  const { state } = useApp();

  const dueSoonTasks = useMemo(() => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const allTasks = [...state.clientTasks, ...state.personalTasks];

    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    }).sort((a, b) => {
      const dateA = new Date(a.dueDate!);
      const dateB = new Date(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    });
  }, [state.clientTasks, state.personalTasks]);

  const overdueTasks = useMemo(() => {
    const today = new Date();
    const allTasks = [...state.clientTasks, ...state.personalTasks];

    return allTasks.filter(task => {
      if (!task.dueDate) return false;
      const dueDate = new Date(task.dueDate);
      return dueDate < today;
    }).sort((a, b) => {
      const dateA = new Date(a.dueDate!);
      const dateB = new Date(b.dueDate!);
      return dateA.getTime() - dateB.getTime();
    });
  }, [state.clientTasks, state.personalTasks]);

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getUrgencyColor = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return 'text-red-600 bg-red-50 border-red-200';
    if (daysUntilDue === 0) return 'text-orange-600 bg-orange-50 border-orange-200';
    if (daysUntilDue <= 2) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getUrgencyIcon = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return <AlertTriangle className="w-5 h-5" />;
    if (daysUntilDue === 0) return <Clock className="w-5 h-5" />;
    return <Calendar className="w-5 h-5" />;
  };

  const getUrgencyText = (daysUntilDue: number) => {
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} day${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`;
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    return `Due in ${daysUntilDue} days`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Due Soon</h1>
      </div>

      {/* Overdue Tasks */}
      {overdueTasks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Overdue Tasks ({overdueTasks.length})
          </h2>
          <div className="space-y-3">
            {overdueTasks.map(task => {
              const daysUntilDue = getDaysUntilDue(task.dueDate!);
              return (
                <div key={task.id} className={`p-4 rounded-lg border-2 ${getUrgencyColor(daysUntilDue)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getUrgencyIcon(daysUntilDue)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.projectName}</h3>
                        {task.clientName && (
                          <p className="text-sm text-gray-600">Client: {task.clientName}</p>
                        )}
                        <p className="text-sm font-medium mt-1">{getUrgencyText(daysUntilDue)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(task.dueDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{task.priority} Priority</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Due Soon Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Due This Week ({dueSoonTasks.length})
        </h2>

        {dueSoonTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No tasks due this week</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dueSoonTasks.map(task => {
              const daysUntilDue = getDaysUntilDue(task.dueDate!);
              return (
                <div key={task.id} className={`p-4 rounded-lg border-2 ${getUrgencyColor(daysUntilDue)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getUrgencyIcon(daysUntilDue)}
                      <div>
                        <h3 className="font-semibold text-gray-900">{task.projectName}</h3>
                        {task.clientName && (
                          <p className="text-sm text-gray-600">Client: {task.clientName}</p>
                        )}
                        <p className="text-sm font-medium mt-1">{getUrgencyText(daysUntilDue)}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Due: {new Date(task.dueDate!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {task.status}
                      </span>
                      <p className="text-xs text-gray-500 mt-1 capitalize">{task.priority} Priority</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default DueSoon;