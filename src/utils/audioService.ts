class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private currentSourceNodes: AudioNode[] = [];

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public stopAll() {
    this.currentSourceNodes.forEach((node) => {
      try {
        if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
          (node as AudioScheduledSourceNode).stop();
        }
        node.disconnect();
      } catch {
        // ignore
      }
    });
    this.currentSourceNodes = [];
  }

  /**
   * Generates a serene, melodic Adhan tone sequence inspired by the Maqam Bayati / Hijaz modal scale
   */
  public playAdhan() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    this.stopAll();

    // Notes: D4, Eb4, F#4, G4, A4, Bb4, C5, D5
    const frequencies = [293.66, 311.13, 369.99, 392.0, 440.0, 392.0, 369.99, 293.66];
    const noteDuration = 0.65;
    const startTime = ctx.currentTime + 0.05;

    frequencies.forEach((freq, idx) => {
      const noteStart = startTime + idx * (noteDuration * 0.85);

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Warm overtone: sine + subtle triangle
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteStart);

      // Smooth attack and gentle exponential decay
      gain.gain.setValueAtTime(0.0001, noteStart);
      gain.gain.exponentialRampToValueAtTime(0.3, noteStart + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration);

      this.currentSourceNodes.push(osc, gain);
    });
  }

  /**
   * Serene gentle chime for reminders
   */
  public playChime() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const chords = [523.25, 659.25, 783.99, 1046.5]; // C major 7th harmonic
    const startTime = ctx.currentTime + 0.05;

    chords.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + i * 0.08);

      gain.gain.setValueAtTime(0.0001, startTime + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + i * 0.08 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startTime + i * 0.08 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + i * 0.08);
      osc.stop(startTime + i * 0.08 + 1.3);

      this.currentSourceNodes.push(osc, gain);
    });
  }

  /**
   * Tactile Tasbeeh counter click sound
   */
  public playTasbeehClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(580, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.05);
  }

  /**
   * Completed lap or target reached tone
   */
  public playSuccess() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880];
    const now = ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.1);

      gain.gain.setValueAtTime(0.001, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.2, now + i * 0.1 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.45);
    });
  }
}

export const audioService = new AudioService();
