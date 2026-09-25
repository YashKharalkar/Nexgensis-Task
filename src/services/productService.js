import axiosClient from '@/api/axiosClient';

// Product service functions to communicate with DummyJSON Products API
export const productService = {
  // 1. Fetch products with pagination, search, category filter, and sorting
  getProducts: async ({ limit = 10, skip = 0, search = '', category = '', sortBy = '', order = 'asc' } = {}) => {
    let url = '/products';
    const params = { limit, skip };

    // If sorting parameters are provided
    if (sortBy) {
      params.sortBy = sortBy;
      params.order = order;
    }

    // Determine the right endpoint based on filters:
    // If search is provided, use the search endpoint
    if (search && search.trim() !== '') {
      url = '/products/search';
      params.q = search.trim();
    }
    // Else if category is provided, use the category endpoint
    else if (category && category.trim() !== '') {
      url = `/products/category/${encodeURIComponent(category.trim())}`;
    }

    const response = await axiosClient.get(url, { params });
    return response.data; // { products: [...], total, skip, limit }
  },

  // 2. Fetch all available product categories
  getCategories: async () => {
    const response = await axiosClient.get('/products/categories');
    return response.data;
  },

  // 3. Fetch a single product by ID
  getProductById: async (id) => {
    const response = await axiosClient.get(`/products/${id}`);
    return response.data;
  },

  // 4. Add a new product (DummyJSON mocks the creation)
  addProduct: async (productData) => {
    const response = await axiosClient.post('/products/add', productData);
    return response.data;
  },

  // 5. Update an existing product
  updateProduct: async (id, productData) => {
    const response = await axiosClient.put(`/products/${id}`, productData);
    return response.data;
  },

  // 6. Delete a product
  deleteProduct: async (id) => {
    const response = await axiosClient.delete(`/products/${id}`);
    return response.data;
  },
};
