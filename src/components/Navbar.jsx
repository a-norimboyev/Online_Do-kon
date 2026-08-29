import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import {
  ShoppingBag,
  Heart,
  Search,
  Moon,
  Sun,
  ShieldCheck,
  Truck,
  Menu,
  X,
  Store,
  Sparkles,
  PhoneCall,
  Star,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const {
    theme,
    toggleTheme,
    currentView,
    setCurrentView,
    totalCartCount,
    cartSubtotal,
    wishlist,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsTrackOrderOpen,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    products,
    setSelectedProductDetail
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchContainerRef = useRef(null);

  // Filter top matching search suggestions
  const searchSuggestions = searchQuery.trim().length > 0
    ? products.filter(p => {
        const q = searchQuery.toLowerCase();
        return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
      }).slice(0, 5)
    : [];

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProduct = (product) => {
    setSelectedProductDetail(product);
    setIsSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      {/* Top micro-bar */}
      <div className="bg-indigo-600 text-white text-xs font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>O'zbekiston bo'ylab 1-2 kunda tezkor yetkazib berish xizmati!</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="flex items-center gap-1 hover:text-amber-200 transition-colors"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Buyurtmani kuzatish</span>
            </button>
            <a
              href="tel:+998712000000"
              className="hidden sm:flex items-center gap-1 hover:text-amber-200 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>+998 (71) 200-00-00</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => {
                setCurrentView('store');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-400 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Online Do'kon
                </span>
                <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest -mt-1">
                  Internet Magazin
                </span>
              </div>
            </button>
          </div>

          {/* Search bar with Live Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="hidden md:flex flex-1 max-w-xl mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="20 000+ mahsulotlar ichidan qidiring (masalan: iPhone, noutbuk, kitob)..."
                className="w-full pl-11 pr-10 py-2.5 rounded-full bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-900 transition-all dark:text-slate-100"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchFocused && searchSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-scale-in">
                <div className="p-2 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1 block">
                    Qidiruv natijalari
                  </span>
                  {searchSuggestions.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelectProduct(prod)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover bg-slate-100 dark:bg-slate-800"
                        />
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-indigo-600">
                            {prod.name}
                          </h4>
                          <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400">
                            {prod.price.toLocaleString()} so'm
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? "Kunduzgi rejim" : "Tungi rejim"}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Sevimlilar ro'yxati"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-scale-in">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-100 dark:border-indigo-800/40 transition-colors font-medium text-sm"
              title="Savat"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline font-semibold">
                {cartSubtotal > 0 ? `${cartSubtotal.toLocaleString()} so'm` : "Savat"}
              </span>
            </button>

            {/* Admin Switcher */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25 hover:bg-amber-600'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {currentView === 'admin' ? (
                <>
                  <Store className="w-4 h-4" />
                  <span className="hidden sm:inline">Do'konga qaytish</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                  <span className="hidden sm:inline">Admin Paneli</span>
                </>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="w-full pl-10 pr-8 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-slate-100"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kategoriyalar</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsMobileMenuOpen(false);
                  setCurrentView('store');
                }}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
