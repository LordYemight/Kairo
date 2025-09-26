'use client';

import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { BarChart3, TrendingUp, DollarSign, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

const Analytics = () => {
  const { state } = useApp();

  const stats = useMemo(() => {
    const allTasks = [...state.clientTasks, ...state.personalTasks];

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(task => task.status === 'Completed').length;
    const inProgressTasks = allTasks.filter(task => task.status === 'In Progress' || task.status === 'Processing').length;
    const overdueTasks = allTasks.filter(task => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== 'Completed';
    }).length;

    const totalRevenue = state.clientTasks.reduce((sum, task) => {
      if (task.totalAmount) {
        return sum + parseFloat(task.totalAmount.replace(/[^0-9.-]+/g, ''));
      }
      return sum;
    }, 0);

    const paidRevenue = state.clientTasks.reduce((sum, task) => {
      if (task.amountPaid) {
        return sum + parseFloat(task.amountPaid.replace(/[^0-9.-]+/g, ''));
      }
      return sum;
    }, 0);

    const outstandingRevenue = totalRevenue - paidRevenue;

    const tasksByStatus = {
      'Not Started': allTasks.filter(t => t.status === 'Not Started').length,
      'Started': allTasks.filter(t => t.status === 'Started').length,
      'Processing': allTasks.filter(t => t.status === 'Processing').length,
      'Review': allTasks.filter(t => t.status === 'Review').length,
      'Review Correction': allTasks.filter(t => t.status === 'Review Correction').length,
      'Completed': completedTasks
    };

    const tasksByPriority = {
      'Low': allTasks.filter(t => t.priority === 'Low').length,
      'Medium': allTasks.filter(t => t.priority === 'Medium').length,
      'High': allTasks.filter(t => t.priority === 'High').length,
      'Urgent': allTasks.filter(t => t.priority === 'Urgent').length
    };

    return {
      totalTasks,
      completedTasks,
      inProgressTasks,
      overdueTasks,
      totalRevenue,
      paidRevenue,
      outstandingRevenue,
      tasksByStatus,
      tasksByPriority,
      completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    };
  }, [state.clientTasks, state.personalTasks]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }: any) => (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${color}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          icon={Calendar}
          color=""
          subtitle={`${stats.completedTasks} completed`}
        />
        <StatCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          color=""
          subtitle={`${stats.completedTasks}/${stats.totalTasks} tasks`}
        />
        <StatCard
          title="In Progress"
          value={stats.inProgressTasks}
          icon={Clock}
          color=""
          subtitle="Active tasks"
        />
        <StatCard
          title="Overdue"
          value={stats.overdueTasks}
          icon={AlertTriangle}
          color={stats.overdueTasks > 0 ? 'border-l-4 border-l-red-500' : ''}
          subtitle="Need attention"
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-600 mt-2">From all client projects</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Paid Revenue</h3>
            <CheckCircle className="w-6 h-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">{formatCurrency(stats.paidRevenue)}</p>
          <p className="text-sm text-gray-600 mt-2">Received payments</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Outstanding</h3>
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
          <p className="text-3xl font-bold text-orange-600">{formatCurrency(stats.outstandingRevenue)}</p>
          <p className="text-sm text-gray-600 mt-2">Pending payments</p>
        </div>
      </div>

      {/* Task Status Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Status</h3>
          <div className="space-y-3">
            {Object.entries(stats.tasksByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{status}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tasks by Priority</h3>
          <div className="space-y-3">
            {Object.entries(stats.tasksByPriority).map(([priority, count]) => (
              <div key={priority} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{priority}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        priority === 'Low' ? 'bg-green-600' :
                        priority === 'Medium' ? 'bg-yellow-600' :
                        priority === 'High' ? 'bg-orange-600' :
                        'bg-red-600'
                      }`}
                      style={{ width: `${stats.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[...state.clientTasks, ...state.personalTasks]
            .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
            .slice(0, 5)
            .map(task => (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-900">{task.projectName}</p>
                  <p className="text-sm text-gray-600">
                    {task.clientName ? `Client: ${task.clientName}` : 'Personal Task'}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    task.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'No date'}
                  </p>
                </div>
              </div>
            ))}
          {[...state.clientTasks, ...state.personalTasks].length === 0 && (
            <p className="text-gray-500 text-center py-4">No tasks yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;