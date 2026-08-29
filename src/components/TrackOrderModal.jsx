import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  X,
  Truck,
  Search,
  PackageCheck,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Package
} from 'lucide-react';

const STATUS_STEPS = [
  { key: 'Yangi', label: 'Qabul qilindi', desc: 'Buyurtma tizimda ro\'yxatga olindi' },
  { key: 'Tayyorlanmoqda', label: 'Tayyorlanmoqda', desc: 'Omborda tekshirilib, qadoqlanmoqda' },
  { key: 'Yetkazilmoqda', label: 'Yo\'lda / Kuryerda', desc: 'Kuryer ko\'rsatilgan manzilga yetkazmoqda' },
  { key: 'Yetkazib berildi', label: 'Yetkazib berildi', desc: 'Mijozga muvaffaqiyatli topshirildi' }
];

export default function TrackOrderModal() {
  const { isTrackOrderOpen, setIsTrackOrderOpen, orders } = useStore();
  const [searchId, setSearchId] = useState('');
  const [searchedOrder, setSearchedOrder] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isTrackOrderOpen) return null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const clean = searchId.trim().toUpperCase().replace('#', '');
    const found = orders.find(
      (o) => o.id.toUpperCase() === clean || o.id.toUpperCase() === `ORD-${clean}`
    );
    setSearchedOrder(found || null);
    setHasSearched(true);
  };

  const getStepIndex = (status) => {
    switch (status) {
      case 'Yangi':
        return 0;
      case 'Tayyorlanmoqda':
        return 1;
      case 'Yetkazilmoqda':
        return 2;
      case 'Yetkazib berildi':
        return 3;
      case 'Bekor qilindi':
        return -1;
      default:
        return 0;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Buyurtma holatini kuzatish
              </h2>
              <p className="text-xs text-slate-400">
                Buyurtma raqamini kiritib, kuryer holatini bilib oling
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setIsTrackOrderOpen(false);
              setSearchedOrder(null);
              setHasSearched(false);
              setSearchId('');
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Package className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Buyurtma kodi (masalan: ORD-98241)"
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none dark:text-slate-100"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors"
            >
              Tekshirish
            </button>
          </form>

          {/* Search Result */}
          {hasSearched && !searchedOrder && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>Bunday raqamli buyurtma topilmadi. Raqamni to'g'ri kiritganingizni tekshiring.</span>
            </div>
          )}

          {searchedOrder && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold block">Buyurtma</span>
                  <strong className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    #{searchedOrder.id}
                  </strong>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    searchedOrder.status === 'Yetkazib berildi'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                      : searchedOrder.status === 'Bekor qilindi'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  }`}
                >
                  {searchedOrder.status}
                </span>
              </div>

              {/* Progress Stepper */}
              {searchedOrder.status !== 'Bekor qilindi' ? (
                <div className="space-y-4 py-2">
                  {STATUS_STEPS.map((step, idx) => {
                    const currentIdx = getStepIndex(searchedOrder.status);
                    const isCompleted = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={step.key} className="flex items-start gap-3 relative">
                        {idx < STATUS_STEPS.length - 1 && (
                          <div
                            className={`absolute left-3 top-7 bottom-0 w-0.5 -mb-4 ${
                              idx < currentIdx ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        )}

                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 z-10 ${
                            isCompleted
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                          }`}
                        >
                          {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>

                        <div>
                          <p
                            className={`text-xs font-bold ${
                              isCurrent
                                ? 'text-indigo-600 dark:text-indigo-400'
                                : isCompleted
                                ? 'text-slate-800 dark:text-slate-200'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </p>
                          <p className="text-[11px] text-slate-400">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 text-xs">
                  Ushbu buyurtma bekor qilingan.
                </div>
              )}

              {/* Meta details */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs space-y-1.5 text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-400">Manzil:</span>
                  <span className="font-semibold">{searchedOrder.region}, {searchedOrder.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Summa:</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">
                    {searchedOrder.total.toLocaleString()} so'm
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
