/**
 * STORY UI - Giao diện DOM, Modal xem ký ức, Thư tình, Bầu trời sao và HUD
 */

class StoryUI {
  constructor() {
    this.toastTimer = null;
    this.chapterTimer = null;
  }

  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  init() {
    this.injectDOM();
    this.bindEvents();
  }

  injectDOM() {
    if (document.getElementById("story-ui-root")) return;

    const conf = window.EXPERIENCE_CONFIG;
    const couple = conf.couple || { person1: "Anh", person2: "Em" };
    const intro = conf.intro || { lines: [], cta: "Đi cùng anh 🌙", hint: "" };
    const letter = conf.loveLetter || { lead1: "", lead2: "", paragraphs: [] };
    const finalMem = conf.finalMemory || { message: "", stayButtonText: "" };

    const linesHtml = intro.lines.map(line => 
      `<div class="opening-line">${this.escapeHtml(line)}</div>`
    ).join("");

    const paragraphsHtml = (letter.paragraphs || []).map(p => 
      `<p class="letter-body-p">${this.escapeHtml(p)}</p>`
    ).join("");

    const html = `
      <div id="torii-flash"></div>
      <div id="story-toast"></div>

      <!-- 1. Opening Curtain -->
      <div id="story-opening">
        <div class="opening-subtitle">${this.escapeHtml(intro.subtitle || "")}</div>
        <div class="opening-lines">${linesHtml}</div>
        <div class="opening-cta-box">
          <button id="btn-start-journey" class="opening-btn story-interactive">${this.escapeHtml(intro.cta || "Đi cùng anh 🌙")}</button>
          <div class="opening-hint">${this.escapeHtml(intro.hint || "")}</div>
        </div>
      </div>

      <!-- 2. Chapter Title Banner -->
      <div id="chapter-banner">
        <div id="chapter-badge" class="chapter-badge">Chapter I</div>
        <div id="chapter-title-text" class="chapter-title-text">Ngày chúng ta bắt đầu</div>
        <div id="chapter-subtitle-text" class="chapter-subtitle-text"></div>
      </div>

      <!-- 3. Nearby Memory Prompt -->
      <div id="nearby-memory-prompt" class="story-interactive">
        <span class="prompt-icon">✦</span>
        <div>
          <div class="prompt-label">Ký ức gần bên</div>
          <div id="prompt-memory-title" class="prompt-title">...</div>
        </div>
      </div>

      <!-- 4. Floating HUD -->
      <div id="journey-hud" class="story-interactive">
        <button id="btn-toggle-drift" class="hud-btn" title="Dừng / Tiếp tục trôi">
          <svg id="icon-drift-pause" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
          <svg id="icon-drift-play" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </button>

        <div class="hud-progress-wrap">
          <div id="hud-progress-bar" class="hud-progress-bar">
            <div id="hud-progress-fill" class="hud-progress-fill"></div>
          </div>
        </div>

        <div class="hud-chapters">
          <span class="chapter-dot active" data-chapter="1">I</span>
          <span class="chapter-dot" data-chapter="2">II</span>
          <span class="chapter-dot" data-chapter="3">III</span>
          <span class="chapter-dot" data-chapter="4">IV</span>
        </div>

        <button id="btn-open-constellation" class="hud-btn" title="Bầu trời sao">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z"/></svg>
        </button>

        <button id="btn-toggle-mute" class="hud-btn" title="Âm thanh">
          <svg id="icon-volume-on" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <svg id="icon-volume-off" style="display:none" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>
        </button>
      </div>

      <!-- 5. Memory Modal Popup -->
      <div id="memory-modal">
        <div class="memory-card story-interactive">
          <div class="memory-img-wrap">
            <img id="memory-modal-img" class="memory-img" src="" alt="Memory">
            <div id="memory-modal-type" class="memory-type-badge">Lantern</div>
          </div>
          <div class="memory-info">
            <div class="memory-meta">
              <span id="memory-modal-date"></span>
              <span id="memory-modal-location"></span>
            </div>
            <div id="memory-modal-title" class="memory-title"></div>
            <div id="memory-modal-caption" class="memory-caption"></div>
            <div class="memory-actions">
              <button id="btn-close-memory" class="memory-close-btn">Tiếp tục trôi thuyền ✦</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 6. Constellation Overlay -->
      <div id="constellation-overlay">
        <div class="constellation-poetry">
          <div class="constellation-line1">${this.escapeHtml(conf.constellation?.sectionText1 || "")}</div>
          <div class="constellation-line2">${this.escapeHtml(conf.constellation?.sectionText2 || "")}</div>
        </div>
        <button id="btn-close-constellation" class="constellation-back-btn story-interactive">Quay lại với thuyền ⛵</button>
      </div>

      <!-- 7. Finale Lake Prompt -->
      <div id="finale-prompt">
        <button id="btn-open-lantern12" class="finale-btn story-interactive">Chạm vào chiếc đèn lồng cuối cùng 🏮</button>
      </div>

      <!-- 8. Love Letter Modal (Washi Paper) -->
      <div id="love-letter-modal">
        <div class="washi-letter story-interactive">
          <div class="letter-recipient">${this.escapeHtml(letter.recipient || "Gửi em,")}</div>
          <div class="letter-lead">${this.escapeHtml(letter.lead1 || "")}</div>
          <div class="letter-lead">${this.escapeHtml(letter.lead2 || "")}</div>
          ${paragraphsHtml}
          <div class="letter-footer">
            <div class="letter-signature">${this.escapeHtml(letter.signature || couple.person1 || "Anh")}</div>
            <div class="letter-date">${this.escapeHtml(letter.closingDate || "Đêm trăng Trung thu")}</div>
          </div>
          <div class="letter-actions">
            <button id="btn-letter-finish" class="letter-finish-btn">Gửi tặng người anh yêu ✦</button>
          </div>
        </div>
      </div>

      <!-- 9. Final Memory Fullscreen -->
      <div id="final-memory-screen">
        <div class="final-img-frame">
          <img id="final-memory-img" class="final-img" src="${this.escapeHtml(finalMem.image || "")}" alt="Final Memory">
        </div>
        <div class="final-message">${this.escapeHtml(finalMem.message || "")}</div>
        <button id="btn-stay-longer" class="stay-btn story-interactive">${this.escapeHtml(finalMem.stayButtonText || "Ở lại đây thêm một chút")}</button>
      </div>
    `;

    const root = document.createElement("div");
    root.id = "story-ui-root";
    root.innerHTML = html;
    document.body.appendChild(root);
  }

  bindEvents() {
    const byId = id => document.getElementById(id);

    // Opening
    byId("btn-start-journey")?.addEventListener("click", () => {
      window.journeyController?.startJourney();
    });

    // Drift play/pause
    byId("btn-toggle-drift")?.addEventListener("click", () => {
      const isAuto = window.journeyController?.toggleAutoDrift();
      byId("icon-drift-pause").style.display = isAuto ? "block" : "none";
      byId("icon-drift-play").style.display = isAuto ? "none" : "block";
    });

    // Mute toggle
    byId("btn-toggle-mute")?.addEventListener("click", () => {
      const isMuted = window.audioManager?.toggleMute();
      byId("icon-volume-on").style.display = isMuted ? "none" : "block";
      byId("icon-volume-off").style.display = isMuted ? "block" : "none";
    });

    // Progress bar scrub
    byId("hud-progress-bar")?.addEventListener("click", e => {
      const rect = e.currentTarget.getBoundingClientRect();
      const p = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      window.journeyController?.setBoatProgress(p);
    });

    // Chapter jump dots
    document.querySelectorAll(".chapter-dot").forEach(dot => {
      dot.addEventListener("click", e => {
        const chId = parseInt(e.currentTarget.getAttribute("data-chapter"), 10);
        window.journeyController?.jumpToChapter(chId);
      });
    });

    // Nearby memory click
    byId("nearby-memory-prompt")?.addEventListener("click", () => {
      if (this.currentNearbyMemory) {
        window.journeyController?.openMemory(this.currentNearbyMemory);
      }
    });

    // Close memory
    byId("btn-close-memory")?.addEventListener("click", () => {
      window.journeyController?.closeMemory();
    });

    byId("memory-modal")?.addEventListener("click", e => {
      if (e.target.id === "memory-modal") {
        window.journeyController?.closeMemory();
      }
    });

    // Constellation
    byId("btn-open-constellation")?.addEventListener("click", () => {
      window.journeyController?.openConstellation();
    });

    byId("btn-close-constellation")?.addEventListener("click", () => {
      window.journeyController?.closeConstellation();
    });

    // Finale prompt
    byId("btn-open-lantern12")?.addEventListener("click", () => {
      byId("finale-prompt").classList.remove("finale-visible");
      window.journeyController?.openLoveLetter();
    });

    // Love letter finish
    byId("btn-letter-finish")?.addEventListener("click", () => {
      byId("love-letter-modal").classList.remove("letter-open");
      window.journeyController?.showFinalMemory();
    });

    // Stay longer (Ending mode)
    byId("btn-stay-longer")?.addEventListener("click", () => {
      byId("final-memory-screen").classList.remove("final-visible");
      window.journeyController?.enterEndingMode();
    });
  }

  hideOpening() {
    document.getElementById("story-opening")?.classList.add("fade-out");
  }

  showHUD() {
    document.getElementById("journey-hud")?.classList.add("hud-visible");
  }

  showChapterTitle(chapter) {
    if (!chapter) return;
    const banner = document.getElementById("chapter-banner");
    const badge = document.getElementById("chapter-badge");
    const title = document.getElementById("chapter-title-text");
    const subtitle = document.getElementById("chapter-subtitle-text");

    if (!banner) return;

    badge.textContent = chapter.name || `Chapter ${chapter.id}`;
    title.textContent = chapter.title || "";
    subtitle.textContent = chapter.subtitle || "";

    banner.classList.add("banner-visible");

    if (this.chapterTimer) clearTimeout(this.chapterTimer);
    this.chapterTimer = setTimeout(() => {
      banner.classList.remove("banner-visible");
    }, 4500);

    // Active dot in HUD
    document.querySelectorAll(".chapter-dot").forEach(dot => {
      const id = parseInt(dot.getAttribute("data-chapter"), 10);
      if (id === chapter.id) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });
  }

  setNearbyMemory(mem) {
    this.currentNearbyMemory = mem;
    const prompt = document.getElementById("nearby-memory-prompt");
    const title = document.getElementById("prompt-memory-title");
    if (!prompt || !title) return;

    if (mem) {
      title.textContent = mem.title;
      prompt.classList.add("prompt-visible");
    } else {
      prompt.classList.remove("prompt-visible");
    }
  }

  showMemoryModal(mem) {
    const modal = document.getElementById("memory-modal");
    const img = document.getElementById("memory-modal-img");
    const title = document.getElementById("memory-modal-title");
    const date = document.getElementById("memory-modal-date");
    const loc = document.getElementById("memory-modal-location");
    const cap = document.getElementById("memory-modal-caption");
    const type = document.getElementById("memory-modal-type");

    if (!modal) return;

    img.src = mem.image;
    title.textContent = mem.title;
    date.textContent = mem.date || "";
    loc.textContent = mem.location ? `✦ ${mem.location}` : "";
    cap.textContent = mem.caption || "";
    type.textContent = mem.type || "Lantern";

    modal.classList.add("modal-open");
  }

  hideMemoryModal() {
    document.getElementById("memory-modal")?.classList.remove("modal-open");
  }

  showConstellationOverlay() {
    document.getElementById("constellation-overlay")?.classList.add("constellation-active");
  }

  hideConstellationOverlay() {
    document.getElementById("constellation-overlay")?.classList.remove("constellation-active");
  }

  showConstellationStarPopup(star) {
    this.showToast(`${star.date} ✦ ${star.label}`);
  }

  showFinalePrompt() {
    document.getElementById("finale-prompt")?.classList.add("finale-visible");
  }

  showLoveLetterModal() {
    document.getElementById("love-letter-modal")?.classList.add("letter-open");
  }

  showFinalMemoryScreen() {
    document.getElementById("final-memory-screen")?.classList.add("final-visible");
  }

  enterEndingState() {
    document.body.classList.add("ending-active");
    this.showToast("Ở lại đây dưới ánh trăng…", 4000);
  }

  triggerToriiFlash() {
    const flash = document.getElementById("torii-flash");
    if (!flash) return;
    flash.classList.add("flash-active");
    setTimeout(() => {
      flash.classList.remove("flash-active");
    }, 2200);
  }

  showToast(msg, duration = 3200) {
    const toast = document.getElementById("story-toast");
    if (!toast) return;

    toast.textContent = msg;
    toast.classList.add("toast-visible");

    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      toast.classList.remove("toast-visible");
    }, duration);
  }

  updateProgress(progress, boatZ) {
    const fill = document.getElementById("hud-progress-fill");
    if (fill) {
      fill.style.width = `${(progress * 100).toFixed(1)}%`;
    }
  }
}

window.storyUI = new StoryUI();
