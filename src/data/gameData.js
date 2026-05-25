export const QUESTS = [
  { id: 'dsa', name: 'Solve 2 DSA Problems', xp: 40, stat: 'intelligence', icon: '🧠', color: '#00ff88' },
  { id: 'cs', name: 'Study Core CS (OS/DBMS/CN/OOP)', xp: 30, stat: 'intelligence', icon: '📚', color: '#00ff88' },
  { id: 'project', name: 'Build Project for 1 Hour', xp: 35, stat: 'builder', icon: '⚒️', color: '#0af' },
  { id: 'english', name: 'English Speaking Practice', xp: 15, stat: 'communication', icon: '🎙️', color: '#c77dff' },
  { id: 'linkedin', name: 'LinkedIn Networking / Apply Jobs', xp: 15, stat: 'reputation', icon: '🌐', color: '#ffd60a' },
  { id: 'workout', name: 'Workout / Walk', xp: 20, stat: 'energy', icon: '⚡', color: '#ff6b35' },
  { id: 'sleep', name: 'Sleep Before 12 AM', xp: 20, stat: 'discipline', icon: '🌙', color: '#48cae4' },
  { id: 'journal', name: 'Journal Your Progress', xp: 10, stat: 'discipline', icon: '📝', color: '#48cae4' },
];

export const BOSS_BATTLES = [
  { id: 'boss_feature', name: 'Complete 1 Full Project Feature', xp: 200, icon: '🏰', difficulty: 'LEGENDARY' },
  { id: 'boss_mock', name: 'Mock Interview', xp: 150, icon: '⚔️', difficulty: 'EPIC' },
  { id: 'boss_contest', name: 'Contest Participation', xp: 150, icon: '🏆', difficulty: 'EPIC' },
  { id: 'boss_post', name: 'Upload LinkedIn Post', xp: 100, icon: '📣', difficulty: 'RARE' },
  { id: 'boss_resume', name: 'Resume Improvement', xp: 100, icon: '📋', difficulty: 'RARE' },
  { id: 'boss_tech', name: 'Learn New Tech Topic', xp: 120, icon: '🔬', difficulty: 'RARE' },
];

export const PENALTIES = [
  { id: 'pen_dsa', name: 'Skipped DSA', xp: -25, icon: '💀' },
  { id: 'pen_scroll', name: 'Wasted 3+ Hours Scrolling', xp: -40, icon: '📱' },
  { id: 'pen_sleep', name: 'Slept After 2 AM', xp: -30, icon: '😴' },
  { id: 'pen_missed', name: 'Missed Entire Day', xp: -50, icon: '☠️' },
];

export const LEVELS = [
  { level: 1, xp: 0, title: 'Beginner', color: '#888', desc: 'Every legend starts here.' },
  { level: 2, xp: 500, title: 'Consistent Learner', color: '#4ade80', desc: 'The grind begins.' },
  { level: 3, xp: 1500, title: 'Problem Solver', color: '#22d3ee', desc: 'DSA clicks into place.' },
  { level: 4, xp: 3000, title: 'Builder', color: '#818cf8', desc: 'You ship real things.' },
  { level: 5, xp: 5000, title: 'Internship Hunter', color: '#f59e0b', desc: 'Applications incoming.' },
  { level: 6, xp: 8000, title: 'Interview Ready', color: '#f97316', desc: 'Bring on the rounds.' },
  { level: 7, xp: 12000, title: 'SWE Candidate', color: '#ec4899', desc: 'The final stretch.' },
  { level: 8, xp: 18000, title: 'Microsoft Challenger', color: '#00b4d8', desc: 'Offer incoming. 🏆' },
];

export const DSA_TREE = [
  { id: 'arrays', label: 'Arrays', prereq: null },
  { id: 'strings', label: 'Strings', prereq: 'arrays' },
  { id: 'hashing', label: 'Hashing', prereq: 'strings' },
  { id: 'sliding_window', label: 'Sliding Window', prereq: 'hashing' },
  { id: 'linked_list', label: 'Linked List', prereq: 'sliding_window' },
  { id: 'stack_queue', label: 'Stack & Queue', prereq: 'linked_list' },
  { id: 'binary_search', label: 'Binary Search', prereq: 'stack_queue' },
  { id: 'trees', label: 'Trees', prereq: 'binary_search' },
  { id: 'graphs', label: 'Graphs', prereq: 'trees' },
  { id: 'dp', label: 'Dynamic Programming', prereq: 'graphs' },
];

export const DEV_PHASES = [
  {
    phase: 1, label: 'Foundations',
    skills: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    phase: 2, label: 'Frontend',
    skills: ['React', 'APIs', 'Authentication'],
  },
  {
    phase: 3, label: 'Backend',
    skills: ['Node.js / Backend', 'Databases', 'Deployment'],
  },
  {
    phase: 4, label: 'Advanced',
    skills: ['Full Stack Projects', 'AI Integrations', 'System Design Basics'],
  },
];

export const STAT_META = {
  intelligence: { label: 'Intelligence', icon: '🧠', desc: 'DSA + CS Fundamentals', color: '#00ff88' },
  builder: { label: 'Builder', icon: '⚒️', desc: 'Projects + Development', color: '#0af' },
  communication: { label: 'Communication', icon: '🎙️', desc: 'English + GD + Networking', color: '#c77dff' },
  discipline: { label: 'Discipline', icon: '🌙', desc: 'Sleep + Consistency', color: '#48cae4' },
  energy: { label: 'Energy', icon: '⚡', desc: 'Gym + Health', color: '#ff6b35' },
  reputation: { label: 'Reputation', icon: '🌐', desc: 'LinkedIn + Resume', color: '#ffd60a' },
};

export const REWARDS = [
  { key: 'streak_7', name: 'Favorite Meal', cond: '7-Day Streak', icon: '🍔', threshold: 7, type: 'streak' },
  { key: 'streak_14', name: 'Movie / Game Time', cond: '14-Day Streak', icon: '🎮', threshold: 14, type: 'streak' },
  { key: 'streak_30', name: 'Buy Something Useful', cond: '30-Day Streak', icon: '🛍️', threshold: 30, type: 'streak' },
  { key: 'dsa_100', name: 'Celebration Day', cond: '100 DSA Problems', icon: '🎊', threshold: 100, type: 'dsa' },
  { key: 'project_done', name: 'Social Media Showcase', cond: 'Complete a Project', icon: '🚀', threshold: 1, type: 'project' },
];

export const ACHIEVEMENTS = [
  { id: 'first_steps', name: '🎮 First Steps', desc: 'Complete your first quest', icon: '🎮', condition: (state) => Object.keys(state.questsDone).length >= 1 },
  { id: 'warrior_spirit', name: '⚔️ Warrior Spirit', desc: 'Reach 7-day streak', icon: '⚔️', condition: (state) => state.streak >= 7 },
  { id: 'unstoppable', name: '🔥 Unstoppable', desc: 'Reach 30-day streak', icon: '🔥', condition: (state) => state.streak >= 30 },
  { id: 'xp_collector_100', name: '💰 Penny Wise', desc: 'Reach 100 total XP', icon: '💰', condition: (state) => state.totalXp >= 100 },
  { id: 'xp_collector_1000', name: '💎 Treasure Hunter', desc: 'Reach 1000 total XP', icon: '💎', condition: (state) => state.totalXp >= 1000 },
  { id: 'dsa_master', name: '🧠 DSA Master', desc: 'Solve 50 DSA problems', icon: '🧠', condition: (state) => (state.dsaCount || 0) >= 50 },
  { id: 'perfect_day', name: '⭐ Perfect Day', desc: 'Complete all daily quests', icon: '⭐', condition: (state) => Object.keys(state.questsDone).length === QUESTS.length },
  { id: 'builder', name: '🏗️ Builder', desc: 'Complete first project feature', icon: '🏗️', condition: (state) => state.bossesDone.boss_feature },
  { id: 'interview_ready', name: '💼 Interview Ready', desc: 'Reach Interview Ready level', icon: '💼', condition: (state) => getLevel(state.totalXp).level >= 6 },
  { id: 'legend', name: '👑 Legend', desc: 'Reach Microsoft Challenger level', icon: '👑', condition: (state) => getLevel(state.totalXp).level >= 8 },
  { id: 'active_legend', name: '🌟 Active Legend', desc: 'Stay active for 100+ days', icon: '🌟', condition: (state) => state.totalDaysActive >= 100 },
  { id: 'networking_pro', name: '🌐 Networking Pro', desc: 'Complete 20 networking tasks', icon: '🌐', condition: (state) => state.linkedinCount >= 20 },
];

export const MAX_DAILY_XP = 185;

export function getLevel(xp) {
  let lvl = LEVELS[0];
  for (const l of LEVELS) {
    if (xp >= l.xp) lvl = l;
  }
  return lvl;
}

export function getNextLevel(xp) {
  for (const l of LEVELS) {
    if (xp < l.xp) return l;
  }
  return null;
}

export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const next = getNextLevel(xp);
  if (!next) return { pct: 100, earned: xp - current.xp, needed: 0 };
  const earned = xp - current.xp;
  const needed = next.xp - current.xp;
  const pct = Math.round((earned / needed) * 100);
  return { pct, earned, needed };
}
