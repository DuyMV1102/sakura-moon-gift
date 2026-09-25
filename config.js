/**
 * Experience Configuration
 * Đồng bộ với experience-config.js để người dùng có thể chỉnh sửa tại bất kỳ file nào.
 */
window.experienceConfig = (typeof window !== "undefined" && window.EXPERIENCE_CONFIG) ? window.EXPERIENCE_CONFIG : {
  couple: {
    person1: "Anh",
    person2: "Em",
  },

  intro: {
    lines: [
      "Trung thu năm nay…",
      "Anh không muốn chỉ tặng em một món quà.",
      "Anh muốn làm cho em một nơi.",
    ],
    cta: "Đi cùng anh 🌙",
  },

  // Memory chapters — the boat journey
  chapters: [
    {
      title: "Ngày chúng ta bắt đầu",
      subtitle: "Chapter I",
    },
    {
      title: "Những ngày bình thường",
      subtitle: "Chapter II",
    },
    {
      title: "Những nơi chúng ta đã đi qua",
      subtitle: "Chapter III",
    },
    {
      title: "Ở đây, dưới cùng một mặt trăng",
      subtitle: "Chapter IV",
    },
  ],

  /**
   * Memories — each one becomes a point in the 3D world.
   * type: "lantern" | "bridge" | "sakura" | "reflection" | "moon"
   * chapter: 0-based index into chapters[]
   */
  memories: [
    {
      image: "./memories/01.jpg",
      title: "Ngày đầu tiên",
      date: "25.07.2026",
      caption: "Lúc này chắc cả hai đứa đều chưa biết người bên cạnh sẽ trở nên quan trọng đến thế.",
      location: "Góc quán quen, Hà Nội",
      type: "lantern",
      chapter: 0,
    },
    {
      image: "./memories/02.jpg",
      title: "Nụ cười chiều thu",
      date: "25.07.2026",
      caption: "Ánh mắt em chiều hôm ấy, anh cất vào tim từ lúc nào chẳng hay.",
      location: "Ven bờ hồ Tây",
      type: "reflection",
      chapter: 0,
    },
    {
      image: "./memories/03.jpg",
      title: "Cái nắm tay ngập ngừng",
      date: "25.07.2026",
      caption: "Lần đầu tay chạm tay, cả hai đều vờ như vô tình nhưng tim thì đập rất nhanh.",
      location: "Con đường rợp lá rụng",
      type: "bridge",
      chapter: 0,
    },
    {
      image: "./memories/04.jpg",
      title: "Dưới tán hoa đầu mùa",
      date: "26.07.2026",
      caption: "Cánh hoa rơi vương trên tóc em, tự nhiên thấy lòng dịu lại sau những ngày bận rộn.",
      location: "Vườn hoa anh đào",
      type: "sakura",
      chapter: 1,
    },
    {
      image: "./memories/05.jpg",
      title: "Gặp nhau trên cầu đá",
      date: "26.07.2026",
      caption: "Mưa rơi ướt vai áo anh, nhưng em luôn khô ráo và an tâm nép bên cạnh.",
      location: "Cây cầu đá thung lũng",
      type: "bridge",
      chapter: 1,
    },
    {
      image: "./memories/06.jpg",
      title: "Những quán quen không tên",
      date: "26.07.2026",
      caption: "Món ăn có thể giản đơn, nhưng tiếng cười của em làm tất cả trở nên đặc biệt.",
      location: "Góc phố đèn vàng",
      type: "lantern",
      chapter: 1,
    },
    {
      image: "./memories/07.jpg",
      title: "Chuyến đi xa đầu tiên",
      date: "28.07.2026",
      caption: "Đứng giữa mây trời thênh thang, anh nhận ra thế giới rộng lớn nhưng vừa vặn khi có em.",
      location: "Đỉnh đồi mờ sương",
      type: "lantern",
      chapter: 2,
    },
    {
      image: "./memories/08.jpg",
      title: "Mặt nước lặng yên",
      date: "06.08.2026",
      caption: "Sóng khẽ gợn, phản chiếu bóng hai đứa. Anh thầm mong thời gian cứ ngừng lại lúc này.",
      location: "Hồ vắng lúc hoàng hôn muộn",
      type: "reflection",
      chapter: 2,
    },
    {
      image: "./memories/09.jpg",
      title: "Khoảnh khắc bình yên",
      date: "06.08.2026",
      caption: "Anh ước cho mọi năm tháng về sau, người cùng anh ngắm trăng luôn là em.",
      location: "Gốc cây ước nguyện",
      type: "sakura",
      chapter: 2,
    },
    {
      image: "./memories/10.jpg",
      title: "Ở đây, cùng một vòm trời",
      date: "09.08.2026",
      caption: "Dù cuộc sống có trôi nhanh đến đâu, dừng lại bên em luôn là chốn bình yên nhất.",
      location: "Đêm trăng thanh tĩnh",
      type: "lantern",
      chapter: 3,
    },
    {
      image: "./memories/11.jpg",
      title: "Lời hứa của anh",
      date: "09.08.2026",
      caption: "Không hứa những điều viển vông, chỉ hứa sẽ luôn nắm chặt tay em qua mọi thăng trầm.",
      location: "Bến sông trăng",
      type: "lantern",
      chapter: 3,
    },
    {
      image: "./memories/12.jpg",
      title: "Chiếc đèn lồng nguyện ước",
      date: "Đêm nay",
      caption: "Chiếc đèn lồng này gửi gắm tất cả những điều anh muốn nói với em.",
      location: "Nơi có trăng tròn",
      type: "moon",
      chapter: 3,
    },
  ],

  // Important dates for constellation
  importantDates: [
    { date: "25.07.2026", label: "Ngày chúng ta gặp nhau" },
    { date: "05.10.2024", label: "Chuyến đi đầu tiên" },
  ],

  // Future memories (empty frames)
  futureMemories: [
    "Một chuyến đi chúng ta chưa đi",
    "Một nơi chúng ta chưa sống",
    "Một mùa Trung thu nào đó khi chúng ta già hơn",
    "Một bức ảnh chưa tồn tại",
  ],

  loveLetter: {
    intro: [
      "Anh đã nghĩ rất lâu xem Trung thu này nên tặng em thứ gì.",
      "Rồi anh nhận ra những điều anh muốn giữ nhất không nằm trong một hộp quà.",
    ],
    body: "Nó nằm ở những buổi chiều chúng mình ngồi bên nhau không nói lời nào mà vẫn thấy bình yên, ở những tin nhắn chúc ngủ ngon mỗi tối, và ở ánh mắt em mỗi khi mỉm cười. Cảm ơn em vì đã bước vào thế giới của anh, biến những ngày bình thường nhất trở thành những ngày đáng nhớ nhất. Dù năm tháng có trôi qua, anh vẫn muốn cùng em đi qua thêm nhiều mùa trăng nữa…",
    closing: "Người luôn bên em",
  },

  finalImage: "./memories/final.jpg",
  finalText: "Trung thu vui vẻ, người anh yêu. 🌕",

  // Audio files (add later)
  audio: {
    backgroundMusic: "",
    ambientWater: "",
    wind: "",
    nightAmbience: "",
    lanternSound: "",
    memoryOpenSound: "",
  },

  // Easter egg
  moonClicks: [
    "Em vừa chạm vào mặt trăng.",
    "Nhưng hình như em vẫn ở xa quá.",
    "Vậy thì quay lại đây với anh đi.",
  ],

  ending: {
    stayButton: "Ở lại đây thêm một chút",
  },
};
