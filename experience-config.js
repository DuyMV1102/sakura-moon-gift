/**
 * CẤU HÌNH TRẢI NGHIỆM TRUNG THU: "ĐI CÙNG ANH ĐẾN NƠI CÓ TRĂNG"
 * Chỉnh sửa toàn bộ thông tin hai người, 12 ký ức, chòm sao và thư tình tại đây.
 */

window.EXPERIENCE_CONFIG = {
  couple: {
    person1: "Anh",
    person2: "Em",
    anniversary: "12.08.2024"
  },

  intro: {
    subtitle: "MÓN QUÀ TRUNG THU DÀNH RIÊNG CHO EM",
    lines: [
      "Trung thu năm nay…",
      "Anh không muốn chỉ tặng em một món quà.",
      "Anh muốn làm cho em một nơi."
    ],
    cta: "Đi cùng anh 🌙",
    hint: "Chạm để thả thuyền trôi xuôi dòng ký ức"
  },

  chapters: [
    {
      id: 1,
      name: "Chapter I",
      title: "Ngày chúng ta bắt đầu",
      subtitle: "Những rung động đầu tiên khi hoàng hôn buông xuống thung lũng",
      zStart: 150,
      zEnd: 45
    },
    {
      id: 2,
      name: "Chapter II",
      title: "Những ngày bình thường",
      subtitle: "Bình yên là khi có em bên cạnh trong từng khoảnh khắc giản đơn",
      zStart: 45,
      zEnd: -60
    },
    {
      id: 3,
      name: "Chapter III",
      title: "Những nơi chúng ta đã đi qua",
      subtitle: "Từng con đường, cây cầu và góc phố in dấu chân hai đứa",
      zStart: -60,
      zEnd: -200
    },
    {
      id: 4,
      name: "Chapter IV",
      title: "Ở đây, dưới cùng một mặt trăng",
      subtitle: "Dẫu thế giới xoay vần, dưới ánh trăng này chúng ta mãi thuộc về nhau",
      zStart: -200,
      zEnd: -330
    }
  ],

  // 12 Ký ức bố trí dọc theo dòng sông từ z = 130 đến z = -308
  memories: [
    {
      id: 1,
      chapter: 1,
      z: 128,
      type: "lantern",
      title: "Ngày chúng ta bắt đầu",
      date: "12.08.2024",
      location: "Góc quán quen, Hà Nội",
      caption: "Lúc này chắc cả hai đứa đều chưa biết người bên cạnh sẽ trở nên quan trọng đến thế.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg1' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23382729'/><stop offset='60%' stop-color='%235c3c3a'/><stop offset='100%' stop-color='%23a16550'/></linearGradient><radialGradient id='glow1' cx='50%' cy='45%' r='50%'><stop offset='0%' stop-color='%23ffdb9f' stop-opacity='0.9'/><stop offset='100%' stop-color='%23ff9a3c' stop-opacity='0'/></radialGradient></defs><rect width='800' height='1000' fill='url(%23bg1)'/><circle cx='400' cy='420' r='260' fill='url(%23glow1)'/><ellipse cx='400' cy='680' rx='280' ry='120' fill='%23251717' opacity='0.7'/><circle cx='370' cy='610' r='38' fill='%23191010'/><path d='M335 780 C340 680 360 640 370 648 C380 640 400 680 405 780 Z' fill='%23191010'/><circle cx='435' cy='625' r='32' fill='%23191010'/><path d='M405 780 C410 690 425 658 435 664 C445 658 460 690 465 780 Z' fill='%23191010'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>NGÀY ĐẦU TIÊN GẶP NHAU</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>12 . 08 . 2024</text></svg>"
    },
    {
      id: 2,
      chapter: 1,
      z: 98,
      type: "reflection",
      title: "Nụ cười chiều thu",
      date: "25.08.2024",
      location: "Ven bờ hồ Tây",
      caption: "Ánh mắt em chiều hôm ấy, anh cất vào tim từ lúc nào chẳng hay.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg2' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23222538'/><stop offset='50%' stop-color='%23634053'/><stop offset='100%' stop-color='%23dd886b'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg2)'/><circle cx='400' cy='380' r='180' fill='%23ffeec2' opacity='0.75'/><rect x='0' y='650' width='800' height='350' fill='%231b1c2b'/><path d='M0 650 Q 200 630 400 650 T 800 650 L 800 1000 L 0 1000 Z' fill='%23121320'/><ellipse cx='400' cy='780' rx='160' ry='30' fill='%23f9c687' opacity='0.3'/><circle cx='400' cy='580' r='45' fill='%230f111a'/><path d='M350 780 C360 670 380 620 400 630 C420 620 440 670 450 780 Z' fill='%230f111a'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>NỤ CƯỜI CHIỀU THU</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>25 . 08 . 2024</text></svg>"
    },
    {
      id: 3,
      chapter: 1,
      z: 68,
      type: "lantern",
      title: "Cái nắm tay ngập ngừng",
      date: "08.09.2024",
      location: "Con đường rợp lá rụng",
      caption: "Lần đầu tay chạm tay, cả hai đều vờ như vô tình nhưng tim thì đập rất nhanh.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg3' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%233a1e28'/><stop offset='60%' stop-color='%237a3b3e'/><stop offset='100%' stop-color='%23f48a5e'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg3)'/><circle cx='400' cy='350' r='120' fill='%23fff3d1' opacity='0.85'/><path d='M250 820 Q 320 620 380 660 Q 420 670 480 820 Z' fill='%23190e14'/><path d='M360 660 Q 400 690 420 660' stroke='%23f9bf80' stroke-width='6' fill='none'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>TAY CHẠM TAY</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>08 . 09 . 2024</text></svg>"
    },
    {
      id: 4,
      chapter: 2,
      z: 32,
      type: "sakura_tree",
      title: "Dưới tán hoa đầu mùa",
      date: "22.09.2024",
      location: "Vườn hoa anh đào",
      caption: "Cánh hoa rơi vương trên tóc em, tự nhiên thấy lòng dịu lại sau những ngày bận rộn.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg4' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%2328223d'/><stop offset='60%' stop-color='%238c4b69'/><stop offset='100%' stop-color='%23f29bb2'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg4)'/><circle cx='400' cy='380' r='200' fill='%23fbd2df' opacity='0.45'/><path d='M100 200 Q 300 350 400 850' stroke='%23261622' stroke-width='38' fill='none'/><circle cx='280' cy='290' r='50' fill='%23fca8bf' opacity='0.8'/><circle cx='450' cy='260' r='70' fill='%23ffb9ce' opacity='0.8'/><circle cx='340' cy='380' r='45' fill='%23ffd0dc' opacity='0.9'/><circle cx='490' cy='360' r='55' fill='%23fba0b9' opacity='0.8'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>DƯỚI TÁN ANH ĐÀO</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>22 . 09 . 2024</text></svg>"
    },
    {
      id: 5,
      chapter: 2,
      z: -10,
      type: "bridge",
      title: "Gặp nhau trên cầu đá",
      date: "10.10.2024",
      location: "Cây cầu đá thung lũng",
      caption: "Mưa rơi ướt vai áo anh, nhưng em luôn khô ráo và an tâm nép bên cạnh.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg5' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%2319202a'/><stop offset='55%' stop-color='%233c4656'/><stop offset='100%' stop-color='%239e7667'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg5)'/><path d='M50 700 Q 400 480 750 700 L 750 900 L 50 900 Z' fill='%2313171d'/><ellipse cx='400' cy='720' rx='220' ry='160' fill='%230b0e12'/><circle cx='375' cy='520' r='25' fill='%23f9bf80'/><circle cx='425' cy='530' r='22' fill='%23f9bf80'/><path d='M340 490 Q 400 450 460 490' stroke='%23e05a47' stroke-width='14' fill='none'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>TRÊN CẦU ĐÁ</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>10 . 10 . 2024</text></svg>"
    },
    {
      id: 6,
      chapter: 2,
      z: -45,
      type: "lantern",
      title: "Những quán quen không tên",
      date: "05.11.2024",
      location: "Góc phố đèn vàng",
      caption: "Món ăn có thể giản đơn, nhưng tiếng cười của em làm tất cả trở nên đặc biệt.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg6' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%231a1528'/><stop offset='50%' stop-color='%2348273f'/><stop offset='100%' stop-color='%23c26743'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg6)'/><rect x='320' y='280' width='160' height='260' rx='20' fill='%23ffbe5c' opacity='0.85'/><line x1='400' y1='100' x2='400' y2='280' stroke='%2322131b' stroke-width='4'/><circle cx='400' cy='410' r='90' fill='%23fff3cf' opacity='0.7'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>QUÁN QUEN ĐÈN VÀNG</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>05 . 11 . 2024</text></svg>"
    },
    {
      id: 7,
      chapter: 3,
      z: -85,
      type: "lantern",
      title: "Chuyến đi xa đầu tiên",
      date: "24.12.2024",
      location: "Đỉnh đồi mờ sương",
      caption: "Đứng giữa mây trời thênh thang, anh nhận ra thế giới rộng lớn nhưng vừa vặn khi có em.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg7' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23121829'/><stop offset='60%' stop-color='%2329385c'/><stop offset='100%' stop-color='%236f8bb8'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg7)'/><polygon points='100,650 350,350 550,650' fill='%23182136'/><polygon points='300,680 550,400 780,680' fill='%2323304c'/><rect x='0' y='650' width='800' height='350' fill='%230f1422'/><circle cx='400' cy='220' r='40' fill='%23fff4d4'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>CHUYẾN ĐI ĐẦU TIÊN</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>24 . 12 . 2024</text></svg>"
    },
    {
      id: 8,
      chapter: 3,
      z: -130,
      type: "reflection",
      title: "Mặt nước lặng yên",
      date: "18.01.2025",
      location: "Hồ vắng lúc hoàng hôn muộn",
      caption: "Sóng khẽ gợn, phản chiếu bóng hai đứa. Anh thầm mong thời gian cứ ngừng lại lúc này.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg8' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%230d121c'/><stop offset='50%' stop-color='%23202942'/><stop offset='100%' stop-color='%23465882'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg8)'/><ellipse cx='400' cy='500' rx='280' ry='160' fill='%2329385c' opacity='0.7'/><line x1='120' y1='500' x2='680' y2='500' stroke='%23eed2a2' stroke-width='2' opacity='0.6'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>MẶT NƯỚC LẶNG YÊN</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>18 . 01 . 2025</text></svg>"
    },
    {
      id: 9,
      chapter: 3,
      z: -175,
      type: "sakura_tree",
      title: "Khoảnh khắc bình yên",
      date: "14.02.2025",
      location: "Gốc cây ước nguyện",
      caption: "Anh ước cho mọi năm tháng về sau, người cùng anh ngắm trăng luôn là em.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg9' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23120f21'/><stop offset='60%' stop-color='%23321f47'/><stop offset='100%' stop-color='%23703d7a'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg9)'/><circle cx='400' cy='320' r='180' fill='%23f3b9d2' opacity='0.4'/><circle cx='400' cy='320' r='120' fill='%23fff' opacity='0.85'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>ƯỚC NGUYỆN DƯỚI HOA</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>14 . 02 . 2025</text></svg>"
    },
    {
      id: 10,
      chapter: 4,
      z: -245,
      type: "lantern",
      title: "Ở đây, cùng một vòm trời",
      date: "15.05.2025",
      location: "Đêm trăng thanh tĩnh",
      caption: "Dù cuộc sống có trôi nhanh đến đâu, dừng lại bên em luôn là chốn bình yên nhất.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg10' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23080b14'/><stop offset='60%' stop-color='%23121b33'/><stop offset='100%' stop-color='%231d2e5a'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg10)'/><circle cx='400' cy='360' r='220' fill='%23edf2fb' opacity='0.9'/><ellipse cx='400' cy='750' rx='360' ry='120' fill='%2307090f'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>DƯỚI CÙNG VÒM TRỜI</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>15 . 05 . 2025</text></svg>"
    },
    {
      id: 11,
      chapter: 4,
      z: -275,
      type: "lantern",
      title: "Lời hứa của anh",
      date: "20.07.2025",
      location: "Bến sông trăng",
      caption: "Không hứa những điều viển vông, chỉ hứa sẽ luôn nắm chặt tay em qua mọi thăng trầm.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg11' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%23060810'/><stop offset='60%' stop-color='%2310162b'/><stop offset='100%' stop-color='%23223055'/></linearGradient></defs><rect width='800' height='1000' fill='url(%23bg11)'/><circle cx='400' cy='320' r='140' fill='%23ffd78a' opacity='0.7'/><circle cx='400' cy='320' r='80' fill='%23fff5db'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>LỜI HỨA CỦA ANH</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>20 . 07 . 2025</text></svg>"
    },
    {
      id: 12,
      chapter: 4,
      z: -308,
      type: "moon",
      title: "Chiếc đèn lồng nguyện ước",
      date: "Đêm nay",
      location: "Nơi có trăng tròn",
      caption: "Chiếc đèn lồng này gửi gắm tất cả những điều anh muốn nói với em.",
      image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='800' height='1000' viewBox='0 0 800 1000'><defs><linearGradient id='bg12' x1='0' y1='0' x2='0' y2='1'><stop offset='0%' stop-color='%2305070d'/><stop offset='50%' stop-color='%230c1426'/><stop offset='100%' stop-color='%23192847'/></linearGradient><radialGradient id='moonGlow' cx='50%' cy='40%' r='50%'><stop offset='0%' stop-color='%23fffdf0'/><stop offset='50%' stop-color='%23e6ecf8' stop-opacity='0.9'/><stop offset='100%' stop-color='%23385280' stop-opacity='0'/></radialGradient></defs><rect width='800' height='1000' fill='url(%23bg12)'/><circle cx='400' cy='400' r='300' fill='url(%23moonGlow)'/><circle cx='400' cy='400' r='190' fill='%23fefdf4'/><text x='400' y='870' fill='%23fce6c9' font-family='serif' font-size='32' text-anchor='middle' letter-spacing='4'>MẶT TRĂNG CỦA CHÚNG MÌNH</text><text x='400' y='920' fill='%23dfb07b' font-family='serif' font-size='20' text-anchor='middle' letter-spacing='2'>TRUNG THU NĂM NAY</text></svg>"
    }
  ],

  constellation: {
    title: "Bầu trời của chúng ta",
    sectionText1: "Trong hàng tỷ ngày đã trôi qua…",
    sectionText2: "…anh vẫn rất vui vì chúng ta đã gặp nhau vào đúng ngày ấy.",
    stars: [
      { id: "s1", date: "12.08.2024", label: "Ngày chúng ta gặp nhau", x: -0.35, y: 0.22, memoryId: 1 },
      { id: "s2", date: "08.09.2024", label: "Lần đầu nắm tay", x: -0.15, y: 0.42, memoryId: 3 },
      { id: "s3", date: "10.10.2024", label: "Cơn mưa trên cầu", x: 0.08, y: 0.28, memoryId: 5 },
      { id: "s4", date: "24.12.2024", label: "Chuyến đi đầu tiên", x: 0.28, y: 0.48, memoryId: 7 },
      { id: "s5", date: "14.02.2025", label: "Dưới vòm trời sao", x: 0.38, y: 0.18, memoryId: 9 },
      { id: "s6", date: "Đêm nay", label: "Đêm trăng Trung thu", x: 0.02, y: 0.58, memoryId: 12 }
    ]
  },

  futureMemories: [
    {
      title: "Một chuyến đi chúng ta chưa đi",
      caption: "Những vùng đất xa xôi đang chờ bước chân hai đứa."
    },
    {
      title: "Một nơi chúng ta chưa sống",
      caption: "Một căn nhà nhỏ ngập nắng và rộn tiếng cười."
    },
    {
      title: "Một mùa Trung thu khi chúng ta già hơn",
      caption: "Tóc đã hoa râm nhưng tay vẫn nắm chặt."
    },
    {
      title: "Một bức ảnh chưa tồn tại",
      caption: "Dành riêng cho những điều tuyệt vời nhất phía trước."
    }
  ],

  loveLetter: {
    recipient: "Gửi người anh yêu,",
    lead1: "Anh đã nghĩ rất lâu xem Trung thu này nên tặng em thứ gì.",
    lead2: "Rồi anh nhận ra những điều anh muốn giữ nhất không nằm trong một hộp quà.",
    paragraphs: [
      "Nó nằm ở những buổi chiều chúng mình ngồi bên nhau không nói lời nào mà vẫn thấy bình yên, ở những tin nhắn chúc ngủ ngon mỗi tối, và ở ánh mắt em mỗi khi mỉm cười.",
      "Cảm ơn em vì đã bước vào thế giới của anh, biến những ngày bình thường nhất trở thành những ngày đáng nhớ nhất.",
      "Dù năm tháng có trôi qua, anh vẫn muốn cùng em đi qua thêm nhiều mùa trăng nữa…",
      "Anh yêu em rất nhiều."
    ],
    signature: "Người luôn bên em",
    closingDate: "Rằm Tháng Tám"
  },

  finalMemory: {
    image: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='900' viewBox='0 0 1200 900'><defs><linearGradient id='finBg' x1='0' y1='0' x2='1' y2='1'><stop offset='0%' stop-color='%23080e18'/><stop offset='50%' stop-color='%23192338'/><stop offset='100%' stop-color='%232a192e'/></linearGradient><radialGradient id='moonGlowFin' cx='50%' cy='35%' r='50%'><stop offset='0%' stop-color='%23fffdf4'/><stop offset='40%' stop-color='%23ffecb3' stop-opacity='0.85'/><stop offset='100%' stop-color='%23192338' stop-opacity='0'/></radialGradient></defs><rect width='1200' height='900' fill='url(%23finBg)'/><circle cx='600' cy='350' r='240' fill='url(%23moonGlowFin)'/><circle cx='600' cy='350' r='140' fill='%23fffcf2'/><path d='M0 650 Q 300 580 600 660 T 1200 650 L 1200 900 L 0 900 Z' fill='%230c111c'/><ellipse cx='600' cy='740' rx='280' ry='40' fill='%23ffd885' opacity='0.35'/><circle cx='575' cy='630' r='28' fill='%23080a11'/><path d='M550 750 C555 680 570 650 575 656 C580 650 595 680 600 750 Z' fill='%23080a11'/><circle cx='625' cy='642' r='24' fill='%23080a11'/><path d='M605 750 C610 690 620 666 625 670 C630 666 640 690 645 750 Z' fill='%23080a11'/><text x='600' y='820' fill='%23fde8cf' font-family='serif' font-size='28' text-anchor='middle' letter-spacing='4'>MÃI MÃI ĐI CÙNG NHAU</text></svg>",
    message: "Trung thu vui vẻ, người anh yêu. 🌕",
    stayButtonText: "Ở lại đây thêm một chút"
  },

  easterEgg: {
    moonClicks: [
      "Em vừa chạm vào mặt trăng.",
      "Nhưng hình như em vẫn ở xa quá.",
      "Vậy thì quay lại đây với anh đi."
    ]
  },

  audio: {
    backgroundMusic: "",
    ambientWater: "",
    wind: ""
  }
};

window.experienceConfig = window.EXPERIENCE_CONFIG;
