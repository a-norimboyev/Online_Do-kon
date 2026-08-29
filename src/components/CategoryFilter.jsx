import React, { useRef } from 'react';
import { useStore } from '../context/StoreContext';
import {
  LayoutGrid,
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  BookOpen,
  Sparkles,
  Watch,
  SlidersHorizontal,
  Percent,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const ICON_MAP = {
  LayoutGrid,
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  BookOpen,
  Sparkles,
  Watch
};

export default function CategoryFilter() {
  const {
    categories,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    onlyInStock,
    setOnlyInStock,
    onlyDiscounted,
    setOnlyDiscounted,
    filteredProducts
  } = useStore();

  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -250 : 250;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div id="catalog-section" className="space-y-6 pt-4">
      {/* Category Chips with Navigation Buttons and Hidden Scrollbar */}
      <div className="relative group/chips flex items-center">
        {/* Left scroll button */}
        <button
          onClick={() => scroll('left')}
          className="hidden sm:flex absolute -left-3 z-10 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover/chips:opacity-100"
          aria-label="Chapga surish"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories container */}
        <div
          ref={scrollRef}
          className="flex items-center gap-2.5 overflow-x-auto py-1 px-1 no-scrollbar scroll-smooth w-full"
        >
          {categories.map(cat => {
            const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25 scale-[1.02]'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 shadow-sm'
                }`}
              >
                <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right scroll button */}
        <button
          onClick={() => scroll('right')}
          className="hidden sm:flex absolute -right-3 z-10 p-2 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all opacity-0 group-hover/chips:opacity-100"
          aria-label="O'ngga surish"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Control bar: Quick filters, count, sort dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Left: Quick filters */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => setOnlyDiscounted(!onlyDiscounted)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              onlyDiscounted
                ? 'bg-rose-500 text-white shadow-rose-500/20'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50'
            }`}
          >
            <Percent className="w-3.5 h-3.5" />
            <span>Aksiyadagi tovarlar</span>
          </button>

          <button
            onClick={() => setOnlyInStock(!onlyInStock)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              onlyInStock
                ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Faqat mavjud tovarlar</span>
          </button>

          <span className="text-xs text-slate-400 font-medium pl-1">
            Topildi: <strong className="text-slate-700 dark:text-slate-200 font-bold">{filteredProducts.length} ta</strong> tovar
          </span>
        </div>

        {/* Right: Sort dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">Saralash:</span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="popular">Eng ommabop (Xit savdo)</option>
            <option value="price-asc">Narxi: Arzondan qimmatga</option>
            <option value="price-desc">Narxi: Qimmatdan arzonga</option>
            <option value="rating">Reytingi yuqori</option>
            <option value="newest">Yangi qo'shilganlar</option>
          </select>
        </div>
      </div>
    </div>
  );
}
