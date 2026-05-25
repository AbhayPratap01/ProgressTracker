import React, { useEffect, useState } from 'react';

export default function XPPopup({ xp, x, y, id }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
    const timer = setTimeout(() => {
      setAnimate(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        left: x,
        top: y,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontWeight: 700,
          color: '#00ff88',
          textShadow: '0 0 15px rgba(0,255,136,0.6)',
          whiteSpace: 'nowrap',
          transform: animate ? 'translateY(-80px) scale(1)' : 'translateY(0) scale(0.8)',
          opacity: animate ? 0 : 1,
          transition: 'all 1s ease-out',
          letterSpacing: '0.05em',
        }}
      >
        +{xp} XP
      </div>
    </div>
  );
}
