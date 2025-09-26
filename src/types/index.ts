export interface Task {
  id: number;
  projectName: string;
  description: string;
  clientName?: string;
  startDate?: string;
  dueDate?: string;
  status: string;
  priority: string;
  category?: string;
  totalAmount?: string;
  amountPaid?: string;
  outstandingAmount?: string;
  files?: string[];
  tags: string[];
  createdAt?: string;
  completed?: boolean;
  days?: {
    totalDays: number;
    remainingDays: number;
  };
}

export interface Settings {
  userName: string;
  logo?: string;
  theme: string;
  darkMode: boolean;
  sidebarCollapsed: boolean;
  notifications: {
    overdue: boolean;
    upcoming: boolean;
    updates: boolean;
    payments: boolean;
  };
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  date: string;
}

export interface Message {
  id: number;
  from: string;
  subject: string;
  body: string;
  date: string;
  read: boolean;
}

export interface AppState {
  currentPage: string;
  clientTasks: Task[];
  personalTasks: Task[];
  taskTemplates: any[];
  settings: Settings;
  editingTask: Task | null;
  taskType: 'client' | 'personal';
  tags: string[];
  notifications: Notification[];
  messages: Message[];
  calendarDate: Date;
  sortClientTasksByDueDate: boolean;
  selectedCalendarDate: Date | null;
  isFirstTimeUser: boolean;
  showTaskModal: boolean;
  showSettingsModal: boolean;
  showInboxModal: boolean;
  showNotificationsPanel: boolean;
  showTaskTypeSelector: boolean;
}