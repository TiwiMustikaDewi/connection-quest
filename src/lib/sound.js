// Web Audio API Procedural Sound & BGM Synthesizer
// Completely self-contained: zero external audio files, zero 404s, works reliably across all browsers.

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isBgmPlaying = false;
    this.bgmVolume = 0.28;
    this.bgmGain = null;
    this.timerId = null;
    this.currentStep = 0;
    this.nextNoteTime = 0;
    this.tempo = 122; // BPM
    this.listeners = new Set();
    this.activeNodes = new Set();
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Listener subscription for UI (e.g. music toggle & visualizer)
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener({ isBgmPlaying: this.isBgmPlaying, bgmVolume: this.bgmVolume });
      } catch {
        // Ignore subscriber errors
      }
    }
  }

  // ==================== BGM INSTRUMENTAL SYNTHESIZER ====================

  startBgm() {
    this.init();
    if (!this.ctx) return;
    if (this.isBgmPlaying) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isBgmPlaying = true;
    this.currentStep = 0;
    this.nextNoteTime = this.ctx.currentTime + 0.05;

    // Master BGM gain node
    if (!this.bgmGain) {
      this.bgmGain = this.ctx.createGain();
      this.bgmGain.connect(this.ctx.destination);
    }
    this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);

    // Lookahead scheduler loop (runs every 35ms, schedules ahead by 120ms)
    this.timerId = setInterval(() => {
      this.scheduleBgm();
    }, 35);

    this.notify();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }

    if (this.bgmGain && this.ctx) {
      try {
        this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, this.ctx.currentTime);
        this.bgmGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
      } catch {
        // Ignore ramp error
      }
    }

    // Stop active scheduled nodes
    for (const node of this.activeNodes) {
      try {
        node.stop();
      } catch {
        // node already finished
      }
    }
    this.activeNodes.clear();

    this.notify();
  }

  toggleBgm() {
    if (this.isBgmPlaying) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isBgmPlaying;
  }

  setBgmVolume(val) {
    this.bgmVolume = Math.max(0, Math.min(1, val));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
    this.notify();
  }

  // 8-Bar Fun Instrumental Melody & Rhythm Pattern
  scheduleBgm() {
    if (!this.ctx || !this.isBgmPlaying) return;

    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = secondsPerBeat / 2; // Eighth note step (0.245s)
    const lookahead = 0.12;

    while (this.nextNoteTime < this.ctx.currentTime + lookahead) {
      this.playPatternStep(this.currentStep, this.nextNoteTime, stepDuration);
      this.nextNoteTime += stepDuration;
      this.currentStep = (this.currentStep + 1) % 64; // 64 eighth-notes = 32 beats = 8 bars
    }
  }

  playPatternStep(step, time, stepDuration) {
    if (!this.ctx || !this.bgmGain) return;

    // 1. Bassline (Walking acoustic bass)
    const bassNote = this.getBassNote(step);
    if (bassNote) {
      this.synthBassNote(bassNote, time, stepDuration * 0.85);
    }

    // 2. Cheerful Marimba Lead Melody
    const melodyNote = this.getMelodyNote(step);
    if (melodyNote) {
      this.synthMarimbaNote(melodyNote, time, stepDuration * 0.75);
    }

    // 3. Gentle Chord Harmony (Pads on beat 1 and 3 of every measure)
    if (step % 4 === 0) {
      const chord = this.getChordNotes(step);
      if (chord) {
        this.synthPadChord(chord, time, stepDuration * 3.5);
      }
    }

    // 4. Soft Rhythm Ticks (Woodblock on beat 2 and 4, light shaker on off-beats)
    if (step % 4 === 2) {
      this.synthWoodblock(time, 650);
    } else if (step % 2 === 1) {
      this.synthHiHat(time, 0.02);
    }
  }

  // Bass Notes mapping (frequencies in Hz)
  getBassNote(step) {
    // Bar 1 (C Major): step 0..7
    if (step === 0 || step === 4) return 130.81; // C3
    if (step === 2 || step === 6) return 196.00; // G3
    // Bar 2 (Am): step 8..15
    if (step === 8 || step === 12) return 110.00; // A2
    if (step === 10 || step === 14) return 164.81; // E3
    // Bar 3 (F): step 16..23
    if (step === 16 || step === 20) return 87.31; // F2
    if (step === 18 || step === 22) return 130.81; // C3
    // Bar 4 (G): step 24..31
    if (step === 24 || step === 28) return 98.00; // G2
    if (step === 26 || step === 30) return 146.83; // D3
    // Bar 5 (C): step 32..39
    if (step === 32 || step === 36) return 130.81; // C3
    if (step === 34 || step === 38) return 196.00; // G3
    // Bar 6 (Dm): step 40..47
    if (step === 40 || step === 44) return 146.83; // D3
    if (step === 42 || step === 46) return 220.00; // A3
    // Bar 7 (G): step 48..55
    if (step === 48 || step === 52) return 98.00; // G2
    if (step === 50 || step === 54) return 146.83; // D3
    // Bar 8 (C Turnaround): step 56..63
    if (step === 56 || step === 60) return 130.81; // C3
    if (step === 58 || step === 62) return 196.00; // G3
    return null;
  }

  // Playful Melody Notes mapping (C5 = 523.25, D5 = 587.33, E5 = 659.25, G5 = 783.99, A5 = 880, C6 = 1046.5)
  getMelodyNote(step) {
    const melodyMap = {
      // Bar 1: C
      0: 523.25, // C5
      1: 587.33, // D5
      2: 659.25, // E5
      4: 783.99, // G5
      6: 659.25, // E5
      // Bar 2: Am
      8: 880.00, // A5
      10: 783.99, // G5
      12: 659.25, // E5
      14: 523.25, // C5
      // Bar 3: F
      16: 698.46, // F5
      18: 659.25, // E5
      20: 587.33, // D5
      22: 523.25, // C5
      // Bar 4: G
      24: 587.33, // D5
      26: 659.25, // E5
      28: 783.99, // G5
      30: 880.00, // A5
      // Bar 5: C energetic
      32: 1046.50, // C6
      34: 880.00,  // A5
      36: 783.99,  // G5
      38: 659.25,  // E5
      // Bar 6: Dm
      40: 698.46, // F5
      42: 783.99, // G5
      44: 880.00, // A5
      46: 1046.50,// C6
      // Bar 7: G7
      48: 987.77, // B5
      50: 880.00, // A5
      52: 783.99, // G5
      54: 587.33, // D5
      // Bar 8: C Resolution
      56: 659.25, // E5
      58: 587.33, // D5
      60: 523.25, // C5
    };
    return melodyMap[step] || null;
  }

  // Soft Chord Pads
  getChordNotes(step) {
    const bar = Math.floor(step / 8);
    switch (bar) {
      case 0: return [261.63, 329.63, 392.00]; // C, E, G
      case 1: return [220.00, 261.63, 329.63]; // A, C, E
      case 2: return [261.63, 349.23, 440.00]; // C, F, A
      case 3: return [246.94, 293.66, 392.00]; // B, D, G
      case 4: return [261.63, 329.63, 523.25]; // C, E, C
      case 5: return [293.66, 349.23, 440.00]; // D, F, A
      case 6: return [246.94, 293.66, 349.23]; // B, D, F
      case 7: return [261.63, 329.63, 392.00]; // C, E, G
      default: return null;
    }
  }

  // Synthesizer: Marimba / Bell Lead
  synthMarimbaNote(freq, time, duration) {
    try {
      const osc = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, time); // 1 octave overtone

      gain.gain.setValueAtTime(0.18, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(gain);
      osc2.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc2.start(time);
      osc.stop(time + duration);
      osc2.stop(time + duration);

      this.activeNodes.add(osc);
      this.activeNodes.add(osc2);
      osc.onended = () => {
        this.activeNodes.delete(osc);
        this.activeNodes.delete(osc2);
      };
    } catch {
      // Audio node scheduling error catch
    }
  }

  // Synthesizer: Warm Plucked Bass
  synthBassNote(freq, time, duration) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.24, time);
      gain.gain.exponentialRampToValueAtTime(0.005, time + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);

      this.activeNodes.add(osc);
      osc.onended = () => this.activeNodes.delete(osc);
    } catch {
      // Ignore
    }
  }

  // Synthesizer: Gentle Pad Chord
  synthPadChord(notes, time, duration) {
    try {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(750, time);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      filter.connect(gain);
      gain.connect(this.bgmGain);

      notes.forEach((freq) => {
        const osc = this.ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, time);
        osc.connect(filter);
        osc.start(time);
        osc.stop(time + duration);
        this.activeNodes.add(osc);
        osc.onended = () => this.activeNodes.delete(osc);
      });
    } catch {
      // Ignore
    }
  }

  // Synthesizer: Woodblock percussion tick
  synthWoodblock(time, freq) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, time + 0.035);

      gain.gain.setValueAtTime(0.08, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.035);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + 0.035);
    } catch {
      // Ignore
    }
  }

  // Synthesizer: Soft Hi-hat / Shaker
  synthHiHat(time, duration) {
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'highpass';
      osc.frequency.setValueAtTime(7000, time);

      gain.gain.setValueAtTime(0.015, time);
      gain.gain.exponentialRampToValueAtTime(0.0005, time + duration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(time);
      osc.stop(time + duration);
    } catch {
      // Ignore
    }
  }

  // ==================== ARCADE SOUND EFFECTS ====================

  // Cheerful pop
  playPop(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Audio policy catch
    }
  }

  // Bright select chime
  playSelect(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      [523.25, 659.25, 783.99].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.05);

        gain.gain.setValueAtTime(0.12, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.005, now + i * 0.05 + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.18);
      });
    } catch {
      // Audio policy catch
    }
  }

  // Typewriter blip
  playBlip(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);

      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch {
      // Audio policy catch
    }
  }

  // Sparkle celebration
  playSparkle(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [587.33, 739.99, 880.0, 1174.66]; // D5, F#5, A5, D6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);

        gain.gain.setValueAtTime(0.12, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.35);
      });
    } catch {
      // Audio policy catch
    }
  }

  // Catching an item in the arcade catcher game
  playCatch(enabled = true, comboLevel = 1) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const baseFreq = 523.25 * Math.min(2, 1 + (comboLevel - 1) * 0.15);

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.1);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.12);
    } catch {
      // Audio catch
    }
  }

  // Combo milestone fanfare in arcade game
  playComboFanfare(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.05);

        gain.gain.setValueAtTime(0.14, now + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.05);
        osc.stop(now + idx * 0.05 + 0.25);
      });
    } catch {
      // Audio catch
    }
  }

  // Wooden puzzle tile rotation click
  playRotate(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.05);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio catch
    }
  }

  // Bridge circuit conduit glowing connection
  playCircuitConnect(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [440, 554.37, 659.25, 880];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);

        gain.gain.setValueAtTime(0.15, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.3);
      });
    } catch {
      // Audio catch
    }
  }

  // Hitting a stormcloud or wrong move
  playMiss(enabled = true) {
    if (!enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.15);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch {
      // Audio catch
    }
  }
}

export const sound = new SoundEngine();
