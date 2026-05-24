import React, { useState } from 'react';

export default function MissionBriefing({ onGenerate }) {
  const [loading, setLoading] = useState(false);

  const handle = async () => {
    setLoading(true);
    try {
      if (onGenerate) await onGenerate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handle} style={{ padding: '10px 14px', borderRadius: 8, background: '#111', color: '#fff' }}>
      {loading ? 'Generating...' : "Generate today's mission briefing"}
    </button>
  );
}
