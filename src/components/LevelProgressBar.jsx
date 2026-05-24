import React from 'react';

export default function LevelProgressBar({ progress = 0, current = {}, next = {} }) {
  const pct = Math.round((progress || 0) * 100);
  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <div>{current.title || 'Level'}</div>
        <div>{next ? `${pct}%` : 'MAX'}</div>
      </div>
      <div style={{ background: '#333', height: 10, borderRadius: 6 }}>
        <div style={{ width: `${pct}%`, background: '#2ecc71', height: '100%', borderRadius: 6 }} />
      </div>
    </div>
  );
}
