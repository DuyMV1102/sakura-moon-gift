/* ── Journey Overlay ──────────────────────────────────────
   Sits ON TOP of the existing Sakura Valley 3D scene.
   Hooks into window.__v (exposed by scene-SV5IBQX7.js).
   Controls: intro → boat journey → memories → finale.
   ──────────────────────────────────────────────────────── */

(function () {
  "use strict";

  const POLL = setInterval(() => {
    if (window.__v && window.__v.rig && window.__v.scene) {
      clearInterval(POLL);
      boot();
    }
  }, 100);

  /* ── constants ── */
  const RA = { z0: 150, z1: -330 };
  const JOURNEY_SPEED = 1.35;
  const MEMORY_RADIUS = 22;
  const TORII_Z = -12.0;

  /* ── state ── */
  const S = {
    phase: "loading",
    journeyZ: RA.z0,
    journeyProgress: 0,
    paused: false,
    activeMemory: null,
    chapterIdx: 0,
    memoryIdx: 0,
    moonClicks: 0,
    dayU: 0.70,
    toriiPassed: false,
    constellationShown: false,
    futureShown: false,
    finaleStarted: false,
    letterShown: false,
    finalShown: false,
    speedMultiplier: 1.0,
    audioMuted: false,
    audioStarted: false,
    scrollAccum: 0,
  };

  /* ── Web Audio Synthesizer & Audio Manager ── */
  class WebAudioManager {
    constructor() {
      this.ctx = null;
      this.master = null;
      this.musicGain = null;
      this.ambientGain = null;
      this.sfxGain = null;
      this.tracks = {};
      this.isPlaying = false;
      this.scale = [146.83, 164.81, 196.0, 220.0, 261.63, 293.66, 329.63, 392.0, 440.0, 523.25];
      this.timer = null;
    }

    init() {
      if (this.ctx) return;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();

      this.master = this.ctx.createGain();
      this.master.gain.value = 0.7;
      this.master.connect(this.ctx.destination);

      this.musicGain = this.ctx.createGain();
      this.musicGain.gain.value = 0.45;
      this.musicGain.connect(this.master);

      this.ambientGain = this.ctx.createGain();
      this.ambientGain.gain.value = 0.35;
      this.ambientGain.connect(this.master);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 0.6;
      this.sfxGain.connect(this.master);
    }

    start(cfg) {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === "suspended") this.ctx.resume();
      if (this.isPlaying) return;
      this.isPlaying = true;

      // Check external bgm
      if (cfg && cfg.audio && cfg.audio.backgroundMusic && cfg.audio.backgroundMusic.trim()) {
        try {
          const el = new Audio(cfg.audio.backgroundMusic.trim());
          el.loop = true;
          el.crossOrigin = "anonymous";
          const src = this.ctx.createMediaElementSource(el);
          src.connect(this.musicGain);
          el.play().catch(() => this.startProcedural());
          this.tracks.bgm = el;
        } catch (e) {
          this.startProcedural();
        }
      } else {
        this.startProcedural();
      }

      this.startWater();
      this.startWind();
    }

    startWater() {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.05;
        b1 = 0.99332 * b1 + white * 0.07;
        b2 = 0.96900 * b2 + white * 0.14;
        data[i] = (b0 + b1 + b2) * 0.07;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 420;
      filter.Q.value = 1.2;

      noise.connect(filter);
      filter.connect(this.ambientGain);
      noise.start();
    }

    startWind() {
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.03;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 280;

      noise.connect(filter);
      filter.connect(this.ambientGain);
      noise.start();
    }

    startProcedural() {
      if (!this.ctx) return;
      // Soft background drone
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc1.type = "sine";
      osc1.frequency.value = 73.42; // D2
      osc2.type = "triangle";
      osc2.frequency.value = 110.0; // A2
      filter.type = "lowpass";
      filter.frequency.value = 180;
      droneGain.gain.value = 0.1;

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.musicGain);
      osc1.start();
      osc2.start();

      const playChime = () => {
        if (!this.isPlaying || S.audioMuted) return;
        const freq = this.scale[Math.floor(Math.random() * this.scale.length)];
        this.playTone(freq, 0.2, 3.0);
        if (Math.random() > 0.5) {
          setTimeout(() => {
            if (this.isPlaying && !S.audioMuted) {
              this.playTone(freq * 1.5, 0.12, 2.5);
            }
          }, 350 + Math.random() * 300);
        }
        this.timer = setTimeout(playChime, 2400 + Math.random() * 2800);
      };
      playChime();
    }

    playTone(freq, vol = 0.25, dur = 2.0) {
      if (!this.ctx || S.audioMuted) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);
      g.gain.setValueAtTime(0.001, now);
      g.gain.linearRampToValueAtTime(vol, now + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, now + dur);
      osc.connect(g);
      g.connect(this.musicGain);
      osc.start(now);
      osc.stop(now + dur + 0.1);
    }

    playSfx(type) {
      if (!this.ctx || S.audioMuted) return;
      if (type === "memopen") {
        [587.33, 783.99, 880.0, 1174.66].forEach((f, idx) => {
          setTimeout(() => this.playTone(f, 0.18, 1.8), idx * 60);
        });
      } else if (type === "torii") {
        this.playTone(146.83, 0.35, 4.5);
      } else {
        this.playTone(523.25, 0.15, 1.2);
      }
    }

    mute() {
      S.audioMuted = true;
      if (this.master && this.ctx) this.master.gain.setTargetAtTime(0, this.ctx.currentTime, 0.1);
    }

    unmute() {
      S.audioMuted = false;
      if (this.master && this.ctx) this.master.gain.setTargetAtTime(0.7, this.ctx.currentTime, 0.1);
    }
  }

  const audio = new WebAudioManager();

  /* ── 3D World Augmentation (Silhouette, Torii, Lanterns, Moon) ── */
  const World3D = {
    toriiGroup: null,
    lanternMeshes: [],
    moonMesh: null,
    moonHalo: null,
    silhouetteGroup: null,

    init(v, cfg) {
      const THREE = v.THREE;
      if (!THREE) return;

      this.addCoupleSilhouette(v, THREE);
      this.addRiverTorii(v, THREE);
      this.addFloatingLanterns(v, THREE, cfg);
      this.addGrandMoon(v, THREE);
      this.setupRaycasting(v, THREE, cfg);
    },

    addCoupleSilhouette(v, THREE) {
      if (!v.rig || !v.rig.boat || !v.rig.boat.group) return;
      const g = new THREE.Group();
      g.name = "couple-silhouette";

      const mat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x13161c),
        roughness: 0.85
      });

      // Person 1 (Anh)
      const p1 = new THREE.Group();
      p1.position.set(-0.24, 0.45, -0.6);
      const b1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.65, 8), mat);
      b1.position.y = 0.32;
      b1.rotation.z = -0.05;
      const h1 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), mat);
      h1.position.set(-0.02, 0.74, 0);
      p1.add(b1); p1.add(h1);

      // Person 2 (Em)
      const p2 = new THREE.Group();
      p2.position.set(0.18, 0.42, -0.58);
      const b2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.24, 0.58, 8), mat);
      b2.position.y = 0.29;
      b2.rotation.z = -0.15;
      const h2 = new THREE.Mesh(new THREE.SphereGeometry(0.115, 10, 10), mat);
      h2.position.set(-0.06, 0.66, 0.02);
      p2.add(b2); p2.add(h2);

      g.add(p1); g.add(p2);
      v.rig.boat.group.add(g);
      this.silhouetteGroup = g;
    },

    addRiverTorii(v, THREE) {
      const z = TORII_Z;
      const rx = v.riverX ? v.riverX(z) : 0;
      const g = new THREE.Group();
      g.position.set(rx, 0, z);

      const redMat = new THREE.MeshStandardMaterial({ color: 0xb53526, roughness: 0.65 });
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.8 });

      const span = 11.0, height = 7.2;
      [-1, 1].forEach(side => {
        const px = (side * span) / 2;
        const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, height, 10), redMat);
        col.position.set(px, height / 2, 0);
        g.add(col);
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 1.2, 8), darkMat);
        base.position.set(px, 0.5, 0);
        g.add(base);
      });

      const topBar = new THREE.Mesh(new THREE.BoxGeometry(span + 3.2, 0.48, 0.55), redMat);
      topBar.position.set(0, height - 0.2, 0);
      g.add(topBar);

      const nukiBar = new THREE.Mesh(new THREE.BoxGeometry(span + 0.8, 0.32, 0.4), redMat);
      nukiBar.position.set(0, height - 1.4, 0);
      g.add(nukiBar);

      v.scene.add(g);
      this.toriiGroup = g;
    },

    addFloatingLanterns(v, THREE, cfg) {
      const list = cfg.memories || [];
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x221814, roughness: 0.8 });
      const paperMat = new THREE.MeshStandardMaterial({
        color: 0xffe2a8,
        emissive: new THREE.Color(0xff9436),
        emissiveIntensity: 1.8,
        roughness: 0.6,
        transparent: true,
        opacity: 0.92
      });

      list.forEach((m, idx) => {
        const z = m._z;
        const rx = v.riverX ? v.riverX(z) : 0;
        const side = idx % 2 === 0 ? 1 : -1;
        const offset = m.type === "bridge" ? side * 3.5 : (m.type === "reflection" ? side * 5.0 : side * 7.0);

        const g = new THREE.Group();
        g.position.set(rx + offset, 0.35, z);
        g.userData = { memory: m, baseY: 0.35, idx: idx };

        // Paper box
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.55), paperMat);
        box.position.y = 0.42;
        box.userData.parentGroup = g;
        g.add(box);

        // Roof
        const roof = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.28, 4), baseMat);
        roof.position.y = 0.86;
        roof.rotation.y = Math.PI / 4;
        g.add(roof);

        // Point light
        const light = new THREE.PointLight(0xffaa44, 1.4, 9);
        light.position.y = 0.45;
        g.add(light);
        g.userData.light = light;

        v.scene.add(g);
        this.lanternMeshes.push(g);
      });
    },

    addGrandMoon(v, THREE) {
      const g = new THREE.Group();
      g.position.set(-35, 52, -390);

      const canvas = document.createElement("canvas");
      canvas.width = 256; canvas.height = 256;
      const ctx = canvas.getContext("2d");
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
      grad.addColorStop(0, "#fffef5");
      grad.addColorStop(0.7, "#f7f1d8");
      grad.addColorStop(1, "#dcd4b8");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const tex = new THREE.CanvasTexture(canvas);
      const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(24, 24, 24), new THREE.MeshBasicMaterial({ map: tex }));
      moonMesh.userData = { isMoon: true };
      g.add(moonMesh);

      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xe6f0ff,
        transparent: true,
        opacity: 0.38,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending
      });
      const halo = new THREE.Mesh(new THREE.SphereGeometry(32, 20, 20), haloMat);
      g.add(halo);

      v.scene.add(g);
      this.moonMesh = moonMesh;
      this.moonHalo = halo;
    },

    setupRaycasting(v, THREE, cfg) {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();

      window.addEventListener("pointerdown", e => {
        if (e.target.closest && e.target.closest(".jy-overlay .active")) return;
        mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, v.camera);

        if (this.moonMesh) {
          const hits = raycaster.intersectObject(this.moonMesh);
          if (hits.length > 0) {
            triggerMoonEasterEgg();
            return;
          }
        }

        const targets = [];
        this.lanternMeshes.forEach(lg => {
          lg.traverse(child => { if (child.isMesh) targets.push(child); });
        });
        const hits = raycaster.intersectObjects(targets);
        if (hits.length > 0) {
          const hit = hits[0].object;
          const parentGroup = hit.userData.parentGroup || hit.parent;
          if (parentGroup && parentGroup.userData && parentGroup.userData.memory) {
            const mem = parentGroup.userData.memory;
            if (!S.activeMemory) {
              triggerMemory(mem, cfg, window.__jy_ui);
            }
          }
        }
      });
    },

    update(time, boatPos) {
      this.lanternMeshes.forEach(lg => {
        const idx = lg.userData.idx;
        lg.position.y = lg.userData.baseY + Math.sin(time * 1.8 + idx) * 0.08;
        if (boatPos && lg.userData.light) {
          const dist = lg.position.distanceTo(boatPos);
          lg.userData.light.intensity = dist < 25 ? 1.4 + (1 - dist / 25) * 2.0 : 1.2;
        }
      });
      if (this.moonHalo) {
        this.moonHalo.scale.setScalar(1.0 + Math.sin(time * 0.8) * 0.05);
      }
    }
  };

  /* ── image preloader ── */
  const imgCache = new Map();
  function preloadImage(src) {
    if (!src || imgCache.has(src)) return;
    const img = new Image();
    img.src = src;
    imgCache.set(src, img);
  }
  function preloadNearby(cfg, currentZ) {
    for (const mem of cfg.memories) {
      if (!mem._z) continue;
      if (Math.abs(currentZ - mem._z) < 60 && !imgCache.has(mem.image)) {
        preloadImage(mem.image);
      }
    }
  }

  /* ── memory z-positions ── */
  function distributeMemories(cfg) {
    const mems = cfg.memories;
    const total = mems.length;
    const usableZ0 = RA.z0 - 8;   // 142
    const usableZ1 = -285;         // Far lake entrance
    for (let i = 0; i < total; i++) {
      const t = i / Math.max(1, total - 1);
      mems[i]._z = usableZ0 - t * (usableZ0 - usableZ1);
      mems[i]._triggered = false;
      mems[i]._viewed = false;
      mems[i]._idx = i;
    }
    const chapters = cfg.chapters;
    for (let c = 0; c < chapters.length; c++) {
      const chMems = mems.filter(m => m.chapter === c);
      if (chMems.length) {
        chapters[c]._zStart = Math.max(...chMems.map(m => m._z)) + 14;
        chapters[c]._zEnd = Math.min(...chMems.map(m => m._z)) - 8;
      } else {
        chapters[c]._zStart = usableZ0 - (c / chapters.length) * (usableZ0 - usableZ1);
        chapters[c]._zEnd = chapters[c]._zStart - 50;
      }
      chapters[c]._shown = false;
    }
  }

  /* ── DOM helpers ── */
  function el(tag, cls, parent, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    (parent || document.body).appendChild(e);
    return e;
  }
  function elH(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html) e.innerHTML = html;
    (parent || document.body).appendChild(e);
    return e;
  }

  /* ── build UI ── */
  function buildUI(cfg) {
    const ui = {};
    ui.overlay = el("div", "jy-overlay");

    // Intro
    ui.intro = el("div", "jy-intro", ui.overlay);
    ui.introFireflies = el("div", "jy-intro-fireflies", ui.intro);
    for (let i = 0; i < 14; i++) {
      const f = el("div", "jy-firefly", ui.introFireflies);
      f.style.cssText = `--dx:${(Math.random()*80-40)}vw;--dy:${(Math.random()*60-30)}vh;--delay:${Math.random()*5}s;--dur:${4+Math.random()*6}s;left:${Math.random()*100}%;top:${Math.random()*100}%`;
    }
    ui.introLines = el("div", "jy-intro-lines", ui.intro);
    ui.introCta = el("button", "jy-intro-cta", ui.intro, cfg.intro.cta || "Đi cùng anh 🌙");

    // Chapter Title
    ui.chapter = el("div", "jy-chapter", ui.overlay);
    ui.chapterSub = el("div", "jy-chapter-sub", ui.chapter);
    ui.chapterTitle = el("div", "jy-chapter-title", ui.chapter);

    // Nearby memory prompt button
    ui.memoryPrompt = el("div", "jy-memory-prompt", ui.overlay);
    ui.memoryPrompt.style.cssText = "position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(14,18,28,0.85);border:1px solid rgba(229,195,136,0.5);border-radius:30px;padding:10px 22px;color:#fce6c9;font-size:14px;cursor:pointer;opacity:0;pointer-events:none;transition:all 0.4s ease;z-index:20;backdrop-filter:blur(8px);box-shadow:0 6px 25px rgba(0,0,0,0.6);";
    ui.memoryPromptText = el("span", null, ui.memoryPrompt, "✦ Xem ký ức");

    // Memory viewer
    ui.memory = el("div", "jy-memory", ui.overlay);
    ui.memoryInner = el("div", "jy-memory-inner", ui.memory);
    ui.memoryImg = el("div", "jy-memory-img", ui.memoryInner);
    ui.memoryCaption = el("div", "jy-memory-caption", ui.memoryInner);
    ui.memoryCaptionTitle = el("div", "jy-memory-caption-title", ui.memoryCaption);
    ui.memoryCaptionDate = el("div", "jy-memory-caption-date", ui.memoryCaption);
    ui.memoryCaptionText = el("div", "jy-memory-caption-text", ui.memoryCaption);
    ui.memoryClose = el("button", "jy-memory-close", ui.memoryInner, "✕ Tiếp tục trôi thuyền");
    ui.memoryClose.style.cssText = "margin-top:16px;background:rgba(229,195,136,0.18);border:1px solid rgba(229,195,136,0.4);border-radius:24px;color:#ffdf9e;padding:8px 20px;font-size:13px;cursor:pointer;width:100%;transition:all 0.3s ease;";

    // Torii flash
    ui.toriiFlash = el("div", "jy-torii-flash", ui.overlay);

    // Future memories
    ui.future = el("div", "jy-future", ui.overlay);
    ui.futureTitle = el("div", "jy-future-title", ui.future, "Những ký ức chúng ta chưa chụp");
    ui.futureFrames = el("div", "jy-future-frames", ui.future);

    // Constellation
    ui.constellation = el("div", "jy-constellation", ui.overlay);
    ui.constellationStars = el("div", "jy-constellation-stars", ui.constellation);
    ui.constellationText = el("div", "jy-constellation-text", ui.constellation);
    ui.constellationBtn = el("button", "jy-constellation-btn", ui.constellation, "Tiếp tục hành trình ⛵");
    ui.constellationBtn.style.cssText = "position:relative;z-index:10;margin-top:24px;background:rgba(255,255,255,0.12);border:1px solid rgba(255,255,255,0.3);color:#fff;border-radius:30px;padding:10px 26px;font-size:14px;cursor:pointer;transition:all 0.3s ease;";

    // Love letter
    ui.letter = el("div", "jy-letter", ui.overlay);
    ui.letterPaper = el("div", "jy-letter-paper", ui.letter);
    ui.letterActions = el("div", "jy-letter-actions", ui.letterPaper);
    ui.letterActions.style.cssText = "margin-top:28px;text-align:center;";
    ui.letterFinishBtn = el("button", "jy-letter-finish-btn", ui.letterActions, "Gửi tặng người anh yêu ✦");
    ui.letterFinishBtn.style.cssText = "background:#9b2c2c;color:#fff;border:none;padding:12px 28px;border-radius:30px;font-size:14px;cursor:pointer;box-shadow:0 4px 15px rgba(155,44,44,0.4);transition:all 0.3s ease;";

    // Final image
    ui.final = el("div", "jy-final", ui.overlay);
    ui.finalImg = el("div", "jy-final-img", ui.final);
    ui.finalText = el("div", "jy-final-text", ui.final);

    // Ending
    ui.ending = el("div", "jy-ending", ui.overlay);
    ui.endingBtn = el("button", "jy-ending-btn", ui.ending, cfg.ending.stayButton || "Ở lại đây thêm một chút");

    // Control Bar HUD (Bottom)
    ui.controlBar = el("div", "jy-control-bar", ui.overlay);

    // Left: Chapter Navigation
    const ctrlChapters = el("div", "jy-ctrl-chapters", ui.controlBar);
    ui.btnPrevCh = el("button", "jy-btn-nav jy-btn-prev", ctrlChapters, "◀");
    ui.btnPrevCh.title = "Chương trước";

    const tabsWrap = el("div", "jy-chapter-tabs", ctrlChapters);
    ui.chapterTabs = [];
    const roman = ["I", "II", "III", "IV"];
    for (let c = 0; c < 4; c++) {
      const tab = el("button", "jy-tab-ch" + (c === 0 ? " active" : ""), tabsWrap, roman[c]);
      tab.title = cfg.chapters[c]?.title || `Chương ${roman[c]}`;
      const chIdx = c;
      tab.addEventListener("click", (e) => {
        e.stopPropagation();
        jumpToChapter(chIdx, cfg, ui);
      });
      ui.chapterTabs.push(tab);
    }

    ui.btnNextCh = el("button", "jy-btn-nav jy-btn-next", ctrlChapters, "▶");
    ui.btnNextCh.title = "Chương sau";

    ui.btnPrevCh.addEventListener("click", (e) => {
      e.stopPropagation();
      const prev = (S.chapterIdx - 1 + 4) % 4;
      jumpToChapter(prev, cfg, ui);
    });
    ui.btnNextCh.addEventListener("click", (e) => {
      e.stopPropagation();
      const next = (S.chapterIdx + 1) % 4;
      jumpToChapter(next, cfg, ui);
    });

    // Center: Chapter Title
    const ctrlInfo = el("div", "jy-ctrl-info", ui.controlBar);
    ui.currentChapterTitle = el("span", "jy-current-chapter-title", ctrlInfo, `Chương I: ${cfg.chapters[0]?.title || "Ngày chúng ta bắt đầu"}`);

    // Right: Actions (Speed, Play/Pause, Audio)
    const ctrlActions = el("div", "jy-ctrl-actions", ui.controlBar);

    // Speed button
    const speeds = [1.0, 2.5, 5.0];
    const speedLabels = ["⚡ 1x", "⚡ 2.5x", "⚡ 5x"];
    let speedIdx = 0;
    ui.btnSpeed = el("button", "jy-btn-speed", ctrlActions, "⚡ 1x");
    ui.btnSpeed.title = "Tốc độ thuyền";
    ui.btnSpeed.addEventListener("click", (e) => {
      e.stopPropagation();
      speedIdx = (speedIdx + 1) % speeds.length;
      S.speedMultiplier = speeds[speedIdx];
      ui.btnSpeed.textContent = speedLabels[speedIdx];
      const v = window.__v;
      if (v && v.rig && !S.paused) {
        v.rig.speedT = JOURNEY_SPEED * S.speedMultiplier;
      }
      audio.playTone(440 * (1 + speedIdx * 0.4), 0.15, 0.4);
    });

    // Play/Pause button
    ui.btnPlayPause = el("button", "jy-btn-playpause", ctrlActions, "⏸");
    ui.btnPlayPause.title = "Tạm dừng / Tiếp tục";
    ui.btnPlayPause.addEventListener("click", (e) => {
      e.stopPropagation();
      if (S.paused) {
        S.paused = false;
        ui.btnPlayPause.textContent = "⏸";
        audio.playTone(523.25, 0.12, 0.3);
      } else {
        S.paused = true;
        ui.btnPlayPause.textContent = "▶";
        audio.playTone(392.0, 0.12, 0.3);
      }
    });

    // Audio button
    ui.btnAudio = el("button", "jy-btn-audio-ctrl", ctrlActions, "♪");
    ui.btnAudio.title = "Âm thanh";
    ui.btnAudio.addEventListener("click", (e) => {
      e.stopPropagation();
      if (S.audioMuted) {
        audio.unmute();
        ui.btnAudio.classList.remove("muted");
      } else {
        audio.mute();
        ui.btnAudio.classList.add("muted");
      }
    });

    // Moon text toast
    ui.moonText = el("div", "jy-moon-text", ui.overlay);

    // Scroll/touch hint
    ui.scrollHint = el("div", "jy-scroll-hint", ui.overlay, "cuộn chuột hoặc vuốt để trôi thuyền");

    window.__jy_ui = ui;
    return ui;
  }

  /* ── day/night mapping ── */
  function journeyDayU(progress) {
    // 0.00: 0.70 (Golden Sunset) -> 0.35: 0.76 (Sunset/Twilight) -> 0.60: 0.85 (Blue Hour) -> 0.90: 0.945 (Moonlit Night)
    if (progress < 0.25) {
      return 0.70 + (progress / 0.25) * 0.04;
    } else if (progress < 0.45) {
      return 0.74 + ((progress - 0.25) / 0.20) * 0.05;
    } else if (progress < 0.75) {
      return 0.79 + ((progress - 0.45) / 0.30) * 0.09;
    } else {
      return 0.88 + ((progress - 0.75) / 0.25) * 0.065;
    }
  }

  /* ── intro ── */
  function playIntro(cfg, ui) {
    return new Promise(resolve => {
      S.phase = "intro";
      ui.intro.classList.add("active");

      const v = window.__v;
      v.dbg.freeze = true;
      v.setDay(0.70, 0);
      v.env.speed = 0;
      v.rig.speed = 0;
      v.rig.speedT = 0;

      let started = false;
      const startNow = (e) => {
        if (started) return;
        started = true;
        if (e) e.stopPropagation();
        ui.intro.classList.add("fade-out");
        audio.start(cfg);
        setTimeout(() => {
          ui.intro.remove();
          resolve();
        }, 400);
      };

      ui.introCta.addEventListener("click", startNow, { once: true });
      ui.introCta.addEventListener("touchend", (e) => { e.preventDefault(); startNow(e); }, { once: true });
      ui.introCta.addEventListener("pointerdown", startNow, { once: true });

      const lines = cfg.intro.lines || [];
      const lineElements = [];
      lines.forEach(txt => {
        const line = el("div", "jy-intro-line", ui.introLines, txt);
        lineElements.push(line);
      });

      ui.intro.addEventListener("click", (e) => {
        lineElements.forEach(l => l.classList.add("visible"));
        ui.introCta.classList.add("visible");
        startNow(e);
      });

      // Animate lines
      (async () => {
        await delay(300);
        for (let i = 0; i < lineElements.length; i++) {
          if (started) return;
          lineElements[i].classList.add("visible");
          await delay(1200);
        }
        if (!started) ui.introCta.classList.add("visible");
      })();
    });
  }

  /* ── journey start ── */
  function startJourney(cfg, ui) {
    S.phase = "journey";
    const v = window.__v;

    v.dbg.freeze = false;
    v.dbg.timeScale = 1;
    v.env.speed = 0;

    S.dayU = 0.70;
    v.setDay(S.dayU, 0);

    if (v.rig.place) {
      v.rig.place(RA.z0);
    } else {
      v.rig.z = RA.z0;
      if (v.rig.pos) v.rig.pos.z = RA.z0;
    }
    v.rig.speedT = JOURNEY_SPEED;
    v.rig.speed = 0.3;
    v.rig.manualT = 999999;

    interceptRigReset(v);

    if (ui.controlBar) ui.controlBar.classList.add("active");
    setupScrollControl(cfg, ui, v);

    ui.scrollHint.classList.add("active");
    setTimeout(() => ui.scrollHint.classList.remove("active"), 4500);

    // Memory prompt click handler
    ui.memoryPrompt.addEventListener("click", () => {
      if (ui.memoryPrompt.userData && ui.memoryPrompt.userData.memory) {
        triggerMemory(ui.memoryPrompt.userData.memory, cfg, ui);
      }
    });
  }

  /* ── prevent boat reset loop & lock manualT ── */
  function interceptRigReset(v) {
    const rig = v.rig;
    const origUpdate = rig.update.bind(rig);

    rig.update = function (t, e, n, i) {
      rig.manualT = 999999;

      if (S.paused) {
        rig.speed = 0;
        rig.speedT = 0;
      } else if (S.phase === "journey") {
        rig.speedT = JOURNEY_SPEED * S.speedMultiplier + (S.scrollAccum > 0 ? S.scrollAccum * 2.5 : 0);
      } else if (S.phase === "ending") {
        rig.speedT = 0.55;
      }

      // Hard clamp before fade trigger
      if (rig.z < -305) {
        rig.z = -305;
        rig.speedT = 0;
        rig.speed = 0;
        rig.fading = 0;
        rig.fade = 0;
      }

      origUpdate(t, e, n, i);

      if (S.paused) {
        rig.speed = 0;
        rig.speedT = 0;
      }
      if (rig.z < -305) {
        rig.z = -305;
        rig.speedT = 0;
        rig.speed = 0;
        rig.fading = 0;
        rig.fade = 0;
      }
    };
  }

  /* ── scroll/touch advance ── */
  function setupScrollControl(cfg, ui, v) {
    const canvas = document.getElementById("c");

    window.addEventListener("wheel", (e) => {
      if (S.phase !== "journey" || S.activeMemory) return;
      if (e.deltaY > 0) {
        S.scrollAccum += 0.35;
      }
    }, { passive: true });

    let touchStartY = 0;
    canvas.addEventListener("touchstart", (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    canvas.addEventListener("touchend", (e) => {
      if (S.phase !== "journey" || S.activeMemory) return;
      const dy = touchStartY - (e.changedTouches[0]?.clientY || touchStartY);
      if (dy > 25) {
        S.scrollAccum += 0.6;
      } else if (Math.abs(dy) < 12) {
        S.scrollAccum += 0.25;
      }
    }, { passive: true });
  }

  /* ── main update loop ── */
  function journeyUpdate(cfg, ui) {
    const v = window.__v;
    if (!v || !v.rig) return;
    const rig = v.rig;

    // 3D Objects update
    World3D.update(performance.now() * 0.001, rig.boat?.group?.position);

    if (S.phase !== "journey" && S.phase !== "finale") return;

    // Rigid speed enforcement
    rig.manualT = 999999;

    if (S.paused) {
      rig.speed = 0;
      rig.speedT = 0;
    } else if (S.phase === "journey") {
      if (S.scrollAccum > 0.01) {
        rig.speedT = JOURNEY_SPEED + S.scrollAccum * 2.8;
        S.scrollAccum *= 0.92;
        if (S.scrollAccum < 0.01) S.scrollAccum = 0;
      } else {
        rig.speedT = JOURNEY_SPEED;
      }
    }

    // Progress
    const totalDist = RA.z0 - (-308);
    S.journeyZ = rig.z;
    S.journeyProgress = Math.max(0, Math.min(1, (RA.z0 - rig.z) / totalDist));

    if (ui.progressBar) {
      ui.progressBar.style.width = (S.journeyProgress * 100) + "%";
    }

    // Dynamic chapter tab sync
    let curCh = 0;
    if (rig.z > 95) curCh = 0;
    else if (rig.z > 0) curCh = 1;
    else if (rig.z > -150) curCh = 2;
    else curCh = 3;

    if (curCh !== S.chapterIdx) {
      S.chapterIdx = curCh;
      if (ui.chapterTabs) {
        ui.chapterTabs.forEach((tab, i) => tab.classList.toggle("active", i === curCh));
      }
      const roman = ["I", "II", "III", "IV"];
      const ch = cfg.chapters[curCh];
      if (ui.currentChapterTitle && ch) {
        ui.currentChapterTitle.textContent = `Chương ${roman[curCh]}: ${ch.title || ""}`;
      }
    }

    // Day/night smooth tracking
    if (!S.paused && S.phase === "journey") {
      const targetU = journeyDayU(S.journeyProgress);
      S.dayU += (targetU - S.dayU) * 0.15;
      v.setDay(S.dayU, 0);
    }

    // Preload nearby images
    preloadNearby(cfg, S.journeyZ);

    // Checks
    checkChapters(cfg, ui);
    checkMemories(cfg, ui);
    checkTorii(cfg, ui);
    checkFutureZone(cfg, ui);
    checkFinale(cfg, ui);
  }


  /* ── jump to chapter ── */
  function jumpToChapter(idx, cfg, ui) {
    if (idx < 0 || idx >= 4) return;
    S.chapterIdx = idx;

    // Reset modals if open
    if (S.activeMemory) {
      ui.memory.className = "jy-memory";
      S.activeMemory = null;
    }
    ui.constellation.className = "jy-constellation";
    ui.letter.className = "jy-letter";
    ui.final.className = "jy-final";

    S.paused = false;
    S.phase = "journey";
    S.finaleStarted = false;
    if (ui.btnPlayPause) ui.btnPlayPause.textContent = "⏸";

    // Coordinates and sky dayU per chapter
    const chapterZ = [142, 45, -30, -250];
    const chapterU = [0.70, 0.75, 0.86, 0.945];

    const v = window.__v;
    if (v && v.rig) {
      const targetZ = chapterZ[idx];
      v.rig.z = targetZ;
      if (v.rig.pos) v.rig.pos.z = targetZ;
      v.rig.speedT = JOURNEY_SPEED * S.speedMultiplier;
      v.rig.manualT = 999999;
      S.dayU = chapterU[idx];
      v.setDay(chapterU[idx], 0);
    }

    // Update active tab & title
    if (ui.chapterTabs) {
      ui.chapterTabs.forEach((tab, i) => {
        tab.classList.toggle("active", i === idx);
      });
    }
    const roman = ["I", "II", "III", "IV"];
    const ch = cfg.chapters[idx];
    if (ui.currentChapterTitle && ch) {
      ui.currentChapterTitle.textContent = `Chương ${roman[idx]}: ${ch.title || ""}`;
    }

    // Show chapter banner
    if (ch) showChapter(ch, ui);
    audio.playTone(523.25, 0.2, 0.8);
  }

  /* ── chapters ── */
  function checkChapters(cfg, ui) {
    for (let c = 0; c < cfg.chapters.length; c++) {
      const ch = cfg.chapters[c];
      if (!ch._shown && S.journeyZ <= ch._zStart && S.journeyZ >= ch._zStart - 10) {
        ch._shown = true;
        showChapter(ch, ui);
      }
    }
  }

  function showChapter(ch, ui) {
    ui.chapterSub.textContent = ch.subtitle || "";
    ui.chapterTitle.textContent = ch.title || "";
    ui.chapter.classList.remove("active");
    void ui.chapter.offsetWidth;
    ui.chapter.classList.add("active");
    setTimeout(() => ui.chapter.classList.remove("active"), 5000);
  }

  /* ── memory triggers ── */
  function checkMemories(cfg, ui) {
    if (S.activeMemory !== null) {
      ui.memoryPrompt.style.opacity = "0";
      ui.memoryPrompt.style.pointerEvents = "none";
      return;
    }

    let nearest = null;
    let minDist = 999;
    for (const mem of cfg.memories) {
      const dist = Math.abs(S.journeyZ - mem._z);
      if (dist < MEMORY_RADIUS && dist < minDist) {
        minDist = dist;
        nearest = mem;
      }
    }

    if (nearest && !nearest._viewed) {
      ui.memoryPrompt.userData = { memory: nearest };
      ui.memoryPromptText.textContent = `✦ ${nearest.title || "Ký ức gần bên"} — Chạm để xem`;
      ui.memoryPrompt.style.opacity = "1";
      ui.memoryPrompt.style.pointerEvents = "auto";
    } else {
      ui.memoryPrompt.style.opacity = "0";
      ui.memoryPrompt.style.pointerEvents = "none";
    }
  }

  function triggerMemory(mem, cfg, ui) {
    S.activeMemory = mem;
    S.paused = true;

    const v = window.__v;
    v.rig.speed = 0;
    v.rig.speedT = 0;

    audio.playSfx("memopen");

    // Set image
    ui.memoryImg.style.backgroundImage = `url(${mem.image})`;
    ui.memoryCaptionTitle.textContent = mem.title || "";
    ui.memoryCaptionDate.textContent = mem.date || "";
    ui.memoryCaptionText.textContent = mem.caption || "";

    ui.memory.className = "jy-memory active type-" + (mem.type || "lantern");

    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      ui.memory.classList.add("closing");
      setTimeout(() => {
        ui.memory.className = "jy-memory";
        S.activeMemory = null;
        S.paused = false;
        mem._viewed = true;
        S.memoryIdx++;
      }, 600);
    };

    ui.memoryClose.onclick = close;
    ui.memory.onclick = (e) => {
      if (e.target === ui.memory) close();
    };
  }

  /* ── torii transition ── */
  function checkTorii(cfg, ui) {
    if (S.toriiPassed) return;
    if (S.journeyZ <= TORII_Z) {
      S.toriiPassed = true;
      toriiTransition(cfg, ui);
    }
  }

  function toriiTransition(cfg, ui) {
    ui.toriiFlash.classList.add("active");
    const v = window.__v;
    const origBloom = v.pipe?.params?.bloom ?? 0;
    if (v.pipe?.params) v.pipe.params.bloom = 0.28;

    setTimeout(() => {
      ui.toriiFlash.classList.remove("active");
    }, 2200);

    setTimeout(() => {
      if (v.pipe?.params) v.pipe.params.bloom = origBloom;
    }, 3500);

    audio.playSfx("torii");
  }

  /* ── future memories ── */
  function checkFutureZone(cfg, ui) {
    if (S.futureShown) return;
    if (S.journeyZ <= -255 && S.journeyZ >= -275) {
      S.futureShown = true;
      showFutureMemories(cfg, ui);
    }
  }

  function showFutureMemories(cfg, ui) {
    ui.futureFrames.textContent = "";
    for (const text of cfg.futureMemories) {
      const frame = el("div", "jy-future-frame", ui.futureFrames);
      el("div", "jy-future-frame-border", frame);
      el("div", "jy-future-frame-text", frame, text);
    }
    ui.future.classList.add("active");

    setTimeout(() => {
      ui.future.classList.add("fade-out");
      setTimeout(() => {
        ui.future.className = "jy-future";
      }, 1800);
    }, 6000);
  }

  /* ── finale ── */
  function checkFinale(cfg, ui) {
    if (S.finaleStarted) return;
    if (S.journeyZ <= -290) {
      S.finaleStarted = true;
      S.phase = "finale";
      showFinale(cfg, ui);
    }
  }

  async function showFinale(cfg, ui) {
    const v = window.__v;
    v.rig.speed = 0;
    v.rig.speedT = 0;
    S.paused = true;

    // Set full luminous night
    S.dayU = 0.945;
    v.setDay(0.945, 0);

    // Constellation
    await showConstellation(cfg, ui);

    // Love letter
    await showLoveLetter(cfg, ui);

    // Final image
    showFinalImage(cfg, ui);
  }

  /* ── constellation ── */
  function showConstellation(cfg, ui) {
    return new Promise(resolve => {
      ui.constellation.classList.add("active");

      const starField = ui.constellationStars;
      starField.textContent = "";
      for (let i = 0; i < 40; i++) {
        const star = el("div", "jy-star-particle", starField);
        star.style.cssText = `left:${Math.random()*100}%;top:${Math.random()*70}%;--twinkle-delay:${Math.random()*4}s;--size:${1+Math.random()*2}px`;
      }

      const dates = cfg.importantDates || [];
      for (let i = 0; i < dates.length; i++) {
        const d = dates[i];
        const dot = el("div", "jy-const-dot", starField);
        const angle = -0.4 + (i / Math.max(1, dates.length - 1)) * 0.8;
        const cx = 50 + Math.sin(angle) * 28;
        const cy = 28 + Math.cos(angle) * 16;
        dot.style.cssText = `left:${cx}%;top:${cy}%`;
        dot.dataset.idx = i;
        dot.title = `${d.date} — ${d.label}`;
      }

      ui.constellationText.textContent = "";
      const introEl = el("div", "jy-const-intro", ui.constellationText, "Trong hàng tỷ ngày đã trôi qua…");
      setTimeout(() => introEl.classList.add("visible"), 600);

      let dateHtml = "";
      for (const d of dates) {
        dateHtml += `<div class="jy-star-date"><span class="jy-star-dot">✦</span> ${d.date} — ${d.label}</div>`;
      }
      const datesEl = elH("div", "jy-const-dates", ui.constellationText, dateHtml);
      setTimeout(() => datesEl.classList.add("visible"), 2200);

      const outroEl = el("div", "jy-const-outro", ui.constellationText, "…anh vẫn rất vui vì chúng ta đã gặp nhau vào đúng ngày ấy.");
      setTimeout(() => outroEl.classList.add("visible"), 4200);

      let finished = false;
      const advance = () => {
        if (finished) return;
        finished = true;
        ui.constellation.classList.add("fade-out");
        setTimeout(() => {
          ui.constellation.className = "jy-constellation";
          resolve();
        }, 400);
      };

      ui.constellationBtn.onclick = advance;
      setTimeout(advance, 11000);
    });
  }

  /* ── love letter ── */
  function showLoveLetter(cfg, ui) {
    return new Promise(resolve => {
      const letter = cfg.loveLetter;
      const paper = ui.letterPaper;
      paper.textContent = "";

      for (const line of letter.intro || []) {
        el("p", "jy-letter-line", paper, line);
      }

      const bodyEl = el("div", "jy-letter-body", paper);
      const bodyLines = (letter.body || "").split("\n");
      for (const bl of bodyLines) {
        if (bl.trim()) el("p", null, bodyEl, bl.trim());
      }

      if (letter.closing) {
        el("p", "jy-letter-closing", paper, letter.closing);
      }

      const actWrap = el("div", "jy-letter-actions", paper);
      actWrap.style.cssText = "margin-top:28px;text-align:center;";
      const finishBtn = el("button", "jy-letter-finish-btn", actWrap, "Gửi tặng người anh yêu ✦");
      finishBtn.style.cssText = "background:#9b2c2c;color:#fff;border:none;padding:12px 30px;border-radius:30px;font-size:14px;cursor:pointer;box-shadow:0 4px 15px rgba(155,44,44,0.4);transition:all 0.3s ease;";

      ui.letter.classList.add("active");
      audio.playSfx("memopen");

      let closed = false;
      const advance = () => {
        if (closed) return;
        closed = true;
        ui.letter.classList.add("fade-out");
        setTimeout(() => {
          ui.letter.className = "jy-letter";
          resolve();
        }, 400);
      };

      finishBtn.onclick = advance;
    });
  }

  /* ── final image ── */
  function showFinalImage(cfg, ui) {
    if (cfg.finalImage) {
      preloadImage(cfg.finalImage);
      ui.finalImg.style.backgroundImage = `url(${cfg.finalImage})`;
    }
    const text = (cfg.finalText || "").replace("{person2}", cfg.couple.person2 || "em");
    ui.finalText.textContent = text;
    ui.final.classList.add("active");

    const endClick = () => enterEnding(cfg, ui);
    ui.endingBtn.addEventListener("click", endClick, { once: true });
    ui.endingBtn.addEventListener("touchend", (e) => { e.preventDefault(); endClick(); }, { once: true });
    setTimeout(() => {
      ui.ending.classList.add("active");
    }, 1200);
  }

  /* ── ending ── */
  function enterEnding(cfg, ui) {
    S.phase = "ending";
    S.paused = false;

    ui.final.classList.add("fade-out");
    ui.ending.classList.add("fade-out");
    ui.progress.classList.remove("active");

    ui.overlay.classList.add("ending-mode");
    setTimeout(() => {
      ui.final.className = "jy-final";
      ui.ending.className = "jy-ending";
    }, 800);

    const v = window.__v;
    v.dbg.freeze = false;
    v.setDay(0.945, 0);
    v.env.speed = 0;
    // Infinite gentle moonlit drift
    v.rig.speedT = 0.55;
    v.rig.manualT = 999999;
  }

  /* ── moon easter egg ── */
  function triggerMoonEasterEgg() {
    const cfg = window.experienceConfig;
    const ui = window.__jy_ui;
    if (!cfg || !ui) return;

    const clicks = cfg.moonClicks || [];
    const idx = Math.min(S.moonClicks, clicks.length - 1);
    const msg = clicks[idx];
    S.moonClicks++;

    ui.moonText.textContent = msg;
    ui.moonText.classList.remove("active");
    void ui.moonText.offsetWidth;
    ui.moonText.classList.add("active");
    setTimeout(() => ui.moonText.classList.remove("active"), 3500);

    audio.playSfx("memopen");

    if (S.moonClicks >= clicks.length) {
      const v = window.__v;
      const orig = v.pipe?.params?.bloom ?? 0;
      if (v.pipe?.params) v.pipe.params.bloom = 0.35;
      setTimeout(() => { if (v.pipe?.params) v.pipe.params.bloom = orig; }, 3000);
    }
  }

  /* ── helpers ── */
  function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

  /* ── boot ── */
  async function boot() {
    const cfg = window.experienceConfig;
    if (!cfg) { console.error("experienceConfig not found"); return; }

    distributeMemories(cfg);
    const ui = buildUI(cfg);

    const v = window.__v;
    World3D.init(v, cfg);

    function tick() {
      journeyUpdate(cfg, ui);
      requestAnimationFrame(tick);
    }
    tick();

    const loadEl = document.getElementById("load");
    if (loadEl) {
      loadEl.style.opacity = "0";
      setTimeout(() => loadEl.remove(), 600);
    }

    await playIntro(cfg, ui);
    startJourney(cfg, ui);
  }
})();
