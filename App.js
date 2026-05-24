import React, { useState } from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import { getLevel, getLevelProgress, getNextLevel, QUESTS } from './data/gameData';
import Dashboard from './components/Dashboard';
import Quests from './components/Quests';
import Levels from './components/Levels';
import SkillTree from './components/SkillTree';
import Rewards from './components/Rewards';
import Settings from './components/Settings';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
  { id: 'quests', label: 'Daily Quests', icon: '⚔️' },
  { id: 'levels', label: 'Levels', icon: '🏆' },
  { id: 'skills', label: 'Skill Tree', icon: '🌳' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const {
    state,
    getTodayXP,
    toggleQuest,
    toggleBoss,
    togglePenalty,
    cycleSkill,
    resetDay,
    resetAll,
  } = useGameState();

  const xp = state.totalXp;
  const level = getLevel(xp);
  const next = getNextLevel(xp);
  const progress = getLevelProgress(xp);
  const todayXP = QUESTS.filter(q => state.questsDone[q.id]).reduce((s, q) => s + q.xp, 0);

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-logo">SWE QUEST</div>
          <div className="brand-sub">// Microsoft 2026</div>
        </div>

        <div className="sidebar-xp">
          <div className="sidebar-level">
            <div className="level-badge">LVL {level.level}</div>
            <div className="level-name">{level.title}</div>
          </div>
          <div className="xp-bar-mini">
            <div className="xp-bar-fill" style={{ width: progress.pct + '%' }} />
          </div>
          <div className="xp-bar-text">
            {xp.toLocaleString()} XP {next ? `· ${(next.xp - xp).toLocaleString()} to next` : '· MAX LEVEL'}
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Navigation</div>
          {NAV.map(n => (
            <button
              key={n.id}
              className={`nav-btn${page === n.id ? ' active' : ''}`}
              onClick={() => setPage(n.id)}
            >
              <span className="nav-icon">{n.icon}</span>
              {n.label}
              {n.id === 'quests' && todayXP > 0 && (
                <span className="nav-xp-badge">+{todayXP}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-streak">
          <div className="streak-row">
            <span className="streak-flame">🔥</span>
            <span className="streak-num">{state.streak}</span>
          </div>
          <div className="streak-label">day streak</div>
        </div>
      </aside>

      {/* Main */}
      <main className="main-content">
        {page === 'dashboard' && <Dashboard state={state} getTodayXP={getTodayXP} />}
        {page === 'quests' && (
          <Quests
            state={state}
            toggleQuest={toggleQuest}
            toggleBoss={toggleBoss}
            togglePenalty={togglePenalty}
            resetDay={resetDay}
          />
        )}
        {page === 'levels' && <Levels state={state} />}
        {page === 'skills' && <SkillTree state={state} cycleSkill={cycleSkill} />}
        {page === 'rewards' && <Rewards state={state} />}
        {page === 'settings' && <Settings state={state} resetAll={resetAll} />}
      </main>
    </div>
  );
}