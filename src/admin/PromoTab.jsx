import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Tag, Plus, Trash2, X, Percent, DollarSign, CheckCircle2 } from 'lucide-react';

export default function PromoTab() {
  const { promos, addPromo, deletePromo } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('percent'); // 'percent' | 'fixed'
  const [discountValue, setDiscountValue] = useState('');
  const [minAmount, setMinAmount] = useState('100000');
  const [description, setDescription] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    const payload = {
      code: code.trim().toUpperCase(),
      minAmount: Number(minAmount) || 0,
      description: description.trim() || `${discountValue}${discountType === 'percent' ? '%' : " so'm"} chegirma`
    };

    if (discountType === 'percent') {
      payload.discountPercent = Number(discountValue);
    } else {
      payload.fixedDiscount = Number(discountValue);
    }

    addPromo(payload);
    setCode('');
    setDiscountValue('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Promo-kodlar & Chegirmalar
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Xaridorlar uchun chegirma kuponlarini yaratish va boshqarish
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi promo-kod yaratish</span>
        </button>
      </div>

      {/* Promos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {promos.map((promo) => (
          <div
            key={promo.code}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-amber-500/40 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-sm font-black tracking-wider uppercase border border-indigo-200 dark:border-indigo-800">
                  {promo.code}
                </span>

                <button
                  onClick={() => deletePromo(promo.code)}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="O'chirish"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-white">
                {promo.discountPercent ? `${promo.discountPercent}% Chegirma` : `${(promo.fixedDiscount || 0).toLocaleString()} so'm Chegirma`}
              </h4>
              <p className="text-xs text-slate-400 mt-1">{promo.description}</p>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500">
              Minimal xarid miqdori: <strong>{(promo.minAmount || 0).toLocaleString()} so'm</strong>
            </div>
          </div>
        ))}
      </div>

      {/* Create Promo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Yangi promo-kod yaratish
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Promo-kod nomi (Kupon kodi) *
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Masalan: OZBEKISTON2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase font-black focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Chegirma turi
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  >
                    <option value="percent">Foizda (%)</option>
                    <option value="fixed">Aniq summada (so'm)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Qiymati *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percent' ? '15' : '50000'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Minimal buyurtma miqdori (so'm)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="100000"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tavsif (Qisqacha izoh)
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Katta chegirma aksiyasi uchun"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-md"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
