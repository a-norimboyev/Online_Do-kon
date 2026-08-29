export const INITIAL_CATEGORIES = [
  { id: 'all', name: 'Barcha tovarlar', icon: 'LayoutGrid' },
  { id: 'smartphones', name: 'Smartfonlar va Gadjetlar', icon: 'Smartphone' },
  { id: 'laptops', name: 'Noutbuk va Kompyuterlar', icon: 'Laptop' },
  { id: 'appliances', name: 'Maishiy texnika', icon: 'Tv' },
  { id: 'clothing', name: 'Kiyim-kechak & Poyabzal', icon: 'Shirt' },
  { id: 'books', name: 'Kitoblar va Adabiyot', icon: 'BookOpen' },
  { id: 'beauty', name: "Go'zallik va Salomatlik", icon: 'Sparkles' },
  { id: 'accessories', name: 'Aksessuarlar & Soatlar', icon: 'Watch' },
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod-1',
    name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium',
    category: 'smartphones',
    price: 15499000,
    oldPrice: 17200000,
    discount: 10,
    rating: 4.9,
    reviewsCount: 38,
    stock: 14,
    badge: 'Xit savdo',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80'
    ],
    description: "A17 Pro chipiga ega, titan korpusli eng so'nggi flagman smartfon. 48MP asosiy kamera, 5x optik zoom va 120Hz Super Retina XDR displey bilan jihozlangan.",
    specs: {
      "Ekran": "6.7 dyuym OLED, 120Hz ProMotion",
      "Protsessor": "Apple A17 Pro (3nm)",
      "Xotira": "256GB doimiy, 8GB RAM",
      "Kamera": "48MP + 12MP + 12MP (5x Zoom)",
      "Akkumulyator": "4422 mAh, 29 soat video ko'rish",
      "Kafolat": "1 yil rasmiy kafolat"
    },
    reviews: [
      { id: 'rev-1', author: 'Sardor Rahimiy', rating: 5, date: '2026-08-15', comment: "Dizayni juda ajoyib, qo'lda yengil turadi. Kamera sifati esa shunchaki daxshat!" },
      { id: 'rev-2', author: 'Madina Umarova', rating: 5, date: '2026-08-20', comment: "Online do'kondan birinchi marta xarid qildim, kuryer 2 soatda yetkazib berdi. Rahmat!" }
    ]
  },
  {
    id: 'prod-2',
    name: 'Samsung Galaxy S24 Ultra 512GB Titanium Gray',
    category: 'smartphones',
    price: 14200000,
    oldPrice: 15800000,
    discount: 10,
    rating: 4.8,
    reviewsCount: 29,
    stock: 9,
    badge: 'Yangi',
    image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Galaxy AI sun'iy intellekt xususiyatlari, 200MP kamera va o'rnatilgan S-Pen stilusiga ega bo'lgan kuchli smartfon.",
    specs: {
      "Ekran": "6.8 dyuym Dynamic AMOLED 2X, 2600 nit",
      "Protsessor": "Snapdragon 8 Gen 3 for Galaxy",
      "Xotira": "512GB, 12GB RAM",
      "Kamera": "200MP + 50MP + 12MP + 10MP",
      "Batareya": "5000 mAh, 45W tezkor zaryad"
    },
    reviews: [
      { id: 'rev-3', author: 'Javohir Qodirov', rating: 5, date: '2026-08-10', comment: "Sun'iy intellekt funksiyalari (Galaxy AI) tarjima va foto tahrirda juda qo'l keladi." }
    ]
  },
  {
    id: 'prod-3',
    name: 'Apple MacBook Air 15" M3 Chip 16GB / 512GB Midnight',
    category: 'laptops',
    price: 17800000,
    oldPrice: 19500000,
    discount: 9,
    rating: 5.0,
    reviewsCount: 19,
    stock: 6,
    badge: 'Tavsiya etiladi',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Kuchli M3 protsessoriga ega ultra-ingichka noutbuk. 18 soatgacha batareya quvvati, Liquid Retina displey va jim ishlaydigan fanless dizayn.",
    specs: {
      "Ekran": "15.3 dyuym Liquid Retina (2880x1864)",
      "Protsessor": "Apple M3 (8 yadroli CPU, 10 yadroli GPU)",
      "Xotira": "16GB birlashtirilgan xotira, 512GB SSD",
      "Og'irligi": "1.51 kg",
      "Batareya": "18 soatgacha"
    },
    reviews: [
      { id: 'rev-4', author: 'Akmal Zokirov', rating: 5, date: '2026-07-28', comment: "Dasturchilar va ofis ishlari uchun eng zo'r tanlov! Zaryadi 2 kunga yetadi." }
    ]
  },
  {
    id: 'prod-4',
    name: 'Sony WH-1000XM5 Simsiz shovqinni so\'ndiruvchi quloqchin',
    category: 'accessories',
    price: 4350000,
    oldPrice: 4900000,
    discount: 11,
    rating: 4.9,
    reviewsCount: 45,
    stock: 22,
    badge: 'Xit savdo',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Dunyodagi eng yaxshi shovqinni to'suvchi (Active Noise Cancellation) texnologiyasi, kristaldek toza ovoz va 30 soat avtonom ish.",
    specs: {
      "Ulanish": "Bluetooth 5.2, LDAC, Multipoint",
      "Shovqin to'sish": "Industry-leading ANC (8 ta mikrofon)",
      "Batareya": "30 soat (ANC yoniq holda)",
      "Tezkor zaryad": "3 daqiqa zaryad = 3 soat musiqa"
    },
    reviews: [
      { id: 'rev-5', author: 'Nodirbek Aliyev', rating: 5, date: '2026-08-01', comment: "Samolyotda va shovqinli ofisda shunchaki najotkor gadjet!" }
    ]
  },
  {
    id: 'prod-5',
    name: 'Artel Inverter Konditsioner 12HD Inverter Eco',
    category: 'appliances',
    price: 4890000,
    oldPrice: 5600000,
    discount: 13,
    rating: 4.7,
    reviewsCount: 31,
    stock: 8,
    badge: 'Chegirma',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Energiya tejovchi A++ inverter kompressor. 35 kv.m gacha bo'lgan xonalarni tezkor sovutadi va qishda isitadi. Wi-Fi boshqaruvi mavjud.",
    specs: {
      "Xona maydoni": "35 kv.m gacha",
      "Kompressor": "Inverter (A++ tejamkorlik)",
      "Freon turi": "R32 ekologik toza",
      "Kafolat": "3 yil to'liq kafolat"
    },
    reviews: [
      { id: 'rev-6', author: 'Otabek G\'aniyev', rating: 5, date: '2026-07-15', comment: "Juda jim ishlaydi, elektr energiyasini kam sarflaydi. O'rnatib berishdi." }
    ]
  },
  {
    id: 'prod-6',
    name: 'Apple Watch Series 9 GPS 45mm Midnight Aluminum',
    category: 'accessories',
    price: 4990000,
    oldPrice: 5400000,
    discount: 8,
    rating: 4.8,
    reviewsCount: 24,
    stock: 11,
    badge: 'Xit savdo',
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80'
    ],
    description: "S9 SiP chip, yangi 'Double Tap' teginmasdan boshqarish harakati, yorqinroq Always-On Retina displey va sog'liqni nazorat qiluvchi sensorlar.",
    specs: {
      "Korpus": "45mm alyuminiy, 50m suvga chidamli",
      "Displey": "2000 nit Always-On Retina",
      "Sensorlar": "EKG, Yurak urishi, Qondagi kislorod, Tana harorati"
    },
    reviews: []
  },
  {
    id: 'prod-7',
    name: 'Atom Odatlar — Jeyms Klir (O\'zbek tilida, Qattiq muqova)',
    category: 'books',
    price: 89000,
    oldPrice: 110000,
    discount: 19,
    rating: 4.9,
    reviewsCount: 88,
    stock: 45,
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Dunyo bo'yicha millionlab nusxada sotilgan shaxsiy rivojlanish kitobi. Kichik odatlar orqali katta natijalarga erishish bo'yicha amaliy qo'llanma.",
    specs: {
      "Muallif": "Jeyms Klir",
      "Muqova": "Qattiq muqova",
      "Sahifalar soni": "320 bet",
      "Til": "O'zbek tili (Lotin yozuvida)"
    },
    reviews: [
      { id: 'rev-7', author: 'Dilshod Normatov', rating: 5, date: '2026-08-18', comment: "Har bir inson hayotida kamida bir marta o'qishi kerak bo'lgan asar!" }
    ]
  },
  {
    id: 'prod-8',
    name: 'Erkaklar uchun Premium Paxtali Klassik Kurtka',
    category: 'clothing',
    price: 650000,
    oldPrice: 850000,
    discount: 24,
    rating: 4.6,
    reviewsCount: 16,
    stock: 15,
    badge: 'Chegirma',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80'
    ],
    description: "100% tabiiy zich paxta matosidan tikilgan, suv o'tkazmaydigan qoplamali qulay va zamonaviy bahor/kuz kurtkasi.",
    specs: {
      "Mato": "100% zich paxta + shamol to'suvchi astar",
      "O'lchamlar": "M, L, XL, XXL",
      "Rang": "To'q ko'k / Qora",
      "Mavsum": "Bahor / Kuz"
    },
    reviews: []
  },
  {
    id: 'prod-9',
    name: 'Dyson Airwrap Multi-Styler Complete Long Fen-Stayler',
    category: 'beauty',
    price: 7200000,
    oldPrice: 8100000,
    discount: 11,
    rating: 5.0,
    reviewsCount: 52,
    stock: 5,
    badge: 'Premium',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Coanda aero-effekti yordamida sochlarga haddan tashqari issiqlik bermasdan turmaklaydigan va quritadigan mashhur stayler.",
    specs: {
      "Quvvat": "1300 Vt",
      "Harorat nazorati": "Intelligent Heat Control (soniyasiga 40 marta)",
      "Nasatkalar soni": "6 xil turmaklash nasatkalari",
      "Ishlab chiqarilgan": "Buyuk Britaniya brendi"
    },
    reviews: [
      { id: 'rev-8', author: 'Gulnoza Karimova', rating: 5, date: '2026-08-22', comment: "Sochni umuman kuydirmaydi, salon effekti uyda! Ayollar uchun eng yaxshi sovg'a." }
    ]
  },
  {
    id: 'prod-10',
    name: 'De\'Longhi Magnifica S Avtomatik Qahva Mashinasi',
    category: 'appliances',
    price: 6100000,
    oldPrice: 6900000,
    discount: 12,
    rating: 4.8,
    reviewsCount: 23,
    stock: 7,
    badge: 'Xit savdo',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop&q=80'
    ],
    description: "Espresso, Cappuccino va Americano qahvalarini bir tugma orqali tayyorlaydigan italyan texnologiyasidagi donali qahva mashinasi.",
    specs: {
      "Bosim": "15 Bar",
      "Suv idishi": "1.8 litr",
      "Don qahva idishi": "250 gr",
      "Kapuchinator": "Qo'lda quyuq sut ko'pigi hosil qiluvchi"
    },
    reviews: []
  }
];

export const INITIAL_PROMOS = [
  { code: 'YANGI2026', discountPercent: 10, minAmount: 100000, description: '10% xush kelibsiz chegirmasi' },
  { code: 'CHEGIRMA50', fixedDiscount: 50000, minAmount: 500000, description: "500 000 so'mdan ortiq xaridga 50 000 so'm chegirma" },
  { code: 'SUPERDISCOUNT', discountPercent: 15, minAmount: 1000000, description: '15% maxsus chegirma' }
];

export const REGIONS_UZB = [
  { id: 'tashkent-city', name: 'Toshkent shahri', deliveryPrice: 20000, deliveryTime: '1 kun / 3 soat Express' },
  { id: 'tashkent-reg', name: 'Toshkent viloyati', deliveryPrice: 30000, deliveryTime: '1-2 kun' },
  { id: 'samarkand', name: 'Samarqand viloyati', deliveryPrice: 35000, deliveryTime: '1-2 kun' },
  { id: 'bukhara', name: 'Buxoro viloyati', deliveryPrice: 40000, deliveryTime: '2-3 kun' },
  { id: 'fergana', name: "Farg'ona viloyati", deliveryPrice: 35000, deliveryTime: '1-2 kun' },
  { id: 'andijan', name: 'Andijon viloyati', deliveryPrice: 35000, deliveryTime: '1-2 kun' },
  { id: 'namangan', name: 'Namangan viloyati', deliveryPrice: 35000, deliveryTime: '1-2 kun' },
  { id: 'kashkadarya', name: 'Qashqadaryo viloyati', deliveryPrice: 40000, deliveryTime: '2-3 kun' },
  { id: 'surkhandarya', name: 'Surxondaryo viloyati', deliveryPrice: 45000, deliveryTime: '2-3 kun' },
  { id: 'khorezm', name: 'Xorazm viloyati', deliveryPrice: 45000, deliveryTime: '2-3 kun' },
  { id: 'navoiy', name: 'Navoiy viloyati', deliveryPrice: 40000, deliveryTime: '2-3 kun' },
  { id: 'jizzakh', name: 'Jizzax viloyati', deliveryPrice: 35000, deliveryTime: '1-2 kun' },
  { id: 'sirdaryo', name: 'Sirdaryo viloyati', deliveryPrice: 30000, deliveryTime: '1-2 kun' },
  { id: 'karakalpakstan', name: "Qoraqalpog'iston Respublikasi", deliveryPrice: 50000, deliveryTime: '3-4 kun' }
];

export const INITIAL_ORDERS = [
  {
    id: 'ORD-98241',
    customerName: 'Rustam Karimov',
    phone: '+998 90 123 45 67',
    region: 'Toshkent shahri',
    address: 'Chilonzor tumani, 9-mavze, 14-uy',
    items: [
      { id: 'prod-1', name: 'Apple iPhone 15 Pro Max 256GB Natural Titanium', price: 15499000, quantity: 1, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80' }
    ],
    deliveryType: 'standard',
    deliveryPrice: 20000,
    paymentMethod: 'Payme',
    subtotal: 15499000,
    discountAmount: 0,
    total: 15519000,
    status: 'Yetkazilmoqda',
    createdAt: '2026-08-28T11:30:00.000Z'
  },
  {
    id: 'ORD-98240',
    customerName: 'Shahlo Azimova',
    phone: '+998 93 987 65 43',
    region: 'Samarqand viloyati',
    address: 'Registon ko\'chasi, 25-uy',
    items: [
      { id: 'prod-4', name: 'Sony WH-1000XM5 Simsiz quloqchin', price: 4350000, quantity: 1, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80' },
      { id: 'prod-7', name: 'Atom Odatlar — Jeyms Klir', price: 89000, quantity: 2, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80' }
    ],
    deliveryType: 'standard',
    deliveryPrice: 35000,
    paymentMethod: 'Click',
    subtotal: 4528000,
    discountAmount: 452800,
    total: 4110200,
    status: 'Yetkazib berildi',
    createdAt: '2026-08-27T16:15:00.000Z'
  },
  {
    id: 'ORD-98239',
    customerName: 'Behzod Shukurov',
    phone: '+998 97 555 11 22',
    region: 'Farg\'ona viloyati',
    address: 'Marg\'ilon ko\'chasi, 102-xonadon',
    items: [
      { id: 'prod-8', name: 'Erkaklar uchun Premium Paxtali Klassik Kurtka', price: 650000, quantity: 1, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80' }
    ],
    deliveryType: 'express',
    deliveryPrice: 55000,
    paymentMethod: 'Naqd pul (Yetkazilganda)',
    subtotal: 650000,
    discountAmount: 0,
    total: 705000,
    status: 'Tayyorlanmoqda',
    createdAt: '2026-08-29T09:00:00.000Z'
  }
];

export const BANNERS = [
  {
    id: 'banner-1',
    title: 'Katta Yozgi Chegirmalar — 30% gacha!',
    subtitle: 'Eng so\'nggi smartfonlar, noutbuklar va maishiy texnika vositalariga maxsus chegirmalar.',
    tag: 'Faqat shu hafta',
    bgGradient: 'from-indigo-600 via-indigo-700 to-purple-800',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Xarid qilish',
    categoryTarget: 'smartphones'
  },
  {
    id: 'banner-2',
    title: 'M3 Protsessorli Apple MacBook modellari',
    subtitle: 'Tezkor yetkazib berish va 1 yillik rasmiy kafolat bilan!',
    tag: 'Yangi kolleksiya',
    bgGradient: 'from-slate-900 via-slate-800 to-indigo-950',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Batafsil ko\'rish',
    categoryTarget: 'laptops'
  },
  {
    id: 'banner-3',
    title: 'Kitoblar va Shaxsiy Rivojlanish',
    subtitle: 'Dunyo bestsellerlari endi o\'zbek tilida eng qulay narxlarda.',
    tag: 'Bestsellerlar',
    bgGradient: 'from-amber-600 via-orange-600 to-red-700',
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1200&auto=format&fit=crop&q=80',
    buttonText: 'Kitoblarni tanlash',
    categoryTarget: 'books'
  }
];

