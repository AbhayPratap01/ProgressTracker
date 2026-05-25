import React, { useState } from 'react';

export default function Settings({ state, resetAll, user, logout }) {
  const [confirmReset, setConfirmReset] = useState(false);

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `swe_quest_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function importData(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        localStorage.setItem('swe_quest_2026_v1', JSON.stringify(data));
        window.location.reload();
      } catch {
        alert('Invalid backup file.');
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <div className="page-title">SETTINGS</div>
          <div className="page-sub">// manage your data and preferences</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 16 }}>
          DATA MANAGEMENT
        </div>

        <div style={{ marginBottom: 16, fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {user ? `Signed in as ${user.email} — remote save active.` : 'Guest mode — data is saved locally only.'}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-green" onClick={exportData} style={{ justifyContent: 'flex-start' }}>
            📤 Export Backup (JSON)
          </button>
          <label className="btn" style={{ cursor: 'pointer', justifyContent: 'flex-start' }}>
            📥 Import Backup (JSON)
            <input type="file" accept=".json" style={{ display: 'none' }} onChange={importData} />
          </label>
        </div>
      </div>

      {user && (
        <div className="card" style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 12 }}>
            ACCOUNT
          </div>
          <button className="btn btn-danger" onClick={logout} style={{ justifyContent: 'flex-start' }}>
            Sign out of Firebase
          </button>
        </div>
      )}

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.06em', marginBottom: 16 }}>
          CURRENT SAVE DATA
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {[
            ['Total XP', state.totalXp.toLocaleString()],
            ['Streak', `${state.streak} days`],
            ['Best Streak', `${state.longestStreak} days`],
            ['Days Active', state.totalDaysActive],
            ['DSA Problems', state.dsaCount || 0],
            ['Last Reset', state.lastDayReset || 'Never'],
          ].map(([label, val]) => (
            <div key={label} style={{ background: 'var(--bg-elevated)', borderRadius: 8, padding: '8px 12px' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>{label.toUpperCase()}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--text-primary)', marginTop: 2 }}>{val}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ border: '1px solid rgba(255,68,68,0.2)', background: 'rgba(255,68,68,0.03)' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--red)', letterSpacing: '0.06em', marginBottom: 8 }}>
          DANGER ZONE
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, fontFamily: 'var(--font-mono)' }}>
          Resets ALL progress — XP, streaks, skills. Cannot be undone.
        </div>
        {!confirmReset ? (
          <button className="btn btn-danger" onClick={() => setConfirmReset(true)}>
            ☠️ Reset All Progress
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--red)' }}>Are you sure?</span>
            <button className="btn btn-danger" onClick={() => { resetAll(); setConfirmReset(false); }}>
              Yes, reset everything
            </button>
            <button className="btn" onClick={() => setConfirmReset(false)}>Cancel</button>
          </div>
        )}
      </div>

      <div style={{ marginTop: 24, padding: '12px 16px', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border)', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
        <div style={{ color: 'var(--green)', marginBottom: 4 }}>// STORAGE INFO</div>
        Data is saved locally in your browser using <span style={{ color: 'var(--text-secondary)' }}>localStorage</span>. Export backups regularly. In Version 2, data syncs to Firebase across all devices.
      </div>
    </div>
  );
}
