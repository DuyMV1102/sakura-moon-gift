/**
 * JOURNEY CONTROLLER - Quản lý tiến trình xuôi thuyền, đồng bộ Day/Night,
 * chuyển cảnh Torii, kiểm soát Camera và các cột mốc Chapter.
 */

class JourneyController {
  constructor() {
    this.v = null;
    this.rig = null;
    this.env = null;
    this.dbg = null;

    this.isJourneyStarted = false;
    this.isAutoDrift = true;
    this.isAscensionActive = false;
    this.isEndingMode = false;
    this.activeMemory = null;
    this.toriiCrossed = false;

    this.zStart = 150;
    this.zEnd = -320;
    this.currentChapterId = 1;
    this.normalBoatSpeed = 1.35;
  }

  init(v) {
    this.v = v;
    this.rig = v.rig;
    this.env = v.env;
    this.dbg = v.dbg;

    if (this.dbg) {
      this.dbg.daySpeed = 0; // Dừng đồng hồ môi trường mặc định để sync theo vị trí thuyền
    }

    // Đưa thuyền về vị trí xuất phát z = 150
    this.setBoatProgress(0.0);
    this.updateLightingByProgress(0.0);

    // Vòng lặp cập nhật mỗi frame
    const tick = () => {
      this.update();
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  startJourney() {
    this.isJourneyStarted = true;
    this.isAutoDrift = true;

    if (window.audioManager) {
      window.audioManager.start();
    }

    if (window.storyUI) {
      window.storyUI.hideOpening();
      window.storyUI.showHUD();
      window.storyUI.showChapterTitle(window.EXPERIENCE_CONFIG.chapters[0]);
    }

    if (this.rig) {
      this.rig.speedT = this.normalBoatSpeed;
      if (this.v.dbg) this.v.dbg.freeze = false;
    }
  }

  toggleAutoDrift() {
    this.isAutoDrift = !this.isAutoDrift;
    if (this.rig) {
      this.rig.speedT = this.isAutoDrift ? this.normalBoatSpeed : 0;
    }
    return this.isAutoDrift;
  }

  setBoatProgress(p) {
    p = Math.max(0, Math.min(1, p));
    const targetZ = this.zStart - p * (this.zStart - this.zEnd);
    if (this.rig) {
      this.rig.z = targetZ;
      if (this.rig.pos) {
        this.rig.pos.z = targetZ;
        if (this.v && this.v.riverX) {
          this.rig.pos.x = this.v.riverX(targetZ);
        }
      }
      if (this.rig.boat && this.rig.boat.group) {
        this.rig.boat.group.position.z = targetZ;
        if (this.v && this.v.riverX) {
          this.rig.boat.group.position.x = this.v.riverX(targetZ);
        }
      }
    }
  }

  getBoatZ() {
    if (this.rig && typeof this.rig.z === "number") {
      return this.rig.z;
    }
    return this.zStart;
  }

  getProgress() {
    const z = this.getBoatZ();
    return Math.max(0, Math.min(1, (this.zStart - z) / (this.zStart - this.zEnd)));
  }

  update() {
    if (!this.v || !this.rig) return;

    const boatZ = this.getBoatZ();
    const progress = this.getProgress();
    const boatPos = this.rig.boat.group.position;

    // Cập nhật các vật thể 3D thế giới ký ức
    if (window.memoryWorld) {
      window.memoryWorld.update(performance.now() * 0.001, boatPos);
    }

    if (!this.isJourneyStarted) return;

    // Tốc độ thuyền trôi tự động
    if (this.rig) {
      this.rig.manualT = 999999;
    }
    if (this.isAutoDrift && !this.activeMemory && !this.isEndingMode) {
      this.rig.speedT = this.normalBoatSpeed;
    } else {
      this.rig.speedT = 0;
    }

    // 1. Đồng bộ thời gian Day -> Sunset -> Twilight -> Moonlit Night
    this.updateLightingByProgress(progress);

    // 2. Chuyển cảnh qua Cổng Torii (z = -12)
    if (boatZ <= -12 && !this.toriiCrossed) {
      this.toriiCrossed = true;
      if (window.audioManager) {
        window.audioManager.playToriiCross();
      }
      if (window.storyUI) {
        window.storyUI.triggerToriiFlash();
      }
    }

    // 3. Kiểm tra Chapter
    this.checkChapterMilestones(boatZ);

    // 4. Phát hiện ký ức gần thuyền
    this.checkNearbyMemories(boatZ);

    // 5. Đến hồ đích mặt trăng (Finale Lake)
    if (boatZ <= -302 && !this.isAscensionActive && !this.isEndingMode) {
      this.triggerMoonriseFinale();
    }

    // Cập nhật thanh tiến trình HUD
    if (window.storyUI) {
      window.storyUI.updateProgress(progress, boatZ);
    }
  }

  updateLightingByProgress(progress) {
    if (!this.v || !this.v.setDay) return;

    // Ánh sáng chuyển đổi mềm mại từ 0.70 (Golden Hour) đến 0.94 (Đêm trăng rằm)
    let u = 0.70;
    if (progress < 0.25) {
      // Chapter 1: Golden hour hoàng hôn ấm
      u = 0.70 + (progress / 0.25) * 0.035; // 0.70 -> 0.735
    } else if (progress < 0.38) {
      // Gần cổng Torii: Sunset đậm sang chạng vạng
      u = 0.735 + ((progress - 0.25) / 0.13) * 0.045; // 0.735 -> 0.78
    } else if (progress < 0.75) {
      // Sau Torii: Twilight sang Blue Hour và Đêm sao
      u = 0.78 + ((progress - 0.38) / 0.37) * 0.09; // 0.78 -> 0.87
    } else {
      // Đêm trăng sâu thẳm, mặt trăng sáng rực
      u = 0.87 + ((progress - 0.75) / 0.25) * 0.07; // 0.87 -> 0.94
    }

    this.v.setDay(u);
  }

  checkChapterMilestones(boatZ) {
    const chapters = window.EXPERIENCE_CONFIG.chapters || [];
    for (let i = 0; i < chapters.length; i++) {
      const ch = chapters[i];
      if (boatZ <= ch.zStart && boatZ > ch.zEnd) {
        if (this.currentChapterId !== ch.id) {
          this.currentChapterId = ch.id;
          if (window.storyUI) {
            window.storyUI.showChapterTitle(ch);
          }
        }
        break;
      }
    }
  }

  checkNearbyMemories(boatZ) {
    if (this.activeMemory) return;

    const list = window.EXPERIENCE_CONFIG.memories || [];
    let closest = null;
    let minDist = 999;

    list.forEach(m => {
      const dist = Math.abs(m.z - boatZ);
      if (dist < 14 && dist < minDist) {
        minDist = dist;
        closest = m;
      }
    });

    if (window.storyUI) {
      window.storyUI.setNearbyMemory(closest);
    }
  }

  jumpToChapter(chapterId) {
    const chapters = window.EXPERIENCE_CONFIG.chapters || [];
    const target = chapters.find(c => c.id === chapterId);
    if (!target) return;

    const targetZ = target.zStart - 2;
    const p = (this.zStart - targetZ) / (this.zStart - this.zEnd);
    this.setBoatProgress(p);

    if (chapterId >= 3) {
      this.toriiCrossed = true;
    }
  }

  openMemory(mem) {
    this.activeMemory = mem;
    if (window.audioManager) {
      window.audioManager.playMemoryOpen();
    }
    if (window.storyUI) {
      window.storyUI.showMemoryModal(mem);
    }
  }

  closeMemory() {
    this.activeMemory = null;
    if (window.storyUI) {
      window.storyUI.hideMemoryModal();
    }
  }

  openConstellation() {
    if (window.memoryWorld && window.memoryWorld.constellationGroup) {
      window.memoryWorld.constellationGroup.visible = true;
      window.memoryWorld.isConstellationVisible = true;
    }
    if (this.rig) {
      this.rig.speedT = 0;
      this.rig.pitch = 0.82; // Camera ngước nhìn bầu trời sao
    }
    if (window.storyUI) {
      window.storyUI.showConstellationOverlay();
    }
  }

  closeConstellation() {
    if (window.memoryWorld && window.memoryWorld.constellationGroup) {
      window.memoryWorld.constellationGroup.visible = false;
      window.memoryWorld.isConstellationVisible = false;
    }
    if (this.rig) {
      this.rig.pitch = 0.05; // Trở về góc nhìn thung lũng
    }
    if (window.storyUI) {
      window.storyUI.hideConstellationOverlay();
    }
  }

  triggerMoonriseFinale() {
    this.isAscensionActive = true;
    if (this.rig) {
      this.rig.speedT = 0;
    }
    if (window.storyUI) {
      window.storyUI.showFinalePrompt();
    }
  }

  openLoveLetter() {
    if (window.audioManager) {
      window.audioManager.playMemoryOpen();
    }
    if (window.storyUI) {
      window.storyUI.showLoveLetterModal();
    }
  }

  showFinalMemory() {
    if (window.storyUI) {
      window.storyUI.showFinalMemoryScreen();
    }
  }

  enterEndingMode() {
    this.isEndingMode = true;
    this.isAutoDrift = true;
    if (window.storyUI) {
      window.storyUI.enterEndingState();
    }
    if (this.rig) {
      this.rig.speedT = 0.45; // Thuyền trôi rất chậm nhẹ nhàng vô tận dưới trăng
    }
  }
}

window.journeyController = new JourneyController();
