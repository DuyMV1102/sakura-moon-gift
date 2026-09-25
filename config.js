/**
 * config.js — Đi cùng anh đến nơi có trăng
 * Cấu hình nội dung hành trình ký ức tình yêu
 */

window.experienceConfig = {
  couple: {
    partnerName: "Em",
    userName: "Anh",
  },

  intro: {
    lines: [
      "Trung thu năm nay…",
      "Anh không muốn chỉ tặng em một món quà.",
      "Anh muốn làm cho em một nơi.",
      "Nơi chỉ có hai đứa mình, dòng sông êm đềm và ánh trăng sáng nhất.",
    ],
    cta: "Đi cùng anh 🌙",
  },

  // 4 Memory chapters
  chapters: [
    {
      title: "Ngày chúng ta bắt đầu",
      subtitle: "Chapter I",
    },
    {
      title: "Những ngày bình dị & Cơm nhà",
      subtitle: "Chapter II",
    },
    {
      title: "Chuyến đi xa — Senna Resort",
      subtitle: "Chapter III",
    },
    {
      title: "Dưới vòm trời đêm — Về chung một lối",
      subtitle: "Chapter IV",
    },
  ],

  /**
   * 12 Memories matching the real story
   */
  memories: [
    {
      image: "./memories/01.jpg",
      title: "Bó hoa đầu tiên",
      date: "25.07.2026",
      caption: "Bó hoa hồng phấn ngày anh ngỏ lời. Lúc ấy cả hai đứa đều ngượng ngùng, chẳng ngờ một bó hoa lại mở ra cả một hành trình dịu dàng đến thế.",
      location: "Góc quán quen, Hà Nội",
      type: "lantern",
      chapter: 0,
    },
    {
      image: "./memories/02.jpg",
      title: "Những ngón tay đan chặt",
      date: "25.07.2026",
      caption: "Bàn tay nhỏ của em ngoan ngoãn nằm trong tay anh suốt cả chặng đường. Cảm giác ấm áp ấy là điều anh luôn muốn nắm giữ mãi mãi.",
      location: "Trên xe đón đưa",
      type: "reflection",
      chapter: 0,
    },
    {
      image: "./memories/03.jpg",
      title: "Sóng đôi bước đi",
      date: "25.07.2026",
      caption: "Hai bóng lưng sánh bước thong thả bên nhau. Chẳng cần điểm đến nào vội vã, chỉ cần người đi cạnh là em là đủ trọn vẹn một ngày.",
      location: "Những góc phố quen",
      type: "bridge",
      chapter: 0,
    },
    {
      image: "./memories/04.jpg",
      title: "Cơm nhà ấm áp",
      date: "26.07.2026",
      caption: "Đĩa thịt kho thơm nức, bát canh rau luộc thanh ngọt. Hạnh phúc giản đơn nhất là sau một ngày dài được ngồi ăn bữa cơm nhà nóng hổi cùng em.",
      location: "Căn bếp nhỏ",
      type: "sakura",
      chapter: 1,
    },
    {
      image: "./memories/05.jpg",
      title: "Que kem chiều hè",
      date: "26.07.2026",
      caption: "Chia nhau từng que kem mát lạnh giữa buổi chiều hè. Vị ngọt mát của kem chẳng bằng nụ cười tươi rói của em lúc ấy.",
      location: "Dưới bóng râm góc phố",
      type: "bridge",
      chapter: 1,
    },
    {
      image: "./memories/06.jpg",
      title: "Cùng nhau vun vén",
      date: "06.08.2026",
      caption: "Cùng đẩy xe đi chọn từng chiếc chảo, từng món đồ gia dụng nhỏ xinh. Cảm giác hai đứa đang cùng nhau chăm chút cho tổ ấm tương lai.",
      location: "Siêu thị gia đình",
      type: "lantern",
      chapter: 1,
    },
    {
      image: "./memories/07.jpg",
      title: "Chào đón ở Senna",
      date: "09.08.2026",
      caption: "Chuyến đi trốn thành phố đầu tiên của hai đứa. Bức thư chào mừng xinh xắn và đĩa hoa quả ngọt lành mở đầu cho một kỳ nghỉ bình yên.",
      location: "Senna Wellness Retreat",
      type: "lantern",
      chapter: 2,
    },
    {
      image: "./memories/08.jpg",
      title: "Khoảnh khắc bên sofa",
      date: "09.08.2026",
      caption: "Buổi trưa lười biếng tựa vào nhau, những cái ôm và nụ hôn dịu dàng. Ở nơi này, chỉ có tiếng gió thổi và thế giới của riêng hai đứa.",
      location: "Góc phòng resort",
      type: "reflection",
      chapter: 2,
    },
    {
      image: "./memories/09.jpg",
      title: "Bữa tối dưới ánh đèn vàng",
      date: "09.08.2026",
      caption: "Bàn tiệc tối ấm cúng bên ánh nến lung linh. Ngắm nhìn em rạng rỡ phía bên kia bàn ăn, anh biết mình đã tìm thấy điều quý giá nhất.",
      location: "Nhà hàng Senna",
      type: "sakura",
      chapter: 2,
    },
    {
      image: "./memories/10.jpg",
      title: "Áo choàng đôi trước gương",
      date: "09.08.2026",
      caption: "Bức ảnh selfie đôi đáng yêu trong chiếc áo choàng trắng tinh. Những điều ngốc nghếch nhất khi làm cùng em đều trở nên đáng yêu lạ thường.",
      location: "Phòng nghỉ resort",
      type: "lantern",
      chapter: 3,
    },
    {
      image: "./memories/11.jpg",
      title: "Cái ôm siết chặt",
      date: "25.07.2026",
      caption: "Dưới ánh đèn đường vàng dịu mát, anh ôm em thật chặt vào lòng. Nguyện ước khoảnh khắc bình yên này sẽ kéo dài mãi mãi.",
      location: "Góc phố đêm Châu Âu",
      type: "lantern",
      chapter: 3,
    },
    {
      image: "./memories/12.jpg",
      title: "Ngồi sau xe anh",
      date: "14.09.2026",
      caption: "Gió đêm thu lành lạnh lướt qua vai, em ngồi sau ôm eo anh thật chặt. Giữa thành phố muôn ánh đèn, người ngồi sau anh là điều duy nhất anh hướng về.",
      location: "Gió đêm thu Hà Nội",
      type: "moon",
      chapter: 3,
    },
  ],

  // Important dates for constellation
  importantDates: [
    { date: "25.07.2026", label: "Bó hoa đầu tiên & Cái nắm tay" },
    { date: "26.07.2026", label: "Bữa cơm nhà & Que kem hè" },
    { date: "09.08.2026", label: "Kỳ nghỉ ngọt ngào Senna Resort" },
    { date: "14.09.2026", label: "Đêm thu trên xe anh & Mùa trăng trọn vẹn" },
  ],

  // Future memories (empty frames)
  futureMemories: [
    "Một chuyến đi xa hơn chúng ta chưa đi",
    "Một ngôi nhà nhỏ tràn ngập tiếng cười",
    "Một mùa Trung thu nào đó khi chúng ta già hơn",
    "Một bức ảnh gia đình trọn vẹn trong tương lai",
  ],

  loveLetter: {
    intro: [
      "Anh đã nghĩ rất lâu xem Trung thu này nên tặng em thứ gì.",
      "Rồi anh nhận ra những điều quý giá nhất đều đã nằm trong những ngày chúng mình bên nhau.",
    ],
    body: "Từ bó hoa ngày đầu ngỏ lời, cái nắm tay ngập ngừng trên xe, những bữa cơm nhà nóng hổi hai đứa cùng nấu, cho đến chuyến đi Senna ngập tràn tiếng cười và những buổi tối em nép sau lưng anh lướt qua từng con phố gió thu... Cảm ơn em vì đã đến, biến những điều bình thường nhất trở thành ký ức đẹp nhất. Chúc cho mọi mùa trăng về sau, người ngồi sau xe anh và cùng anh ngắm trăng mãi mãi là em.",
    closing: "Người luôn bên em",
  },

  finalImage: "./memories/final.jpg",
  finalText: "Trung thu ấm áp, người anh yêu. 🌕",

  audio: {
    backgroundMusic: "",
    ambientWater: "",
    wind: "",
    nightAmbience: "",
    lanternSound: "",
    memoryOpenSound: "",
  },

  ending: {
    stayButton: "Ở lại ngắm trăng cùng anh 🌙",
    replayButton: "Xem lại hành trình",
  },
};
