'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const FirstTimeModal = () => {
  const { state, dispatch } = useApp();
  const [formData, setFormData] = useState({
    fullName: '',
    gender: '',
    email: '',
    whatsapp: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Process first time user form
    dispatch({ type: 'SET_FIRST_TIME_USER', payload: false });
    dispatch({
      type: 'SET_SETTINGS',
      payload: { ...state.settings, userName: formData.fullName }
    });
    // Send welcome message
    const welcomeMessage = {
      id: Date.now(),
      from: 'Maayo',
      subject: 'Welcome to Kairo!',
      body: `I'm Maayo, founder of Kairo — and I'm thrilled you're here.

Kairo was built to help busy people and teams take control of their day — not just at work, but in life. Whether you're managing client deadlines, household priorities, payments, or personal goals, Kairo brings everything into one calm place so you can think clearly and act with confidence.

Welcome again — here's to calmer days, clearer priorities, and getting the right things done.

Warmly,  
Maayo  
Founder, Kairo`,
      date: new Date().toISOString(),
      read: false
    };
    dispatch({
      type: 'SET_MESSAGES',
      payload: [welcomeMessage, ...state.messages]
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!state.isFirstTimeUser) return null;

  return (
    <div id="first-time-modal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 first-time-modal">
      <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Kairo! 🎉</h2>
          <p className="text-gray-600">Let's get you set up in just a few seconds.</p>
        </div>

        <form id="first-time-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="form-input-group">
            <label htmlFor="user-fullname" className="form-label">
              👤 Full Name
            </label>
            <input
              type="text"
              id="user-fullname"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-input-group">
            <label htmlFor="user-gender" className="form-label">
              🚀 Gender
            </label>
            <select
              id="user-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <div className="form-input-group">
            <label htmlFor="user-email" className="form-label">
              📧 Email Address
            </label>
            <input
              type="email"
              id="user-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>

          <div className="form-input-group">
            <label htmlFor="user-whatsapp" className="form-label">
              📱 WhatsApp Number
            </label>
            <input
              type="tel"
              id="user-whatsapp"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="+1234567890"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Get Started with Kairo 🚀
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Your information helps us personalize your experience and send you important updates.</p>
        </div>
      </div>
    </div>
  );
};

export default FirstTimeModal;