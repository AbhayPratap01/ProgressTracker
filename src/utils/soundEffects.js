// Sound effects using Web Audio API with better browser compatibility
let audioContext = null;
let soundEnabled = localStorage.getItem('soundEnabled') !== 'false';

function getAudioContext() {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.log('Audio context not supported');
      return null;
    }
  }
  
  // Resume if suspended (browser autoplay policy)
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume().catch(e => console.log('Could not resume audio context'));
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

export function playXPSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    // Sweet ascending tone
    osc.frequency.setValueAtTime(400, now);
    osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
    
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0, now + 0.15);
    
    osc.type = 'sine';
    osc.start(now);
    osc.stop(now + 0.15);
  } catch (e) {
    console.log('Sound playback error:', e);
  }
}

export function playSuccessSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);
    
    // Two-tone success sound
    osc1.frequency.setValueAtTime(600, now);
    osc2.frequency.setValueAtTime(800, now);
    
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0, now + 0.3);
    
    osc1.type = 'sine';
    osc2.type = 'sine';
    
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.3);
    osc2.stop(now + 0.3);
  } catch (e) {
    console.log('Sound playback error:', e);
  }
}

export function playClickSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.frequency.setValueAtTime(300, now);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0, now + 0.05);
    
    osc.type = 'triangle';
    osc.start(now);
    osc.stop(now + 0.05);
  } catch (e) {
    console.log('Sound playback error:', e);
  }
}

export function playLevelUpSound() {
  if (!soundEnabled) return;
  
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    
    const now = ctx.currentTime;
    const frequencies = [523.25, 659.25, 783.99]; // C, E, G chord
    
    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0, now + 0.5);
      
      osc.type = 'sine';
      osc.start(now);
      osc.stop(now + 0.5);
    });
  } catch (e) {
    console.log('Sound playback error:', e);
  }
}
