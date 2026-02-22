/**
 * Play a short two-tone chime (e.g. for "your turn" in online mode).
 * Uses Web Audio API; safe to call in browser (checks context, catches autoplay errors).
 */
export function playTurnChime(): void {
  if (typeof window === 'undefined') return;
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const playTone = (frequency: number, startTime: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.15, startTime);
      gain.gain.exponentialRampToValueAtTime(0.01, startTime + duration);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };
    playTone(523.25, 0, 0.08);   // C5
    playTone(659.25, 0.1, 0.12); // E5
  } catch {
    // Autoplay policy or unsupported; ignore
  }
}
