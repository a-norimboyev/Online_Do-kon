import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Heart,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function WishlistModal() {
  const {
    isWishlistOpen,
    setIsWishlistOpen,
    wishlist,
    products,
    toggleWishlist,
    addToCart,
    setSelectedProductDetail
  } = useStore();

  if (!isWishlistOpen) return null;

  const likedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    likedProducts.forEach(prod => {
      if (prod.stock > 0) {
        addToCart(prod, 1);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[85vh] flex flex-col animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <Heart className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Sevimlilar ro'yxati (Tanlanganlar)
              </h2>
              <p className="text-xs text-slate-400">
                {likedProducts.length} ta saqlangan mahsulot
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {likedProducts.length > 0 && (
              <button
                onClick={handleAddAllToCart}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 text-xs font-bold transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Barchasini savatga olish</span>
              </button>
            )}
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {likedProducts.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/40 flex items-center justify-center text-rose-400 mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 mb-1">
              Sevimlilar ro'yxati bo'sh
            </h3>
            <p className="text-xs text-slate-400 max-w-xs mb-6">
              Mahsulot kartasidagi yurakcha (❤️) tugmasini bosib, sizga yoqqan tovarlarni shu yerga saqlang!
            </p>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all"
            >
              Mahsulotlarni ko'rish
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {likedProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 hover:border-indigo-500/30 transition-all"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-white dark:bg-slate-900 border border-slate-200/50 flex-shrink-0 cursor-pointer"
                  onClick={() => {
                    setIsWishlistOpen(false);
                    setSelectedProductDetail(product);
                  }}
                />

                <div className="flex-1 min-w-0">
                  <h4
                    onClick={() => {
                      setIsWishlistOpen(false);
                      setSelectedProductDetail(product);
                    }}
                    className="text-xs font-bold text-slate-800 dark:text-slate-100 line-clamp-1 hover:text-indigo-600 cursor-pointer"
                  >
                    {product.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                      {product.price.toLocaleString()} so'm
                    </span>
                    <span className={`text-[10px] font-semibold ${product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {product.stock > 0 ? `Omborda: ${product.stock} ta` : 'Tugagan'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={product.stock <= 0}
                    className="flex items-center gap-1 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors disabled:opacity-50"
                    title="Savatga qo'shish"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Savatga</span>
                  </button>

                  <button
                    onClick={() => toggleWishlist(product)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="O'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
