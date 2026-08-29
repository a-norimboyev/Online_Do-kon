import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Package,
  X,
  Check,
  Star,
  Sparkles,
  FileSpreadsheet,
  Upload,
  Image as ImageIcon
} from 'lucide-react';

export default function ProductsTab() {
  const {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    showToast
  } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  // Add / Edit Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'smartphones',
    price: '',
    oldPrice: '',
    stock: '',
    badge: 'Yangi',
    image: '',
    description: '',
    specsString: ''
  });

  // Filter products
  const displayedProducts = products.filter(p => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return p.name.toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q);
    }
    return true;
  });

  const handleOpenAdd = () => {
    setEditingProductId(null);
    setFormData({
      name: '',
      category: categories.find(c => c.id !== 'all')?.id || 'smartphones',
      price: '',
      oldPrice: '',
      stock: '10',
      badge: 'Yangi',
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
      description: '',
      specsString: "Kafolat: 1 yil\nHolati: Yangi\nIshlab chiqaruvchi: Original"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProductId(p.id);
    const specsStr = p.specs
      ? Object.entries(p.specs).map(([k, v]) => `${k}: ${v}`).join('\n')
      : '';

    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      oldPrice: p.oldPrice || '',
      stock: p.stock,
      badge: p.badge || '',
      image: p.image,
      description: p.description || '',
      specsString: specsStr
    });
    setIsModalOpen(true);
  };

  // Handle local file upload
  const handleImageFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, image: reader.result }));
      showToast("Rasm muvaffaqiyatli tanlandi!", "success");
    };
    reader.readAsDataURL(file);
  };

  // Export products to CSV
  const handleExportProductsCSV = () => {
    if (!products || products.length === 0) {
      showToast("Eksport qilish uchun tovarlar yo'q!", "info");
      return;
    }

    const headers = ["Tovar ID", "Nomi", "Toifasi", "Narxi (so'm)", "Eski narxi", "Chegirma (%)", "Omborda qoldiq", "Reyting", "Sharhlar soni", "Yorliq"];
    const rows = products.map(p => {
      const catObj = categories.find(c => c.id === p.category);
      return [
        `"${p.id}"`,
        `"${p.name.replace(/"/g, '""')}"`,
        `"${catObj ? catObj.name : p.category}"`,
        `"${p.price}"`,
        `"${p.oldPrice || ''}"`,
        `"${p.discount || 0}"`,
        `"${p.stock}"`,
        `"${p.rating}"`,
        `"${p.reviewsCount || 0}"`,
        `"${p.badge || ''}"`
      ];
    });

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Tovarlar_Katalogi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Tovarlar katalogi Excel (.csv) formatida yuklab olindi!", "success");
  };

  const handleSaveProduct = (e) => {
    e.preventDefault();

    // Parse specs string into key-value object
    const specsObj = {};
    if (formData.specsString.trim()) {
      formData.specsString.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          specsObj[parts[0].trim()] = parts.slice(1).join(':').trim();
        }
      });
    }

    const payload = {
      name: formData.name.trim(),
      category: formData.category,
      price: Number(formData.price),
      oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
      stock: Number(formData.stock),
      badge: formData.badge,
      image: formData.image.trim(),
      description: formData.description.trim(),
      specs: specsObj,
      gallery: [formData.image.trim()]
    };

    if (editingProductId) {
      updateProduct(editingProductId, payload);
    } else {
      addProduct(payload);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Haqiqatan ham "${name}" mahsulotini o'chirmoqchimisiz?`)) {
      deleteProduct(id);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Tovarlar Boshqaruvi (CRUD)
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Yangi tovarlar qo'shish, rasmlar va narxlarni tahrirlash hamda ombor qoldig'ini boshqarish
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportProductsCSV}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-105"
            title="Tovarlarni Excel (.csv) formatida yuklab olish"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excelga yuklash</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Yangi tovar qo'shish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Mahsulot nomi yoki tavsifi bo'yicha qidirish..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-4 px-4">Tovar</th>
                <th className="py-4 px-4">Toifasi</th>
                <th className="py-4 px-4">Narxi</th>
                <th className="py-4 px-4">Chegirma</th>
                <th className="py-4 px-4">Ombor</th>
                <th className="py-4 px-4">Reyting</th>
                <th className="py-4 px-4 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedProducts.map((product) => {
                const catObj = categories.find(c => c.id === product.category);
                return (
                  <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Product cell */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 flex-shrink-0"
                        />
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1 max-w-xs">
                            {product.name}
                          </h4>
                          {product.badge && (
                            <span className="inline-block text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                              {product.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Category cell */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-semibold text-slate-600 dark:text-slate-300">
                        {catObj ? catObj.name : product.category}
                      </span>
                    </td>

                    {/* Price cell */}
                    <td className="py-4 px-4 font-bold text-slate-900 dark:text-white">
                      {product.price.toLocaleString()} so'm
                    </td>

                    {/* Discount cell */}
                    <td className="py-4 px-4">
                      {product.discount > 0 ? (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
                          -{product.discount}%
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Stock cell */}
                    <td className="py-4 px-4">
                      <span
                        className={`font-black ${
                          product.stock <= 3
                            ? 'text-rose-500'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {product.stock} dona
                      </span>
                    </td>

                    {/* Rating cell */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(product)}
                          className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-8 max-h-[90vh] flex flex-col animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {editingProductId ? "Tovarni tahrirlash" : "Yangi tovar qo'shish"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tovar nomi *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Masalan: Apple iPhone 15 Pro Max 256GB"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Toifasi (Kategoriya) *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  >
                    {categories.filter(c => c.id !== 'all').map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Badge / Yorliq
                  </label>
                  <select
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  >
                    <option value="">Yorliqsiz</option>
                    <option value="Yangi">Yangi</option>
                    <option value="Xit savdo">Xit savdo</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Chegirma">Chegirma</option>
                    <option value="Tavsiya etiladi">Tavsiya etiladi</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Sotuv narxi (so'mda) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="15000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Eski narxi (ixtiyoriy)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.oldPrice}
                    onChange={(e) => setFormData({ ...formData, oldPrice: e.target.value })}
                    placeholder="17000000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Omborda qoldiq soni *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                  />
                </div>
              </div>

              {/* Image Input: URL or Local File Upload */}
              <div className="space-y-2">
                <label className="block font-semibold text-slate-700 dark:text-slate-300">
                  Tovar rasmi (URL yoki fayl yuklash) *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      required
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                    />
                  </div>

                  <div>
                    <label className="flex items-center justify-center gap-2 w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer font-bold text-slate-600 dark:text-slate-300 transition-colors">
                      <Upload className="w-4 h-4 text-amber-500" />
                      <span>Faylni tanlash...</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {formData.image && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                    />
                    <span className="text-[11px] text-emerald-600 font-semibold">
                      ✓ Rasm ko'rinishi tayyor
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Batafsil tavsif
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Mahsulot haqida to'liq ma'lumot..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Texnik parametrlar (har bir qatorda: Kalit: Qiymat)
                </label>
                <textarea
                  rows={3}
                  value={formData.specsString}
                  onChange={(e) => setFormData({ ...formData, specsString: e.target.value })}
                  placeholder="Ekran: 6.7 OLED&#10;Protsessor: Apple A17 Pro&#10;Kafolat: 1 yil"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono focus:ring-2 focus:ring-amber-500 focus:outline-none dark:text-slate-100"
                />
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
