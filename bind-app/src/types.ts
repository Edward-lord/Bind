export type Category = 'mindset' | 'fitness' | 'learning' | 'productivity' | 'social';

export interface Habit {
  id: string;
  title: string;
  description: string;
  category: Category;
  xpReward: number;
  streak: number;
  completedToday: boolean;
  completedDates: string[];
  icon: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  coinReward: number;
  progress: number;
  goal: number;
  category: Category;
  completed: boolean;
  deadline: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface PlayerStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  totalHabitsCompleted: number;
  longestStreak: number;
  currentStreak: number;
  rank: string;
}
