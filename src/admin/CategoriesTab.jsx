import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Plus,
  FolderTree,
  Edit2,
  Trash2,
  X,
  Package,
  LayoutGrid,
  Smartphone,
  Laptop,
  Tv,
  Shirt,
  BookOpen,
  Sparkles,
  Watch
} from 'lucide-react';

const AVAILABLE_ICONS = [
  'LayoutGrid',
  'Smartphone',
  'Laptop',
  'Tv',
  'Shirt',
  'BookOpen',
  'Sparkles',
  'Watch'
];

export default function CategoriesTab() {
  const {
    categories,
    products,
    addCategory,
    updateCategory,
    deleteCategory
  } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatId, setEditingCatId] = useState(null);
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('LayoutGrid');

  const handleOpenAdd = () => {
    setEditingCatId(null);
    setCatName('');
    setCatIcon('LayoutGrid');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingCatId(cat.id);
    setCatName(cat.name);
    setCatIcon(cat.icon || 'LayoutGrid');
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!catName.trim()) return;

    if (editingCatId) {
      updateCategory(editingCatId, catName.trim(), catIcon);
    } else {
      const generatedId = catName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      addCategory({
        id: generatedId || `cat-${Date.now()}`,
        name: catName.trim(),
        icon: catIcon
      });
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (id === 'all') {
      alert("Asosiy 'Barcha tovarlar' toifasini o'chirib bo'lmaydi!");
      return;
    }
    if (window.confirm(`Haqiqatan ham "${name}" toifasini o'chirmoqchimisiz?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Kategoriyalar Boshqaruvi
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Do'kon toifalarini qo'shish, tahrirlash va ularga tegishli tovarlar hisobini ko'rish
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Yangi toifa qo'shish</span>
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const productCount =
            cat.id === 'all'
              ? products.length
              : products.filter(p => p.category === cat.id).length;

          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between group hover:border-amber-500/40 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                  <FolderTree className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Package className="w-3.5 h-3.5" />
                    <span>{productCount} ta mahsulot</span>
                  </p>
                </div>
              </div>

              {cat.id !== 'all' && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cat)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id, cat.name)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingCatId ? "Toifani tahrirlash" : "Yangi toifa qo'shish"}
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
                  Kategoriya nomi *
                </label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  placeholder="Masalan: Sport va Dam olish"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Piktogramma (Icon)
                </label>
                <select
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                >
                  {AVAILABLE_ICONS.map((ic) => (
                    <option key={ic} value={ic}>
                      {ic}
                    </option>
                  ))}
                </select>
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
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
