const API_BASE = '/api';

export const api = {
  async getDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/stats/dashboard`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API getDashboardStats error', e);
      return null;
    }
  },

  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API getProducts error', e);
      return null;
    }
  },

  async createProduct(productData) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API createProduct error', e);
      return null;
    }
  },

  async updateProduct(id, productData) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API updateProduct error', e);
      return null;
    }
  },

  async deleteProduct(id) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API request failed');
      return true;
    } catch (e) {
      console.warn('API deleteProduct error', e);
      return false;
    }
  },

  async addReview(productId, reviewData) {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data;
    } catch (e) {
      console.warn('API addReview error', e);
      return null;
    }
  },

  async deleteReview(productId, reviewId) {
    try {
      const res = await fetch(`${API_BASE}/products/${productId}/reviews/${reviewId}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API request failed');
      return true;
    } catch (e) {
      console.warn('API deleteReview error', e);
      return false;
    }
  },

  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API getCategories error', e);
      return null;
    }
  },

  async createCategory(catData) {
    try {
      const res = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API createCategory error', e);
      return null;
    }
  },

  async updateCategory(id, catData) {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API updateCategory error', e);
      return null;
    }
  },

  async deleteCategory(id) {
    try {
      const res = await fetch(`${API_BASE}/categories/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API request failed');
      return true;
    } catch (e) {
      console.warn('API deleteCategory error', e);
      return false;
    }
  },

  async getOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API getOrders error', e);
      return null;
    }
  },

  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API createOrder error', e);
      return null;
    }
  },

  async updateOrderStatus(id, status) {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API updateOrderStatus error', e);
      return null;
    }
  },

  async getPromos() {
    try {
      const res = await fetch(`${API_BASE}/promos`);
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API getPromos error', e);
      return null;
    }
  },

  async createPromo(promoData) {
    try {
      const res = await fetch(`${API_BASE}/promos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promoData)
      });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API createPromo error', e);
      return null;
    }
  },

  async deletePromo(code) {
    try {
      const res = await fetch(`${API_BASE}/promos/${code}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('API request failed');
      return true;
    } catch (e) {
      console.warn('API deletePromo error', e);
      return false;
    }
  },

  async resetData() {
    try {
      const res = await fetch(`${API_BASE}/reset-data`, { method: 'POST' });
      if (!res.ok) throw new Error('API request failed');
      const data = await res.json();
      return data.data;
    } catch (e) {
      console.warn('API resetData error', e);
      return null;
    }
  }
};