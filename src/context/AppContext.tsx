'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { AppState, Task, Settings, Notification, Message } from '../types';

const initialState: AppState = {
  currentPage: 'dashboard',
  clientTasks: [],
  personalTasks: [],
  taskTemplates: [],
  settings: {
    userName: 'Your Name',
    theme: 'blue',
    darkMode: false,
    sidebarCollapsed: false,
    notifications: {
      overdue: true,
      upcoming: true,
      updates: true,
      payments: true,
    },
  },
  editingTask: null,
  taskType: 'client',
  tags: [],
  notifications: [],
  messages: [],
  calendarDate: new Date(),
  sortClientTasksByDueDate: false,
  selectedCalendarDate: null,
  isFirstTimeUser: typeof window !== 'undefined' ? localStorage.getItem('firstTimeUser') === null : true,
  showTaskModal: false,
  showSettingsModal: false,
  showInboxModal: false,
  showNotificationsPanel: false,
  showTaskTypeSelector: false,
};

type Action =
  | { type: 'SET_CURRENT_PAGE'; payload: string }
  | { type: 'SET_CLIENT_TASKS'; payload: Task[] }
  | { type: 'SET_PERSONAL_TASKS'; payload: Task[] }
  | { type: 'SET_SETTINGS'; payload: Settings }
  | { type: 'SET_EDITING_TASK'; payload: Task | null }
  | { type: 'SET_TASK_TYPE'; payload: 'client' | 'personal' }
  | { type: 'SET_TAGS'; payload: string[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'SET_CALENDAR_DATE'; payload: Date }
  | { type: 'SET_SELECTED_CALENDAR_DATE'; payload: Date | null }
  | { type: 'SET_FIRST_TIME_USER'; payload: boolean }
  | { type: 'SET_SHOW_TASK_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_SETTINGS_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_INBOX_MODAL'; payload: boolean }
  | { type: 'SET_SHOW_NOTIFICATIONS_PANEL'; payload: boolean }
  | { type: 'SET_SHOW_TASK_TYPE_SELECTOR'; payload: boolean }
  | { type: 'LOAD_DATA' };

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_CLIENT_TASKS':
      return { ...state, clientTasks: action.payload };
    case 'SET_PERSONAL_TASKS':
      return { ...state, personalTasks: action.payload };
    case 'SET_SETTINGS':
      return { ...state, settings: action.payload };
    case 'SET_EDITING_TASK':
      return { ...state, editingTask: action.payload };
    case 'SET_TASK_TYPE':
      return { ...state, taskType: action.payload };
    case 'SET_TAGS':
      return { ...state, tags: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'SET_CALENDAR_DATE':
      return { ...state, calendarDate: action.payload };
    case 'SET_SELECTED_CALENDAR_DATE':
      return { ...state, selectedCalendarDate: action.payload };
    case 'SET_FIRST_TIME_USER':
      return { ...state, isFirstTimeUser: action.payload };
    case 'SET_SHOW_TASK_MODAL':
      return { ...state, showTaskModal: action.payload };
    case 'SET_SHOW_SETTINGS_MODAL':
      return { ...state, showSettingsModal: action.payload };
    case 'SET_SHOW_INBOX_MODAL':
      return { ...state, showInboxModal: action.payload };
    case 'SET_SHOW_NOTIFICATIONS_PANEL':
      return { ...state, showNotificationsPanel: action.payload };
    case 'SET_SHOW_TASK_TYPE_SELECTOR':
      return { ...state, showTaskTypeSelector: action.payload };
    case 'LOAD_DATA':
      // Load from localStorage
      if (typeof window !== 'undefined') {
        const savedClientTasks = localStorage.getItem('clientTasks');
        const savedPersonalTasks = localStorage.getItem('personalTasks');
        const savedSettings = localStorage.getItem('settings');
        const savedNotifications = localStorage.getItem('notifications');
        const savedMessages = localStorage.getItem('messages');
        const savedTemplates = localStorage.getItem('taskTemplates');
        return {
          ...state,
          clientTasks: savedClientTasks ? JSON.parse(savedClientTasks) : [],
          personalTasks: savedPersonalTasks ? JSON.parse(savedPersonalTasks) : [],
          settings: savedSettings ? JSON.parse(savedSettings) : state.settings,
          notifications: savedNotifications ? JSON.parse(savedNotifications) : [],
          messages: savedMessages ? JSON.parse(savedMessages) : [],
          taskTemplates: savedTemplates ? JSON.parse(savedTemplates) : [],
          isFirstTimeUser: localStorage.getItem('firstTimeUser') === null,
        };
      }
      return state;
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'LOAD_DATA' });
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}