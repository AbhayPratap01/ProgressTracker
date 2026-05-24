import React from 'react';

export default function StatCard({ title, value = 0, subtitle }) {
  return (
    <div style={{ background: '#222', padding: 12, borderRadius: 8, color: '#fff', minWidth: 140 }}>
      <div style={{ fontSize: 12, opacity: 0.8 }}>{title}</div>
      <div style={{ fontSize: 22, fontWeight: '700', marginTop: 6 }}>{value}</div>
      {subtitle && <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>{subtitle}</div>}
    </div>
  );
}
