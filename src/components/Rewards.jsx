import React from 'react';
import { REWARDS, LEVELS, getLevel } from '../data/gameData';

export default function Rewards({ state }) {
  const streak = state.streak;
  const dsaCount = state.dsaCount || 0;
  const projectCount = state.projectCount || 0;
  const xp = state.totalXp;
  const level = getLevel(xp);

  function isAchieved(r) {
    if (r.type === 'streak') return streak >= r.threshold;
    if (r.type === 'dsa') return dsaCount >= r.threshold;
    if (r.type === 'project') return projectCount >= r.threshold;
    return false;
  }

  const nextStreakReward = REWARDS.filter(r => r.type === 'streak' && !isAchieved(r))[0];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">REWARDS</div>
          <div className="page-sub">// earn streaks, unlock real-world prizes</div>
        </div>
      </div>

      {/* Streak hero */}
      <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(255,214,10,0.25)', background: 'rgba(255,214,10,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ fontSize: 48, lineHeight: 1 }}>🔥</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
              {streak} <span style={{ fontSize: 18, color: 'var(--text-muted)' }}>day streak</span>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
              longest: {state.longestStreak} days
            </div>
            {nextStreakReward && (
              <div style={{ marginTop: 10 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>
                  Next reward: {nextStreakReward.name} ({nextStreakReward.threshold - streak} days away)
                </div>
                <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: Math.round((streak / nextStreakReward.threshold) * 100) + '%',
                    background: 'linear-gradient(90deg, var(--gold), #ffaa00)',
                    borderRadius: 99,
                    boxShadow: '0 0 8px rgba(255,214,10,0.4)',
                  }} />
                </div>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: level.color,
              padding: '8px 16px', background: `${level.color}15`, border: `1px solid ${level.color}44`,
              borderRadius: 8,
            }}>
              {level.title}
            </div>
          </div>
        </div>
      </div>

      {/* Rewards grid */}
      <div className="section-heading">Achievement Rewards</div>
      <div className="grid-auto" style={{ marginBottom: 20 }}>
        {REWARDS.map(r => {
          const achieved = isAchieved(r);
          return (
            <div key={r.key} className={`reward-card${achieved ? ' achieved' : ''}`}>
              <div className="reward-card-icon">{r.icon}</div>
              <div className="reward-card-name">{r.name}</div>
              <div className="reward-card-cond">{r.cond}</div>
              {achieved && (
                <div className="reward-achieved-label">✓ UNLOCKED</div>
              )}
              {!achieved && r.type === 'streak' && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 6 }}>
                  {streak}/{r.threshold} days
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Milestone tracker */}
      <div className="section-heading">Milestone Tracker</div>
      <div className="card">
        {[
          { label: 'DSA Problems Solved', current: dsaCount, target: 100, color: 'var(--green)' },
          { label: 'Current Streak', current: streak, target: 30, color: 'var(--gold)' },
          { label: 'Projects Completed', current: projectCount, target: 3, color: 'var(--blue)' },
          { label: 'Total XP Earned', current: xp, target: 5000, color: 'var(--purple)' },
        ].map(m => {
          const pct = Math.min(100, Math.round((m.current / m.target) * 100));
          return (
            <div key={m.label} style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{m.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
                  {m.current.toLocaleString()} / {m.target.toLocaleString()}
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', width: pct + '%',
                  background: m.color, borderRadius: 99,
                  transition: 'width 0.6s ease',
                  boxShadow: `0 0 6px ${m.color}66`,
                }} />
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                {pct}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
