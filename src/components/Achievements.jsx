import React from 'react';
import { ACHIEVEMENTS } from '../data/gameData';

export default function Achievements({ state }) {
  const earned = ACHIEVEMENTS.filter(a => a.condition(state));
  const total = ACHIEVEMENTS.length;
  const percentage = Math.round((earned.length / total) * 100);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">ACHIEVEMENTS</div>
          <div className="page-sub">{`// unlock badges by progressing`}</div>
        </div>
      </div>

      {/* Achievement progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            ACHIEVEMENTS EARNED
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--gold)', fontWeight: 600 }}>
            {earned.length} / {total}
          </span>
        </div>
        <div style={{ height: 10, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: percentage + '%',
            borderRadius: 99,
            background: 'linear-gradient(90deg, #ffd60a, #f59e0b)',
            transition: 'width 0.5s ease',
            boxShadow: '0 0 10px rgba(255,214,10,0.3)',
          }} />
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            {percentage}% complete
          </span>
        </div>
      </div>

      {/* Achievements grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: 12,
      }}>
        {ACHIEVEMENTS.map(achievement => {
          const isEarned = earned.some(e => e.id === achievement.id);
          return (
            <div
              key={achievement.id}
              style={{
                padding: 14,
                borderRadius: 'var(--radius-md)',
                background: isEarned ? 'rgba(255,214,10,0.08)' : 'var(--bg-card)',
                border: isEarned ? '1px solid rgba(255,214,10,0.3)' : '1px solid var(--border)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                cursor: 'default',
                transition: 'all 0.2s',
                opacity: isEarned ? 1 : 0.6,
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 6 }}>
                {achievement.icon}
              </div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: 12,
                fontWeight: 600,
                color: isEarned ? 'var(--gold)' : 'var(--text-muted)',
                marginBottom: 4,
                lineHeight: 1.3,
              }}>
                {achievement.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--text-muted)',
                lineHeight: 1.4,
              }}>
                {achievement.desc}
              </div>
              {isEarned && (
                <div style={{
                  marginTop: 8,
                  padding: '2px 8px',
                  background: 'rgba(255,214,10,0.2)',
                  borderRadius: 99,
                  fontSize: 10,
                  color: 'var(--gold)',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono)',
                }}>
                  EARNED ✓
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
