import React from 'react';
import { PlayerStats } from '../types';

interface Props {
  stats: PlayerStats;
}

export default function StatsBar({ stats }: Props) {
  return (
    <div className="stats-bar">
      <div className="stat-card">
        <span className="stat-icon">🔥</span>
        <div>
          <div className="stat-value">{stats.currentStreak}</div>
          <div className="stat-label">Streak actuel</div>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">⚡</span>
        <div>
          <div className="stat-value">{stats.longestStreak}</div>
          <div className="stat-label">Record streak</div>
        </div>
      </div>
      <div className="stat-card">
        <span className="stat-icon">✅</span>
        <div>
          <div className="stat-value">{stats.totalHabitsCompleted}</div>
          <div className="stat-label">Habitudes complétées</div>
        </div>
      </div>
    </div>
  );
}
