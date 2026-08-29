import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Eye,
  Printer,
  X,
  MapPin,
  CreditCard,
  Phone,
  User
} from 'lucide-react';

export default function OrdersTab() {
  const { orders, updateOrderStatus, setLatestReceipt } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [viewingOrder, setViewingOrder] = useState(null);

  const filteredOrders = orders.filter(o => {
    if (selectedStatus !== 'all' && o.status !== selectedStatus) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.region.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Buyurtmalar Nazorati (Orders)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Barcha kelib tushgan buyurtmalarni ko'rish, holatini o'zgartirish va cheklarni chop etish
        </p>
      </div>

      {/* Filter and Status tabs */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buyurtma ID, ism, telefon yoki viloyat bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['all', 'Yangi', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazib berildi', 'Bekor qilindi'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                selectedStatus === st
                  ? 'bg-amber-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {st === 'all' ? 'Barcha buyurtmalar' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Buyurtma</th>
                <th className="py-4 px-4">Xaridor</th>
                <th className="py-4 px-4">Manzil</th>
                <th className="py-4 px-4">Mahsulotlar</th>
                <th className="py-4 px-4">Jami</th>
                <th className="py-4 px-4">To'lov</th>
                <th className="py-4 px-4">Holat</th>
                <th className="py-4 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4">
                    <span className="font-black text-indigo-600 dark:text-indigo-400 block">
                      #{order.id}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('uz-UZ', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-100 block">
                      {order.customerName}
                    </span>
                    <span className="text-[11px] text-slate-400">{order.phone}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 block">
                      {order.region}
                    </span>
                    <span className="text-[11px] text-slate-400 line-clamp-1 max-w-[150px]">
                      {order.address}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {order.items.reduce((c, i) => c + i.quantity, 0)} dona
                    </span>
                    <span className="text-[11px] text-slate-400 block line-clamp-1 max-w-[120px]">
                      {order.items.map(i => i.name).join(', ')}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-slate-900 dark:text-white">
                    {order.total.toLocaleString()} so'm
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                      {order.paymentMethod}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none ${
                        order.status === 'Yetkazib berildi'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                          : order.status === 'Bekor qilindi'
                          ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                          : 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800'
                      }`}
                    >
                      <option value="Yangi">Yangi</option>
                      <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                      <option value="Yetkazilmoqda">Yetkazilmoqda</option>
                      <option value="Yetkazib berildi">Yetkazib berildi</option>
                      <option value="Bekor qilindi">Bekor qilindi</option>
                    </select>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setViewingOrder(order)}
                        className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50"
                        title="Batafsil ko'rish"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setLatestReceipt(order)}
                        className="p-2 rounded-xl text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/50"
                        title="Chekni chop etish"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Buyurtma #{viewingOrder.id} Tafsilotlari
              </h3>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
                <div>
                  <span className="text-slate-400">Xaridor:</span>
                  <p className="font-bold">{viewingOrder.customerName}</p>
                </div>
                <div>
                  <span className="text-slate-400">Telefon:</span>
                  <p className="font-bold">{viewingOrder.phone}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400">Manzil:</span>
                  <p className="font-bold">{viewingOrder.region}, {viewingOrder.address}</p>
                </div>
                {viewingOrder.comment && (
                  <div className="col-span-2">
                    <span className="text-slate-400">Izoh:</span>
                    <p className="italic text-slate-600 dark:text-slate-300">{viewingOrder.comment}</p>
                  </div>
                )}
              </div>

              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-2">Buyurtma tovarlari:</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {viewingOrder.items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                        <span className="line-clamp-1 font-semibold">{item.name}</span>
                      </div>
                      <span className="font-bold whitespace-nowrap pl-2">
                        {item.quantity} × {item.price.toLocaleString()} so'm
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                <span className="font-black text-sm">Jami To'lov:</span>
                <span className="font-black text-base text-indigo-600 dark:text-indigo-400">
                  {viewingOrder.total.toLocaleString()} so'm
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
