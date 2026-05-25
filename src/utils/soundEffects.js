// Sound effects using Web Audio API with a softer, more aesthetic profile
let audioContext = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

function getAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.error('Audio context not supported:', e);
      return null;
    }
  }

  // Resume if suspended (browser autoplay policy)
  if (audioContext && audioContext.state === 'suspended') {
    audioContext
      .resume()
      .catch((e) => console.error('Could not resume audio context:', e));
  }

  return audioContext;
}

export function enableSound(enabled) {
  soundEnabled = enabled;
  localStorage.setItem('soundEnabled', enabled ? 'true' : 'false');
}

export function isSoundEnabled() {
  return soundEnabled;
}

function playTone({
  ctx,
  type = 'sine',
  frequency,
  startAt,
  duration,
  peak = 0.14,
}) {
  const now = startAt;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  // osc -> gain -> destination
  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);

  // Gentle envelope (avoid loud pops)
  // Exponential ramps need positive values.
  const floor = 0.0001;
  gain.gain.setValueAtTime(floor, now);
  gain.gain.exponentialRampToValueAtTime(peak, now + 0.01); // fast attack
  gain.gain.exponentialRampToValueAtTime(floor, now + duration); // decay

  osc.start(now);
  osc.stop(now + duration + 0.02);
}

function playSequence({
  ctx,
  type,
  freqs,
  startAt,
  step = 0.06,
  duration = 0.08,
  peak = 0.14,
}) {
  freqs.forEach((f, i) => {
    playTone({
      ctx,
      type,
      frequency: f,
      startAt: startAt + i * step,
      duration,
      peak,
    });
  });
}

// Short soft “XP gained” tick
export function playXPSound() {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // A little arpeggio instead of harsh square beep
    playSequence({
      ctx,
      type: 'triangle',
      freqs: [523.25, 659.25, 783.99], // C E G
      startAt: now + 0.01,
      step: 0.05,
      duration: 0.07,
      peak: 0.11,
    });
  } catch (e) {
    console.error('Sound playback error:', e);
  }
}

// Softer “success/ding” with two/three notes
export function playSuccessSound() {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    playSequence({
      ctx,
      type: 'sine',
      freqs: [659.25, 880.0, 1046.5], // E A C-ish
      startAt: now + 0.01,
      step: 0.055,
      duration: 0.10,
      peak: 0.12,
    });
  } catch (e) {
    console.error('Success sound error:', e);
  }
}

export function playClickSound() {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playTone({
      ctx,
      type: 'sine',
      frequency: 392.0, // G4
      startAt: now + 0.005,
      duration: 0.05,
      peak: 0.08,
    });
  } catch (e) {
    console.error('Sound playback error:', e);
  }
}

export function playLevelUpSound() {
  if (!soundEnabled) return;

  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    playSequence({
      ctx,
      type: 'sine',
      freqs: [523.25, 659.25, 783.99, 987.77], // C E G B-ish
      startAt: now + 0.01,
      step: 0.07,
      duration: 0.12,
      peak: 0.10,
    });
  } catch (e) {
    console.error('Sound playback error:', e);
  }
}

