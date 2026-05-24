import { useState, useCallback, useEffect } from 'react';
import { QUESTS, BOSS_BATTLES, PENALTIES } from '../data/gameData';

const STORAGE_KEY = 'swe_quest_2026_v1';

function defaultState() {
  return {
    totalXp: 0,
    streak: 0,
    longestStreak: 0,
    questsDone: {},
    bossesDone: {},
    penalties: {},
    dsaSkills: { arrays: 'mastered', strings: 'unlocked' },
    devSkills: {},
    stats: {
      intelligence: 0,
      builder: 0,
      communication: 0,
      discipline: 0,
      energy: 0,
      reputation: 0,
    },
    dsaCount: 0,
    projectCount: 0,
    lastDayReset: null,
    xpHistory: [],
    totalDaysActive: 0,
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function useGameState() {
  const [state, setState] = useState(() => loadState());

  useEffect(() => {
    saveState(state);
  }, [state]);

  const getTodayXP = useCallback((s = state) => {
    const q = QUESTS.filter(q => s.questsDone[q.id]).reduce((a, q) => a + q.xp, 0);
    const b = BOSS_BATTLES.filter(b => s.bossesDone[b.id]).reduce((a, b) => a + b.xp, 0);
    const p = PENALTIES.filter(p => s.penalties[p.id]).reduce((a, p) => a + p.xp, 0);
    return q + b + p;
  }, [state]);

  const toggleQuest = useCallback((quest) => {
    setState(prev => {
      const wasDone = !!prev.questsDone[quest.id];
      const delta = wasDone ? -quest.xp : quest.xp;
      const newStats = { ...prev.stats };
      newStats[quest.stat] = Math.max(0, (newStats[quest.stat] || 0) + delta);
      const newDsaCount = quest.id === 'dsa'
        ? Math.max(0, prev.dsaCount + (wasDone ? -2 : 2))
        : prev.dsaCount;
      return {
        ...prev,
        questsDone: { ...prev.questsDone, [quest.id]: !wasDone },
        totalXp: Math.max(0, prev.totalXp + delta),
        stats: newStats,
        dsaCount: newDsaCount,
      };
    });
  }, []);

  const toggleBoss = useCallback((boss) => {
    setState(prev => {
      const wasDone = !!prev.bossesDone[boss.id];
      const delta = wasDone ? -boss.xp : boss.xp;
      const newProjectCount = boss.id === 'boss_feature'
        ? Math.max(0, prev.projectCount + (wasDone ? -1 : 1))
        : prev.projectCount;
      return {
        ...prev,
        bossesDone: { ...prev.bossesDone, [boss.id]: !wasDone },
        totalXp: Math.max(0, prev.totalXp + delta),
        projectCount: newProjectCount,
      };
    });
  }, []);

  const togglePenalty = useCallback((penalty) => {
    setState(prev => {
      const wasActive = !!prev.penalties[penalty.id];
      const delta = wasActive ? -penalty.xp : penalty.xp;
      return {
        ...prev,
        penalties: { ...prev.penalties, [penalty.id]: !wasActive },
        totalXp: Math.max(0, prev.totalXp + delta),
      };
    });
  }, []);

  const cycleSkill = useCallback((type, key) => {
    const cycle = { locked: 'unlocked', unlocked: 'mastered', mastered: 'locked' };
    setState(prev => {
      if (type === 'dsa') {
        const cur = prev.dsaSkills[key] || 'locked';
        return { ...prev, dsaSkills: { ...prev.dsaSkills, [key]: cycle[cur] } };
      } else {
        const cur = prev.devSkills[key] || 'locked';
        return { ...prev, devSkills: { ...prev.devSkills, [key]: cycle[cur] } };
      }
    });
  }, []);

  const resetDay = useCallback(() => {
    setState(prev => {
      const todayXP = prev.questsDone;
      const questCount = Object.values(todayXP).filter(Boolean).length;
      const newStreak = questCount >= 4 ? prev.streak + 1 : 0;
      const today = new Date().toISOString().split('T')[0];
      const history = [...(prev.xpHistory || [])];
      const todayEntry = { date: today, xp: prev.totalXp };
      if (!history.find(h => h.date === today)) history.push(todayEntry);
      if (history.length > 30) history.splice(0, history.length - 30);
      return {
        ...prev,
        questsDone: {},
        bossesDone: {},
        penalties: {},
        streak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastDayReset: today,
        totalDaysActive: prev.totalDaysActive + 1,
        xpHistory: history,
      };
    });
  }, []);

  const resetAll = useCallback(() => {
    const fresh = defaultState();
    setState(fresh);
    saveState(fresh);
  }, []);

  return {
    state,
    getTodayXP,
    toggleQuest,
    toggleBoss,
    togglePenalty,
    cycleSkill,
    resetDay,
    resetAll,
  };
}
