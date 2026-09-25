import axiosClient from '@/api/axiosClient';

export const productService = {
  getProducts: async ({ limit = 10, skip = 0, search = '', category = '', sortBy = '', order = 'asc' } = {}) => {
    let url = '/products';
    const params = { limit, skip };

    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order;
    }

    if (search && search.trim() !== '') {
      url = '/products/search';
      params.q = search.trim();
    } else if (category && category.trim() !== '') {
      url = `/products/category/${encodeURIComponent(category.trim())}`;
    }

    const response = await axiosClient.get(url, { params });
    return response.data;
  },

  getCategories: async () => {
    const response = await axiosClient.get('/products/categories');
    return response.data;
  },

  getProductById: async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  addProduct: async (productData) => {
    const response = await axiosClient.post('/products/add', productData);
    return response.data;
  },

  updateProduct: async (id, productData) => {
    const response = await axiosClient.put(`/products/${id}`, productData);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },
};
