import express from 'express';
import cors from 'cors';
import { readDB, writeDB, resetDB, initDB } from './db.js';

initDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

// --- STATS & DASHBOARD ---
app.get('/api/stats/dashboard', (req, res) => {
  const db = readDB();
  const totalRevenue = db.orders.reduce((sum, o) => {
    return o.status !== 'Bekor qilindi' ? sum + o.total : sum;
  }, 0);

  const totalOrders = db.orders.length;
  const completedOrders = db.orders.filter(o => o.status === 'Yetkazib berildi').length;
  const pendingOrders = db.orders.filter(o => o.status === 'Yangi' || o.status === 'Tayyorlanmoqda').length;
  const lowStockCount = db.products.filter(p => p.stock <= 3).length;

  res.json({
    success: true,
    data: {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      totalProducts: db.products.length,
      lowStockCount,
      recentOrders: db.orders.slice(0, 5),
      lowStockProducts: db.products.filter(p => p.stock <= 3)
    }
  });
});

// --- LIVE SEARCH API (Internet & Local Search) ---
app.get('/api/search', (req, res) => {
  const db = readDB();
  const query = (req.query.q || '').trim().toLowerCase();

  if (!query) {
    return res.json({ success: true, count: 0, data: [], categories: [] });
  }

  // Search in products (name, description, specs, category)
  const matchedProducts = db.products.filter(p => {
    const nameMatch = (p.name || p.title || '').toLowerCase().includes(query);
    const descMatch = (p.description || '').toLowerCase().includes(query);
    const catMatch = (p.category || '').toLowerCase().includes(query);
    return nameMatch || descMatch || catMatch;
  });

  // Matched categories
  const matchedCategories = db.categories.filter(c =>
    c.name.toLowerCase().includes(query) || c.id.toLowerCase().includes(query)
  );

  res.json({
    success: true,
    query,
    count: matchedProducts.length,
    data: matchedProducts.slice(0, 8),
    categories: matchedCategories
  });
});

// --- PRODUCTS API ---
app.get('/api/products', (req, res) => {
  const db = readDB();
  let result = [...db.products];

  const { category, search, sort, inStock, discounted, minPrice, maxPrice } = req.query;

  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  if (search) {
    const q = search.toLowerCase();
    result = result.filter(p =>
      (p.name || p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    result = result.filter(p => p.price >= Number(minPrice));
  }

  if (maxPrice) {
    result = result.filter(p => p.price <= Number(maxPrice));
  }

  if (inStock === 'true') {
    result = result.filter(p => p.stock > 0);
  }

  if (discounted === 'true') {
    result = result.filter(p => p.discount > 0);
  }

  if (sort === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    result.sort((a, b) => (b.badge === 'Yangi' ? 1 : 0) - (a.badge === 'Yangi' ? 1 : 0));
  } else {
    result.sort((a, b) => (b.reviewsCount || b.reviews_count || 0) - (a.reviewsCount || a.reviews_count || 0));
  }

  res.json({ success: true, count: result.length, data: result });
});

app.get('/api/products/:id', (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }
  res.json({ success: true, data: product });
});

app.post('/api/products', (req, res) => {
  const db = readDB();
  const productData = req.body;

  const discount = productData.oldPrice && productData.oldPrice > productData.price
    ? Math.round(((productData.oldPrice - productData.price) / productData.oldPrice) * 100)
    : 0;

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: productData.name || productData.title,
    title: productData.name || productData.title,
    rating: 5.0,
    reviewsCount: 0,
    reviews: [],
    discount,
    ...productData
  };

  db.products.unshift(newProduct);
  writeDB(db);
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  const updatedFields = req.body;
  const current = db.products[idx];

  const discount = updatedFields.oldPrice && updatedFields.oldPrice > updatedFields.price
    ? Math.round(((updatedFields.oldPrice - updatedFields.price) / updatedFields.oldPrice) * 100)
    : current.discount;

  db.products[idx] = {
    ...current,
    ...updatedFields,
    name: updatedFields.name || updatedFields.title || current.name,
    title: updatedFields.name || updatedFields.title || current.title,
    discount
  };

  writeDB(db);
  res.json({ success: true, data: db.products[idx] });
});

app.delete('/api/products/:id', (req, res) => {
  const db = readDB();
  const exists = db.products.some(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (!exists) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  db.products = db.products.filter(p => p.id !== req.params.id && String(p.id) !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: "Mahsulot o'chirildi" });
});

// --- REVIEWS API ---
app.post('/api/products/:id/reviews', (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  const { author, rating, comment } = req.body;
  const newReview = {
    id: `rev-${Date.now()}`,
    author: author || 'Mijoz',
    rating: Number(rating) || 5,
    comment: comment || '',
    date: new Date().toISOString().split('T')[0]
  };

  const product = db.products[idx];
  product.reviews = [newReview, ...(product.reviews || [])];
  product.reviewsCount = product.reviews.length;
  const totalScore = product.reviews.reduce((sum, r) => sum + Number(r.rating), 0);
  product.rating = Number((totalScore / product.reviews.length).toFixed(1));

  writeDB(db);
  res.status(201).json({ success: true, data: newReview, product });
});

app.delete('/api/products/:id/reviews/:reviewId', (req, res) => {
  const db = readDB();
  const prodIdx = db.products.findIndex(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (prodIdx === -1) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  const product = db.products[prodIdx];
  product.reviews = (product.reviews || []).filter(r => r.id !== req.params.reviewId);
  product.reviewsCount = product.reviews.length;
  if (product.reviews.length > 0) {
    const totalScore = product.reviews.reduce((sum, r) => sum + Number(r.rating), 0);
    product.rating = Number((totalScore / product.reviews.length).toFixed(1));
  } else {
    product.rating = 5.0;
  }

  writeDB(db);
  res.json({ success: true, message: "Sharh o'chirildi" });
});

// --- CATEGORIES API ---
app.get('/api/categories', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.categories });
});

app.post('/api/categories', (req, res) => {
  const db = readDB();
  const newCat = {
    id: req.body.id || `cat-${Date.now()}`,
    name: req.body.name,
    icon: req.body.icon || 'LayoutGrid'
  };
  db.categories.push(newCat);
  writeDB(db);
  res.status(201).json({ success: true, data: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const db = readDB();
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Toifa topilmadi' });
  }
  db.categories[idx] = { ...db.categories[idx], ...req.body };
  writeDB(db);
  res.json({ success: true, data: db.categories[idx] });
});

app.delete('/api/categories/:id', (req, res) => {
  if (req.params.id === 'all') {
    return res.status(400).json({ success: false, message: "Asosiy toifani o'chirib bo'lmaydi" });
  }
  const db = readDB();
  db.categories = db.categories.filter(c => c.id !== req.params.id);
  writeDB(db);
  res.json({ success: true, message: "Toifa o'chirildi" });
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.orders });
});

app.get('/api/orders/:id', (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  }
  res.json({ success: true, data: order });
});

app.post('/api/orders', (req, res) => {
  const db = readDB();
  const orderData = req.body;

  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: 'Yangi',
    ...orderData
  };

  // Deduct stocks
  if (Array.isArray(orderData.items)) {
    db.products = db.products.map(prod => {
      const match = orderData.items.find(i => i.id === prod.id);
      if (match) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - match.quantity)
        };
      }
      return prod;
    });
  }

  db.orders.unshift(newOrder);
  writeDB(db);
  res.status(201).json({ success: true, data: newOrder });
});

app.patch('/api/orders/:id/status', (req, res) => {
  const db = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  }

  db.orders[idx].status = req.body.status;
  writeDB(db);
  res.json({ success: true, data: db.orders[idx] });
});

// --- PROMOS API ---
app.get('/api/promos', (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.promos });
});

app.post('/api/promos', (req, res) => {
  const db = readDB();
  db.promos.push(req.body);
  writeDB(db);
  res.status(201).json({ success: true, data: req.body });
});

app.delete('/api/promos/:code', (req, res) => {
  const db = readDB();
  db.promos = db.promos.filter(p => p.code !== req.params.code);
  writeDB(db);
  res.json({ success: true, message: "Promo-kod o'chirildi" });
});

// --- RESET DEMO DATA ---
app.post('/api/reset-data', (req, res) => {
  const freshData = resetDB();
  res.json({ success: true, message: "Ma'lumotlar qayta tiklandi", data: freshData });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Online Do'kon API Server running at http://localhost:${PORT}`);
});
