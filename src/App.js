import React, { useState } from 'react';
import './App.css';
import { useAuth } from './hooks/useAuth';
import { useGameState } from './hooks/useGameState';
import { useXPPopup } from './hooks/useXPPopup';
import { getLevel, getLevelProgress, getNextLevel, QUESTS } from './data/gameData';
import Dashboard from './components/Dashboard';
import Quests from './components/Quests';
import Levels from './components/Levels';
import SkillTree from './components/SkillTree';
import Rewards from './components/Rewards';
import Achievements from './components/Achievements';
import Settings from './components/Settings';
import Auth from './components/Auth';
import ProfileMenu from './components/ProfileMenu';
import XPPopup from './components/XPPopup';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
  { id: 'quests', label: 'Daily Quests', icon: '⚔️' },
  { id: 'levels', label: 'Levels', icon: '🏆' },
  { id: 'skills', label: 'Skill Tree', icon: '🌳' },
  { id: 'rewards', label: 'Rewards', icon: '🎁' },
  { id: 'achievements', label: 'Achievements', icon: '🏅' },
  { id: 'settings', label: 'Settings', icon: '⚙️' },
];

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [guestMode, setGuestMode] = useState(false);
  const { popups, showXPPopup } = useXPPopup();
  const {
    user,
    authLoading,
    authError,
    login,
    loginWithGoogle,
    register,
    logout,
  } = useAuth();

  const {
    state,
    loaded,
    getTodayXP,
    toggleQuest,
    toggleBoss,
    togglePenalty,
    cycleSkill,
    resetDay,
    resetAll,
    remoteError,
    retryRemoteSync,
    lastLoadSource,
  } = useGameState(user && !guestMode ? user : null);

  if (authLoading || !loaded) {
    return (
      <div className="loading-screen">
        <div className="loading-box">Loading your progress...</div>
      </div>
    );
  }

  if (!user && !guestMode) {
    return (
      <div className="auth-shell">
        <Auth
          login={login}
          register={register}
          loginWithGoogle={loginWithGoogle}
          authError={authError}
          onGuest={() => setGuestMode(true)}
        />
      </div>
    );
  }

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
        <div className="main-header">
          {remoteError && (
            <div className="sync-warning">
              <div>Remote sync unavailable. Progress will continue locally.</div>
              <div className="sync-error">{remoteError}</div>
              <button className="sync-retry-btn" onClick={() => retryRemoteSync()}>Retry sync</button>
            </div>
          )}
          {user && (
            <div className="user-debug">loaded: {String(lastLoadSource)}</div>
          )}
          {user && <ProfileMenu user={user} logout={logout} />}
          {guestMode && <div className="guest-badge">Guest Mode</div>}
        </div>

        <div className="main-pages">
          {page === 'dashboard' && <Dashboard state={state} getTodayXP={getTodayXP} />}
          {page === 'quests' && (
            <Quests
              state={state}
              toggleQuest={toggleQuest}
              toggleBoss={toggleBoss}
              togglePenalty={togglePenalty}
              resetDay={resetDay}
              showXPPopup={showXPPopup}
            />
          )}
          {page === 'levels' && <Levels state={state} />}
          {page === 'skills' && <SkillTree state={state} cycleSkill={cycleSkill} />}
          {page === 'rewards' && <Rewards state={state} />}
          {page === 'achievements' && <Achievements state={state} />}
          {page === 'settings' && <Settings state={state} resetAll={resetAll} user={user} logout={logout} />}
        </div>
      </main>

      {/* XP Popups */}
      {popups.map(popup => (
        <XPPopup key={popup.id} {...popup} />
      ))}
    </div>
  );
}
