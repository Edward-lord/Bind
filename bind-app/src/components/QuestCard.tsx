import React from 'react';
import { Quest } from '../types';

const categoryColors: Record<string, string> = {
  mindset: '#a855f7',
  fitness: '#ef4444',
  learning: '#3b82f6',
  productivity: '#f59e0b',
  social: '#22c55e',
};

interface Props {
  quest: Quest;
}

export default function QuestCard({ quest }: Props) {
  const color = categoryColors[quest.category];
  const percent = Math.min((quest.progress / quest.goal) * 100, 100);

  return (
    <div className={`quest-card ${quest.completed ? 'quest-completed' : ''}`}>
      <div className="quest-header">
        <h3 className="quest-title">{quest.title}</h3>
        {quest.completed && <span className="quest-done-badge">✓ Terminée</span>}
      </div>
      <p className="quest-desc">{quest.description}</p>
      <div className="quest-progress">
        <div className="progress-bar-bg">
          <div className="progress-bar-fill" style={{ width: `${percent}%`, backgroundColor: color }} />
        </div>
        <span className="progress-text">{quest.progress}/{quest.goal}</span>
      </div>
      <div className="quest-rewards">
        <span className="reward-xp">⚡ +{quest.xpReward} XP</span>
        <span className="reward-coin">🪙 +{quest.coinReward}</span>
        <span className="deadline">📅 {quest.deadline}</span>
      </div>
    </div>
  );
}
