import React from 'react';
import { Habit } from '../types';

const categoryColors: Record<string, string> = {
  mindset: '#a855f7',
  fitness: '#ef4444',
  learning: '#3b82f6',
  productivity: '#f59e0b',
  social: '#22c55e',
};

const categoryLabels: Record<string, string> = {
  mindset: 'Mindset',
  fitness: 'Fitness',
  learning: 'Apprentissage',
  productivity: 'Productivité',
  social: 'Social',
};

interface Props {
  habit: Habit;
  onComplete: (id: string) => void;
}

export default function HabitCard({ habit, onComplete }: Props) {
  const color = categoryColors[habit.category];

  return (
    <div className={`habit-card ${habit.completedToday ? 'completed' : ''}`} style={{ borderLeftColor: color }}>
      <div className="habit-header">
        <span className="habit-icon">{habit.icon}</span>
        <div className="habit-info">
          <h3 className="habit-title">{habit.title}</h3>
          <p className="habit-desc">{habit.description}</p>
        </div>
        <div className="habit-meta">
          <span className="category-badge" style={{ backgroundColor: color + '22', color }}>
            {categoryLabels[habit.category]}
          </span>
        </div>
      </div>
      <div className="habit-footer">
        <div className="streak-info">
          {habit.streak > 0 && (
            <span className="streak-badge">🔥 {habit.streak} jours</span>
          )}
          <span className="xp-badge">+{habit.xpReward} XP</span>
        </div>
        <button
          className={`complete-btn ${habit.completedToday ? 'done' : ''}`}
          onClick={() => !habit.completedToday && onComplete(habit.id)}
          disabled={habit.completedToday}
        >
          {habit.completedToday ? '✓ Accompli' : 'Valider'}
        </button>
      </div>
      {habit.completedToday && <div className="completed-overlay" />}
    </div>
  );
}
