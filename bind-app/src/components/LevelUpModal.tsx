import React, { useEffect } from 'react';

interface Props {
  level: number;
  rank: string;
  onClose: () => void;
}

export default function LevelUpModal({ level, rank, onClose }: Props) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="levelup-modal" onClick={e => e.stopPropagation()}>
        <div className="levelup-glow" />
        <div className="levelup-content">
          <div className="levelup-stars">✨ ✨ ✨</div>
          <h2 className="levelup-title">NIVEAU SUPÉRIEUR !</h2>
          <div className="levelup-level">Niveau {level}</div>
          <div className="levelup-rank">{rank}</div>
          <p className="levelup-msg">Tu deviens une meilleure version de toi-même</p>
        </div>
      </div>
    </div>
  );
}
