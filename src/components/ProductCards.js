'use client';

import React from 'react';
import Link from 'next/link';
import { formatINR } from '@/utils/currency';
import { FiEye, FiEdit2, FiTrash2, FiTag } from 'react-icons/fi';
import { BsStarFill } from 'react-icons/bs';

export default function ProductCards({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 md:hidden">
      {products.map((product) => {
        const stock = Number(product.stock) || 0;
        let stockText = `${stock} in stock`;
        let stockDotColor = 'bg-emerald-500';
        let stockTextColor = 'text-emerald-700';

        if (stock <= 0) {
          stockText = 'Out of Stock';
          stockDotColor = 'bg-rose-500';
          stockTextColor = 'text-rose-600';
        } else if (stock < 10) {
          stockText = `Low: ${stock} left`;
          stockDotColor = 'bg-amber-500';
          stockTextColor = 'text-amber-700';
        }

        return (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-[#D5E4EE] p-4 shadow-sm flex flex-col justify-between hover:border-[#064469]/50 transition"
          >
            <div>
              {/* Product Image */}
              <div className="relative w-full h-40 bg-[#F0F6FA] rounded-lg overflow-hidden mb-2.5 border border-[#D5E4EE] flex items-center justify-center p-2">
                <img
                  src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/150'}
                  alt={product.title}
                  className="w-full h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Title & Category (Background removed, font size slightly increased) */}
              <div className="flex items-center justify-between gap-1.5 mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#072D44] capitalize">
                  <FiTag className="w-3.5 h-3.5 text-[#064469]/80 shrink-0" />
                  <span>{product.category}</span>
                </div>

                {/* Stock (Background removed, dot indicator) */}
                <div className="flex items-center text-xs font-semibold">
                  <span className={`inline-block w-2 h-2 rounded-full mr-1.5 shrink-0 ${stockDotColor}`} />
                  <span className={stockTextColor}>{stockText}</span>
                </div>
              </div>

              <Link
                href={`/products/${product.id}`}
                className="font-bold text-[#072D44] hover:text-[#064469] transition block text-[15.5px] line-clamp-1 mb-2"
              >
                {product.title}
              </Link>

              {/* Price (INR) & Rating */}
              <div className="flex items-center justify-between mb-3.5">
                <div>
                  <span className="text-[17px] font-extrabold text-[#072D44]">
                    {formatINR(product.price)}
                  </span>
                  {product.discountPercentage > 0 && (
                    <span className="text-xs text-[#064469] font-bold ml-1.5">
                      {product.discountPercentage}% off
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200">
                  <BsStarFill className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-bold text-[#072D44]">
                    {Number(product.rating || 0).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-zinc-100">
              <Link
                href={`/products/${product.id}`}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#F0F6FA] hover:bg-[#072D44] hover:text-white text-[#072D44] rounded-lg text-xs font-bold transition border border-[#D5E4EE]"
              >
                <FiEye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>

              <button
                onClick={() => onEdit(product)}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#F0F6FA] hover:bg-[#064469] hover:text-white text-[#072D44] rounded-lg text-xs font-bold transition border border-[#D5E4EE] cursor-pointer"
              >
                <FiEdit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>

              <button
                onClick={() => onDelete(product)}
                className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#F0F6FA] hover:bg-red-50 hover:text-red-700 text-[#072D44] rounded-lg text-xs font-bold transition border border-[#D5E4EE] cursor-pointer"
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>

          </div>
        );
      })}
    </div>
  );
}
