import React, { useState } from 'react';
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
  CheckCircle2
} from 'lucide-react';

export default function ProductDetailModal() {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    toggleWishlist,
    isInWishlist,
    addReview,
    setIsCheckoutOpen
  } = useStore();

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isLiked = isInWishlist(product.id);

  const [activeImage, setActiveImage] = useState(
    product.gallery && product.gallery.length ? product.gallery[0] : product.image
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' or 'reviews'

  // New Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

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

  const handleQuickBuy = () => {
    addToCart(product, quantity);
    setSelectedProductDetail(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Close */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              Mahsulot tafsilotlari
            </span>
          </div>
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Gallery */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden border border-slate-200/80 dark:border-slate-700">
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {product.discount > 0 && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-extrabold text-white bg-rose-500 shadow-lg">
                    Chegirma -{product.discount}%
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.gallery && product.gallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.gallery.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        activeImage === img
                          ? 'border-indigo-600 scale-105 shadow-md'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Info and Action */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Rating & Wishlist */}
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-1.5 text-amber-500">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= Math.round(product.rating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
                    <span className="text-xs text-slate-400">({product.reviewsCount || 0} ta sharh)</span>
                  </div>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                      isLiked
                        ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 border-rose-200 dark:border-rose-900'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                    <span>{isLiked ? 'Sevimlilarda' : 'Sevimlilarga'}</span>
                  </button>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug mb-3">
                  {product.name}
                </h1>

                <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                  {product.description}
                </p>

                {/* Price block */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 mb-6">
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400">
                      {product.price.toLocaleString()} <span className="text-sm font-semibold">so'm</span>
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.oldPrice.toLocaleString()} so'm
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Muddatli to'lov: 12 oyga {(Math.round(product.price / 12)).toLocaleString()} so'mdan
                  </p>
                </div>

                {/* Quantity and Actions */}
                <div className="space-y-3">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-slate-500 uppercase">Miqdor:</span>
                    <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-800">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-l-xl text-slate-600 dark:text-slate-300"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-slate-800 dark:text-slate-200">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        disabled={quantity >= product.stock}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-r-xl text-slate-600 dark:text-slate-300 disabled:opacity-40"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-xs font-medium text-slate-400">
                      (Omborda: {product.stock} dona)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <button
                      onClick={() => addToCart(product, quantity)}
                      disabled={product.stock <= 0}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-500/25 transition-all text-sm disabled:opacity-50"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Savatga qo'shish</span>
                    </button>

                    <button
                      onClick={handleQuickBuy}
                      disabled={product.stock <= 0}
                      className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-400/25 transition-all text-sm disabled:opacity-50"
                    >
                      <Zap className="w-4 h-4" />
                      <span>1-klikda xarid qilish</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-3 gap-2 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-500">
                  <Truck className="w-4 h-4 text-indigo-500" />
                  <span>Tezkor yetkazish</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>100% Kafolat</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-[11px] font-medium text-slate-500">
                  <RotateCcw className="w-4 h-4 text-amber-500" />
                  <span>Qaytarish kafolati</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs: Specifications vs Reviews */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <button
                onClick={() => setActiveTab('specs')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
                  activeTab === 'specs'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                Xususiyatlar & Parametrlar
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
                  activeTab === 'reviews'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
                }`}
              >
                <span>Xaridorlar sharhlari</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  {product.reviews ? product.reviews.length : 0}
                </span>
              </button>
            </div>

            {/* Tab 1: Specs */}
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.specs && Object.keys(product.specs).length > 0 ? (
                  Object.entries(product.specs).map(([key, val]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs"
                    >
                      <span className="text-slate-500 font-medium">{key}</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{val}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-400 col-span-2">Ushbu tovar uchun qo'shimcha parametrlar kiritilmagan.</p>
                )}
              </div>
            )}

            {/* Tab 2: Reviews */}
            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit New Review Form */}
                <form
                  onSubmit={handleAddReview}
                  className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4"
                >
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    <span>O'z fikringiz va sharhingizni qoldiring</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Ismingiz:
                      </label>
                      <input
                        type="text"
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Masalan: Sardor"
                        className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                        Baholash:
                      </label>
                      <div className="flex items-center gap-1 pt-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-125 transition-transform"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= reviewRating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold ml-2 text-slate-700 dark:text-slate-300">
                          {reviewRating} yulduz
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                      Izoh / Fikr-mulohaza:
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Mahsulot haqidagi taassurotlaringiz..."
                      className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition-colors"
                  >
                    Sharhni yuborish
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                              {rev.author}
                            </span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Tasdiqlangan xaridor
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1 text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= rev.rating ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-600'
                              }`}
                            />
                          ))}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {rev.comment}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Hozircha sharhlar yo'q. Birinchi bo'lib o'z fikringizni qoldiring!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

