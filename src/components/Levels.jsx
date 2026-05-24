import React from 'react';
import { LEVELS, getLevel, getLevelProgress } from '../data/gameData';

export default function Levels({ state }) {
  const xp = state.totalXp;
  const current = getLevel(xp);
  const progress = getLevelProgress(xp);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">PROGRESSION</div>
          <div className="page-sub">// your journey from beginner to Microsoft Challenger</div>
        </div>
      </div>

      {/* Current level highlight */}
      <div className="card" style={{ marginBottom: 20, border: `1px solid ${current.color}44`, background: `${current.color}08` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: `${current.color}22`,
            border: `2px solid ${current.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700,
            color: current.color,
            boxShadow: `0 0 20px ${current.color}44`,
            flexShrink: 0,
          }}>
            {current.level}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 2 }}>
              current rank
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, color: current.color }}>
              {current.title}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{current.desc}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: 'var(--text-primary)' }}>
              {xp.toLocaleString()}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>total XP</div>
          </div>
        </div>
        <div style={{ marginTop: 14 }}>
          <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: progress.pct + '%',
              background: `linear-gradient(90deg, ${current.color}, ${current.color}99)`,
              borderRadius: 99, transition: 'width 0.8s ease',
              boxShadow: `0 0 8px ${current.color}66`,
            }} />
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>
            {progress.pct}% to next level
          </div>
        </div>
      </div>

      {/* All levels */}
      <div className="section-heading">All Ranks</div>
      {LEVELS.map(l => {
        const isCurrent = l.level === current.level;
        const isUnlocked = xp >= l.xp && !isCurrent;
        const isLocked = xp < l.xp;
        return (
          <div key={l.level} className={`level-row ${isCurrent ? 'current' : isUnlocked ? 'unlocked' : 'locked'}`}>
            <div className="level-num-badge" style={isCurrent ? { background: l.color, color: '#000', borderColor: l.color, boxShadow: `0 0 12px ${l.color}66` } : isUnlocked ? { color: l.color, borderColor: l.color + '44' } : {}}>
              {l.level}
            </div>
            <div className="level-info">
              <div className="level-title-text" style={isCurrent || isUnlocked ? { color: l.color } : {}}>
                {l.title}
              </div>
              <div className="level-desc">{l.desc}</div>
            </div>
            <div className="level-xp-req">
              {isLocked ? `${l.xp.toLocaleString()} XP` : isCurrent ? '← you are here' : '✓ completed'}
            </div>
          </div>
        );
      })}

      {/* XP requirements table */}
      <div className="section-heading" style={{ marginTop: 24 }}>XP Required Per Level</div>
      <div className="card">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em' }}>LVL</th>
              <th style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600 }}>TITLE</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL XP</th>
              <th style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)', fontWeight: 600 }}>TO NEXT</th>
            </tr>
          </thead>
          <tbody>
            {LEVELS.map((l, i) => {
              const next = LEVELS[i + 1];
              const isCurrent = l.level === current.level;
              return (
                <tr key={l.level} style={{ borderBottom: '1px solid var(--border)', background: isCurrent ? `${l.color}08` : 'transparent' }}>
                  <td style={{ padding: '8px 12px', color: isCurrent ? l.color : 'var(--text-secondary)', fontWeight: isCurrent ? 700 : 400 }}>{l.level}</td>
                  <td style={{ padding: '8px 12px', color: isCurrent ? l.color : 'var(--text-secondary)' }}>{l.title}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>{l.xp.toLocaleString()}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: 'var(--text-muted)' }}>{next ? (next.xp - l.xp).toLocaleString() : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
