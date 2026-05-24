export const LEVELS = [
  { level: 1, xp: 0, title: 'Beginner' },
  { level: 2, xp: 500, title: 'Consistent Learner' },
  { level: 3, xp: 1500, title: 'Problem Solver' },
  { level: 4, xp: 3000, title: 'Builder' },
  { level: 5, xp: 5000, title: 'Internship Hunter' },
  { level: 6, xp: 8000, title: 'Interview Ready' },
  { level: 7, xp: 12000, title: 'SWE Candidate' },
  { level: 8, xp: 18000, title: 'Microsoft Challenger' },
];

export function getLevelForXP(totalXP) {
  let current = LEVELS[0];
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXP >= LEVELS[i].xp) current = LEVELS[i];
    else break;
  }
  const currentIndex = LEVELS.findIndex(l => l.level === current.level);
  const next = LEVELS[currentIndex + 1] || null;
  const nextXP = next ? next.xp : current.xp;
  const progress = next ? (totalXP - current.xp) / (next.xp - current.xp) : 1;
  return { current, next, progress: Math.max(0, Math.min(1, progress)) };
}

export function sumXPFromQuests(quests, completedMap) {
  let sum = 0;
  Object.keys(completedMap || {}).forEach(key => {
    if (completedMap[key]) {
      const q = quests.find(x => x.id === key);
      if (q) sum += q.xp || 0;
    }
  });
  return sum;
}

export function applyPenalties(total, penalties) {
  let t = total;
  (penalties || []).forEach(p => {
    t += p; // penalties are negative numbers
  });
  return t;
}
