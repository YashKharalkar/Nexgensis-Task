'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FiArrowLeft, FiLoader, FiCheck } from 'react-icons/fi';

export default function AddProductPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    stock: '10',
    brand: '',
    description: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const data = await productService.getCategories();
        setCategories(data);
        if (data.length > 0) {
          const firstSlug = typeof data[0] === 'object' ? data[0].slug : data[0];
          setFormData((prev) => ({ ...prev, category: prev.category || firstSlug }));
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (isAuthenticated) {
      fetchCats();
    }
  }, [isAuthenticated]);

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Product title is required';
    }

    if (!formData.price || isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number in INR';
    }

    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }

    if (formData.stock === '' || isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = 'Stock must be 0 or higher';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        stock: parseInt(formData.stock, 10),
        brand: formData.brand.trim(),
        description: formData.description.trim(),
        thumbnail: formData.thumbnail.trim() || 'https://via.placeholder.com/300',
      };

      const res = await productService.addProduct(payload);

      const createdProduct = {
        ...payload,
        ...res,
        id: res.id || Date.now(),
        rating: 5.0,
      };

      try {
        const saved = JSON.parse(localStorage.getItem('local_added_products') || '[]');
        localStorage.setItem(
          'local_added_products',
          JSON.stringify([createdProduct, ...saved])
        );
      } catch (storageErr) {
        console.error(storageErr);
      }

      router.push('/products');
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || 'Failed to create product.' });
    } finally {
      setIsSubmitting(false);
    }
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
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-[#064469] transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-2xl font-black text-[#072D44] tracking-tight">
            Add New Product
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Fill in the details below to add a new product to your inventory
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#D5E4EE] p-6 sm:p-8 shadow-sm">
          {errors.form && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                Product Title <span className="text-[#064469]">*</span>
              </label>
              <input
                type="text"
                id="product-title-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Premium Noise Canceling Wireless Headphones"
                className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition ${
                  errors.title ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE] bg-white'
                }`}
              />
              {errors.title && <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                  Price (₹ INR) <span className="text-[#064469]">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  id="product-price-input"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="2499.00"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition ${
                    errors.price ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE] bg-white'
                  }`}
                />
                {errors.price && <p className="text-xs text-red-600 mt-1 font-medium">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                  Stock Quantity <span className="text-[#064469]">*</span>
                </label>
                <input
                  type="number"
                  id="product-stock-input"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition ${
                    errors.stock ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE] bg-white'
                  }`}
                />
                {errors.stock && <p className="text-xs text-red-600 mt-1 font-medium">{errors.stock}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                  Category <span className="text-[#064469]">*</span>
                </label>
                <select
                  id="product-category-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition bg-white cursor-pointer ${
                    errors.category ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE]'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => {
                    const slug = typeof cat === 'object' ? cat.slug : cat;
                    const name = typeof cat === 'object' ? cat.name : cat;
                    return (
                      <option key={slug} value={slug}>
                        {name}
                      </option>
                    );
                  })}
                </select>
                {errors.category && <p className="text-xs text-red-600 mt-1 font-medium">{errors.category}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                  Brand
                </label>
                <input
                  type="text"
                  id="product-brand-input"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Sony, Apple"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5E4EE] text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                Product Image URL
              </label>
              <input
                type="url"
                id="product-image-input"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                placeholder="https://example.com/product-image.jpg"
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5E4EE] text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
                Description
              </label>
              <textarea
                rows={4}
                id="product-description-input"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe key features, specifications, and warranty details..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-[#D5E4EE] text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
              <Link
                href="/products"
                className="px-5 py-2.5 text-xs font-semibold text-[#072D44] hover:bg-[#F0F6FA] rounded-lg transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                id="save-new-product-button"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#064469] hover:bg-[#072D44] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-md shadow-[#064469]/20 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <FiLoader className="w-4 h-4 animate-spin" />
                    <span>Adding Product...</span>
                  </>
                ) : (
                  <>
                    <FiCheck className="w-4 h-4" />
                    <span>Create Product</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
