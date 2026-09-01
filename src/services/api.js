const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const TIMEOUT = import.meta.env.VITE_API_TIMEOUT ? Number(import.meta.env.VITE_API_TIMEOUT) : 10000;

function withTimeout(promise, ms = TIMEOUT) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('Request timeout')), ms))
  ]);
}

async function fetchWithValidation(url, options = {}) {
  try {
    const res = await withTimeout(fetch(url, options));
    if (!res.ok) {
      const error = await res.json().catch(() => ({}));
      throw new Error(error.message || `HTTP ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error(`API error at ${url}:`, error);
    throw error;
  }
}

export const api = {
  async getDashboardStats() {
    try {
      const data = await fetchWithValidation(`${API_BASE}/stats/dashboard`);
      return data.data || null;
    } catch (e) {
      console.warn('getDashboardStats failed:', e.message);
      return null;
    }
  },

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const data = await fetchWithValidation(`${API_BASE}/products?${query}`);
      return data.data || null;
    } catch (e) {
      console.warn('getProducts failed:', e.message);
      return null;
    }
  },

  async createProduct(productData) {
    if (!productData || !productData.name) throw new Error('Product name required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return data.data || null;
    } catch (e) {
      console.warn('createProduct failed:', e.message);
      return null;
    }
  },

  async updateProduct(id, productData) {
    if (!id || !productData) throw new Error('ID and data required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      return data.data || null;
    } catch (e) {
      console.warn('updateProduct failed:', e.message);
      return null;
    }
  },

  async deleteProduct(id) {
    if (!id) throw new Error('ID required');
    try {
      await fetchWithValidation(`${API_BASE}/products/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      console.warn('deleteProduct failed:', e.message);
      return false;
    }
  },

  async addReview(productId, reviewData) {
    if (!productId || !reviewData) throw new Error('Product ID and review data required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      return data || null;
    } catch (e) {
      console.warn('addReview failed:', e.message);
      return null;
    }
  },

  async deleteReview(productId, reviewId) {
    if (!productId || !reviewId) throw new Error('Product ID and review ID required');
    try {
      await fetchWithValidation(`${API_BASE}/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      return true;
    } catch (e) {
      console.warn('deleteReview failed:', e.message);
      return false;
    }
  },

  async getCategories() {
    try {
      const data = await fetchWithValidation(`${API_BASE}/categories`);
      return data.data || null;
    } catch (e) {
      console.warn('getCategories failed:', e.message);
      return null;
    }
  },

  async createCategory(catData) {
    if (!catData || !catData.name) throw new Error('Category name required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      return data.data || null;
    } catch (e) {
      console.warn('createCategory failed:', e.message);
      return null;
    }
  },

  async updateCategory(id, catData) {
    if (!id || !catData) throw new Error('ID and data required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      return data.data || null;
    } catch (e) {
      console.warn('updateCategory failed:', e.message);
      return null;
    }
  },

  async deleteCategory(id) {
    if (!id) throw new Error('ID required');
    try {
      await fetchWithValidation(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      console.warn('deleteCategory failed:', e.message);
      return false;
    }
  },

  async getOrders() {
    try {
      const data = await fetchWithValidation(`${API_BASE}/orders`);
      return data.data || null;
    } catch (e) {
      console.warn('getOrders failed:', e.message);
      return null;
    }
  },

  async createOrder(orderData) {
    if (!orderData || !orderData.items) throw new Error('Order data required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      return data.data || null;
    } catch (e) {
      console.warn('createOrder failed:', e.message);
      return null;
    }
  },

  async updateOrderStatus(id, status) {
    if (!id || !status) throw new Error('ID and status required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      return data.data || null;
    } catch (e) {
      console.warn('updateOrderStatus failed:', e.message);
      return null;
    }
  },

  async getPromos() {
    try {
      const data = await fetchWithValidation(`${API_BASE}/promos`);
      return data.data || null;
    } catch (e) {
      console.warn('getPromos failed:', e.message);
      return null;
    }
  },

  async createPromo(promoData) {
    if (!promoData || !promoData.code) throw new Error('Promo code required');
    try {
      const data = await fetchWithValidation(`${API_BASE}/promos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData)
      });
      return data.data || null;
    } catch (e) {
      console.warn('createPromo failed:', e.message);
      return null;
    }
  },

  async deletePromo(code) {
    if (!code) throw new Error('Code required');
    try {
      await fetchWithValidation(`${API_BASE}/promos/${code}`, { method: 'DELETE' });
      return true;
    } catch (e) {
      console.warn('deletePromo failed:', e.message);
      return false;
    }
  },

  async resetData() {
    try {
      const data = await fetchWithValidation(`${API_BASE}/reset-data`, { method: 'POST' });
      return data.data || null;
    } catch (e) {
      console.warn('resetData failed:', e.message);
      return null;
    }
  },

  async search(query) {
    if (!query || query.trim().length === 0) {
      return { success: true, data: [], categories: [] };
    }
    try {
      const encodedQuery = encodeURIComponent(query);
      const data = await fetchWithValidation(`${API_BASE}/search?q=${encodedQuery}`);
      return data;
    } catch (e) {
      console.warn('search failed:', e.message);
      return { success: false, data: [], categories: [] };
    }
  }
};