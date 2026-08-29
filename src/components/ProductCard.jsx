import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, Zap, Eye, Check, Clock, CheckCircle } from 'lucide-react';

export default function ProductCard({ product }) {
  const {
    addToCart,
    cart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductDetail,
    setIsCheckoutOpen
  } = useStore();

  const isLiked = isInWishlist(product.id);
  const cartItem = cart.find(i => i.id === product.id);
  const inCart = !!cartItem;

  // Monthly installment estimate (12 months)
  const monthlyPrice = Math.round(product.price / 12);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => setSelectedProductDetail(product)}
      className="group relative flex flex-col justify-between bg-white dark:bg-[#1F2026] rounded-2xl p-2.5 sm:p-3 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* 1. Top Image & Badges */}
      <div className="relative w-full aspect-[4/5] rounded-xl bg-[#F2F4F7] dark:bg-slate-800 overflow-hidden mb-2.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Uzum Style Top-Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.discount > 0 ? (
            <>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase text-white bg-[#7000FF] shadow-sm tracking-wider">
                AKSIYA
              </span>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase text-white bg-[#FF007A] shadow-sm tracking-wider">
                ARZON NARX KAFOLATI
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-bold text-white bg-[#7000FF]/90 shadow-sm">
                <Clock className="w-2.5 h-2.5" />
                <span>2 KUN</span>
              </span>
            </>
          ) : product.badge ? (
            <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase text-white bg-[#7000FF] shadow-sm">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Like (Wishlist) Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-md transition-all duration-200 ${
            isLiked
              ? 'bg-white text-rose-500 shadow-md scale-110'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-400 hover:text-rose-500'
          }`}
          title={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom of Image: Original Badge */}
        <div className="absolute bottom-1.5 left-1.5 z-10">
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/90 dark:bg-slate-900/90 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold shadow-sm">
            <CheckCircle className="w-2.5 h-2.5" />
            <span>ORIGINAL</span>
          </span>
        </div>
      </div>

      {/* 2. Product Details & Prices (Uzum Market Exact Layout) */}
      <div className="flex-1 flex flex-col justify-between">
        {/* Prices Section */}
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
              {product.price.toLocaleString()} <span className="text-xs font-semibold">so'm</span>
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-[11px] text-slate-400 line-through">
                {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Uzum Yellow Installment Pill */}
          <div className="mt-1">
            <span className="inline-block px-1.5 py-0.5 rounded bg-[#FFFF00] text-slate-950 font-extrabold text-[10px] tracking-tight">
              {monthlyPrice.toLocaleString()} so'm/oyiga
            </span>
            {product.discount > 0 && (
              <span className="text-[10px] text-[#FF007A] font-bold ml-1.5">
                Arzonlashdi
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xs font-normal text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight mt-1.5 group-hover:text-[#7000FF] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating & Reviews */}
        <div className="mt-2 pt-1.5">
          <div className="flex items-center gap-1 text-[11px] text-slate-500 mb-2">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span className="font-bold text-slate-800 dark:text-slate-200">{product.rating}</span>
            <span className="text-[10px] text-slate-400">({product.reviewsCount || 0} sharhlar)</span>
          </div>

          {/* Uzum Full-Width Purple Action Button: "Ertaga" */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            className={`w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
              inCart
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-[#7000FF] hover:bg-[#5E00D6] text-white active:scale-95'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {inCart ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Savatda ({cartItem.quantity})</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Ertaga</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
