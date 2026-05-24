import React from 'react';

export default function QuestItem({ quest, completed = false, onToggle }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 8, background: '#1c1c1c', borderRadius: 8 }}>
      <input type="checkbox" checked={!!completed} onChange={() => onToggle(quest.id)} />
      <div style={{ flex: 1 }}>
        <div style={{ color: '#fff' }}>{quest.label}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{quest.xp} XP</div>
      </div>
    </div>
  );
}
