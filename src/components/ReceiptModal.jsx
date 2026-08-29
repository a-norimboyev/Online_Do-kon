import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  CheckCircle2,
  Printer,
  Copy,
  X,
  PackageCheck,
  ShoppingBag,
  MapPin,
  CreditCard,
  Truck
} from 'lucide-react';

export default function ReceiptModal() {
  const { latestReceipt, setLatestReceipt, showToast } = useStore();

  if (!latestReceipt) return null;

  const order = latestReceipt;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(order.id);
    showToast(`Buyurtma raqami (#${order.id}) nusxalandi!`, 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable Area */}
        <div id="printable-receipt" className="p-6 sm:p-8 space-y-6">
          {/* Success Banner */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-scale-in">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Buyurtmangiz qabul qilindi!
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Xaridingiz uchun tashakkur. Tez orada operatorimiz siz bilan bog'lanadi.
            </p>
          </div>

          {/* Receipt Card */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
            {/* Order meta */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Buyurtma kodi
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <strong className="text-base font-black text-indigo-600 dark:text-indigo-400">
                    #{order.id}
                  </strong>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    title="Nusxalash"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Holat
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 mt-0.5">
                  {order.status}
                </span>
              </div>
            </div>

            {/* Customer & Delivery meta */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 font-medium">Xaridor:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{order.customerName}</p>
                <p className="text-slate-500">{order.phone}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Yetkazish manzili:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{order.region}</p>
                <p className="text-slate-500 line-clamp-1">{order.address}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">To'lov turi:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">{order.paymentMethod}</p>
              </div>

              <div>
                <span className="text-slate-400 font-medium">Sana:</span>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {new Date(order.createdAt).toLocaleDateString('uz-UZ', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>

            {/* Order Items Table */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Buyurtma tarkibi:
              </span>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 dark:text-slate-300 line-clamp-1 pr-4">
                      {item.name} × <strong>{item.quantity}</strong>
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {(item.price * item.quantity).toLocaleString()} so'm
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Mahsulotlar:</span>
                <span>{order.subtotal.toLocaleString()} so'm</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Chegirma:</span>
                  <span>-{order.discountAmount.toLocaleString()} so'm</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Yetkazib berish:</span>
                <span>{order.deliveryPrice > 0 ? `${order.deliveryPrice.toLocaleString()} so'm` : 'Bepul'}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base font-black text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-700">
                <span>Jami summa:</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  {order.total.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Chekni chop etish</span>
            </button>

            <button
              onClick={() => setLatestReceipt(null)}
              className="flex-1 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-indigo-500/25 transition-colors"
            >
              <span>Tushunarli, yopish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
