'use client';

import React, { useState, useEffect } from 'react';
import { FiX, FiLoader } from 'react-icons/fi';

export default function ProductModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  categories = [],
}) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    category: '',
    stock: '',
    brand: '',
    description: '',
    thumbnail: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        category: initialData.category || '',
        stock: initialData.stock !== undefined ? String(initialData.stock) : '',
        brand: initialData.brand || '',
        description: initialData.description || '',
        thumbnail: initialData.thumbnail || '',
      });
    } else {
      setFormData({
        title: '',
        price: '',
        category: categories.length > 0 ? (typeof categories[0] === 'object' ? categories[0].slug : categories[0]) : '',
        stock: '10',
        brand: '',
        description: '',
        thumbnail: '',
      });
    }
    setErrors({});
  }, [initialData, isOpen, categories]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
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

      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors({ form: err.response?.data?.message || err.message || 'Failed to save product.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = Boolean(initialData);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#072D44]/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#D5E4EE] overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#064469] bg-[#072D44] text-white">
          <h2 className="text-base font-bold">
            {isEditMode ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-300 hover:text-white p-1 rounded hover:bg-[#064469] transition cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {errors.form && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-lg font-medium">
              {errors.form}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#072D44] mb-1">
              Product Title <span className="text-[#064469]">*</span>
            </label>
            <input
              type="text"
              id="product-title-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Wireless Noise Canceling Headphones"
              className={`w-full px-3 py-2 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition ${
                errors.title ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE] bg-white'
              }`}
            />
            {errors.title && <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1">
                Price (₹ INR) <span className="text-[#064469]">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                id="product-price-input"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="2499.00"
                className={`w-full px-3 py-2 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition ${
                  errors.price ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE] bg-white'
                }`}
              />
              {errors.price && <p className="text-xs text-red-600 mt-1 font-medium">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1">
                Stock Quantity <span className="text-[#064469]">*</span>
              </label>
              <input
                type="number"
                id="product-stock-input"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="10"
                className={`w-full px-3 py-2 rounded-lg border text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition ${
                  errors.stock ? 'border-red-400 bg-red-50/40' : 'border-[#D5E4EE] bg-white'
                }`}
              />
              {errors.stock && <p className="text-xs text-red-600 mt-1 font-medium">{errors.stock}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1">
                Category <span className="text-[#064469]">*</span>
              </label>
              <select
                id="product-category-input"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[#D5E4EE] bg-white text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition cursor-pointer"
              >
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
            </div>

            <div>
              <label className="block text-xs font-bold text-[#072D44] mb-1">Brand</label>
              <input
                type="text"
                id="product-brand-input"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Sony, Apple"
                className="w-full px-3 py-2 rounded-lg border border-[#D5E4EE] bg-white text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#072D44] mb-1">Image URL</label>
            <input
              type="url"
              id="product-image-input"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 rounded-lg border border-[#D5E4EE] bg-white text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#072D44] mb-1">Description</label>
            <textarea
              rows={3}
              id="product-description-input"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Product details and features..."
              className="w-full px-3 py-2 rounded-lg border border-[#D5E4EE] bg-white text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#072D44] hover:bg-[#F0F6FA] rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              id="save-product-button"
              className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#064469] hover:bg-[#072D44] disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-md shadow-[#064469]/20 cursor-pointer"
            >
              {isSubmitting && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
              <span>{isEditMode ? 'Update Product' : 'Create Product'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
