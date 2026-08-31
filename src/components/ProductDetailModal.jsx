import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Star,
  ShoppingBag,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Plus,
  Minus,
  MessageSquare,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Flame,
  CreditCard,
  Check,
  Store,
  Share2,
  Info,
  Layers
} from 'lucide-react';

export default function ProductDetailModal() {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    cart,
    toggleWishlist,
    isInWishlist,
    addReview,
    setIsCheckoutOpen,
    products,
    categories
  } = useStore();

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isLiked = isInWishlist(product.id);
  const cartItem = cart.find(i => i.id === product.id);
  const inCart = !!cartItem;

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedSize, setSelectedSize] = useState('10-12 yosh — 134-140 sm');
  const [installmentMonths, setInstallmentMonths] = useState(24);
  const [activeDescTab, setActiveDescTab] = useState('description'); // 'description', 'composition', 'instructions', 'sizes'

  // Review Form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const galleryList = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image, product.image];

  useEffect(() => {
    if (product) {
      setActiveImageIdx(0);
      setSelectedVariant(0);
      setInstallmentMonths(24);
      setActiveDescTab('description');
    }
  }, [product?.id]);

  const activeImage = galleryList[activeImageIdx] || product.image;

  // Installment calculation based on selected months
  const monthlyPrice = Math.round(product.price / installmentMonths);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleQuickBuy = () => {
    addToCart(product, 1);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  const handleAddReview = (e) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewText.trim()) return;

    addReview(product.id, {
      author: reviewName.trim(),
      rating: Number(reviewRating),
      comment: reviewText.trim()
    });

    setReviewName('');
    setReviewText('');
    setReviewRating(5);
  };

  // Related products
  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || Math.random() > 0.5))
    .slice(0, 5);

  const catObj = categories.find(c => c.id === product.category);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-6xl bg-white dark:bg-[#1F2026] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-4 max-h-[94vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-[#F2F4F7] dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-6 md:p-8 space-y-8 text-slate-800 dark:text-slate-200">
          {/* 1. Breadcrumbs (Uzum Market Exact) */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-400">
            <span className="hover:text-[#7000FF] cursor-pointer">Bosh sahifa</span>
            <span>&gt;</span>
            <span className="hover:text-[#7000FF] cursor-pointer">Barcha toifalar</span>
            <span>&gt;</span>
            <span className="hover:text-[#7000FF] cursor-pointer font-medium text-slate-600 dark:text-slate-300">
              {catObj ? catObj.name : "Elektronika"}
            </span>
            <span>&gt;</span>
            <span className="text-slate-500 truncate max-w-xs">{product.name}</span>
          </div>

          {/* 2. Main Product Showcase (3-Column Layout like Uzum Market) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Column A: Gallery & Thumbnails (5 cols) */}
            <div className="lg:col-span-5 flex gap-3">
              {/* Vertical Thumbnails */}
              {galleryList.length > 1 && (
                <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] no-scrollbar">
                  {galleryList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIdx(idx)}
                      className={`w-14 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImageIdx === idx
                          ? 'border-[#7000FF] ring-2 ring-[#7000FF]/20 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Main Image Container with Arrows */}
              <div className="relative flex-1 aspect-[4/5] rounded-2xl bg-[#F2F4F7] dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-800 group">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Left/Right Carousel Arrows */}
                {galleryList.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImageIdx((activeImageIdx - 1 + galleryList.length) % galleryList.length)}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setActiveImageIdx((activeImageIdx + 1) % galleryList.length)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Column B: Info & Selectors (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-slate-500 font-normal">({product.reviewsCount || 44} sharh)</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-slate-500">400+ buyurtma</span>
                </div>

                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>KAFOLAT 6 OY</span>
                  </span>
                </div>
              </div>

              {/* Color selector */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Rang: <span className="font-normal text-slate-500">Oq</span>
                </span>
                <div className="flex items-center gap-2">
                  {[0, 1].map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        selectedVariant === v
                          ? 'border-[#7000FF] ring-2 ring-[#7000FF]/20 scale-105'
                          : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selectors */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Kiyim o'lchami:
                  </span>
                </div>
                <div className="flex gap-2">
                  {['L'].map((sz) => (
                    <button
                      key={sz}
                      className="px-3.5 py-1.5 rounded-xl border-2 border-[#7000FF] bg-[#E8E3FF] text-[#7000FF] font-black text-xs"
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">
                    O'lcham: <span className="font-normal text-slate-500">{selectedSize}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      '7–9 yosh — 122–128 sm',
                      '10–12 yosh — 134–140 sm',
                      '12+ yosh — 146–152 sm'
                    ].map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedSize === sz
                            ? 'border-[#7000FF] bg-[#E8E3FF] text-[#7000FF] font-bold shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Column C: Buy Box (Sticky Right 3 cols) */}
            <div className="lg:col-span-3 space-y-3.5 p-4 sm:p-5 rounded-3xl bg-[#FAFAFA] dark:bg-[#18191E] border border-slate-200/60 dark:border-slate-800">
              {/* Price */}
              <div>
                <span className="inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase text-white bg-[#FF007A] mb-1">
                  ARZON NARX KAFOLATI &gt;
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#FF007A]">
                    {product.price.toLocaleString()} so'm
                  </span>
                </div>
                {product.oldPrice && (
                  <span className="text-xs text-slate-400 line-through block mt-0.5">
                    {product.oldPrice.toLocaleString()} so'm
                  </span>
                )}
              </div>

              {/* Installment Month Tabs (24 oy / 12 oy / 6 oy / 3 oy) */}
              <div className="space-y-2 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-[11px] font-bold text-center">
                  {[24, 12, 6, 3].map((m) => (
                    <button
                      key={m}
                      onClick={() => setInstallmentMonths(m)}
                      className={`py-1 rounded-lg transition-all ${
                        installmentMonths === m
                          ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-black'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {m} oy
                    </button>
                  ))}
                </div>

                <div className="p-2 rounded-xl bg-[#FFFF00] text-slate-950 font-black text-xs flex items-center justify-between">
                  <span>{monthlyPrice.toLocaleString()} so'm × {installmentMonths} oy</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>

              {/* 1-Click Buy & Wishlist Button */}
              <div className="flex gap-2">
                <button
                  onClick={handleQuickBuy}
                  className="flex-1 py-2.5 px-3 rounded-2xl bg-[#E8E3FF] hover:bg-[#DBCFFF] text-[#7000FF] font-bold text-xs transition-colors"
                >
                  1 klikda xarid qilish
                </button>
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`p-2.5 rounded-2xl border transition-all ${
                    isLiked
                      ? 'bg-rose-500 text-white border-rose-500'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Main Uzum Purple Button: "Savatga qo'shish" */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#7000FF] hover:bg-[#5E00D6] active:scale-[0.99] text-white shadow-lg shadow-purple-500/25 transition-all text-center group disabled:opacity-50"
              >
                <span className="block text-sm font-black">
                  {inCart ? `Savatda (${cartItem.quantity}) — Yana qo'shish` : "Savatga qo'shish"}
                </span>
                <span className="block text-[11px] text-purple-200 font-medium mt-0.5">
                  Ertaga yetkazib beramiz
                </span>
              </button>

              {/* Stock and Weekly Proof */}
              <div className="space-y-1 text-[11px] text-slate-500 pt-1">
                <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  <span>{product.stock} dona xarid qilish mumkin</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#7000FF]">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Bu haftada 187 kishi sotib oldi</span>
                </div>
              </div>

              {/* Trust Details */}
              <div className="space-y-2 pt-2 border-t border-slate-200/60 dark:border-slate-800 text-[11px]">
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">Ertaga yetkazib beramiz</strong>
                  <span className="text-slate-400">Topshirish punktiga yoki kuryer orqali</span>
                </div>
                <div>
                  <strong className="block text-slate-800 dark:text-slate-200">Qulay usulda xavfsiz to'lov</strong>
                  <span className="text-slate-400">Karta orqali, naqd pulda yoki bo'lib to'lang</span>
                  <div className="flex gap-1 mt-1 font-bold text-[9px]">
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Payme</span>
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Click</span>
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Uzum</span>
                    <span className="px-1.5 py-0.5 bg-white dark:bg-slate-800 border rounded">Humo</span>
                  </div>
                </div>
              </div>

              {/* Seller Card */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold block">Soffi Store</span>
                  <span className="text-[10px] text-amber-500 font-bold">★ 5.0 (50 baho)</span>
                </div>
                <button className="px-3 py-1.5 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-xs font-bold hover:bg-slate-300">
                  Do'konga o'tish
                </button>
              </div>
            </div>
          </div>

          {/* 3. Uzum Reviews Section (44 sharh) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-slate-900 dark:text-white">5</span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-slate-500">44 sharh</span>
            </div>

            {/* Horizontal Review Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#F2F4F7] dark:bg-slate-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Shirin</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 block">23 Avgust • O'lcham: 12+ yosh • Rang: Oq</span>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "Juda yaxshi, qizimga juda yoqdi. Yuqori sifatli paxta matosi, yuvganda cho'zilib ketmadi."
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F2F4F7] dark:bg-slate-800/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Madina B.</span>
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3.5 h-3.5 fill-current" />)}
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 block">25 Avgust • O'lcham: 10-12 yosh</span>
                <p className="text-slate-600 dark:text-slate-300 italic">
                  "Afzalliklari: Sifati yaxshi ekan. Kamchiliklari: Yo'q. Tavsiya qilaman!"
                </p>
              </div>
            </div>
          </div>

          {/* 4. Product Description Tabs (Uzum Style) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
              {[
                { id: 'description', label: 'Mahsulot tavsifi' },
                { id: 'composition', label: 'Tarkib' },
                { id: 'instructions', label: "Ko'rsatma" },
                { id: 'sizes', label: "O'lchamlar" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDescTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeDescTab === tab.id
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-[#FAFAFA] dark:bg-slate-800/40 text-xs leading-relaxed space-y-3">
              <h3 className="font-black text-sm uppercase text-slate-900 dark:text-white">
                FARZANDINGIZ SIZGA RAHMAT AYTADI
              </h3>
              <p className="text-slate-600 dark:text-slate-300">
                {product.description || "Qizingiz kun bo'yi kiyib yuradigan mahsulot shunchaki chiroyli emas, qulay ham bo'lishi kerak. Maktab, sayr, o'yinlar — kun davomida harakat ko'p, shuning uchun bolaning harakatiga xalaqit bermasligi muhim."}
              </p>
              <div className="space-y-1.5 pt-2">
                <p><strong>Baland bel:</strong> Qorin qismini yaxshiroq yopib turishi va tushib ketmasligi uchun.</p>
                <p><strong>Yassi choklar:</strong> Teriga botmaydi va noqulaylik tug'dirmaydi.</p>
                <p><strong>Tarkibi:</strong> 80% tabiiy paxta, 15% poliester, 5% elastan.</p>
              </div>
            </div>
          </div>

          {/* 5. Related Products Section (O'xshash mahsulotlar) */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              O'xshash mahsulotlar
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {relatedProducts.map((rel) => (
                <button
                  key={rel.id}
                  onClick={() => setSelectedProductDetail(rel)}
                  className="p-2.5 rounded-2xl bg-[#FAFAFA] dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 text-left group hover:shadow-md transition-all"
                >
                  <img src={rel.image} alt="" className="w-full aspect-square rounded-xl object-cover mb-2" />
                  <span className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#7000FF]">
                    {rel.name}
                  </span>
                  <span className="text-xs font-black text-[#FF007A] block mt-1">
                    {rel.price.toLocaleString()} so'm
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
