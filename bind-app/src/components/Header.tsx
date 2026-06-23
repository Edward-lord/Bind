import React from 'react';
import { PlayerStats } from '../types';
import { ranks } from '../data';

interface Props {
  stats: PlayerStats;
}

export default function Header({ stats }: Props) {
  const currentRank = [...ranks].reverse().find(r => stats.level >= r.level) || ranks[0];
  const xpPercent = Math.min((stats.xp / stats.xpToNextLevel) * 100, 100);

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">⚔️ <span>BIND</span></div>
        <p className="tagline">Gamifie ta croissance</p>
      </div>
      <div className="header-right">
        <div className="player-info">
          <div className="level-badge" style={{ borderColor: currentRank.color }}>
            <span className="level-number">{stats.level}</span>
            <span className="level-label">LVL</span>
          </div>
          <div className="player-details">
            <div className="rank-name" style={{ color: currentRank.color }}>{currentRank.name}</div>
            <div className="xp-bar-container">
              <div className="xp-bar" style={{ width: `${xpPercent}%`, backgroundColor: currentRank.color }} />
            </div>
            <div className="xp-text">{stats.xp} / {stats.xpToNextLevel} XP</div>
          </div>
          <div className="coins">
            <span className="coin-icon">🪙</span>
            <span className="coin-amount">{stats.coins}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
