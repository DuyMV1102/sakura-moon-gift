/**
 * MAIN GIFT CONTROLLER - "Đi cùng anh đến nơi có trăng"
 * Điểm kết nối giữa Three.js WebGL Scene và Story Experience
 */

(function () {
  console.log("🌸 Khởi tạo món quà Trung thu: Đi cùng anh đến nơi có trăng...");

  let retryCount = 0;
  const maxRetries = 200;

  function tryBootstrap() {
    // Đợi window.__v từ Three.js bundle scene-SV5IBQX7.js
    if (window.__v && window.__v.rig && window.__v.scene) {
      console.log("🌸 Scene WebGL đã sẵn sàng. Gắn kết hệ thống ký ức & hành trình...");
      bootstrap();
    } else {
      retryCount++;
      if (retryCount < maxRetries) {
        setTimeout(tryBootstrap, 100);
      } else {
        console.warn("Timed out waiting for 3D scene engine.");
      }
    }
  }

  function bootstrap() {
    const v = window.__v;

    // 1. Khởi tạo giao diện DOM
    if (window.storyUI) {
      window.storyUI.init();
    }

    // 2. Khởi tạo thế giới 3D (Cổng Torii trên sông, bóng 2 người, 12 đèn lồng ký ức, Mặt trăng lớn)
    if (window.memoryWorld) {
      window.memoryWorld.init(v);
    }

    // 3. Khởi tạo Journey Controller (Điều khiển trôi thuyền, Day/Night sync, mốc Chapter)
    if (window.journeyController) {
      window.journeyController.init(v);
    }

    // 4. Preload các ảnh ký ức ngầm
    preloadMemoryImages();

    console.log("✨ Đã kích hoạt hoàn tất: Đi cùng anh đến nơi có trăng 🌕");
  }

  function preloadMemoryImages() {
    const memories = (window.EXPERIENCE_CONFIG && window.EXPERIENCE_CONFIG.memories) || [];
    memories.forEach(m => {
      if (m.image && m.image.startsWith("http")) {
        const img = new Image();
        img.src = m.image;
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tryBootstrap);
  } else {
    tryBootstrap();
  }
})();
