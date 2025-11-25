export interface Task {
  id: string;
  text: string;
  category: string;
  durationMinutes: number;
  timeLeft: number; // in seconds
  completed: boolean;
  createdAt: number;
  aiRoast?: string; // Generated on creation
  priority: 'low' | 'medium' | 'high';
}

export enum ThemeMode {
  CARTOON = 'CARTOON',
  DARK_SARCASTIC = 'DARK_SARCASTIC',
  CUTE_SILLY = 'CUTE_SILLY',
}

export enum MascotType {
  SLOTH = 'SLOTH',
  ROBOT = 'ROBOT',
  COACH = 'COACH',
}

export interface UserStats {
  xp: number;
  level: number;
  tasksCompleted: number;
  streakDays: number;
  badges: string[];
}

export interface MascotMessage {
  text: string;
  emotion: 'happy' | 'angry' | 'bored' | 'panic' | 'judging';
}
