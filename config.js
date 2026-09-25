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
      image: "/memories/01.jpg",
      title: "Ngày đầu tiên",
      date: "12.08.2024",
      caption: "Lúc này chắc cả hai đứa đều chưa biết người bên cạnh sẽ trở nên quan trọng đến thế.",
      location: "",
      type: "lantern",
      chapter: 0,
    },
    {
      image: "/memories/02.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "lantern",
      chapter: 0,
    },
    {
      image: "/memories/03.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "bridge",
      chapter: 0,
    },
    {
      image: "/memories/04.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "lantern",
      chapter: 1,
    },
    {
      image: "/memories/05.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "sakura",
      chapter: 1,
    },
    {
      image: "/memories/06.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "lantern",
      chapter: 1,
    },
    {
      image: "/memories/07.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "lantern",
      chapter: 2,
    },
    {
      image: "/memories/08.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "reflection",
      chapter: 2,
    },
    {
      image: "/memories/09.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "bridge",
      chapter: 2,
    },
    {
      image: "/memories/10.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "lantern",
      chapter: 3,
    },
    {
      image: "/memories/11.jpg",
      title: "",
      date: "",
      caption: "",
      location: "",
      type: "moon",
      chapter: 3,
    },
  ],

  // Important dates for constellation
  importantDates: [
    { date: "12.08.2024", label: "Ngày chúng ta gặp nhau" },
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
    body: "[LOVE_LETTER_CONTENT]",
    closing: "",
  },

  finalImage: "/memories/final.jpg",
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
