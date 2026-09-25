/**
 * MEMORY WORLD - 3D Visual Objects, Lanterns, Bridge Polaroids, Torii Gate & Moon
 * Tích hợp trực tiếp vào Three.js scene của Sakura Valley
 */

class MemoryWorld {
  constructor() {
    this.THREE = null;
    this.scene = null;
    this.rig = null;
    this.camera = null;
    this.renderer = null;

    this.memoryMeshes = [];
    this.floatingTorii = null;
    this.coupleGroup = null;
    this.moonMesh = null;
    this.moonHalo = null;
    this.constellationGroup = null;
    this.futureFramesGroup = null;

    this.raycaster = null;
    this.pointer = null;
    this.isConstellationVisible = false;
    this.easterEggClickCount = 0;
  }

  init(v) {
    this.THREE = v.THREE;
    this.scene = v.scene;
    this.rig = v.rig;
    this.camera = v.camera;
    this.renderer = v.renderer;

    this.raycaster = new this.THREE.Raycaster();
    this.pointer = new this.THREE.Vector2(-999, -999);

    this.createCoupleSilhouette();
    this.createFloatingRiverTorii();
    this.createMemoryMarkers();
    this.createFutureFrames();
    this.createConstellation();
    this.createInteractiveMoon();
    this.setupInteractions();
  }

  createCoupleSilhouette() {
    const THREE = this.THREE;
    if (!this.rig || !this.rig.boat || !this.rig.boat.group) return;

    const group = new THREE.Group();
    group.name = "couple-silhouette";

    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x13161c),
      roughness: 0.85,
      metalness: 0.1
    });

    // Person 1 (Anh)
    const p1 = new THREE.Group();
    p1.position.set(-0.24, 0.45, -0.6);

    const body1 = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.65, 8), mat);
    body1.position.y = 0.32;
    body1.rotation.z = -0.05;
    p1.add(body1);

    const head1 = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), mat);
    head1.position.set(-0.02, 0.74, 0);
    p1.add(head1);

    // Person 2 (Em)
    const p2 = new THREE.Group();
    p2.position.set(0.18, 0.42, -0.58);

    const body2 = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.24, 0.58, 8), mat);
    body2.position.y = 0.29;
    body2.rotation.z = -0.15;
    p2.add(body2);

    const head2 = new THREE.Mesh(new THREE.SphereGeometry(0.115, 12, 12), mat);
    head2.position.set(-0.06, 0.66, 0.02);
    p2.add(head2);

    group.add(p1);
    group.add(p2);

    this.rig.boat.group.add(group);
    this.coupleGroup = group;
  }

  createFloatingRiverTorii() {
    const THREE = this.THREE;
    const z = -12;
    const riverX = this.getRiverX(z);

    const group = new THREE.Group();
    group.name = "floating-river-torii";
    group.position.set(riverX, 0, z);

    const vermilionMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xb53526),
      roughness: 0.7
    });
    const blackMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x18181b),
      roughness: 0.8
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd4af37),
      metalness: 0.6,
      roughness: 0.3
    });

    const pillarSpan = 11.0;
    const pillarHeight = 7.2;

    [-1, 1].forEach(side => {
      const px = (side * pillarSpan) / 2;
      const col = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, pillarHeight, 12), vermilionMat);
      col.position.set(px, pillarHeight / 2, 0);
      col.rotation.z = side * -0.025;
      group.add(col);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.62, 1.2, 10), blackMat);
      base.position.set(px, 0.5, 0);
      group.add(base);

      const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.39, 0.39, 0.12, 12), goldMat);
      ring.position.set(px, pillarHeight * 0.72, 0);
      group.add(ring);
    });

    const topBar = new THREE.Mesh(new THREE.BoxGeometry(pillarSpan + 3.2, 0.48, 0.55), vermilionMat);
    topBar.position.set(0, pillarHeight - 0.2, 0);
    group.add(topBar);

    const topRoof = new THREE.Mesh(new THREE.BoxGeometry(pillarSpan + 3.6, 0.22, 0.72), blackMat);
    topRoof.position.set(0, pillarHeight + 0.12, 0);
    group.add(topRoof);

    const nukiBar = new THREE.Mesh(new THREE.BoxGeometry(pillarSpan + 0.8, 0.32, 0.4), vermilionMat);
    nukiBar.position.set(0, pillarHeight - 1.4, 0);
    group.add(nukiBar);

    [-1, 1].forEach(side => {
      const lx = (side * pillarSpan) / 3.2;
      const lantern = this.buildMiniLanternMesh(0.55, 0.85);
      lantern.position.set(lx, pillarHeight - 2.0, 0);
      group.add(lantern);
    });

    this.scene.add(group);
    this.floatingTorii = group;
  }

  createMemoryMarkers() {
    const list = window.EXPERIENCE_CONFIG.memories || [];

    list.forEach(item => {
      const z = item.z;
      const rx = this.getRiverX(z);
      const halfW = this.getRiverHalfWidth(z);

      const memGroup = new this.THREE.Group();
      memGroup.name = `memory-${item.id}`;
      memGroup.userData = {
        memoryId: item.id,
        type: item.type,
        data: item,
        baseY: 0.35,
        z: z
      };

      let markerMesh = null;

      if (item.type === "bridge") {
        const px = rx + (item.id % 2 === 0 ? 3.5 : -3.5);
        memGroup.position.set(px, 2.6, z);
        markerMesh = this.buildBridgePolaroidMesh(item);
      } else if (item.type === "sakura_tree") {
        const px = rx + (item.id % 2 === 0 ? halfW + 1.8 : -(halfW + 1.8));
        memGroup.position.set(px, 3.2, z);
        markerMesh = this.buildSakuraTreeTagMesh(item);
      } else if (item.type === "reflection") {
        const px = rx + (item.id % 2 === 0 ? halfW * 0.65 : -halfW * 0.65);
        memGroup.position.set(px, 0.15, z);
        markerMesh = this.buildWaterLotusMesh(item);
      } else if (item.type === "moon") {
        memGroup.position.set(rx, 1.2, z);
        markerMesh = this.buildGrandAscensionLanternMesh(item);
      } else {
        const px = rx + (item.id % 2 === 0 ? halfW * 0.8 : -halfW * 0.8);
        memGroup.position.set(px, 0.35, z);
        markerMesh = this.buildFloatingToroMesh(item);
      }

      memGroup.add(markerMesh);

      const aura = this.createAuraHalo();
      aura.position.y = 0.5;
      memGroup.add(aura);
      memGroup.userData.aura = aura;

      this.scene.add(memGroup);
      this.memoryMeshes.push(memGroup);
    });
  }

  buildFloatingToroMesh(item) {
    const THREE = this.THREE;
    const g = new THREE.Group();

    const baseMat = new THREE.MeshStandardMaterial({ color: 0x221814, roughness: 0.8 });
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.1, 0.75), baseMat);
    g.add(base);

    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xffe2a8,
      emissive: new THREE.Color(0xff8c2b),
      emissiveIntensity: 1.8,
      roughness: 0.6,
      transparent: true,
      opacity: 0.92
    });
    const paper = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.7, 0.55), paperMat);
    paper.position.y = 0.42;
    g.add(paper);

    const roof = new THREE.Mesh(new THREE.ConeGeometry(0.58, 0.28, 4), baseMat);
    roof.position.y = 0.86;
    roof.rotation.y = Math.PI / 4;
    g.add(roof);

    const light = new THREE.PointLight(0xffaa44, 1.2, 8);
    light.position.y = 0.45;
    g.add(light);
    g.userData.light = light;

    return g;
  }

  buildBridgePolaroidMesh(item) {
    const THREE = this.THREE;
    const g = new THREE.Group();

    const lineMat = new THREE.LineBasicMaterial({ color: 0xe2c69b, transparent: true, opacity: 0.6 });
    const points = [new THREE.Vector3(0, 1.2, 0), new THREE.Vector3(0, 0, 0)];
    const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(lineGeo, lineMat);
    g.add(line);

    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.7,
      emissive: new THREE.Color(0xfff5df),
      emissiveIntensity: 0.35
    });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.85, 1.05, 0.04), frameMat);
    g.add(frame);

    const photoMat = new THREE.MeshBasicMaterial({ color: 0xffbe76 });
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(0.68, 0.68), photoMat);
    photo.position.set(0, 0.1, 0.025);
    g.add(photo);

    const light = new THREE.PointLight(0xffbe76, 0.8, 6);
    light.position.set(0, 0, 0.2);
    g.add(light);
    g.userData.light = light;

    return g;
  }

  buildSakuraTreeTagMesh(item) {
    const THREE = this.THREE;
    const g = new THREE.Group();

    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xfba3b9,
      emissive: new THREE.Color(0xf47094),
      emissiveIntensity: 0.8,
      roughness: 0.5,
      side: THREE.DoubleSide
    });
    const ribbon = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 1.2), ribbonMat);
    ribbon.position.y = -0.5;
    g.add(ribbon);

    const bellMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.7, roughness: 0.3 });
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), bellMat);
    bell.position.y = 0.12;
    g.add(bell);

    const light = new THREE.PointLight(0xffa8c5, 0.9, 7);
    light.position.y = -0.4;
    g.add(light);
    g.userData.light = light;

    return g;
  }

  buildWaterLotusMesh(item) {
    const THREE = this.THREE;
    const g = new THREE.Group();

    const petalMat = new THREE.MeshStandardMaterial({
      color: 0xffd1dc,
      emissive: new THREE.Color(0xff8da1),
      emissiveIntensity: 1.5,
      roughness: 0.5,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.42), petalMat);
      petal.rotation.x = Math.PI / 3;
      petal.rotation.z = angle;
      petal.position.set(Math.cos(angle) * 0.25, 0.08, Math.sin(angle) * 0.25);
      g.add(petal);
    }

    const candleMat = new THREE.MeshStandardMaterial({
      color: 0xfffae6,
      emissive: new THREE.Color(0xffb74d),
      emissiveIntensity: 3.0
    });
    const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.18, 12), candleMat);
    candle.position.y = 0.12;
    g.add(candle);

    const light = new THREE.PointLight(0xffaa44, 1.4, 9);
    light.position.y = 0.3;
    g.add(light);
    g.userData.light = light;

    return g;
  }

  buildGrandAscensionLanternMesh(item) {
    const THREE = this.THREE;
    const g = new THREE.Group();

    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xfff6db,
      emissive: new THREE.Color(0xffaa33),
      emissiveIntensity: 2.8,
      roughness: 0.5,
      transparent: true,
      opacity: 0.95
    });

    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.65, 1.35, 16), paperMat);
    body.position.y = 0.68;
    g.add(body);

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.8, roughness: 0.2 });
    const ringTop = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.04, 8, 24), goldMat);
    ringTop.rotation.x = Math.PI / 2;
    ringTop.position.y = 1.35;
    g.add(ringTop);

    const ringBottom = new THREE.Mesh(new THREE.TorusGeometry(0.66, 0.04, 8, 24), goldMat);
    ringBottom.rotation.x = Math.PI / 2;
    ringBottom.position.y = 0.02;
    g.add(ringBottom);

    const light = new THREE.PointLight(0xffc266, 2.8, 18);
    light.position.y = 0.7;
    g.add(light);
    g.userData.light = light;

    return g;
  }

  buildMiniLanternMesh(w = 0.4, h = 0.6) {
    const THREE = this.THREE;
    const g = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0xff4d36,
      emissive: new THREE.Color(0xff6b4a),
      emissiveIntensity: 1.6,
      roughness: 0.6
    });
    const body = new THREE.Mesh(new THREE.CylinderGeometry(w, w * 0.85, h, 12), mat);
    g.add(body);
    const light = new THREE.PointLight(0xff6b4a, 0.8, 6);
    g.add(light);
    return g;
  }

  createAuraHalo() {
    const THREE = this.THREE;
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255, 214, 138, 0.8)");
    grad.addColorStop(0.4, "rgba(255, 170, 70, 0.35)");
    grad.addColorStop(1, "rgba(255, 140, 50, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);

    const tex = new THREE.CanvasTexture(canvas);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.65
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(2.4, 2.4, 1);
    return sprite;
  }

  createFutureFrames() {
    const THREE = this.THREE;
    const z = -285;
    const rx = this.getRiverX(z);

    const group = new THREE.Group();
    group.name = "future-memories-group";
    group.position.set(rx, 1.4, z);

    const conf = window.EXPERIENCE_CONFIG.futureMemories || [];
    conf.forEach((item, idx) => {
      const angle = (idx / conf.length) * Math.PI * 2;
      const dist = 3.6 + (idx % 2) * 0.6;
      const fx = Math.cos(angle) * dist;
      const fz = Math.sin(angle) * dist;

      const fGroup = new THREE.Group();
      fGroup.position.set(fx, 0.3 * Math.sin(idx), fz);
      fGroup.userData = { futureData: item, index: idx };

      const wireMat = new THREE.MeshBasicMaterial({
        color: 0xe2ecfa,
        wireframe: true,
        transparent: true,
        opacity: 0.65
      });
      const frameMesh = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.25, 0.05), wireMat);
      fGroup.add(frameMesh);

      const innerMat = new THREE.MeshBasicMaterial({
        color: 0x93b7e8,
        transparent: true,
        opacity: 0.18,
        side: THREE.DoubleSide
      });
      const inner = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.15), innerMat);
      fGroup.add(inner);

      group.add(fGroup);
    });

    this.scene.add(group);
    this.futureFramesGroup = group;
  }

  createConstellation() {
    const THREE = this.THREE;
    const group = new THREE.Group();
    group.name = "constellation-sky";
    group.position.set(0, 140, -180);
    group.visible = false;

    const data = window.EXPERIENCE_CONFIG.constellation;
    if (!data || !data.stars) return;

    const starPoints = [];
    const starMeshes = [];

    data.stars.forEach(st => {
      const pos = new THREE.Vector3(st.x * 120, st.y * 60, (Math.random() - 0.5) * 10);
      starPoints.push(pos);

      const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const starGeo = new THREE.SphereGeometry(0.7, 8, 8);
      const star = new THREE.Mesh(starGeo, starMat);
      star.position.copy(pos);
      star.userData = { starData: st };

      const aura = this.createAuraHalo();
      aura.scale.set(4.5, 4.5, 1);
      star.add(aura);

      group.add(star);
      starMeshes.push(star);
    });

    const lineMat = new THREE.LineBasicMaterial({
      color: 0xb5d4ff,
      transparent: true,
      opacity: 0.55
    });
    const lineGeo = new THREE.BufferGeometry().setFromPoints(starPoints);
    const constellationLines = new THREE.Line(lineGeo, lineMat);
    group.add(constellationLines);

    this.scene.add(group);
    this.constellationGroup = group;
    this.constellationStars = starMeshes;
  }

  createInteractiveMoon() {
    const THREE = this.THREE;
    const moonPos = new THREE.Vector3(-35, 52, -390);

    const group = new THREE.Group();
    group.name = "interactive-grand-moon";
    group.position.copy(moonPos);

    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, "#fffef5");
    grad.addColorStop(0.7, "#f7f1d8");
    grad.addColorStop(0.95, "#e5ddbe");
    grad.addColorStop(1, "#cfc39c");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);

    ctx.fillStyle = "rgba(180, 168, 140, 0.22)";
    ctx.beginPath();
    ctx.arc(210, 220, 95, 0, Math.PI * 2);
    ctx.arc(310, 290, 80, 0, Math.PI * 2);
    ctx.arc(280, 180, 60, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    const moonMat = new THREE.MeshBasicMaterial({
      map: tex,
      color: 0xffffff
    });

    const moonMesh = new THREE.Mesh(new THREE.SphereGeometry(24, 32, 32), moonMat);
    moonMesh.userData = { isMoon: true };
    group.add(moonMesh);

    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xe6f0ff,
      transparent: true,
      opacity: 0.42,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending
    });
    const moonHalo = new THREE.Mesh(new THREE.SphereGeometry(32, 24, 24), haloMat);
    group.add(moonHalo);

    this.scene.add(group);
    this.moonMesh = moonMesh;
    this.moonHalo = moonHalo;
    this.moonGroup = group;
  }

  setupInteractions() {
    window.addEventListener("pointerdown", e => {
      if (e.target.closest && e.target.closest(".story-ui-layer")) return;

      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      this.pointer.set(x, y);

      this.checkRaycastClick();
    });
  }

  checkRaycastClick() {
    if (!this.camera) return;
    this.raycaster.setFromCamera(this.pointer, this.camera);

    if (this.moonMesh) {
      const hits = this.raycaster.intersectObject(this.moonMesh);
      if (hits.length > 0) {
        this.triggerMoonEasterEgg();
        return;
      }
    }

    if (this.isConstellationVisible && this.constellationStars) {
      const starHits = this.raycaster.intersectObjects(this.constellationStars);
      if (starHits.length > 0) {
        const star = starHits[0].object;
        if (star.userData && star.userData.starData) {
          window.storyUI && window.storyUI.showConstellationStarPopup(star.userData.starData);
        }
        return;
      }
    }

    const memoryTargets = [];
    this.memoryMeshes.forEach(m => {
      m.traverse(child => {
        if (child.isMesh) {
          child.userData.parentMemory = m;
          memoryTargets.push(child);
        }
      });
    });

    const hits = this.raycaster.intersectObjects(memoryTargets);
    if (hits.length > 0) {
      const hitObj = hits[0].object;
      const parentMem = hitObj.userData.parentMemory;
      if (parentMem && parentMem.userData && parentMem.userData.data) {
        window.journeyController && window.journeyController.openMemory(parentMem.userData.data);
      }
    }
  }

  triggerMoonEasterEgg() {
    this.easterEggClickCount++;
    const texts = (window.EXPERIENCE_CONFIG.easterEgg && window.EXPERIENCE_CONFIG.easterEgg.moonClicks) || [];
    const idx = Math.min(this.easterEggClickCount - 1, texts.length - 1);
    const msg = texts[idx] || "Mặt trăng đêm rằm đang tỏa sáng cùng em.";

    if (window.storyUI) {
      window.storyUI.showToast(msg);
    }
    if (window.audioManager) {
      window.audioManager.playEasterEgg();
    }

    if (this.easterEggClickCount >= 3) {
      this.triggerMoonGlowBurst();
    }
  }

  triggerMoonGlowBurst() {
    if (this.moonHalo) {
      const startScale = this.moonHalo.scale.x;
      let t = 0;
      const anim = () => {
        t += 0.05;
        const s = 1.0 + Math.sin(t) * 0.45;
        this.moonHalo.scale.setScalar(s);
        if (t < Math.PI) {
          requestAnimationFrame(anim);
        } else {
          this.moonHalo.scale.setScalar(startScale);
        }
      };
      anim();
    }
  }

  update(time, boatPos) {
    this.memoryMeshes.forEach((m, idx) => {
      const phase = time * 1.8 + idx * 0.7;
      const bob = Math.sin(phase) * 0.08;
      m.position.y = m.userData.baseY + bob;

      if (m.userData.aura) {
        const breathe = 0.85 + 0.25 * Math.sin(time * 2.4 + idx);
        m.userData.aura.scale.set(2.4 * breathe, 2.4 * breathe, 1);
      }

      if (boatPos) {
        const dist = m.position.distanceTo(boatPos);
        const near = Math.max(0, 1 - dist / 22.0);
        if (m.userData.light) {
          m.userData.light.intensity = 1.0 + near * 2.2;
        }
      }
    });

    const lantern12 = this.memoryMeshes.find(m => m.userData && m.userData.memoryId === 12);
    if (lantern12 && window.journeyController && window.journeyController.isAscensionActive) {
      lantern12.position.y += 0.035;
      lantern12.position.z -= 0.02;
    }

    if (this.futureFramesGroup) {
      this.futureFramesGroup.children.forEach((f, i) => {
        f.position.y = Math.sin(time * 1.5 + i * 1.2) * 0.15;
        f.rotation.y = Math.sin(time * 0.8 + i) * 0.1;
      });
    }

    if (this.moonHalo) {
      const moonBreathe = 1.0 + Math.sin(time * 0.9) * 0.06;
      this.moonHalo.scale.setScalar(moonBreathe);
    }
  }

  getRiverX(z) {
    if (window.__v && window.__v.riverX) {
      return window.__v.riverX(z);
    }
    return 0;
  }

  getRiverHalfWidth(z) {
    return 9.0;
  }
}

window.memoryWorld = new MemoryWorld();
