export interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  category?: string;
  priority: "low" | "medium" | "high";
}

export interface TimerData {
  time: number;
  mode: "focus" | "break";
  sessions: number;
  isRunning: boolean;
  focusDuration: number;
  breakDuration: number;
  goalSessions: number;
  totalFocusTime: number;
  lastActiveDate: string;
}
