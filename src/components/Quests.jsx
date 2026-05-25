import React from 'react';
import { QUESTS, BOSS_BATTLES, PENALTIES, MAX_DAILY_XP } from '../data/gameData';
import { playXPSound, playSuccessSound } from '../utils/soundEffects';

export default function Quests({ state, toggleQuest, toggleBoss, togglePenalty, resetDay, showXPPopup }) {
  const dailyXP = QUESTS.filter(q => state.questsDone[q.id]).reduce((s, q) => s + q.xp, 0);
  const pct = Math.min(100, Math.round((dailyXP / MAX_DAILY_XP) * 100));

  const handleToggleQuest = (q) => {
    const isCurrentlyDone = !!state.questsDone[q.id];
    if (!isCurrentlyDone) {
      // Quest being completed - show animation and sound
      if (showXPPopup) {
        showXPPopup(q.xp, window.innerWidth / 2, window.innerHeight / 2);
      }
      playXPSound();
    }
    toggleQuest(q);
  };

  const handleToggleBoss = (b) => {
    const isCurrentlyDone = !!state.bossesDone[b.id];
    if (!isCurrentlyDone) {
      if (showXPPopup) {
        showXPPopup(b.xp, window.innerWidth / 2, window.innerHeight / 2);
      }
      playSuccessSound();
    }
    toggleBoss(b);
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">DAILY QUESTS</div>
          <div className="page-sub">{`// complete missions to earn XP — reset at end of day`}</div>
        </div>
        <button className="btn btn-green" onClick={resetDay}>
          🌅 End Day & Bank XP
        </button>
      </div>

      {/* Daily XP meter */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            TODAY'S DAILY XP
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
            {dailyXP} / {MAX_DAILY_XP}
          </span>
        </div>
        <div style={{ height: 10, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: pct + '%',
            borderRadius: 99,
            background: pct === 100
              ? 'linear-gradient(90deg, #00ff88, #ffd60a)'
              : 'linear-gradient(90deg, #00ff88, #00ffcc)',
            transition: 'width 0.5s ease',
            boxShadow: '0 0 10px rgba(0,255,136,0.3)',
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
            {QUESTS.filter(q => state.questsDone[q.id]).length}/{QUESTS.length} quests done
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: pct === 100 ? 'var(--gold)' : 'var(--text-muted)' }}>
            {pct === 100 ? '🏆 PERFECT DAY!' : `${pct}% complete`}
          </span>
        </div>
      </div>

      {/* Mandatory quests */}
      <div className="section-heading">Mandatory Daily Quests</div>
      {QUESTS.map(q => {
        const done = !!state.questsDone[q.id];
        return (
          <div key={q.id} className={`quest-item${done ? ' done' : ''}`} onClick={() => handleToggleQuest(q)}>
            <div className="quest-check">✓</div>
            <div className="quest-icon">{q.icon}</div>
            <div className="quest-name">{q.name}</div>
            <span className="xp-pill">+{q.xp} XP</span>
          </div>
        );
      })}

      {/* Boss battles */}
      <div className="section-heading" style={{ marginTop: '1.5rem' }}>Weekly Boss Battles</div>
      <div style={{ marginBottom: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
        Harder missions for massive XP rewards
      </div>
      {BOSS_BATTLES.map(b => {
        const done = !!state.bossesDone[b.id];
        return (
          <div key={b.id} className={`boss-card${done ? ' done' : ''}`} onClick={() => handleToggleBoss(b)}>
            <div className="boss-icon-wrap">{b.icon}</div>
            <div style={{ flex: 1 }}>
              <div className="boss-name">{b.name}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 3 }}>
                <span className={`difficulty-badge difficulty-${b.difficulty}`}>{b.difficulty}</span>
              </div>
            </div>
            <span className="xp-pill gold">+{b.xp} XP</span>
          </div>
        );
      })}

      {/* Penalties */}
      <div className="section-heading" style={{ marginTop: '1.5rem' }}>☠️ Penalty Zone</div>
      <div style={{ marginBottom: 8, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
        Log your mistakes — deducts XP from total
      </div>
      {PENALTIES.map(p => {
        const active = !!state.penalties[p.id];
        return (
          <div key={p.id} className={`quest-item${active ? ' penalty-active' : ''}`} onClick={() => togglePenalty(p)}>
            <div className="quest-check" style={active ? { background: 'var(--red)', borderColor: 'var(--red)', color: '#fff' } : {}}>✕</div>
            <div className="quest-icon">{p.icon}</div>
            <div className="quest-name">{p.name}</div>
            <span className="xp-pill negative">{p.xp} XP</span>
          </div>
        );
      })}

      {/* End day tip */}
      <div style={{ marginTop: 24, padding: '10px 16px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
        <span style={{ color: 'var(--gold)' }}>⚡ TIP:</span> Click <strong style={{ color: 'var(--text-secondary)' }}>End Day & Bank XP</strong> each night. This saves your streak and clears today's quests for a fresh start.
      </div>
    </div>
  );
}
