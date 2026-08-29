import React from 'react';
import { useStore } from './context/StoreContext';
import Navbar from './components/Navbar';
import BannerCarousel from './components/BannerCarousel';
import CategoryFilter from './components/CategoryFilter';
import ProductCard from './components/ProductCard';
import ProductDetailModal from './components/ProductDetailModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import ReceiptModal from './components/ReceiptModal';
import WishlistModal from './components/WishlistModal';
import TrackOrderModal from './components/TrackOrderModal';
import ToastContainer from './components/Toast';
import Footer from './components/Footer';
import AdminLayout from './admin/AdminLayout';
import { ShoppingBag, SearchX } from 'lucide-react';

function Storefront() {
  const { filteredProducts, searchQuery, selectedCategory, setSelectedCategory, setSearchQuery } = useStore();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Top Hero Offers Carousel (shows when no active search) */}
        {!searchQuery && <BannerCarousel />}

        {/* Categories & Filter Bar */}
        <CategoryFilter />

        {/* Product Grid */}
        <div className="mt-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="p-12 sm:p-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm my-6">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mx-auto mb-4">
                <SearchX className="w-8 h-8" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-2">
                Hech qanday mahsulot topilmadi
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
                Qidiruv so'zini o'zgartirib ko'ring yoki boshqa toifani tanlang.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md"
              >
                Barcha mahsulotlarni ko'rish
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Global Modals & Drawers */}
      <CartDrawer />
      <WishlistModal />
      <CheckoutModal />
      <ReceiptModal />
      <ProductDetailModal />
      <TrackOrderModal />
      <ToastContainer />
    </div>
  );
}

export default function App() {
  const { currentView } = useStore();

  if (currentView === 'admin') {
    return (
      <>
        <AdminLayout />
        <ToastContainer />
        <ReceiptModal />
      </>
    );
  }

  return <Storefront />;
}

