import React from 'react';
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
  Flame,
  Percent,
  CheckCircle2
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

  return (
    <div id="catalog-section" className="space-y-6 pt-4">
      {/* Category Chips Carousel */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map(cat => {
          const IconComp = ICON_MAP[cat.icon] || LayoutGrid;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium whitespace-nowrap transition-all duration-200 shadow-sm ${
                isSelected
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-indigo-500 dark:text-indigo-400'}`} />
              <span>{cat.name}</span>
            </button>
          );
        })}
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
