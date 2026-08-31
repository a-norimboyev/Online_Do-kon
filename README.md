# 🛍️ Online Do'kon — Internet Magazin & Admin Paneli

Zamonaviy, qulay va to'liq o'zbek tilidagi elektron tijorat (E-commerce) platformasi va do'kon egasi uchun kuchli boshqaruv paneli (Admin Dashboard).

---

## 🚀 Texnologiyalar Steki

- **Frontend**: React 18 (Hooks, Context API, LocalStorage persistence)
- **Build vositasi**: Vite
- **Dizayn & Stillar**: Tailwind CSS + Glassmorphism + Responsive Design
- **Piktogrammalar**: Lucide React
- **Statistika & Grafika**: Chart.js & react-chartjs-2

---

## ✨ Asosiy Imkoniyatlar

### 1. 🛒 Mijozlar Do'koni (Storefront)
* **Tovarlar katalogi**: Yuqori sifatli rasmlar, toifalar, qidiruv, narx va reyting filtrlari, saralash.
* **Savat (Korzinka)**: Yon panel (Drawer), miqdor boshqaruvi (+/-), o'chirish, promo-kodlar (`YANGI2026`, `CHEGIRMA50`, `SUPERDISCOUNT`).
* **Yetkazib berish va To'lov**: O'zbekiston viloyatlari bo'yicha yetkazib berish (Standart, Express, Olib ketish punkti), to'lov usullari (Payme, Click, Uzum, Naqd).
* **Elektron Chek (Receipt)**: Buyurtma kodi (`#ORD-XXXXX`), kvitansiya va chop etish (Print) imkoniyati.
* **Like (Sevimlilar / Wishlist)**: Tovarlarni saqlash va bitta tugma bilan savatga ko'chirish.
* **Sharhlar va Reyting**: Xaridorlar izohlari va yangi sharh qoldirish formasi.
* **1-klikda tezkor xarid**: 5 soniyada buyurtma berish.
* **Buyurtmani kuzatish**: Buyurtma ID bo'yicha real-vaqt holati.
* **Tungi va Kunduzgi rejim**: Dark / Light mode almashtirgich.

### 2. 📊 Super Foydalanuvchi Admin Paneli
* **Bosh sahifa (Dashboard)**: Jami daromad, buyurtmalar soni, ombor qoldig'i, savdo o'sish grafigi va toifalar diagrammasi.
* **Tovarlar CRUD**: Yangi tovar va rasmlar qo'shish, tahrirlash, o'chirish, ombor zaxirasini nazorat qilish.
* **🌐 Ochiq Internet API Import**: Jonli **DummyJSON API** (190+ tovar) va **FakeStore API** orqali tovarlar, rasmlar, sharhlar va parametrlarni valyuta kursiga qarab so'mda avtomatik do'konga import qilish.
* **Kategoriyalar**: Yangi toifalar ochish va boshqarish.
* **Buyurtmalar nazorati**: Tushgan barcha buyurtmalar ro'yxati va statusini o'zgartirish (*Yangi*, *Tayyorlanmoqda*, *Yetkazilmoqda*, *Yetkazib berildi*, *Bekor qilindi*).
* **Promo-kodlar**: Chegirma kuponlarini yaratish.
* **Sharhlar moderatsiyasi**: Foydalanuvchilar sharhlarini ko'rish va o'chirish.

---

## 🛠️ Loyihani Ishga Tushirish

### 1. Paketlarni o'rnatish:
```bash
npm install
```

### 2. Dasturni ishga tushirish (Development server):
```bash
npm run dev
```

### 3. Production uchun yig'ish (Build):
```bash
npm run build
```

