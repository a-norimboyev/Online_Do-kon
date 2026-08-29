import React from 'react';
import { useStore } from '../context/StoreContext';
import { Heart, ShoppingBag, Star, Zap, Eye, Check } from 'lucide-react';

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

  const handleQuickBuy = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  return (
    <div
      onClick={() => setSelectedProductDetail(product)}
      className="group relative flex flex-col justify-between bg-white dark:bg-slate-900 rounded-3xl p-3 sm:p-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Top Image Section */}
      <div className="relative w-full aspect-square rounded-2xl bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3.5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.badge && (
            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md ${
              product.badge === 'Xit savdo' ? 'bg-amber-500' :
              product.badge === 'Yangi' ? 'bg-indigo-600' :
              product.badge === 'Bestseller' ? 'bg-purple-600' : 'bg-emerald-600'
            }`}>
              {product.badge}
            </span>
          )}
          {product.discount > 0 && (
            <span className="px-2 py-0.5 rounded-lg text-[10px] font-extrabold text-white bg-rose-500 shadow-md">
              -{product.discount}%
            </span>
          )}
        </div>

        {/* Like (Wishlist) button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all duration-200 ${
            isLiked
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30 scale-110'
              : 'bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-500'
          }`}
          title={isLiked ? "Sevimlilardan o'chirish" : "Sevimlilarga qo'shish"}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
        </button>

        {/* Quick View overlay on hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-xs font-semibold backdrop-blur-sm shadow-md">
            <Eye className="w-3.5 h-3.5" />
            Batafsil
          </span>
        </div>
      </div>

      {/* Product Information */}
      <div className="flex-1 flex flex-col">
        {/* Rating & Stock */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount || 0})</span>
          </div>

          <span className={`text-[11px] font-semibold ${product.stock > 3 ? 'text-emerald-600 dark:text-emerald-400' : product.stock > 0 ? 'text-amber-500' : 'text-rose-500'}`}>
            {product.stock > 3 ? 'Omborda bor' : product.stock > 0 ? `Qoldiq: ${product.stock} ta` : 'Tugagan'}
          </span>
        </div>

        {/* Product Title */}
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {product.name}
        </h3>

        {/* Monthly installment badge */}
        <div className="mb-3">
          <span className="inline-block px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-semibold border border-amber-200/60 dark:border-amber-800/40">
            Oyiga {monthlyPrice.toLocaleString()} so'mdan
          </span>
        </div>

        {/* Prices */}
        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
              {product.price.toLocaleString()} <span className="text-xs font-medium text-slate-500">so'm</span>
            </span>
            {product.oldPrice && product.oldPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {product.oldPrice.toLocaleString()} so'm
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleQuickBuy}
              disabled={product.stock <= 0}
              className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-amber-400 hover:text-slate-950 transition-colors text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed"
              title="1-klikda tezkor xarid"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-klikda</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              disabled={product.stock <= 0}
              className={`flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-xs font-bold transition-all ${
                inCart
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title="Savatga qo'shish"
            >
              {inCart ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Savatda ({cartItem.quantity})</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Savatga</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
