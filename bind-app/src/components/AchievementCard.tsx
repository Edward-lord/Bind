import React from 'react';
import { Achievement } from '../types';

const rarityColors: Record<string, string> = {
  common: '#94a3b8',
  rare: '#3b82f6',
  epic: '#a855f7',
  legendary: '#f59e0b',
};

const rarityLabels: Record<string, string> = {
  common: 'Commun',
  rare: 'Rare',
  epic: 'Épique',
  legendary: 'Légendaire',
};

interface Props {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: Props) {
  const color = rarityColors[achievement.rarity];

  return (
    <div className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
      style={{ borderColor: achievement.unlocked ? color : '#2a2a3e' }}>
      <div className="achievement-icon-wrap" style={{ backgroundColor: achievement.unlocked ? color + '22' : '#1a1a2e' }}>
        <span className="achievement-icon">{achievement.unlocked ? achievement.icon : '🔒'}</span>
      </div>
      <div className="achievement-info">
        <div className="achievement-top">
          <h4 className="achievement-title" style={{ color: achievement.unlocked ? '#fff' : '#555' }}>
            {achievement.title}
          </h4>
          <span className="rarity-badge" style={{ color, borderColor: color }}>
            {rarityLabels[achievement.rarity]}
          </span>
        </div>
        <p className="achievement-desc">{achievement.description}</p>
        {achievement.unlocked && achievement.unlockedAt && (
          <p className="achievement-date">Débloqué le {achievement.unlockedAt}</p>
        )}
        <span className="achievement-xp">+{achievement.xpReward} XP</span>
      </div>
    </div>
  );
}
