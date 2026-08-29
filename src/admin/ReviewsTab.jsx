import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageSquare, Star, Trash2, CheckCircle2, User, Package } from 'lucide-react';

export default function ReviewsTab() {
  const { products, deleteReview } = useStore();

  // Aggregate all reviews across all products
  const allReviews = [];
  products.forEach((prod) => {
    if (prod.reviews && prod.reviews.length > 0) {
      prod.reviews.forEach((rev) => {
        allReviews.push({
          ...rev,
          productId: prod.id,
          productName: prod.name,
          productImage: prod.image
        });
      });
    }
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Sharhlar Moderatsiyasi (Reviews)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Xaridorlar tomonidan qoldirilgan fikr-mulohazalarni nazorat qilish va moderatsiya qilish
        </p>
      </div>

      {allReviews.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            Hozircha sharhlar mavjud emas
          </h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allReviews.map((rev) => (
            <div
              key={`${rev.productId}-${rev.id}`}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                {/* Product Reference */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <img
                      src={rev.productImage}
                      alt=""
                      className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                    />
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {rev.productName}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteReview(rev.productId, rev.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                    title="Sharhni o'chirish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Author and Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center font-bold text-[10px]">
                      {rev.author.charAt(0)}
                    </div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {rev.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'fill-amber-400' : 'text-slate-200 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-600 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Tasdiqlangan</span>
                </span>
                <span>{rev.date}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

