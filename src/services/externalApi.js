const DEFAULT_USD_TO_UZS_RATE = 12800;
const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 2;

function withTimeout(promise, ms = REQUEST_TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms))
  ]);
}

async function fetchWithRetry(url, retries = MAX_RETRIES) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await withTimeout(fetch(url));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      lastError = err;
      if (i < retries) await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
  throw lastError;
}

export const externalApi = {
  exchangeRate: DEFAULT_USD_TO_UZS_RATE,

  setExchangeRate(rate) {
    const num = Number(rate);
    this.exchangeRate = !isNaN(num) && num > 0 ? num : DEFAULT_USD_TO_UZS_RATE;
  },

  getExchangeRate() {
    return this.exchangeRate;
  },

  mapCategory(extCat) {
    if (!extCat) return 'smartphones';
    const c = String(extCat).toLowerCase().trim();
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

  formatDummyJsonProduct(item) {
    if (!item || typeof item !== 'object') return null;

    const rate = this.exchangeRate;
    const price = Number(item.price) || 0;
    if (price <= 0) return null;

    const priceInUzs = Math.round((price * rate) / 1000) * 1000;
    const discountPercent = Math.max(0, Math.min(100, Math.round(item.discountPercentage || 0)));
    const oldPriceInUzs = discountPercent > 0
      ? Math.round(((price / (1 - discountPercent / 100)) * rate) / 1000) * 1000
      : priceInUzs;

    let badge = 'Yangi';
    if (discountPercent >= 15) {
      badge = 'Chegirma';
    } else if (item.rating && item.rating >= 4.5) {
      badge = 'Xit savdo';
    }

    const reviews = (Array.isArray(item.reviews) ? item.reviews : [])
      .slice(0, 10)
      .map((r, idx) => ({
        id: `rev-ext-${item.id}-${idx}`,
        author: String(r.reviewerName || 'Xaridor').slice(0, 100),
        rating: Math.max(1, Math.min(5, Math.round(r.rating || 5))),
        date: r.date ? String(r.date).split('T')[0] : '2026-08-15',
        comment: String(r.comment || 'Juda sifatli tovar, tavsiya qilaman!').slice(0, 500)
      }));

    return {
      id: `prod-ext-${item.id}-${Date.now()}`,
      name: String(item.title || 'Mahsulot').slice(0, 200),
      category: this.mapCategory(item.category),
      price: priceInUzs,
      oldPrice: oldPriceInUzs,
      discount: discountPercent,
      rating: Number((item.rating || 4.8).toFixed(1)),
      reviewsCount: Math.max(reviews.length, Math.floor(Math.random() * 20 + 5)),
      stock: Math.max(1, Number(item.stock) || 20),
      badge,
      image: item.thumbnail || (Array.isArray(item.images) && item.images[0]) || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800',
      gallery: Array.isArray(item.images) && item.images.length > 0 ? item.images : [item.thumbnail || ''],
      description: String(item.description || 'Yuqori sifatli original mahsulot.').slice(0, 500),
      specs: {
        'Brend': String(item.brand || 'Xalqaro brend').slice(0, 100),
        'Kafolat': String(item.warrantyInformation || '1 yil rasmiy kafolat').slice(0, 100),
        'Yetkazib berish': String(item.shippingInformation || '1-3 kunda bepul yetkazib berish').slice(0, 100),
        'Qaytish siyosati': String(item.returnPolicy || '14 kun ichida almashtirish').slice(0, 100),
        'Minimal buyurtma': `${Math.max(1, Number(item.minimumOrderQuantity) || 1)} dona`
      },
      reviews
    };
  },

  async fetchDummyJsonProducts({ limit = 30, skip = 0, category = '', search = '' } = {}) {
    try {
      limit = Math.max(1, Math.min(100, Number(limit) || 30));
      skip = Math.max(0, Number(skip) || 0);

      let url = 'https://dummyjson.com/products';
      const cleanSearch = String(search || '').trim().slice(0, 100);
      const cleanCategory = String(category || '').trim().slice(0, 50);

      if (cleanSearch) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(cleanSearch)}&limit=${limit}`;
      } else if (cleanCategory && cleanCategory !== 'all') {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(cleanCategory)}?limit=${limit}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const data = await fetchWithRetry(url);

      if (!data || !Array.isArray(data.products)) {
        return { products: [], total: 0, rawProducts: [] };
      }

      const formatted = data.products
        .map(p => this.formatDummyJsonProduct(p))
        .filter(p => p !== null);

      return {
        products: formatted,
        total: data.total || formatted.length,
        rawProducts: data.products || []
      };
    } catch (err) {
      console.error('fetchDummyJsonProducts error:', err.message);
      return { products: [], total: 0, rawProducts: [] };
    }
  },

  async fetchDummyJsonCategories() {
    try {
      const data = await fetchWithRetry('https://dummyjson.com/products/categories');
      if (!Array.isArray(data)) throw new Error('Invalid categories format');
      return data.slice(0, 20);
    } catch (err) {
      console.warn('fetchDummyJsonCategories error:', err.message);
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

  async fetchFakeStoreProducts() {
    try {
      const data = await fetchWithRetry('https://fakestoreapi.com/products');
      if (!Array.isArray(data)) throw new Error('Invalid products format');

      const rate = this.exchangeRate;

      return data
        .slice(0, 20)
        .map(item => {
          if (!item || typeof item !== 'object') return null;

          const price = Number(item.price) || 0;
          if (price <= 0) return null;

          const priceInUzs = Math.round((price * rate) / 1000) * 1000;
          return {
            id: `prod-fakestore-${item.id}-${Date.now()}`,
            name: String(item.title || 'Mahsulot').slice(0, 200),
            category: this.mapCategory(item.category),
            price: priceInUzs,
            oldPrice: Math.round(priceInUzs * 1.15 / 1000) * 1000,
            discount: 15,
            rating: Number((item.rating?.rate || 4.5).toFixed(1)),
            reviewsCount: Math.max(5, Number(item.rating?.count) || 12),
            stock: 15,
            badge: item.rating?.rate > 4.5 ? 'Xit savdo' : 'Yangi',
            image: String(item.image || '').slice(0, 500),
            gallery: [String(item.image || '')],
            description: String(item.description || '').slice(0, 500),
            specs: {
              'Toifasi': String(item.category || '').slice(0, 100),
              'Kafolat': '1 yil rasmiy kafolat',
              'Yetkazib berish': '1-3 kunda yetkazib beriladi'
            },
            reviews: []
          };
        })
        .filter(p => p !== null);
    } catch (err) {
      console.error('fetchFakeStoreProducts error:', err.message);
      return [];
    }
  }
};
