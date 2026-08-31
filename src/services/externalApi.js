// External Open E-Commerce APIs Service (DummyJSON & FakeStoreAPI)

const DEFAULT_USD_TO_UZS_RATE = 12800;

export const externalApi = {
  exchangeRate: DEFAULT_USD_TO_UZS_RATE,

  setExchangeRate(rate) {
    this.exchangeRate = Number(rate) || DEFAULT_USD_TO_UZS_RATE;
  },

  getExchangeRate() {
    return this.exchangeRate;
  },

  // Map external category to internal store categories
  mapCategory(extCat) {
    if (!extCat) return 'smartphones';
    const c = extCat.toLowerCase();
    if (c.includes('phone') || c.includes('smart') || c.includes('tablet') || c.includes('mobile')) {
      return 'smartphones';
    }
    if (c.includes('laptop') || c.includes('computer') || c.includes('electronics')) {
      return 'laptops';
    }
    if (c.includes('home') || c.includes('furniture') || c.includes('kitchen') || c.includes('appliance')) {
      return 'appliances';
    }
    if (c.includes('cloth') || c.includes('dress') || c.includes('shirt') || c.includes('shoe') || c.includes('top')) {
      return 'clothing';
    }
    if (c.includes('beauty') || c.includes('skin') || c.includes('fragrance')) {
      return 'beauty';
    }
    if (c.includes('watch') || c.includes('jewel') || c.includes('sunglass') || c.includes('bag') || c.includes('access')) {
      return 'accessories';
    }
    if (c.includes('book')) {
      return 'books';
    }
    return 'smartphones';
  },

  // Format DummyJSON item to our Store Product Model
  formatDummyJsonProduct(item) {
    const rate = this.exchangeRate;
    const priceInUzs = Math.round((item.price * rate) / 1000) * 1000;
    const discountPercent = Math.round(item.discountPercentage || 0);
    const oldPriceInUzs = discountPercent > 0
      ? Math.round(((item.price / (1 - discountPercent / 100)) * rate) / 1000) * 1000
      : null;

    let badge = 'Yangi';
    if (discountPercent >= 15) {
      badge = 'Chegirma';
    } else if (item.rating >= 4.5) {
      badge = 'Xit savdo';
    }

    const reviews = (item.reviews || []).map((r, idx) => ({
      id: `rev-ext-${item.id}-${idx}`,
      author: r.reviewerName || 'Xaridor',
      rating: r.rating || 5,
      date: r.date ? r.date.split('T')[0] : '2026-08-15',
      comment: r.comment || "Juda sifatli tovar, tavsiya qilaman!"
    }));

    return {
      id: `prod-ext-${item.id}-${Date.now()}`,
      name: item.title,
      category: this.mapCategory(item.category),
      price: priceInUzs,
      oldPrice: oldPriceInUzs,
      discount: discountPercent,
      rating: Number((item.rating || 4.8).toFixed(1)),
      reviewsCount: reviews.length > 0 ? reviews.length : Math.floor(Math.random() * 20 + 5),
      stock: item.stock || 20,
      badge,
      image: item.thumbnail || (item.images && item.images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      gallery: item.images && item.images.length > 0 ? item.images : [item.thumbnail],
      description: item.description || "Yuqori sifatli original mahsulot.",
      specs: {
        "Brend": item.brand || "Xalqaro brend",
        "Kafolat": item.warrantyInformation || "1 yil rasmiy kafolat",
        "Yetkazib berish": item.shippingInformation || "1-3 kunda bepul yetkazib berish",
        "Qaytish siyosati": item.returnPolicy || "14 kun ichida almashtirish",
        "Minimal buyurtma": `${item.minimumOrderQuantity || 1} dona`
      },
      reviews
    };
  },

  // Fetch products from DummyJSON
  async fetchDummyJsonProducts({ limit = 30, skip = 0, category = '', search = '' } = {}) {
    try {
      let url = 'https://dummyjson.com/products';
      if (search.trim()) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search.trim())}&limit=${limit}`;
      } else if (category && category !== 'all') {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`DummyJSON error: ${res.statusText}`);
      const data = await res.json();
      
      const formatted = (data.products || []).map(p => this.formatDummyJsonProduct(p));
      return {
        products: formatted,
        total: data.total || formatted.length,
        rawProducts: data.products || []
      };
    } catch (err) {
      console.error('fetchDummyJsonProducts error:', err);
      throw err;
    }
  },

  // Fetch categories from DummyJSON
  async fetchDummyJsonCategories() {
    try {
      const res = await fetch('https://dummyjson.com/products/categories');
      if (!res.ok) throw new Error('Failed to fetch categories');
      const data = await res.json();
      return data;
    } catch (err) {
      console.warn('fetchDummyJsonCategories error:', err);
      return [
        { slug: 'smartphones', name: 'Smartphones' },
        { slug: 'laptops', name: 'Laptops' },
        { slug: 'fragrances', name: 'Fragrances' },
        { slug: 'skin-care', name: 'Skin Care' },
        { slug: 'groceries', name: 'Groceries' },
        { slug: 'home-decoration', name: 'Home Decoration' },
        { slug: 'furniture', name: 'Furniture' },
        { slug: 'tops', name: 'Tops' },
        { slug: 'womens-dresses', name: 'Womens Dresses' },
        { slug: 'mens-shirts', name: 'Mens Shirts' },
        { slug: 'mens-shoes', name: 'Mens Shoes' },
        { slug: 'mens-watches', name: 'Mens Watches' },
        { slug: 'womens-watches', name: 'Womens Watches' }
      ];
    }
  },

  // Fetch products from FakeStoreAPI
  async fetchFakeStoreProducts() {
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      if (!res.ok) throw new Error('FakeStoreAPI failed');
      const data = await res.json();
      const rate = this.exchangeRate;

      return data.map(item => {
        const priceInUzs = Math.round((item.price * rate) / 1000) * 1000;
        return {
          id: `prod-fakestore-${item.id}-${Date.now()}`,
          name: item.title,
          category: this.mapCategory(item.category),
          price: priceInUzs,
          oldPrice: Math.round(priceInUzs * 1.15 / 1000) * 1000,
          discount: 15,
          rating: Number((item.rating?.rate || 4.5).toFixed(1)),
          reviewsCount: item.rating?.count || 12,
          stock: 15,
          badge: item.rating?.rate > 4.5 ? 'Xit savdo' : 'Yangi',
          image: item.image,
          gallery: [item.image],
          description: item.description,
          specs: {
            "Toifasi": item.category,
            "Kafolat": "1 yil rasmiy kafolat",
            "Yetkazib berish": "1-3 kunda yetkazib beriladi"
          },
          reviews: []
        };
      });
    } catch (err) {
      console.error('fetchFakeStoreProducts error:', err);
      throw err;
    }
  }
};
