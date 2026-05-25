import { useState, useCallback } from 'react';

export function useXPPopup() {
  const [popups, setPopups] = useState([]);

  const showXPPopup = useCallback((xp, x, y) => {
    const id = Date.now() + Math.random();
    setPopups(prev => [...prev, { id, xp, x, y }]);
    
    // Auto remove after animation completes
    setTimeout(() => {
      setPopups(prev => prev.filter(p => p.id !== id));
    }, 1100);
  }, []);

  return { popups, showXPPopup };
}
