import React, { useEffect, useState } from 'react';

interface Props {
  xp: number;
  habitName: string;
  onDone: () => void;
}

export default function XPNotification({ xp, habitName, onDone }: Props) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onDone, 400); }, 2000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div className={`xp-notif ${visible ? 'show' : 'hide'}`}>
      <span className="xp-notif-icon">⚡</span>
      <div>
        <div className="xp-notif-title">+{xp} XP</div>
        <div className="xp-notif-sub">{habitName}</div>
      </div>
    </div>
  );
}
