import api, { USE_MOCK_API } from './api';
import {
  getStoredProducts,
  getStoredProductById,
  saveStoredProduct,
  deleteStoredProduct,
  getEffectiveCurrentTime
} from './mockStorage';
import { calculateAuctionState } from '../utils/auctionPrice';

export const productService = {
  // Get all products with optional filters
  async getProducts(params = {}) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 150));
      let products = getStoredProducts();

      const { category, search, status, sort, minPrice, maxPrice } = params;

      // Category filter
      if (category && category !== 'ALL') {
        products = products.filter((p) => p.category === category);
      }

      // Search keyword filter
      if (search && search.trim()) {
        const query = search.trim().toLowerCase();
        products = products.filter(
          (p) =>
            p.title.toLowerCase().includes(query) ||
            p.venue.toLowerCase().includes(query) ||
            (p.categoryLabel && p.categoryLabel.toLowerCase().includes(query))
        );
      }

      // Status filter
      if (status && status !== 'ALL') {
        products = products.filter((p) => p.status === status);
      }

      // Price filter
      if (minPrice !== undefined) {
        products = products.filter((p) => (p.currentPrice || p.startPrice) >= minPrice);
      }
      if (maxPrice !== undefined) {
        products = products.filter((p) => (p.currentPrice || p.startPrice) <= maxPrice);
      }

      // Sort
      if (sort === 'closing') {
        products.sort((a, b) => new Date(a.auctionEndTime).getTime() - new Date(b.auctionEndTime).getTime());
      } else if (sort === 'price_asc') {
        products.sort((a, b) => (a.currentPrice || a.startPrice) - (b.currentPrice || b.startPrice));
      } else if (sort === 'price_desc') {
        products.sort((a, b) => (b.currentPrice || b.startPrice) - (a.currentPrice || a.startPrice));
      } else if (sort === 'discount') {
        products.sort((a, b) => {
          const discA = ((a.startPrice - (a.currentPrice || a.startPrice)) / a.startPrice);
          const discB = ((b.startPrice - (b.currentPrice || b.startPrice)) / b.startPrice);
          return discB - discA;
        });
      } else {
        // popular
        products.sort((a, b) => (b.wishlistCount || 0) + (b.viewCount || 0) - ((a.wishlistCount || 0) + (a.viewCount || 0)));
      }

      return products;
    }

    try {
      const res = await api.get('/products', { params });
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    } catch (e) {
      console.error('Failed to get products from API', e);
      return [];
    }
  },

  // Get single product detail by ID
  async getProductById(id) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      return getStoredProductById(id);
    }
    try {
      const res = await api.get(`/products/${id}`);
      return res?.data || res;
    } catch (e) {
      console.error('Failed to get product', e);
      return null;
    }
  },

  // Check inventory and current price before checkout
  async verifyProductAvailability(id) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      const product = getStoredProductById(id);
      if (!product) {
        return { available: false, message: '존재하지 않는 상품입니다.' };
      }
      if (product.status === 'SOLD' || (product.remainingSeats !== undefined && product.remainingSeats <= 0)) {
        return { available: false, message: '다른 사용자가 먼저 구매하여 매진되었습니다.' };
      }
      if (product.status === 'ENDED') {
        return { available: false, message: '경매가 이미 종료된 상품입니다.' };
      }
      const nowMs = getEffectiveCurrentTime();
      const calc = calculateAuctionState(product, nowMs);
      return {
        available: true,
        currentPrice: calc.currentPrice,
        status: calc.status,
      };
    }

    return await api.get(`/products/${id}/verify`);
  },

  // Admin: Create new product
  async createProduct(productData) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return saveStoredProduct(productData);
    }
    return await api.post('/admin/products', productData);
  },

  // Admin: Update product
  async updateProduct(id, productData) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return saveStoredProduct({ ...productData, id });
    }
    return await api.put(`/admin/products/${id}`, productData);
  },

  // Admin: Delete product
  async deleteProduct(id) {
    if (USE_MOCK_API) {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return deleteStoredProduct(id);
    }
    return await api.delete(`/admin/products/${id}`);
  }
};
