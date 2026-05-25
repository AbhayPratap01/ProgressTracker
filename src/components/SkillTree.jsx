import React from 'react';
import { DSA_TREE, DEV_PHASES } from '../data/gameData';

const phaseColors = ['#00ff88', '#00aaff', '#c77dff', '#ffd60a'];

export default function SkillTree({ state, cycleSkill }) {
  const dsaSkills = state.dsaSkills || {};
  const devSkills = state.devSkills || {};

  const masteredCount = DSA_TREE.filter(t => dsaSkills[t.id] === 'mastered').length;
  const unlockedCount = DSA_TREE.filter(t => dsaSkills[t.id] === 'unlocked').length;

  function getSkillStatus(id, prereq) {
    if (dsaSkills[id]) return dsaSkills[id];
    if (!prereq) return 'locked';
    const prereqStatus = dsaSkills[prereq];
    if (prereqStatus === 'mastered') return 'unlocked';
    return 'locked';
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">SKILL TREE</div>
          <div className="page-sub">Click topics to cycle: locked → unlocked → mastered</div>
        </div>
      </div>

      {/* DSA progress */}
      <div className="grid-3" style={{ marginBottom: 20 }}>
        <div className="stat-card" style={{ '--card-accent': '#00ff88' }}>
          <div className="stat-card-label">Mastered</div>
          <div className="stat-card-value" style={{ color: 'var(--green)' }}>{masteredCount}</div>
          <div className="stat-card-sub">DSA topics</div>
        </div>
        <div className="stat-card" style={{ '--card-accent': '#00aaff' }}>
          <div className="stat-card-label">In Progress</div>
          <div className="stat-card-value" style={{ color: 'var(--blue)' }}>{unlockedCount}</div>
          <div className="stat-card-sub">DSA topics</div>
        </div>
        <div className="stat-card" style={{ '--card-accent': '#ffd60a' }}>
          <div className="stat-card-label">DSA Problems</div>
          <div className="stat-card-value" style={{ color: 'var(--gold)' }}>{state.dsaCount || 0}</div>
          <div className="stat-card-sub">total solved</div>
        </div>
      </div>

      {/* DSA Tree */}
      <div className="section-heading">DSA Skill Tree</div>
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ marginBottom: 12, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
          Topics unlock sequentially. Master one to unlock the next.
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {DSA_TREE.map((topic, i) => {
            const status = getSkillStatus(topic.id, topic.prereq);
            const canClick = status !== 'locked' || !topic.prereq;
            return (
              <button
                key={topic.id}
                className={`skill-node ${status}`}
                onClick={() => canClick && cycleSkill('dsa', topic.id)}
                style={{ cursor: canClick ? 'pointer' : 'not-allowed' }}
                title={status === 'locked' ? `Unlock ${topic.prereq} first` : `Status: ${status} — click to advance`}
              >
                {status === 'mastered' ? '✓ ' : status === 'unlocked' ? '◉ ' : '○ '}
                {topic.label}
              </button>
            );
          })}
        </div>

        {/* Visual chain */}
        <div style={{ marginTop: 16, padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 8 }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', marginBottom: 8 }}>PROGRESSION PATH</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
            {DSA_TREE.map((t, i) => {
              const status = getSkillStatus(t.id, t.prereq);
              return (
                <React.Fragment key={t.id}>
                  <span style={{
                    fontSize: 11,
                    color: status === 'mastered' ? 'var(--green)' : status === 'unlocked' ? 'var(--blue)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: status === 'mastered' ? 600 : 400,
                  }}>
                    {t.label}
                  </span>
                  {i < DSA_TREE.length - 1 && (
                    <span style={{ color: 'var(--text-muted)', fontSize: 10 }}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          {[
            { status: 'mastered', color: 'var(--green)', label: 'Mastered' },
            { status: 'unlocked', color: 'var(--blue)', label: 'In Progress' },
            { status: 'locked', color: 'var(--text-muted)', label: 'Locked' },
          ].map(({ status, color, label }) => (
            <span key={status} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color }} />
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Dev Tree */}
      <div className="section-heading">Development Tree</div>
      {DEV_PHASES.map((phase, pi) => {
        const phaseColor = phaseColors[pi];
        const phaseUnlocked = pi === 0 || DEV_PHASES[pi - 1].skills.every(s => devSkills[`dev_${s}`] === 'mastered');
        return (
          <div key={phase.phase} className="card" style={{ marginBottom: 12, borderLeft: `3px solid ${phaseColor}44` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: `${phaseColor}22`, border: `1px solid ${phaseColor}44`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: phaseColor,
              }}>
                {phase.phase}
              </div>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: phaseColor, letterSpacing: '0.04em' }}>
                  PHASE {phase.phase} — {phase.label.toUpperCase()}
                </div>
                {!phaseUnlocked && (
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                    Complete Phase {phase.phase - 1} to unlock
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {phase.skills.map(skill => {
                const key = `dev_${skill}`;
                const status = devSkills[key] || 'locked';
                const canClick = phaseUnlocked;
                return (
                  <button
                    key={skill}
                    className={`skill-node ${canClick ? status : 'locked'}`}
                    onClick={() => canClick && cycleSkill('dev', key)}
                    style={{ cursor: canClick ? 'pointer' : 'not-allowed' }}
                  >
                    {status === 'mastered' ? '✓ ' : status === 'unlocked' ? '◉ ' : '○ '}
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Roadmap note */}
      <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--purple)' }}>{`// FUTURE:`}</span>{` Version 2 — convert this into a React + Firebase web app with auth, cloud sync, and AI-powered study planner. `}<span style={{ color: 'var(--text-secondary)' }}>This can become your strongest resume project.</span>
      </div>
    </div>
  );
}
