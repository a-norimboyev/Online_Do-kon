import express from 'express';
import cors from 'cors';
import { readDB, writeDB, resetDB, initDB } from './db.js';

initDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));

app.use((req, res, next) => {
  console.log(`[API] ${req.method} ${req.url}`);
  next();
});

function validateString(value, maxLength = 500) {
  return typeof value === 'string' && value.length > 0 && value.length <= maxLength;
}

function validateNumber(value, min = 0, max = Infinity) {
  return typeof value === 'number' && value >= min && value <= max;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function sanitizeString(str) {
  return String(str).trim().slice(0, 500);
}

function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ success: false, message: 'Server xatosi yuz berdi' });
});

app.get('/api/stats/dashboard', asyncHandler(async (req, res) => {
  const db = readDB();
  const totalRevenue = db.orders.reduce((sum, o) => {
    return o.status !== 'Bekor qilindi' ? sum + (o.total || 0) : sum;
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
}));

app.get('/api/search', asyncHandler(async (req, res) => {
  const db = readDB();
  const query = sanitizeString(req.query.q || '').toLowerCase();

  if (!query || query.length < 1) {
    return res.json({ success: true, count: 0, data: [], categories: [] });
  }

  const matchedProducts = db.products.filter(p => {
    const nameMatch = (p.name || p.title || '').toLowerCase().includes(query);
    const descMatch = (p.description || '').toLowerCase().includes(query);
    const catMatch = (p.category || '').toLowerCase().includes(query);
    return nameMatch || descMatch || catMatch;
  });

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
}));

app.get('/api/products', asyncHandler(async (req, res) => {
  const db = readDB();
  let result = [...db.products];

  const { category, search, sort, inStock, discounted, minPrice, maxPrice } = req.query;

  if (category && category !== 'all') {
    result = result.filter(p => p.category === sanitizeString(category));
  }

  if (search) {
    const q = sanitizeString(search).toLowerCase();
    result = result.filter(p =>
      (p.name || p.title || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)
    );
  }

  if (minPrice) {
    const min = Number(minPrice);
    if (!isNaN(min) && min >= 0) {
      result = result.filter(p => p.price >= min);
    }
  }

  if (maxPrice) {
    const max = Number(maxPrice);
    if (!isNaN(max) && max >= 0) {
      result = result.filter(p => p.price <= max);
    }
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
}));

app.get('/api/products/:id', asyncHandler(async (req, res) => {
  const db = readDB();
  const product = db.products.find(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (!product) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }
  res.json({ success: true, data: product });
}));

app.post('/api/products', asyncHandler(async (req, res) => {
  const { name, title, price, oldPrice, stock, category, description, image, images } = req.body;

  if (!validateString(name || title)) {
    return res.status(400).json({ success: false, message: 'Mahsulot nomi talab qilinadi' });
  }

  if (!validateNumber(price, 0) || !validateNumber(stock, 0)) {
    return res.status(400).json({ success: false, message: 'Narx va ombor soni notogri' });
  }

  const db = readDB();
  const discount = oldPrice && oldPrice > price
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  const newProduct = {
    id: `prod-${Date.now()}`,
    name: sanitizeString(name || title),
    title: sanitizeString(name || title),
    price: Number(price),
    oldPrice: oldPrice ? Number(oldPrice) : price,
    stock: Number(stock),
    category: sanitizeString(category || 'Boshqalar'),
    description: sanitizeString(description || ''),
    image: sanitizeString(image || ''),
    images: Array.isArray(images) ? images.map(i => sanitizeString(i)) : [],
    rating: 5.0,
    reviewsCount: 0,
    reviews: [],
    discount,
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.status(201).json({ success: true, data: newProduct });
}));

app.put('/api/products/:id', asyncHandler(async (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  const { name, title, price, oldPrice, stock, category, description, image, images } = req.body;

  if (name && !validateString(name)) {
    return res.status(400).json({ success: false, message: 'Mahsulot nomi notogri' });
  }

  if (price && !validateNumber(price, 0)) {
    return res.status(400).json({ success: false, message: 'Narx notogri' });
  }

  const current = db.products[idx];
  const newPrice = price !== undefined ? Number(price) : current.price;
  const newOldPrice = oldPrice !== undefined ? Number(oldPrice) : current.oldPrice;

  const discount = newOldPrice && newOldPrice > newPrice
    ? Math.round(((newOldPrice - newPrice) / newOldPrice) * 100)
    : current.discount;

  db.products[idx] = {
    ...current,
    name: name ? sanitizeString(name) : current.name,
    title: title ? sanitizeString(title) : current.title,
    price: newPrice,
    oldPrice: newOldPrice,
    stock: stock !== undefined ? Number(stock) : current.stock,
    category: category ? sanitizeString(category) : current.category,
    description: description ? sanitizeString(description) : current.description,
    image: image ? sanitizeString(image) : current.image,
    images: Array.isArray(images) ? images.map(i => sanitizeString(i)) : current.images,
    discount,
    updatedAt: new Date().toISOString()
  };

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, data: db.products[idx] });
}));

app.delete('/api/products/:id', asyncHandler(async (req, res) => {
  const db = readDB();
  const exists = db.products.some(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (!exists) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  db.products = db.products.filter(p => p.id !== req.params.id && String(p.id) !== req.params.id);

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, message: 'Mahsulot ochirildi' });
}));

app.post('/api/products/:id/reviews', asyncHandler(async (req, res) => {
  const db = readDB();
  const idx = db.products.findIndex(p => p.id === req.params.id || String(p.id) === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Mahsulot topilmadi' });
  }

  const { author, rating, comment } = req.body;

  if (!validateString(author, 100)) {
    return res.status(400).json({ success: false, message: 'Avtorning ismi talab qilinadi' });
  }

  if (!validateNumber(rating, 1, 5)) {
    return res.status(400).json({ success: false, message: 'Reyting 1-5 oraligida bolishi kerak' });
  }

  if (comment && !validateString(comment)) {
    return res.status(400).json({ success: false, message: 'Sharh juda uzun' });
  }

  const newReview = {
    id: `rev-${Date.now()}`,
    author: sanitizeString(author),
    rating: Number(rating),
    comment: sanitizeString(comment || ''),
    date: new Date().toISOString().split('T')[0]
  };

  const product = db.products[idx];
  product.reviews = [newReview, ...(product.reviews || [])];
  product.reviewsCount = product.reviews.length;
  const totalScore = product.reviews.reduce((sum, r) => sum + Number(r.rating), 0);
  product.rating = Number((totalScore / product.reviews.length).toFixed(1));

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.status(201).json({ success: true, data: newReview, product });
}));

app.delete('/api/products/:id/reviews/:reviewId', asyncHandler(async (req, res) => {
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

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, message: 'Sharh ochirildi' });
}));

app.get('/api/categories', asyncHandler(async (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.categories });
}));

app.post('/api/categories', asyncHandler(async (req, res) => {
  const { name, icon } = req.body;

  if (!validateString(name, 100)) {
    return res.status(400).json({ success: false, message: 'Toifa nomi talab qilinadi' });
  }

  const db = readDB();
  const newCat = {
    id: `cat-${Date.now()}`,
    name: sanitizeString(name),
    icon: sanitizeString(icon || 'LayoutGrid', 50),
    createdAt: new Date().toISOString()
  };

  db.categories.push(newCat);
  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.status(201).json({ success: true, data: newCat });
}));

app.put('/api/categories/:id', asyncHandler(async (req, res) => {
  const db = readDB();
  const idx = db.categories.findIndex(c => c.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Toifa topilmadi' });
  }

  const { name, icon } = req.body;

  if (name && !validateString(name, 100)) {
    return res.status(400).json({ success: false, message: 'Toifa nomi notogri' });
  }

  db.categories[idx] = {
    ...db.categories[idx],
    ...(name && { name: sanitizeString(name) }),
    ...(icon && { icon: sanitizeString(icon, 50) }),
    updatedAt: new Date().toISOString()
  };

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, data: db.categories[idx] });
}));

app.delete('/api/categories/:id', asyncHandler(async (req, res) => {
  if (req.params.id === 'all') {
    return res.status(400).json({ success: false, message: 'Asosiy toifani ochirib bolmaydi' });
  }

  const db = readDB();
  db.categories = db.categories.filter(c => c.id !== req.params.id);

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, message: 'Toifa ochirildi' });
}));

app.get('/api/orders', asyncHandler(async (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.orders });
}));

app.get('/api/orders/:id', asyncHandler(async (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  }
  res.json({ success: true, data: order });
}));

app.post('/api/orders', asyncHandler(async (req, res) => {
  const { items, total, customerInfo, deliveryInfo } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Buyurtmada mahsulot yoq' });
  }

  if (!validateNumber(total, 0)) {
    return res.status(400).json({ success: false, message: 'Jami qiymati notogri' });
  }

  if (!customerInfo || !validateString(customerInfo.name, 100)) {
    return res.status(400).json({ success: false, message: 'Mijoz malumoti talab qilinadi' });
  }

  if (customerInfo.phone && !/^\d{7,20}$/.test(customerInfo.phone.replace(/\D/g, ''))) {
    return res.status(400).json({ success: false, message: 'Telefon raqami notogri' });
  }

  const db = readDB();
  const newOrder = {
    id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
    createdAt: new Date().toISOString(),
    status: 'Yangi',
    items: items.map(i => ({ id: String(i.id), quantity: Math.max(1, Number(i.quantity)) })),
    total: Number(total),
    customerInfo: {
      name: sanitizeString(customerInfo.name),
      phone: sanitizeString(customerInfo.phone || ''),
      email: customerInfo.email && validateEmail(customerInfo.email) ? customerInfo.email : '',
      address: sanitizeString(customerInfo.address || '')
    },
    deliveryInfo: deliveryInfo || {}
  };

  if (Array.isArray(items)) {
    db.products = db.products.map(prod => {
      const match = items.find(i => String(i.id) === String(prod.id));
      if (match) {
        return {
          ...prod,
          stock: Math.max(0, prod.stock - Number(match.quantity))
        };
      }
      return prod;
    });
  }

  db.orders.unshift(newOrder);
  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.status(201).json({ success: true, data: newOrder });
}));

app.patch('/api/orders/:id/status', asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['Yangi', 'Tayyorlanmoqda', 'Yetkazilmoqda', 'Yetkazib berildi', 'Bekor qilindi'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: 'Notogri holat' });
  }

  const db = readDB();
  const idx = db.orders.findIndex(o => o.id === req.params.id);
  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Buyurtma topilmadi' });
  }

  db.orders[idx].status = status;
  db.orders[idx].updatedAt = new Date().toISOString();

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, data: db.orders[idx] });
}));

app.get('/api/promos', asyncHandler(async (req, res) => {
  const db = readDB();
  res.json({ success: true, data: db.promos });
}));

app.post('/api/promos', asyncHandler(async (req, res) => {
  const { code, discountPercent, fixedDiscount, minAmount } = req.body;

  if (!validateString(code, 20)) {
    return res.status(400).json({ success: false, message: 'Promo-kod nomi talab qilinadi' });
  }

  if (discountPercent && !validateNumber(discountPercent, 0, 100)) {
    return res.status(400).json({ success: false, message: 'Chegirma foizi 0-100 oraligida bolishi kerak' });
  }

  if (fixedDiscount && !validateNumber(fixedDiscount, 0)) {
    return res.status(400).json({ success: false, message: 'Birgina chegirma soni notogri' });
  }

  const db = readDB();
  const newPromo = {
    code: sanitizeString(code).toUpperCase(),
    discountPercent: discountPercent ? Number(discountPercent) : 0,
    fixedDiscount: fixedDiscount ? Number(fixedDiscount) : 0,
    minAmount: minAmount ? Number(minAmount) : 0,
    createdAt: new Date().toISOString()
  };

  db.promos.push(newPromo);
  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.status(201).json({ success: true, data: newPromo });
}));

app.delete('/api/promos/:code', asyncHandler(async (req, res) => {
  const db = readDB();
  const code = sanitizeString(req.params.code).toUpperCase();
  db.promos = db.promos.filter(p => p.code !== code);

  if (!writeDB(db)) {
    return res.status(500).json({ success: false, message: 'Malumot saqlashda xato' });
  }

  res.json({ success: true, message: 'Promo-kod ochirildi' });
}));

app.post('/api/reset-data', asyncHandler(async (req, res) => {
  const freshData = resetDB();
  if (!freshData) {
    return res.status(500).json({ success: false, message: 'Malumot qayta tiklanishda xato' });
  }
  res.json({ success: true, message: 'Malumotlar qayta tiklandi', data: freshData });
}));

app.listen(PORT, () => {
  console.log(`🚀 Online Dokon API Server running at http://localhost:${PORT}`);
});
