import { useState, useCallback, useEffect } from 'react';
import { QUESTS, BOSS_BATTLES, PENALTIES } from '../data/gameData';
import { db } from '../firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

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

function userStorageKey(user) {
  return user ? `${STORAGE_KEY}_${user.uid}` : STORAGE_KEY;
}

function loadLocalState(user) {
  try {
    const raw = localStorage.getItem(userStorageKey(user));
    if (!raw) return defaultState();
    return { ...defaultState(), ...JSON.parse(raw) };
  } catch {
    return defaultState();
  }
}

function saveLocalState(state, user) {
  try {
    localStorage.setItem(userStorageKey(user), JSON.stringify(state));
  } catch {
    // ignore write failures
  }
}

async function loadRemoteState(user) {
  if (!user) return null;
  try {
    const snapshot = await getDoc(doc(db, 'users', user.uid));
    if (!snapshot.exists()) return null;
    const remote = snapshot.data()?.gameState;
    return remote ? { ...defaultState(), ...remote } : null;
  } catch {
    throw new Error('Unable to load remote game state');
  }
}

async function saveRemoteState(state, user) {
  if (!user) return;
  try {
    await setDoc(
      doc(db, 'users', user.uid),
      {
        gameState: state,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    return true;
  } catch {
    return false;
  }
}

// Try to obtain a server-side timestamp by writing then reading a small doc.
// Returns a Date object representing server time, or throws on failure.
async function getServerTime() {
  try {
    const metaRef = doc(db, '__meta', 'serverTimeSync');
    await setDoc(metaRef, { now: serverTimestamp() }, { merge: true });
    const snap = await getDoc(metaRef);
    const ts = snap.data()?.now;
    if (!ts || typeof ts.toDate !== 'function') throw new Error('no server timestamp');
    return ts.toDate();
  } catch (err) {
    throw err;
  }
}

export function useGameState(user) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);
  const [remoteError, setRemoteError] = useState(null);
  const [lastLoadSource, setLastLoadSource] = useState(null); // 'remote' | 'cache' | 'default'

  useEffect(() => {
    let canceled = false;

    async function initialize() {
      if (!user) {
        setState(loadLocalState());
        setLoaded(true);
        return;
      }
      // Load cached state first for fast recovery (works if Firestore is down)
      const cachedState = loadLocalState(user);
      const defaultStateJSON = JSON.stringify(defaultState());
      const cachedStateJSON = JSON.stringify(cachedState);
      if (cachedState && cachedStateJSON !== defaultStateJSON) {
        setState(cachedState);
        setLastLoadSource('cache');
      }

      // If user has no cached progress but a guest cache exists, merge guest -> user
      if ((!cachedState || cachedStateJSON === defaultStateJSON)) {
        try {
          const guestState = loadLocalState(null);
          const guestJSON = JSON.stringify(guestState);
          if (guestState && guestJSON !== defaultStateJSON) {
            // promote guest progress to this user
            setState(guestState);
            setLastLoadSource('merged-guest');
            try { saveLocalState(guestState, user); } catch {};
          }
        } catch (e) {
          // ignore
        }
      }

      if (canceled) return;

      // Then try to load remote and reconcile
      try {
        const remoteState = await loadRemoteState(user);
        if (canceled) return;
        if (remoteState) {
          setState(remoteState);
          setLastLoadSource('remote');
          saveLocalState(remoteState, user);
        } else {
          // no remote: attempt to push cached or initialize remote
          if (cachedState && cachedStateJSON !== defaultStateJSON) {
            const saved = await saveRemoteState(cachedState, user);
            if (!saved) setRemoteError('Unable to save cached progress to remote storage');
          } else {
            const newState = defaultState();
            setState(newState);
            setLastLoadSource('default');
            const saved = await saveRemoteState(newState, user);
            if (!saved) setRemoteError('Unable to initialize remote progress storage');
          }
        }
      } catch (error) {
        // remote failed; we already loaded cached state above
        setRemoteError(error.message);
      }

      // Clear generic guest state once a user is associated
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // ignore
      }

      setLoaded(true);
    }

    initialize();
    return () => { canceled = true; };
  }, [user]);

  useEffect(() => {
    if (!loaded) return;
    if (user) {
      saveLocalState(state, user);
      saveRemoteState(state, user).then((saved) => {
        if (!saved) setRemoteError('Remote save failed. Progress is still saved locally.');
      });
    } else {
      saveLocalState(state, null);
    }
  }, [state, user, loaded]);

  // Define reset functions before effects that reference them
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
  }, []);

  // Daily reset: ensure quests reset at local midnight and when the page becomes visible
  useEffect(() => {
    if (!loaded) return;

    let midnightTimer = null;
    let dailyInterval = null;

    const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000; // IST = UTC+5:30
    const getToday = () => {
      const now = new Date();
      const ist = new Date(now.getTime() + IST_OFFSET_MS);
      return ist.toISOString().split('T')[0];
    };

    const scheduleNextMidnight = () => {
      const now = new Date();
      // compute next midnight in IST and convert to UTC ms
      const istNowMs = now.getTime() + IST_OFFSET_MS;
      const istNow = new Date(istNowMs);
      const nextIstMidUtcMs = Date.UTC(istNow.getUTCFullYear(), istNow.getUTCMonth(), istNow.getUTCDate() + 1, 0, 0, 1) - IST_OFFSET_MS;
      const ms = nextIstMidUtcMs - now.getTime();
      midnightTimer = setTimeout(() => {
        resetDay();
        dailyInterval = setInterval(() => resetDay(), 24 * 60 * 60 * 1000);
      }, ms);
    };

    const performCheck = () => {
      const today = getToday();
      // If lastDayReset is missing or older than today, perform reset using existing state
      if (state.lastDayReset !== today) {
        // Only reset if there was activity yesterday (or it's simply a new day)
        resetDay();
      }
    };

    // Run check immediately and schedule next run
    performCheck();
    scheduleNextMidnight();

    const onVisible = () => {
      if (!document.hidden) performCheck();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      if (midnightTimer) clearTimeout(midnightTimer);
      if (dailyInterval) clearInterval(dailyInterval);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [loaded, state.lastDayReset, resetDay]);

  // Server-time based reset: if Firestore is reachable, schedule resets at server midnight (UTC-based).
  useEffect(() => {
    if (!loaded || !user) return;

    let serverTimer = null;
    let serverInterval = null;
    let cancelled = false;

    async function scheduleByServer() {
      try {
        const serverNow = await getServerTime();
        if (cancelled) return;

        // compute next IST midnight based on server time (IST = UTC+5:30)
        const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
        const istMs = serverNow.getTime() + IST_OFFSET_MS;
        const istDate = new Date(istMs);
        // find the UTC ms that corresponds to 00:00:01 IST of the next IST day
        const nextIstMidUtcMs = Date.UTC(istDate.getUTCFullYear(), istDate.getUTCMonth(), istDate.getUTCDate() + 1, 0, 0, 1) - IST_OFFSET_MS;
        const ms = nextIstMidUtcMs - serverNow.getTime();
        // clear any local timers to avoid duplicate resets
        if (serverTimer) clearTimeout(serverTimer);
        if (serverInterval) clearInterval(serverInterval);
        serverTimer = setTimeout(() => {
          resetDay();
          serverInterval = setInterval(() => resetDay(), 24 * 60 * 60 * 1000);
        }, ms);
      } catch (err) {
        // If server time can't be obtained, do nothing — local midnight effect remains as fallback
      }
    }

    scheduleByServer();

    return () => {
      cancelled = true;
      if (serverTimer) clearTimeout(serverTimer);
      if (serverInterval) clearInterval(serverInterval);
    };
  }, [loaded, user, resetDay]);

  const retryRemoteSync = useCallback(async () => {
    if (!user) return false;
    setRemoteError(null);
    try {
      const remote = await loadRemoteState(user);
      if (remote) {
        setState(remote);
        saveLocalState(remote, user);
        setRemoteError(null);
        return true;
      }

      const saved = await saveRemoteState(state, user);
      if (!saved) {
        setRemoteError('Retry failed: remote save failed');
        return false;
      }
      setRemoteError(null);
      return true;
    } catch (err) {
      setRemoteError(err?.message || 'Retry failed');
      return false;
    }
  }, [user, state]);

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
      }
      const cur = prev.devSkills[key] || 'locked';
      return { ...prev, devSkills: { ...prev.devSkills, [key]: cycle[cur] } };
    });
  }, []);


  return {
    state,
    loaded,
    remoteError,
    lastLoadSource,
    retryRemoteSync,
    getTodayXP,
    toggleQuest,
    toggleBoss,
    togglePenalty,
    cycleSkill,
    resetDay,
    resetAll,
  };
}
