'use client';

import React from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start < maxVisiblePages - 1) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-[#D5E4EE] p-3.5 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm text-xs">
      
      {/* Results counter & Per page dropdown */}
      <div className="flex flex-wrap items-center gap-3 text-zinc-600">
        <span>
          Showing <strong className="text-[#072D44]">{startItem}</strong>–
          <strong className="text-[#072D44]">{endItem}</strong> of{' '}
          <strong className="text-[#072D44]">{totalItems}</strong>
        </span>

        <div className="flex items-center gap-1.5">
          <label htmlFor="page-size-select" className="text-zinc-500 font-medium">
            Per page:
          </label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="py-1 px-2.5 bg-transparent border border-[#D5E4EE] rounded text-xs font-semibold text-[#072D44] focus:outline-none focus:ring-1 focus:ring-[#064469] cursor-pointer hover:border-[#064469] transition"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Prev / Pages / Next */}
      <div className="flex items-center gap-1">
        
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          id="prev-page-button"
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition ${
            currentPage <= 1
              ? 'opacity-40 cursor-not-allowed bg-transparent text-zinc-400 border-zinc-200'
              : 'bg-transparent hover:bg-[#F0F6FA] text-[#072D44] border-[#D5E4EE] cursor-pointer'
          }`}
        >
          <FiChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {getPageNumbers().map((pageNum) => {
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-7 h-7 rounded text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                isActive
                  ? 'bg-[#064469] text-white shadow-sm shadow-[#064469]/30'
                  : 'bg-transparent text-[#072D44] hover:bg-[#F0F6FA] hover:text-[#064469] border border-[#D5E4EE]'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          id="next-page-button"
          className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold border transition ${
            currentPage >= totalPages
              ? 'opacity-40 cursor-not-allowed bg-transparent text-zinc-400 border-zinc-200'
              : 'bg-transparent hover:bg-[#F0F6FA] text-[#072D44] border-[#D5E4EE] cursor-pointer'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <FiChevronRight className="w-3.5 h-3.5" />
        </button>

      </div>

    </div>
  );
}
