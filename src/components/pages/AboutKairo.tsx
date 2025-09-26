'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { Info, Code, Heart, Zap, Shield, Users } from 'lucide-react';

const AboutKairo = () => {
  const { state } = useApp();

  const features = [
    {
      icon: Users,
      title: 'Client & Personal Tasks',
      description: 'Manage both client projects and personal tasks in one unified interface.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay organized with live notifications and task status updates.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is stored locally and never shared without your permission.'
    },
    {
      icon: Code,
      title: 'Modern Technology',
      description: 'Built with Next.js, TypeScript, and Tailwind CSS for optimal performance.'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Kairo</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          A modern task management application designed to help freelancers and small businesses
          stay organized and productive.
        </p>
      </div>

      {/* App Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {state.clientTasks.length + state.personalTasks.length}
          </div>
          <div className="text-sm text-gray-600">Total Tasks</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {state.clientTasks.length}
          </div>
          <div className="text-sm text-gray-600">Client Projects</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {state.personalTasks.length}
          </div>
          <div className="text-sm text-gray-600">Personal Tasks</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {state.notifications.filter(n => !n.read).length}
          </div>
          <div className="text-sm text-gray-600">Unread Notifications</div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Version & Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Version Information
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated:</span>
              <span className="font-medium">September 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Framework:</span>
              <span className="font-medium">Next.js 15</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Code className="w-5 h-5" />
            Technology Stack
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Frontend:</span>
              <span className="font-medium">React 18</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Language:</span>
              <span className="font-medium">TypeScript</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Styling:</span>
              <span className="font-medium">Tailwind CSS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Icons:</span>
              <span className="font-medium">Lucide React</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200">
        <div className="text-center">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Kairo was created to empower freelancers and small business owners by providing
            a simple yet powerful tool to manage their workflow, track client projects,
            and maintain productivity. We believe that great work happens when you're organized,
            focused, and in control of your tasks.
          </p>
        </div>
      </div>

      {/* Getting Started */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Getting Started</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">1</div>
            <p className="font-medium">Add Your First Task</p>
            <p className="text-gray-600">Click the + button to create client or personal tasks</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">2</div>
            <p className="font-medium">Organize with Tags</p>
            <p className="text-gray-600">Use tags and priorities to categorize your work</p>
          </div>
          <div className="text-center">
            <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2 font-bold">3</div>
            <p className="font-medium">Track Progress</p>
            <p className="text-gray-600">Monitor completion rates and financial metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutKairo;