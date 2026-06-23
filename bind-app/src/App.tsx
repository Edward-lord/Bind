import React, { useState, useCallback } from 'react';
import { Habit, PlayerStats, Quest } from './types';
import { initialHabits, initialQuests, initialAchievements, initialStats, ranks } from './data';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import HabitCard from './components/HabitCard';
import QuestCard from './components/QuestCard';
import AchievementCard from './components/AchievementCard';
import LevelUpModal from './components/LevelUpModal';
import XPNotification from './components/XPNotification';
import './App.css';

type Tab = 'habits' | 'quests' | 'achievements' | 'profile';

function getXpForLevel(level: number) {
  return level * 200;
}

function getRank(level: number) {
  return [...ranks].reverse().find(r => level >= r.level) || ranks[0];
}

export default function App() {
  const [tab, setTab] = useState<Tab>('habits');
  const [stats, setStats] = useState<PlayerStats>(initialStats);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [quests, setQuests] = useState<Quest[]>(initialQuests);
  const [achievements, setAchievements] = useState(initialAchievements);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number; rank: string } | null>(null);
  const [xpNotif, setXpNotif] = useState<{ xp: number; name: string } | null>(null);

  const awardXP = useCallback((amount: number, habitName: string, newStats: PlayerStats): PlayerStats => {
    let s = { ...newStats, xp: newStats.xp + amount };
    setXpNotif({ xp: amount, name: habitName });
    while (s.xp >= s.xpToNextLevel) {
      s.xp -= s.xpToNextLevel;
      s.level += 1;
      s.xpToNextLevel = getXpForLevel(s.level);
      const rank = getRank(s.level);
      setLevelUpInfo({ level: s.level, rank: rank.name });
    }
    s.rank = getRank(s.level).name;
    return s;
  }, []);

  const completeHabit = useCallback((id: string) => {
    const today = new Date().toISOString().split('T')[0];
    let completedHabit: Habit | null = null;

    const newHabits = habits.map(h => {
      if (h.id !== id) return h;
      completedHabit = {
        ...h,
        completedToday: true,
        streak: h.streak + 1,
        completedDates: [...h.completedDates, today],
      };
      return completedHabit;
    });

    if (!completedHabit) return;
    const habit = completedHabit as Habit;

    let newStats: PlayerStats = {
      ...stats,
      totalHabitsCompleted: stats.totalHabitsCompleted + 1,
      longestStreak: Math.max(stats.longestStreak, habit.streak),
      currentStreak: habit.streak,
    };
    newStats = awardXP(habit.xpReward, habit.title, newStats);

    const newQuests = quests.map(q => {
      if (q.completed) return q;
      let progress = q.progress;
      if (q.category === habit.category || q.id === 'q1') {
        progress = Math.min(q.progress + 1, q.goal);
      }
      const completed = progress >= q.goal;
      if (completed && !q.completed) {
        newStats = awardXP(q.xpReward, q.title, newStats);
        newStats = { ...newStats, coins: newStats.coins + q.coinReward };
      }
      return { ...q, progress, completed };
    });

    const newAchievements = achievements.map(a => {
      if (a.unlocked) return a;
      let unlock = false;
      if (a.id === 'a1' && newStats.totalHabitsCompleted >= 1) unlock = true;
      if (a.id === 'a2' && newStats.longestStreak >= 7) unlock = true;
      if (a.id === 'a3' && newStats.longestStreak >= 30) unlock = true;
      if (a.id === 'a4' && newHabits.every(h => h.completedToday)) unlock = true;
      if (a.id === 'a5' && newStats.level >= 50) unlock = true;
      if (unlock) {
        newStats = awardXP(a.xpReward, a.title, newStats);
        return { ...a, unlocked: true, unlockedAt: today };
      }
      return a;
    });

    setHabits(newHabits);
    setQuests(newQuests);
    setAchievements(newAchievements);
    setStats(newStats);
  }, [habits, quests, achievements, stats, awardXP]);

  const completedCount = habits.filter(h => h.completedToday).length;
  const totalCount = habits.length;
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="app">
      <Header stats={stats} />
      <StatsBar stats={stats} />

      <nav className="nav-tabs">
        {([
          { key: 'habits', label: '🗡️ Habitudes', badge: `${completedCount}/${totalCount}` },
          { key: 'quests', label: '📜 Quêtes', badge: null },
          { key: 'achievements', label: '🏅 Succès', badge: `${unlockedCount}/${achievements.length}` },
          { key: 'profile', label: '👤 Profil', badge: null },
        ] as const).map(t => (
          <button
            key={t.key}
            className={`tab-btn ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
            {t.badge && <span className="tab-badge">{t.badge}</span>}
          </button>
        ))}
      </nav>

      <main className="main-content">
        {tab === 'habits' && (
          <section>
            <div className="section-header">
              <h2>Habitudes du jour</h2>
              <span className="progress-label">{completedCount}/{totalCount} complétées</span>
            </div>
            <div className="daily-progress">
              <div
                className="daily-progress-fill"
                style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
            <div className="habits-grid">
              {habits.map(h => (
                <HabitCard key={h.id} habit={h} onComplete={completeHabit} />
              ))}
            </div>
          </section>
        )}

        {tab === 'quests' && (
          <section>
            <div className="section-header">
              <h2>Quêtes actives</h2>
              <span className="progress-label">{quests.filter(q => q.completed).length}/{quests.length} terminées</span>
            </div>
            <div className="quests-grid">
              {quests.map(q => <QuestCard key={q.id} quest={q} />)}
            </div>
          </section>
        )}

        {tab === 'achievements' && (
          <section>
            <div className="section-header">
              <h2>Succès</h2>
              <span className="progress-label">{unlockedCount}/{achievements.length} débloqués</span>
            </div>
            <div className="achievements-grid">
              {achievements.map(a => <AchievementCard key={a.id} achievement={a} />)}
            </div>
          </section>
        )}

        {tab === 'profile' && (
          <section>
            <div className="profile-card">
              <div className="profile-avatar">⚔️</div>
              <h2 className="profile-name">Ton Profil</h2>
              <div className="profile-rank" style={{ color: getRank(stats.level).color }}>
                {stats.rank}
              </div>
              <div className="profile-stats-grid">
                {[
                  { value: stats.level, label: 'Niveau' },
                  { value: stats.xp, label: 'XP totale' },
                  { value: stats.coins, label: 'Pièces 🪙' },
                  { value: stats.totalHabitsCompleted, label: 'Habitudes' },
                  { value: stats.longestStreak, label: 'Meilleur streak' },
                  { value: unlockedCount, label: 'Succès' },
                ].map(s => (
                  <div key={s.label} className="profile-stat">
                    <div className="ps-value">{s.value}</div>
                    <div className="ps-label">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="ranks-progression">
                <h3>Progression des rangs</h3>
                {ranks.map(r => (
                  <div key={r.name} className={`rank-item ${stats.level >= r.level ? 'reached' : ''}`}>
                    <span className="rank-dot" style={{ backgroundColor: stats.level >= r.level ? r.color : '#2a2a3e' }} />
                    <span className="rank-item-name" style={{ color: stats.level >= r.level ? r.color : '#555' }}>
                      {r.name}
                    </span>
                    <span className="rank-item-level">Niv. {r.level}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {levelUpInfo && (
        <LevelUpModal
          level={levelUpInfo.level}
          rank={levelUpInfo.rank}
          onClose={() => setLevelUpInfo(null)}
        />
      )}
      {xpNotif && (
        <XPNotification
          xp={xpNotif.xp}
          habitName={xpNotif.name}
          onDone={() => setXpNotif(null)}
        />
      )}
    </div>
  );
}
