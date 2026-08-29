import React from 'react';
import { useStore } from '../context/StoreContext';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  Users,
  CheckCircle2,
  Clock,
  Truck,
  Eye
} from 'lucide-react';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

export default function DashboardTab() {
  const {
    products,
    orders,
    categories,
    updateOrderStatus,
    setAdminActiveTab,
    theme
  } = useStore();

  // Financial and Operational KPIs
  const totalRevenue = orders.reduce((sum, ord) => {
    return ord.status !== 'Bekor qilindi' ? sum + ord.total : sum;
  }, 0);

  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'Yetkazib berildi').length;
  const pendingOrders = orders.filter(o => o.status === 'Yangi' || o.status === 'Tayyorlanmoqda').length;
  const lowStockProducts = products.filter(p => p.stock <= 3);

  // Sales dynamic chart data (mock past 6 months data combined with live orders)
  const isDark = theme === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)';

  const lineChartData = {
    labels: ['Mart', 'Aprel', 'May', 'Iyun', 'Iyul', 'Avgust (Joriy)'],
    datasets: [
      {
        label: "Oylik tushum (million so'm)",
        data: [42, 58, 65, 82, 94, Math.round(totalRevenue / 1000000) || 112],
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.12)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#ffffff',
        pointHoverRadius: 6,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.raw} mln so'm`
        }
      }
    },
    scales: {
      x: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } }
      },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { size: 11 } }
      }
    }
  };

  // Category Distribution Doughnut Data
  const catLabels = categories.filter(c => c.id !== 'all').map(c => c.name);
  const catCounts = categories.filter(c => c.id !== 'all').map(cat => {
    return products.filter(p => p.category === cat.id).length;
  });

  const doughnutData = {
    labels: catLabels,
    datasets: [
      {
        data: catCounts.map(count => (count === 0 ? 1 : count)),
        backgroundColor: [
          '#6366f1',
          '#f59e0b',
          '#10b981',
          '#ec4899',
          '#8b5cf6',
          '#06b6d4',
          '#f97316'
        ],
        borderWidth: 2,
        borderColor: isDark ? '#0f172a' : '#ffffff'
      }
    ]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 10,
          font: { size: 11 },
          color: textColor
        }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Boshqaruv Paneli (Dashboard)
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Do'koningizning real-vaqt tahliliy ko'rsatkichlari va so'nggi savdo harakatlari
          </p>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Revenue */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Jami Tushum
            </span>
            <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {totalRevenue.toLocaleString()} <span className="text-xs font-semibold text-slate-400">so'm</span>
          </h3>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>O'tgan oyga nisbatan +18.4%</span>
          </p>
        </div>

        {/* Card 2: Total Orders */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Jami Buyurtmalar
            </span>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {totalOrders} ta
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-2">
            {completedOrders} ta yetkazildi • {pendingOrders} ta kutilmoqda
          </p>
        </div>

        {/* Card 3: Total Products */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Mahsulotlar Bazasi
            </span>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {products.length} xil tovar
          </h3>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-2">
            {categories.length - 1} ta toifada taqsimlangan
          </p>
        </div>

        {/* Card 4: Low Stock Alert */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Kam qolgan tovarlar
            </span>
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white">
            {lowStockProducts.length} ta
          </h3>
          <p className="text-xs text-rose-600 dark:text-rose-400 font-semibold mt-2">
            Zaxirani to'ldirish talab etiladi
          </p>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart: Revenue */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Savdolar Dinamikasi
              </h3>
              <p className="text-xs text-slate-400">Oylar bo'yicha daromad o'sish ko'rsatkichi</p>
            </div>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Doughnut Chart: Categories */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Toifalar bo'yicha Tovar Ulushi
            </h3>
            <p className="text-xs text-slate-400">Tovarlar toifalarga bo'linishi</p>
          </div>
          <div className="h-64 sm:h-72 w-full">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                So'nggi Buyurtmalar
              </h3>
              <p className="text-xs text-slate-400">Eng oxirgi kelib tushgan buyurtmalar</p>
            </div>
            <button
              onClick={() => setAdminActiveTab('orders')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Barchasini ko'rish →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-semibold">
                <tr>
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Xaridor</th>
                  <th className="py-3 px-2">Summa</th>
                  <th className="py-3 px-2">Holat</th>
                  <th className="py-3 px-2 text-right">O'zgartirish</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="py-3 px-2 font-bold text-indigo-600 dark:text-indigo-400">
                      #{order.id}
                    </td>
                    <td className="py-3 px-2">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-slate-400">{order.phone}</span>
                    </td>
                    <td className="py-3 px-2 font-bold text-slate-900 dark:text-white">
                      {order.total.toLocaleString()} so'm
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          order.status === 'Yetkazib berildi'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : order.status === 'Bekor qilindi'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                        className="text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 focus:ring-1 focus:ring-indigo-500"
                      >
                        <option value="Yangi">Yangi</option>
                        <option value="Tayyorlanmoqda">Tayyorlanmoqda</option>
                        <option value="Yetkazilmoqda">Yetkazilmoqda</option>
                        <option value="Yetkazib berildi">Yetkazib berildi</option>
                        <option value="Bekor qilindi">Bekor qilindi</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Products List */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kam Qolgan Tovarlar
              </h3>
              <p className="text-xs text-slate-400">Qoldig'i 3 tadan kam mahsulotlar</p>
            </div>
            <button
              onClick={() => setAdminActiveTab('products')}
              className="text-xs font-bold text-amber-500 hover:underline"
            >
              Katalog →
            </button>
          </div>

          <div className="space-y-3">
            {lowStockProducts.length > 0 ? (
              lowStockProducts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 border border-rose-100 dark:border-rose-900/50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                        {p.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">{p.price.toLocaleString()} so'm</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500 text-white">
                    {p.stock} dona
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-emerald-600 font-semibold py-8 text-center">
                Barcha tovarlar zaxirasi yetarli darajada!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
