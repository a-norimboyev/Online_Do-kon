import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { api } from '../services/api';
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
  MapPin,
  ChevronDown,
  User,
  LayoutGrid,
  ArrowRight,
  Globe,
  Tag
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

  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Toshkent');
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [apiCategories, setApiCategories] = useState([]);
  const searchContainerRef = useRef(null);

  // Real-time API Search with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setApiSearchResults([]);
      setApiCategories([]);
      return;
    }

    const timer = setTimeout(async () => {
      const res = await api.search(searchQuery);
      if (res && res.data && res.data.length > 0) {
        setApiSearchResults(res.data);
        setApiCategories(res.categories || []);
      } else {
        // Local fallback
        const q = searchQuery.toLowerCase();
        const localMatched = products.filter(p =>
          (p.name || p.title || '').toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q)
        ).slice(0, 6);
        setApiSearchResults(localMatched);
      }
    }, 120);

    return () => clearTimeout(timer);
  }, [searchQuery, products]);

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
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-[#1F2026] border-b border-slate-100 dark:border-slate-800 transition-colors shadow-sm">
      {/* 1. Top Micro Bar (Exact Uzum Market) */}
      <div className="bg-[#F2F4F7] dark:bg-[#18191E] text-[13px] text-slate-600 dark:text-slate-400 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-5">
            <button className="flex items-center gap-1 font-medium hover:text-[#7000FF] transition-colors">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>Shahar: <u className="font-bold underline text-slate-800 dark:text-slate-200">{selectedCity}</u></span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hidden sm:flex items-center gap-1 hover:text-[#7000FF] transition-colors"
            >
              <span>Topshirish punktlari</span>
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 text-xs">
            <span className="hidden md:inline hover:text-[#7000FF] cursor-pointer">Sotuvchi bo'lish</span>
            <span className="hidden md:inline hover:text-[#7000FF] cursor-pointer">Topshirish punktini ochish</span>
            <button
              onClick={() => setIsTrackOrderOpen(true)}
              className="hover:text-[#7000FF] cursor-pointer"
            >
              Buyurtmalarim
            </button>
            <div className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200 cursor-pointer">
              <span>🇺🇿 O'zbekcha</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Uzum Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-3 sm:gap-6">
          {/* Logo (Uzum Market Style) */}
          <button
            onClick={() => {
              setCurrentView('store');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="flex items-center gap-2 flex-shrink-0 group"
          >
            {/* Uzum Violet Logo Mark */}
            <div className="w-9 h-9 rounded-full bg-[#7000FF] flex items-center justify-center text-white shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
              <div className="w-4 h-4 rounded-full border-2 border-white flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
            </div>
            <div className="flex items-baseline">
              <span className="text-2xl font-extrabold tracking-tight text-[#7000FF] lowercase font-sans">
                uzum
              </span>
              <span className="text-2xl font-normal tracking-tight text-slate-800 dark:text-white lowercase ml-1">
                market
              </span>
            </div>
          </button>

          {/* Catalog Button */}
          <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E8E3FF] hover:bg-[#DBCFFF] text-[#7000FF] dark:bg-[#2F1B5C] dark:text-[#B899FF] font-bold text-sm transition-all"
          >
            {isCatalogOpen ? <X className="w-5 h-5" /> : <LayoutGrid className="w-5 h-5" />}
            <span>Katalog</span>
          </button>

          {/* Search Input Bar with Live API Autocomplete Dropdown */}
          <div ref={searchContainerRef} className="flex-1 max-w-2xl relative">
            <div className="relative flex items-center w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden focus-within:border-[#7000FF] focus-within:ring-2 focus-within:ring-[#7000FF]/20 transition-all">
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setIsSearchFocused(true);
                }}
                placeholder="Mahsulotlar va turkumlar izlash..."
                className="w-full pl-4 pr-12 py-2.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 text-slate-400 hover:text-slate-600 mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : null}
              <button
                className="px-5 py-2.5 bg-[#F2F4F7] dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center border-l border-slate-200 dark:border-slate-700"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>

            {/* Live API Search Results Dropdown */}
            {isSearchFocused && searchQuery.trim().length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-scale-in max-h-96 overflow-y-auto">
                <div className="p-3 space-y-2">
                  {/* Category matches */}
                  {apiCategories.length > 0 && (
                    <div className="pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Toifalar bo'yicha:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {apiCategories.map(cat => (
                          <button
                            key={cat.id}
                            onClick={() => {
                              setSelectedCategory(cat.id);
                              setIsSearchFocused(false);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E8E3FF] text-[#7000FF] text-xs font-bold hover:bg-[#7000FF] hover:text-white transition-colors"
                          >
                            <Tag className="w-3 h-3" />
                            <span>{cat.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Product matches */}
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1">
                    Mahsulotlar ({apiSearchResults.length} ta natija):
                  </span>

                  {apiSearchResults.length > 0 ? (
                    apiSearchResults.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F2F4F7] dark:hover:bg-slate-800 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prod.image}
                            alt={prod.name || prod.title}
                            className="w-11 h-11 rounded-lg object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                          />
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-[#7000FF]">
                              {prod.name || prod.title}
                            </h4>
                            <span className="text-[11px] font-black text-[#7000FF]">
                              {prod.price.toLocaleString()} so'm
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#7000FF] group-hover:translate-x-1 transition-all" />
                      </button>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-slate-400">
                      Hech qanday mahsulot topilmadi
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (Kirish, Saralangan, Savat, Admin) */}
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={theme === 'dark' ? "Kunduzgi rejim" : "Tungi rejim"}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Profile / Kirish */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#7000FF] transition-colors"
            >
              <User className="w-5 h-5" />
              <span>{currentView === 'admin' ? "Do'kon" : "Kirish"}</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="flex flex-col sm:flex-row items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#7000FF] transition-colors relative"
            >
              <div className="relative">
                <Heart className="w-6 h-6" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#7000FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-medium">Saralangan</span>
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col sm:flex-row items-center gap-1 text-slate-700 dark:text-slate-200 hover:text-[#7000FF] transition-colors relative"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#7000FF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale-in">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-medium">
                {totalCartCount > 0 ? `Savat (${totalCartCount})` : "Savat"}
              </span>
            </button>

            {/* Admin Switcher Badge */}
            <button
              onClick={() => setCurrentView(currentView === 'store' ? 'admin' : 'store')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                currentView === 'admin'
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-[#F2F4F7] dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-[#E8E3FF] hover:text-[#7000FF]'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span className="hidden md:inline">{currentView === 'admin' ? "Do'kon" : "Admin"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Uzum Category Bar & Links */}
      <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#1F2026]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6 overflow-x-auto py-2.5 text-[13px] no-scrollbar whitespace-nowrap">
            <button
              onClick={() => { setSelectedCategory('all'); setCurrentView('store'); }}
              className={`flex items-center gap-1.5 font-bold transition-colors ${
                selectedCategory === 'all' ? 'text-[#7000FF]' : 'text-slate-700 dark:text-slate-300 hover:text-[#7000FF]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-[#7000FF]" />
              <span>Barcha mahsulotlar</span>
            </button>

            {categories.filter(c => c.id !== 'all').map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setCurrentView('store');
                }}
                className={`font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'text-[#7000FF] font-bold border-b-2 border-[#7000FF] pb-0.5'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Catalog Mega Dropdown */}
      {isCatalogOpen && (
        <div className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1F2026] shadow-2xl animate-fade-in">
          <div className="max-w-7xl mx-auto p-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsCatalogOpen(false);
                  setCurrentView('store');
                }}
                className="flex items-center gap-3 p-3 rounded-2xl bg-[#F2F4F7] dark:bg-slate-800 hover:bg-[#E8E3FF] dark:hover:bg-[#2F1B5C] text-left group transition-all"
              >
                <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center text-[#7000FF] font-bold text-xs">
                  ★
                </div>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#7000FF]">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
