import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_ORDERS,
  INITIAL_PROMOS,
  REGIONS_UZB
} from '../data/initialData';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // Theme state (Dark / Light)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('online_dokon_theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('online_dokon_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // View state: 'store' or 'admin'
  const [currentView, setCurrentView] = useState('store');
  const [adminActiveTab, setAdminActiveTab] = useState('dashboard');

  // Core Data States with LocalStorage Persistence
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('online_dokon_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('online_dokon_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('online_dokon_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('online_dokon_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem('online_dokon_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [promos, setPromos] = useState(() => {
    const saved = localStorage.getItem('online_dokon_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMOS;
  });

  const [activePromo, setActivePromo] = useState(null);

  // Sync back to LocalStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('online_dokon_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('online_dokon_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('online_dokon_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('online_dokon_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('online_dokon_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('online_dokon_promos', JSON.stringify(promos));
  }, [promos]);

  // Filters and Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);

  // Modals & Drawers
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [latestReceipt, setLatestReceipt] = useState(null);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Cart Operations
  const addToCart = (product, quantity = 1) => {
    if (product.stock <= 0) {
      showToast("Kechirasiz, ushbu tovar omborda qolmagan!", "error");
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock);
        showToast(`"${product.name}" savatdagi soni oshirildi (${newQty} dona)`);
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      } else {
        showToast(`"${product.name}" savatga qo'shildi!`);
        return [...prev, { ...product, quantity: Math.min(quantity, product.stock) }];
      }
    });
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const prod = products.find(p => p.id === productId);
    if (prod && newQuantity > prod.stock) {
      showToast(`Mavjud maksimal qoldiq: ${prod.stock} dona`, 'error');
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === productId ? { ...item, quantity: newQuantity } : item))
    );
  };

  const removeFromCart = (productId) => {
    const item = cart.find(i => i.id === productId);
    setCart(prev => prev.filter(i => i.id !== productId));
    if (item) {
      showToast(`"${item.name}" savatdan olib tashlandi`, 'info');
    }
  };

  const clearCart = () => {
    setCart([]);
    setActivePromo(null);
  };

  // Wishlist Operations
  const toggleWishlist = (product) => {
    const exists = wishlist.some(id => id === product.id);
    if (exists) {
      setWishlist(prev => prev.filter(id => id !== product.id));
      showToast(`"${product.name}" sevimlilardan o'chirildi`, 'info');
    } else {
      setWishlist(prev => [...prev, product.id]);
      showToast(`"${product.name}" sevimlilarga saqlandi! ❤️`, 'success');
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  // Cart Calculations
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const discountAmount = useMemo(() => {
    if (!activePromo) return 0;
    if (activePromo.discountPercent) {
      return Math.round((cartSubtotal * activePromo.discountPercent) / 100);
    }
    if (activePromo.fixedDiscount) {
      return Math.min(activePromo.fixedDiscount, cartSubtotal);
    }
    return 0;
  }, [cartSubtotal, activePromo]);

  const cartTotal = useMemo(() => {
    return Math.max(0, cartSubtotal - discountAmount);
  }, [cartSubtotal, discountAmount]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  // Promo Code Validation
  const applyPromoCode = (code) => {
    const trimmed = code.trim().toUpperCase();
    const found = promos.find(p => p.code.toUpperCase() === trimmed);
    if (!found) {
      showToast("Bunday promo-kod mavjud emas!", "error");
      return false;
    }
    if (found.minAmount && cartSubtotal < found.minAmount) {
      showToast(`Ushbu promo-kod kamida ${found.minAmount.toLocaleString()} so'mlik xarid uchun amal qiladi!`, "error");
      return false;
    }
    setActivePromo(found);
    showToast(`"${found.code}" promo-kodi muvaffaqiyatli qo'llandi!`, "success");
    return true;
  };

  const removePromoCode = () => {
    setActivePromo(null);
    showToast("Promo-kod bekor qilindi", "info");
  };

  // Orders Management
  const createOrder = (orderData) => {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: 'Yangi',
      ...orderData
    };

    // Deduct stock from products
    setProducts(prev =>
      prev.map(prod => {
        const orderedItem = orderData.items.find(item => item.id === prod.id);
        if (orderedItem) {
          return {
            ...prod,
            stock: Math.max(0, prod.stock - orderedItem.quantity)
          };
        }
        return prod;
      })
    );

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setLatestReceipt(newOrder);
    showToast(`Buyurtmangiz qabul qilindi! Buyurtma raqami: #${newOrder.id}`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev =>
      prev.map(ord => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
    );
    showToast(`Buyurtma #${orderId} holati o'zgartirildi: "${newStatus}"`, 'success');
  };

  // Product CRUD (Admin)
  const addProduct = (productData) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      reviews: [],
      discount: productData.oldPrice && productData.oldPrice > productData.price
        ? Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100)
        : 0,
      ...productData
    };
    setProducts(prev => [newProduct, ...prev]);
    showToast(`"${newProduct.name}" tovari muvaffaqiyatli qo'shildi!`, 'success');
    return newProduct;
  };

  const updateProduct = (productId, updatedFields) => {
    setProducts(prev =>
      prev.map(prod => {
        if (prod.id === productId) {
          const discount = updatedFields.oldPrice && updatedFields.oldPrice > updatedFields.price
            ? Math.round(((updatedFields.oldPrice - updatedFields.price) / updatedFields.oldPrice) * 100)
            : prod.discount;
          return { ...prod, ...updatedFields, discount };
        }
        return prod;
      })
    );
    showToast("Mahsulot ma'lumotlari yangilandi!", 'success');
  };

  const deleteProduct = (productId) => {
    const prod = products.find(p => p.id === productId);
    setProducts(prev => prev.filter(p => p.id !== productId));
    setCart(prev => prev.filter(item => item.id !== productId));
    setWishlist(prev => prev.filter(id => id !== productId));
    showToast(`"${prod ? prod.name : 'Mahsulot'}" bazadan o'chirildi`, 'info');
  };

  // Reviews Operation
  const addReview = (productId, reviewData) => {
    const newReview = {
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      ...reviewData
    };

    setProducts(prev =>
      prev.map(prod => {
        if (prod.id === productId) {
          const updatedReviews = [newReview, ...(prod.reviews || [])];
          const totalRating = updatedReviews.reduce((sum, r) => sum + Number(r.rating), 0);
          const avgRating = Number((totalRating / updatedReviews.length).toFixed(1));
          return {
            ...prod,
            reviews: updatedReviews,
            reviewsCount: updatedReviews.length,
            rating: avgRating
          };
        }
        return prod;
      })
    );

    if (selectedProductDetail && selectedProductDetail.id === productId) {
      setSelectedProductDetail(prev => ({
        ...prev,
        reviews: [newReview, ...(prev.reviews || [])],
        reviewsCount: (prev.reviewsCount || 0) + 1
      }));
    }

    showToast("Fikr-mulohazangiz uchun tashakkur! Sharh qo'shildi.", 'success');
  };

  const deleteReview = (productId, reviewId) => {
    setProducts(prev =>
      prev.map(prod => {
        if (prod.id === productId) {
          const filtered = (prod.reviews || []).filter(r => r.id !== reviewId);
          const avgRating = filtered.length
            ? Number((filtered.reduce((sum, r) => sum + Number(r.rating), 0) / filtered.length).toFixed(1))
            : 5.0;
          return {
            ...prod,
            reviews: filtered,
            reviewsCount: filtered.length,
            rating: avgRating
          };
        }
        return prod;
      })
    );
    showToast("Sharh o'chirildi", 'info');
  };

  // Categories CRUD
  const addCategory = (categoryData) => {
    const newCat = {
      id: `cat-${Date.now()}`,
      ...categoryData
    };
    setCategories(prev => [...prev, newCat]);
    showToast(`"${newCat.name}" toifasi qo'shildi`, 'success');
  };

  const updateCategory = (categoryId, newName, newIcon) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === categoryId ? { ...cat, name: newName, icon: newIcon || cat.icon } : cat))
    );
    showToast("Toifa yangilandi", 'success');
  };

  const deleteCategory = (categoryId) => {
    if (categoryId === 'all') return;
    setCategories(prev => prev.filter(c => c.id !== categoryId));
    showToast("Toifa o'chirildi", 'info');
  };

  // Promos CRUD
  const addPromo = (promoData) => {
    setPromos(prev => [...prev, promoData]);
    showToast(`"${promoData.code}" promo-kodi yaratildi`, 'success');
  };

  const deletePromo = (code) => {
    setPromos(prev => prev.filter(p => p.code !== code));
    if (activePromo && activePromo.code === code) {
      setActivePromo(null);
    }
    showToast(`Promo-kod o'chirildi`, 'info');
  };

  // Reset to Demo Data
  const resetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setCategories(INITIAL_CATEGORIES);
    setOrders(INITIAL_ORDERS);
    setPromos(INITIAL_PROMOS);
    setCart([]);
    setWishlist([]);
    setActivePromo(null);
    showToast("Barcha ma'lumotlar boshlang'ich holatga qaytarildi!", 'success');
  };

  // Filtered Products for Catalog
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(q);
        const matchDesc = (product.description || '').toLowerCase().includes(q);
        if (!matchName && !matchDesc) return false;
      }
      // In stock
      if (onlyInStock && product.stock <= 0) return false;
      // Discounted
      if (onlyDiscounted && (!product.discount || product.discount <= 0)) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.badge === 'Yangi' ? 1 : 0) - (a.badge === 'Yangi' ? 1 : 0);
      // default: popular / xit savdo
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, selectedCategory, searchQuery, onlyInStock, onlyDiscounted, sortBy]);

  return (
    <StoreContext.Provider
      value={{
        // Theme
        theme,
        toggleTheme,
        // Views
        currentView,
        setCurrentView,
        adminActiveTab,
        setAdminActiveTab,
        // Data
        products,
        filteredProducts,
        categories,
        cart,
        wishlist,
        orders,
        promos,
        activePromo,
        regions: REGIONS_UZB,
        // Cart calculations
        cartSubtotal,
        discountAmount,
        cartTotal,
        totalCartCount,
        // Cart Actions
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        // Wishlist Actions
        toggleWishlist,
        isInWishlist,
        // Promos
        applyPromoCode,
        removePromoCode,
        addPromo,
        deletePromo,
        // Orders
        createOrder,
        updateOrderStatus,
        // Products CRUD
        addProduct,
        updateProduct,
        deleteProduct,
        // Reviews
        addReview,
        deleteReview,
        // Categories CRUD
        addCategory,
        updateCategory,
        deleteCategory,
        // Reset
        resetDemoData,
        // Filters State
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        onlyInStock,
        setOnlyInStock,
        onlyDiscounted,
        setOnlyDiscounted,
        // Modals & Drawers
        isCartOpen,
        setIsCartOpen,
        isWishlistOpen,
        setIsWishlistOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        selectedProductDetail,
        setSelectedProductDetail,
        latestReceipt,
        setLatestReceipt,
        isTrackOrderOpen,
        setIsTrackOrderOpen,
        // Toasts
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);

