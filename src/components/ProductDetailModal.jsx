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
  Flame,
  CreditCard,
  Check
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
    setIsCheckoutOpen
  } = useStore();

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isLiked = isInWishlist(product.id);
  const cartItem = cart.find(i => i.id === product.id);
  const inCart = !!cartItem;

  const [activeImage, setActiveImage] = useState(
    product.gallery && product.gallery.length ? product.gallery[0] : product.image
  );
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showFullDetails, setShowFullDetails] = useState(false);

  // Review Form
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.gallery && product.gallery.length ? product.gallery[0] : product.image);
      setQuantity(1);
      setShowFullDetails(false);
    }
  }, [product?.id]);

  const monthlyPrice = Math.round((product.price * quantity) / 12);

  const handleAddToCart = () => {
    addToCart(product, quantity);
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

  const galleryList = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image, product.image];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-[#1F2026] rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden my-8 max-h-[92vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Close Button */}
        <button
          onClick={() => setSelectedProductDetail(null)}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#F2F4F7] dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Left: Product Image & Gallery */}
            <div className="md:col-span-5 space-y-4">
              <div className="relative w-full aspect-square rounded-2xl bg-[#F2F4F7] dark:bg-slate-800 overflow-hidden border border-slate-100 dark:border-slate-800">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                    isLiked
                      ? 'bg-white text-rose-500 shadow-md scale-110'
                      : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Thumbnails */}
              {galleryList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {galleryList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-14 h-14 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImage === img
                          ? 'border-[#7000FF] ring-2 ring-[#7000FF]/20 scale-105'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Toggle Full Specs & Reviews Button (Uzum Style) */}
              <button
                onClick={() => setShowFullDetails(!showFullDetails)}
                className="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-[#7000FF] dark:hover:border-[#7000FF] text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between transition-all group"
              >
                <span>Mahsulot haqidagi bor ma'lumot</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#7000FF] group-hover:translate-x-1 transition-all" />
              </button>
            </div>

            {/* Right: Uzum Product Details & Purchase Form */}
            <div className="md:col-span-7 space-y-4">
              {/* Title & Warranty */}
              <div>
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewsCount || 0} sharhlar)</span>
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>KAFOLAT: 1 YIL</span>
                  </span>
                </div>
              </div>

              {/* Color / Variant Selector */}
              <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Rang: <span className="font-normal text-slate-500">Asosiy</span>
                </span>
                <div className="flex items-center gap-2">
                  {[0, 1, 2].map((v) => (
                    <button
                      key={v}
                      onClick={() => setSelectedVariant(v)}
                      className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
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

              {/* Quantity Counter & Stock Status */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Miqdor:
                </span>
                <div className="flex items-center gap-4">
                  <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-[#7000FF] font-semibold">
                    <Flame className="w-4 h-4 fill-current" />
                    <span>{product.stock} dona xarid qilish mumkin</span>
                  </div>
                </div>
              </div>

              {/* Price Block (Uzum Market Exact Layout) */}
              <div className="pt-2">
                <span className="inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase text-white bg-[#FF007A] mb-1">
                  ARZON NARX KAFOLATI &gt;
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl sm:text-3xl font-black text-[#FF007A] tracking-tight">
                    {(product.price * quantity).toLocaleString()} so'm
                  </span>
                  {product.oldPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      {(product.oldPrice * quantity).toLocaleString()} so'm
                    </span>
                  )}
                </div>
              </div>

              {/* Installment Badge Card (Uzum Market Style) */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#F2F4F7] dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/50 cursor-pointer hover:bg-[#E8E3FF] dark:hover:bg-[#2F1B5C] transition-colors group">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 rounded-md bg-[#FFFF00] text-slate-950 font-black text-xs">
                    Oyiga {monthlyPrice.toLocaleString()} so'mdan
                  </span>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    muddatli to'lov
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#7000FF] group-hover:translate-x-1 transition-all" />
              </div>

              {/* Big Purple Action Button: "Savatga qo'shish / Ertaga yetkazib beramiz" */}
              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#7000FF] hover:bg-[#5E00D6] active:scale-[0.99] text-white shadow-lg shadow-purple-500/25 transition-all text-center group disabled:opacity-50"
              >
                <span className="block text-sm font-black tracking-wide">
                  {inCart ? `Savatda (${cartItem.quantity} dona) — Yana qo'shish` : "Savatga qo'shish"}
                </span>
                <span className="block text-[11px] text-purple-200 font-medium mt-0.5">
                  Ertaga yetkazib beramiz
                </span>
              </button>

              {/* 3 Uzum Delivery & Service Trust Cards */}
              <div className="space-y-2.5 pt-2">
                {/* 1. Yetkazib berish */}
                <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900/50">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Ertaga yetkazib beramiz
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Uzum buyurtmalarni topshirish punktida yoki kuryer orqali
                  </p>
                </div>

                {/* 2. To'lov usullari */}
                <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900/50">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Qulay usulda xavfsiz to'lov
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Karta orqali, naqd pulda yoki bo'lib to'lang
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-2">
                    {['Payme', 'Click', 'Uzum', 'Uzcard', 'Humo', 'VISA'].map((b) => (
                      <span
                        key={b}
                        className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[9px] font-black text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 3. Qaytarish */}
                <div className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800 bg-[#FAFAFA] dark:bg-slate-900/50">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Qaytarish oson va tez
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Tovarlarni 10 kun ichida qabul qilamiz va darhol pulingizni qaytaramiz
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Collapsible Full Specs & Reviews Section */}
          {showFullDetails && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-6 animate-fade-in">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
                  Texnik Parametrlar (Xususiyatlari)
                </h3>
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(product.specs).map(([key, val], idx) => (
                      <div
                        key={idx}
                        className="flex justify-between p-3 rounded-xl bg-[#F2F4F7] dark:bg-slate-800/60 text-xs"
                      >
                        <span className="text-slate-500">{key}:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{val}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">Standart zavod komplektatsiyasi.</p>
                )}
              </div>

              {/* Reviews List & Submission */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Mijozlar Sharhlari ({product.reviewsCount || 0})
                </h3>

                <form onSubmit={handleAddReview} className="p-4 rounded-2xl bg-[#F2F4F7] dark:bg-slate-800/60 space-y-3">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    O'z fikringizni qoldiring
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      placeholder="Ismingiz..."
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-semibold"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500">Bahoyingiz:</span>
                      <div className="flex gap-1 text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setReviewRating(s)}
                            className="p-1 hover:scale-125 transition-transform"
                          >
                            <Star className={`w-4 h-4 ${s <= reviewRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Mahsulot haqida fikringiz..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-[#7000FF] hover:bg-[#5E00D6] text-white text-xs font-bold shadow-md"
                  >
                    Sharh qoldirish
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800 dark:text-slate-200">{rev.author}</span>
                          <div className="flex items-center gap-0.5 text-amber-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3 h-3 ${s <= rev.rating ? 'fill-amber-400' : 'text-slate-200'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 italic">Hozircha sharhlar yo'q. Birinchi bo'lib fikr bildiring!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
