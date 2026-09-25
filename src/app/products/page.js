'use client';

import React, { useState, useEffect, useCallback, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import Navbar from '@/components/Navbar';
import FilterBar from '@/components/FilterBar';
import ProductTable from '@/components/ProductTable';
import ProductCards from '@/components/ProductCards';
import Pagination from '@/components/Pagination';
import ProductModal from '@/components/ProductModal';
import DeleteConfirmModal from '@/components/DeleteConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorState from '@/components/ErrorState';
import { FiPackage, FiCheckCircle } from 'react-icons/fi';

function ProductsContent() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Request ID ref to protect against search/filter race conditions
  const latestRequestIdRef = useRef(0);

  // 1. Read and sanitize query parameters from URL
  const rawPage = searchParams.get('page');
  const parsedPage = parseInt(rawPage, 10);
  const currentPage = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;

  const rawLimit = searchParams.get('limit');
  const parsedLimit = parseInt(rawLimit, 10);
  const pageSize = [10, 20, 50].includes(parsedLimit) ? parsedLimit : 10;

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const sortBy = searchParams.get('sortBy') || '';
  const order = searchParams.get('order') || 'asc';

  // 2. Component State
  const [products, setProducts] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Local CRUD overrides (optimistic frontend state)
  const [localAddedProducts, setLocalAddedProducts] = useState([]);
  const [localUpdatedProducts, setLocalUpdatedProducts] = useState({});
  const [localDeletedIds, setLocalDeletedIds] = useState(new Set());

  // Toast notification state
  const [toast, setToast] = useState(null);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Helper to update URL search parameters
  const updateUrlParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  // Route protection
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };

    if (isAuthenticated) {
      fetchCategories();
      try {
        const savedAdded = JSON.parse(localStorage.getItem('local_added_products') || '[]');
        if (savedAdded && savedAdded.length > 0) {
          setLocalAddedProducts(savedAdded);
        }
      } catch (e) {
        console.error('Failed to load local_added_products:', e);
      }
    }
  }, [isAuthenticated]);

  // Fetch products with race condition protection
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Increment request ID so previous slow/delayed requests are discarded
    const currentRequestId = ++latestRequestIdRef.current;

    try {
      const skip = (currentPage - 1) * pageSize;
      const data = await productService.getProducts({
        limit: pageSize,
        skip,
        search,
        category,
        sortBy,
        order,
      });

      // If a newer request has already fired, ignore this response
      if (currentRequestId !== latestRequestIdRef.current) {
        return;
      }

      let fetchedList = data.products || [];

      // Apply local updates
      fetchedList = fetchedList.map((item) => {
        if (localUpdatedProducts[item.id]) {
          return { ...item, ...localUpdatedProducts[item.id] };
        }
        return item;
      });

      // Filter out deleted
      fetchedList = fetchedList.filter((item) => !localDeletedIds.has(item.id));

      // Prepend local adds on page 1
      if (currentPage === 1 && !search && !category) {
        const customAdded = localAddedProducts.filter(
          (p) => !localDeletedIds.has(p.id)
        );
        fetchedList = [...customAdded, ...fetchedList];
      }

      setProducts(fetchedList);
      setTotalProducts(data.total || fetchedList.length);
    } catch (err) {
      if (currentRequestId === latestRequestIdRef.current) {
        setError(err.response?.data?.message || err.message || 'Failed to load products.');
      }
    } finally {
      if (currentRequestId === latestRequestIdRef.current) {
        setLoading(false);
      }
    }
  }, [
    currentPage,
    pageSize,
    search,
    category,
    sortBy,
    order,
    localAddedProducts,
    localUpdatedProducts,
    localDeletedIds,
  ]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [fetchProducts, isAuthenticated]);

  // Filter handlers
  const handleSearchChange = (newSearch) => {
    updateUrlParams({ search: newSearch, page: 1 });
  };

  const handleCategoryChange = (newCategory) => {
    updateUrlParams({ category: newCategory, page: 1 });
  };

  const handleSortByChange = (newSortBy) => {
    updateUrlParams({ sortBy: newSortBy, page: 1 });
  };

  const handleOrderChange = (newOrder) => {
    updateUrlParams({ order: newOrder, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateUrlParams({ page: newPage });
  };

  const handlePageSizeChange = (newSize) => {
    updateUrlParams({ limit: newSize, page: 1 });
  };

  // CRUD Handlers
  const handleOpenAdd = () => {
    setSelectedProduct(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleSaveProduct = async (formData) => {
    if (selectedProduct) {
      const updated = await productService.updateProduct(selectedProduct.id, formData);
      const mergedProduct = { ...selectedProduct, ...formData, ...updated };

      setLocalUpdatedProducts((prev) => ({
        ...prev,
        [selectedProduct.id]: mergedProduct,
      }));

      setProducts((prev) =>
        prev.map((item) => (item.id === selectedProduct.id ? mergedProduct : item))
      );

      showToast(`Product "${formData.title}" updated.`);
    } else {
      const newProduct = await productService.addProduct(formData);
      const createdItem = {
        ...formData,
        ...newProduct,
        id: newProduct.id || Date.now(),
        rating: 5.0,
      };

      setLocalAddedProducts((prev) => [createdItem, ...prev]);
      setProducts((prev) => [createdItem, ...prev]);
      setTotalProducts((prev) => prev + 1);

      showToast(`Product "${formData.title}" created.`);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;

    await productService.deleteProduct(productToDelete.id);

    setLocalDeletedIds((prev) => new Set(prev).add(productToDelete.id));
    setProducts((prev) => prev.filter((item) => item.id !== productToDelete.id));
    setTotalProducts((prev) => Math.max(0, prev - 1));

    showToast(`Product "${productToDelete.title}" deleted.`);
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <LoadingSpinner text="Authenticating..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col text-[#072D44]">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        
        {/* Toast Notification */}
        {toast && (
          <div className="fixed top-16 right-4 z-50 flex items-center gap-2 px-4 py-3 bg-[#072D44] text-white text-xs font-semibold rounded-xl shadow-2xl border border-[#064469] animate-slide-in">
            <FiCheckCircle className="w-4 h-4 text-[#64B5F6] shrink-0" />
            <span>{toast.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#072D44] tracking-tight">
              Product Inventory
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              Live admin dashboard managing items, pricing in INR, categories, and inventory
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar
          search={search}
          onSearchChange={handleSearchChange}
          category={category}
          onCategoryChange={handleCategoryChange}
          categories={categories}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          order={order}
          onOrderChange={handleOrderChange}
          onOpenAddModal={handleOpenAdd}
          totalResults={totalProducts}
        />

        {/* Loading, Error, Empty, or Table */}
        {loading ? (
          <LoadingSpinner text="Fetching products from catalog..." />
        ) : error ? (
          <ErrorState message={error} onRetry={fetchProducts} />
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D5E4EE] p-10 text-center shadow-sm max-w-sm mx-auto my-8">
            <div className="w-12 h-12 bg-[#F0F6FA] text-[#064469] rounded-full flex items-center justify-center mx-auto mb-3 border border-[#D5E4EE]">
              <FiPackage className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#072D44] mb-1">No products found</h3>
            <p className="text-xs text-zinc-500 mb-4">
              {currentPage > 1
                ? `No products found on page ${currentPage}.`
                : 'Try adjusting your search query or selected category.'}
            </p>
            <button
              onClick={() => {
                updateUrlParams({ search: '', category: '', sortBy: '', order: 'asc', page: 1 });
              }}
              className="inline-flex items-center px-4 py-2 bg-[#064469] hover:bg-[#072D44] text-white text-xs font-bold rounded-lg transition shadow-md shadow-[#064469]/20 cursor-pointer"
            >
              Reset to Page 1
            </button>
          </div>
        ) : (
          <>
            <ProductTable
              products={products}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />

            <ProductCards
              products={products}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
            />

            <Pagination
              currentPage={currentPage}
              totalItems={totalProducts}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </>
        )}

      </main>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProduct}
        initialData={selectedProduct}
        categories={categories}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        productTitle={productToDelete?.title}
      />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
          <LoadingSpinner text="Loading..." />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
