import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getLevel, getNextLevel, getLevelProgress, STAT_META, MAX_DAILY_XP, QUESTS } from '../data/gameData';

function StatBar({ stat, value, meta }) {
  const maxStat = 500;
  const pct = Math.min(100, Math.round((value / maxStat) * 100));
  return (
    <div className="char-stat-row">
      <div className="char-stat-icon">{meta.icon}</div>
      <div className="char-stat-info">
        <div className="char-stat-name">{meta.label}</div>
        <div className="char-stat-desc">{meta.desc}</div>
      </div>
      <div className="char-stat-bar-wrap">
        <div className="char-stat-bar">
          <div className="char-stat-fill" style={{ width: pct + '%', background: meta.color }} />
        </div>
        <div className="char-stat-num">{value} XP</div>
      </div>
    </div>
  );
}

export default function Dashboard({ state, getTodayXP }) {
  const xp = state.totalXp;
  const level = getLevel(xp);
  const next = getNextLevel(xp);
  const progress = getLevelProgress(xp);
  const todayXP = getTodayXP();
  const questsDoneCount = Object.values(state.questsDone).filter(Boolean).length;

  const chartData = (state.xpHistory || []).slice(-14).map((h, i) => ({
    day: `D${i + 1}`,
    xp: h.xp || 0,
  }));
  if (chartData.length === 0) {
    chartData.push({ day: 'Today', xp: xp });
  }

  const statKeys = Object.keys(STAT_META);

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">COMMAND CENTER</div>
          <div className="page-sub">// Microsoft SWE 2026 — build your character</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
          </div>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid-4" style={{ marginBottom: 16 }}>
        <div className="stat-card" style={{ '--card-accent': level.color }}>
          <div className="stat-card-label">Total XP</div>
          <div className="stat-card-value" style={{ color: level.color }}>{xp.toLocaleString()}</div>
          <div className="stat-card-sub">all time earned</div>
        </div>
        <div className="stat-card" style={{ '--card-accent': 'var(--green)' }}>
          <div className="stat-card-label">Today's XP</div>
          <div className="stat-card-value" style={{ color: 'var(--green)' }}>{todayXP}</div>
          <div className="stat-card-sub">/ {MAX_DAILY_XP} max daily</div>
        </div>
        <div className="stat-card" style={{ '--card-accent': 'var(--gold)' }}>
          <div className="stat-card-label">Streak</div>
          <div className="stat-card-value" style={{ color: 'var(--gold)' }}>🔥 {state.streak}</div>
          <div className="stat-card-sub">best: {state.longestStreak} days</div>
        </div>
        <div className="stat-card" style={{ '--card-accent': 'var(--blue)' }}>
          <div className="stat-card-label">Quests Done</div>
          <div className="stat-card-value" style={{ color: 'var(--blue)' }}>{questsDoneCount}/{QUESTS.length}</div>
          <div className="stat-card-sub">today's missions</div>
        </div>
      </div>

      {/* XP Progress bar */}
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
              LVL {level.level} — {level.title}
            </span>
            {next && (
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', marginLeft: 10 }}>
                → LVL {next.level}: {next.title}
              </span>
            )}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>
            {next ? `${progress.earned.toLocaleString()} / ${progress.needed.toLocaleString()} XP` : 'MAX LEVEL 🏆'}
          </div>
        </div>
        <div style={{ height: 8, background: 'var(--bg-elevated)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            borderRadius: 99,
            background: `linear-gradient(90deg, ${level.color}, ${next?.color || level.color})`,
            width: progress.pct + '%',
            transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
            boxShadow: `0 0 10px ${level.color}66`,
          }} />
        </div>
        <div style={{ marginTop: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
          {progress.pct}% to next level {next ? `• ${(progress.needed - progress.earned).toLocaleString()} XP needed` : ''}
        </div>
      </div>

      <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
        {/* Character stats */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 12, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            CHARACTER STATS
          </div>
          {statKeys.map(key => (
            <StatBar key={key} stat={key} value={state.stats[key] || 0} meta={STAT_META[key]} />
          ))}
        </div>

        {/* XP History chart */}
        <div className="card">
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16, color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>
            XP GROWTH
          </div>
          <div className="chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#4a5568', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} width={40} />
                <Tooltip
                  contentStyle={{ background: '#0f1018', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontFamily: 'JetBrains Mono', fontSize: 11 }}
                  labelStyle={{ color: '#8892a4' }}
                  itemStyle={{ color: '#00ff88' }}
                />
                <Area type="monotone" dataKey="xp" stroke="#00ff88" strokeWidth={2} fill="url(#xpGrad)" dot={{ fill: '#00ff88', r: 3 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>DSA PROBLEMS</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--blue)' }}>{state.dsaCount || 0}</div>
            </div>
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>DAYS ACTIVE</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--purple)' }}>{state.totalDaysActive || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Motivational rule */}
      <div style={{
        padding: '12px 18px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderLeft: '3px solid var(--green)',
        borderRadius: 'var(--radius-md)',
        fontFamily: 'var(--font-mono)',
        fontSize: 12,
        color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>
        <span style={{ color: 'var(--green)' }}>// RULE 01:</span> Consistency beats motivation. Even a low-XP day is better than a zero-XP day. The goal is not perfection. The goal is <span style={{ color: 'var(--text-primary)' }}>progression.</span>
      </div>
    </div>
  );
}
