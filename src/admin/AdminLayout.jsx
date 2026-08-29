import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Tag,
  MessageSquare,
  Store,
  RotateCcw,
  Moon,
  Sun,
  ShieldCheck,
  Menu,
  X,
  Plus
} from 'lucide-react';
import DashboardTab from './DashboardTab';
import ProductsTab from './ProductsTab';
import CategoriesTab from './CategoriesTab';
import OrdersTab from './OrdersTab';
import PromoTab from './PromoTab';
import ReviewsTab from './ReviewsTab';

export default function AdminLayout() {
  const {
    adminActiveTab,
    setAdminActiveTab,
    setCurrentView,
    theme,
    toggleTheme,
    resetDemoData,
    products,
    orders
  } = useStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'Yangi' || o.status === 'Tayyorlanmoqda').length;
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  const NAV_ITEMS = [
    { id: 'dashboard', label: 'Boshqaruv Paneli (Dashboard)', icon: LayoutDashboard },
    { id: 'products', label: 'Tovarlar Boshqaruvi (CRUD)', icon: Package, badge: lowStockCount ? `${lowStockCount} ta kam` : null, badgeColor: 'bg-rose-500' },
    { id: 'categories', label: 'Kategoriyalar', icon: FolderTree },
    { id: 'orders', label: 'Buyurtmalar Nazorati', icon: ShoppingBag, badge: pendingOrdersCount ? `${pendingOrdersCount} ta yangi` : null, badgeColor: 'bg-indigo-600' },
    { id: 'promos', label: 'Promo-kodlar & Chegirmalar', icon: Tag },
    { id: 'reviews', label: 'Sharhlar Moderatsiyasi', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
      {/* Mobile Top bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-sm font-black">Admin Paneli</span>
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-5 flex flex-col justify-between transition-transform duration-200 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Admin Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white leading-none">
                  Admin Paneli
                </h2>
                <span className="text-[10px] font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                  Super Foydalanuvchi
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = adminActiveTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminActiveTab(item.id);
                    setIsSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold text-white ${
                        isActive ? 'bg-black/20' : item.badgeColor
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentView('store')}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Store className="w-4 h-4" />
            <span>Do'konga qaytish</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={resetDemoData}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 text-slate-600 dark:text-slate-400 text-[11px] font-semibold transition-colors"
              title="Barcha ma'lumotlarni boshlang'ich holatga qaytarish"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Tema"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content View */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto max-w-7xl">
        {adminActiveTab === 'dashboard' && <DashboardTab />}
        {adminActiveTab === 'products' && <ProductsTab />}
        {adminActiveTab === 'categories' && <CategoriesTab />}
        {adminActiveTab === 'orders' && <OrdersTab />}
        {adminActiveTab === 'promos' && <PromoTab />}
        {adminActiveTab === 'reviews' && <ReviewsTab />}
      </main>
    </div>
  );
}
