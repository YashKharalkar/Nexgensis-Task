'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiSearch, FiPlus, FiX, FiFilter, FiInfo, FiRotateCcw } from 'react-icons/fi';

export default function FilterBar({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  categories = [],
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
  onOpenAddModal,
  totalResults = 0,
}) {
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Debounce search input: 400ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== search) {
        onSearchChange(searchInput);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, search, onSearchChange]);

  const handleClearFilters = () => {
    setSearchInput('');
    onSearchChange('');
    onCategoryChange('');
    onSortByChange('');
    onOrderChange('asc');
  };

  const hasActiveFilters = Boolean(search || category || sortBy);

  return (
    <div className="bg-white rounded-xl border border-[#D5E4EE] p-4 shadow-sm mb-6 space-y-3">
      
      {/* Search and Add Button Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        
        {/* Search Box */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-400">
            <FiSearch className="w-4 h-4" />
          </div>
          <input
            type="text"
            id="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search products by title..."
            className="w-full pl-9 pr-8 py-2 bg-[#F0F6FA] border border-[#D5E4EE] rounded-lg text-sm text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] focus:border-[#064469] focus:bg-white transition"
          />
          {searchInput && (
            <button
              onClick={() => {
                setSearchInput('');
                onSearchChange('');
              }}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-[#072D44] cursor-pointer"
              title="Clear search"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Add Product Button (Navigates to /products/add new page) */}
        <Link
          href="/products/add"
          id="add-product-button"
          className="inline-flex items-center justify-center gap-1.5 bg-[#064469] hover:bg-[#072D44] text-white px-4 py-2 rounded-lg font-bold text-sm transition shadow-md shadow-[#064469]/20 cursor-pointer"
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Product</span>
        </Link>
      </div>

      {/* Filters & Sorting Row */}
      <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-zinc-100 text-xs">
        
        {/* Category Dropdown */}
        <div className="flex items-center gap-1.5 flex-1 min-w-[170px]">
          <FiFilter className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
          <select
            id="category-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={Boolean(searchInput.trim())}
            className={`w-full py-1.5 px-2.5 border rounded-lg text-xs text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition cursor-pointer ${
              searchInput.trim() ? 'opacity-50 cursor-not-allowed bg-zinc-100 border-zinc-200' : 'bg-white border-[#D5E4EE]'
            }`}
          >
            <option value="">All Categories</option>
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

        {/* Sort By Dropdown */}
        <div className="flex-1 min-w-[150px]">
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
            className="w-full py-1.5 px-2.5 border border-[#D5E4EE] rounded-lg bg-white text-xs text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition cursor-pointer"
          >
            <option value="">Sort by (Default)</option>
            <option value="title">Title (A-Z)</option>
            <option value="price">Price (INR)</option>
            <option value="rating">Rating</option>
          </select>
        </div>

        {/* Sort Order Toggle */}
        {sortBy && (
          <div>
            <select
              id="order-select"
              value={order}
              onChange={(e) => onOrderChange(e.target.value)}
              className="py-1.5 px-2.5 border border-[#D5E4EE] rounded-lg bg-white text-xs text-[#072D44] focus:outline-none focus:ring-2 focus:ring-[#064469] transition cursor-pointer"
            >
              <option value="asc">Ascending (Low-to-High / A-Z)</option>
              <option value="desc">Descending (High-to-Low / Z-A)</option>
            </select>
          </div>
        )}

        {/* Clear / Reset Filters (Background removed, clean transparent outline) */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            id="clear-filters-button"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#072D44] hover:text-[#064469] bg-transparent py-1.5 px-2.5 rounded-lg border border-[#D5E4EE] hover:border-[#064469] transition cursor-pointer"
            title="Reset active filters"
          >
            <FiRotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Note when searching */}
      {Boolean(searchInput.trim()) && (
        <div className="flex items-center gap-1.5 text-xs text-[#072D44] bg-[#F0F6FA] p-2 rounded-lg border border-[#D5E4EE]">
          <FiInfo className="w-3.5 h-3.5 shrink-0 text-[#064469]" />
          <span>Searching across all categories. (DummyJSON API does not support combined category + search filtering).</span>
        </div>
      )}

    </div>
  );
}
