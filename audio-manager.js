/**
 * AUDIO MANAGER - Web Audio API Ambient Soundscape & Custom Audio Player
 * Tự động tạo âm thanh thung lũng, nước chảy, gió, chuông gió thiền
 * và hỗ trợ phát file nhạc tùy chọn từ experience-config.js
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.ambientGain = null;
    this.sfxGain = null;
    this.isMuted = false;
    this.isPlaying = false;
    this.customMusicAudio = null;

    this.melodyTimer = null;
    this.waterNode = null;
    this.windNode = null;
    
    // Scale ngũ âm Nhật Bản (Insen / Hirajoshi: D, Eb, G, A, C)
    this.scale = [
      146.83, 155.56, 196.00, 220.00, 261.63,
      293.66, 311.13, 392.00, 440.00, 523.25,
      587.33, 622.25, 783.99, 880.00
    ];
  }

  init() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.75, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.55, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
    this.ambientGain.connect(this.masterGain);

    this.sfxGain = this.ctx.createGain();
    this.sfxGain.gain.setValueAtTime(0.65, this.ctx.currentTime);
    this.sfxGain.connect(this.masterGain);

    const conf = window.EXPERIENCE_CONFIG && window.EXPERIENCE_CONFIG.audio;
    if (conf && conf.backgroundMusic && conf.backgroundMusic.trim()) {
      try {
        this.customMusicAudio = new Audio(conf.backgroundMusic.trim());
        this.customMusicAudio.loop = true;
        this.customMusicAudio.crossOrigin = "anonymous";
        const source = this.ctx.createMediaElementSource(this.customMusicAudio);
        source.connect(this.musicGain);
      } catch (err) {
        console.warn("Custom music fallback to procedural:", err);
      }
    }
  }

  start() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    this.startWaterAmbient();
    this.startWindAmbient();

    if (this.customMusicAudio) {
      this.customMusicAudio.play().catch(() => {
        this.startProceduralMusic();
      });
    } else {
      this.startProceduralMusic();
    }
  }

  startWaterAmbient() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      output[i] = (b0 + b1 + b2) * 0.08;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(450, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.5, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.2, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(120, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    whiteNoise.connect(filter);
    filter.connect(this.ambientGain);
    whiteNoise.start();
    this.waterNode = whiteNoise;
  }

  startWindAmbient() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * 0.035;
    }

    const wind = this.ctx.createBufferSource();
    wind.buffer = noiseBuffer;
    wind.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(320, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime);
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(160, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    wind.connect(filter);
    filter.connect(this.ambientGain);
    wind.start();
    this.windNode = wind;
  }

  startProceduralMusic() {
    if (!this.ctx) return;
    this.createWarmDrone();

    const playNote = () => {
      if (!this.isPlaying || this.isMuted) return;
      const freq = this.scale[Math.floor(Math.random() * this.scale.length)];
      this.playChimeTone(freq, 0.28, 3.2);

      if (Math.random() > 0.45) {
        setTimeout(() => {
          if (!this.isPlaying) return;
          const harmonyFreq = freq * (Math.random() > 0.5 ? 1.5 : 1.333);
          this.playChimeTone(harmonyFreq, 0.18, 2.8);
        }, 350 + Math.random() * 300);
      }

      const nextDelay = 2200 + Math.random() * 2600;
      this.melodyTimer = setTimeout(playNote, nextDelay);
    };

    playNote();
  }

  createWarmDrone() {
    if (!this.ctx) return;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = "sine";
    osc1.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2
    osc2.type = "triangle";
    osc2.frequency.setValueAtTime(110.00, this.ctx.currentTime); // A2

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(200, this.ctx.currentTime);
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc1.start();
    osc2.start();
  }

  playChimeTone(freq, volume = 0.3, duration = 3.0) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, now);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(freq * 3.5, now);
    filter.frequency.exponentialRampToValueAtTime(freq * 0.9, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.musicGain);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  playMemoryOpen() {
    if (!this.ctx || this.isMuted) return;
    const chord = [587.33, 783.99, 880.00, 1174.66];
    chord.forEach((freq, idx) => {
      setTimeout(() => {
        this.playSfxTone(freq, 0.22, 1.8);
      }, idx * 60);
    });
  }

  playLanternGlow() {
    if (!this.ctx || this.isMuted) return;
    this.playSfxTone(440, 0.16, 1.2);
    setTimeout(() => this.playSfxTone(659.25, 0.12, 1.4), 80);
  }

  playToriiCross() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(146.83, now);
    osc.frequency.exponentialRampToValueAtTime(110.0, now + 5.0);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + 6.0);
  }

  playEasterEgg() {
    if (!this.ctx || this.isMuted) return;
    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51, 1760];
    arpeggio.forEach((freq, idx) => {
      setTimeout(() => {
        this.playSfxTone(freq, 0.2, 1.2);
      }, idx * 75);
    });
  }

  playSfxTone(freq, volume = 0.2, duration = 1.5) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.sfxGain);

    osc.start(now);
    osc.stop(now + duration + 0.05);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.setTargetAtTime(this.isMuted ? 0 : 0.75, now, 0.1);
    }
    if (this.customMusicAudio) {
      this.customMusicAudio.muted = this.isMuted;
    }
    return this.isMuted;
  }
}

window.audioManager = new AudioManager();
