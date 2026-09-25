'use client';

import React from 'react';
import Link from 'next/link';
import { formatINR } from '@/utils/currency';
import {
  FiEye,
  FiEdit2,
  FiTrash2,
  FiPackage,
  FiTag,
  FiTrendingUp,
  FiLayers,
} from 'react-icons/fi';
import { BsStarFill } from 'react-icons/bs';

export default function ProductTable({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="hidden md:block bg-white rounded-xl border border-[#D5E4EE] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* Header in Deep Navy #072D44 with react-icons and slightly increased font size */}
          <thead className="bg-[#072D44] text-white text-[14px] font-bold uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FiPackage className="w-4 h-4 text-[#D5E4EE]" />
                  <span>Product</span>
                </div>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FiTag className="w-4 h-4 text-[#D5E4EE]" />
                  <span>Category</span>
                </div>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FiTrendingUp className="w-4 h-4 text-[#D5E4EE]" />
                  <span>Price (INR)</span>
                </div>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <BsStarFill className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span>Rating</span>
                </div>
              </th>
              <th scope="col" className="px-5 py-3.5">
                <div className="flex items-center gap-2">
                  <FiLayers className="w-4 h-4 text-[#D5E4EE]" />
                  <span>Stock</span>
                </div>
              </th>
              <th scope="col" className="px-5 py-3.5 text-right">
                <span className="text-[14px]">Actions</span>
              </th>
            </tr>
          </thead>

          {/* Body with slightly increased font sizes and clean transparent category & stock */}
          <tbody className="divide-y divide-zinc-100 bg-white">
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
                stockText = `Low (${stock})`;
                stockDotColor = 'bg-amber-500';
                stockTextColor = 'text-amber-700';
              }

              return (
                <tr
                  key={product.id}
                  className="hover:bg-[#F0F6FA]/60 transition-colors"
                >
                  {/* Thumbnail & Product Title (Font size 16px) */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-lg bg-[#F0F6FA] border border-[#D5E4EE] overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <img
                          src={product.thumbnail || product.images?.[0] || 'https://via.placeholder.com/150'}
                          alt={product.title}
                          className="w-full h-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <div className="max-w-xs">
                        <Link
                          href={`/products/${product.id}`}
                          className="font-bold text-[#072D44] hover:text-[#064469] transition line-clamp-1 text-[16px]"
                          title={product.title}
                        >
                          {product.title}
                        </Link>
                        {product.brand && (
                          <span className="text-xs text-zinc-500 block">
                            {product.brand}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category (Font size 14.5px, no background) */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 text-[14.5px] font-medium text-[#072D44] capitalize">
                      <FiTag className="w-3.5 h-3.5 text-[#064469]/80 shrink-0" />
                      <span>{product.category}</span>
                    </div>
                  </td>

                  {/* Price in INR (Font size 16.5px) */}
                  <td className="px-5 py-3.5">
                    <div className="font-extrabold text-[#072D44] text-[16.5px]">
                      {formatINR(product.price)}
                    </div>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs text-[#064469] font-bold">
                        {product.discountPercentage}% off
                      </span>
                    )}
                  </td>

                  {/* Rating (Font size 14.5px with yellow BsStarFill) */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <BsStarFill className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                      <span className="text-[14.5px] font-bold text-[#072D44]">
                        {Number(product.rating || 0).toFixed(1)}
                      </span>
                    </div>
                  </td>

                  {/* Stock (Font size 14.5px, no background, status dot) */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center text-[14.5px] font-semibold">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 shrink-0 ${stockDotColor}`} />
                      <span className={stockTextColor}>{stockText}</span>
                    </div>
                  </td>

                  {/* Actions (Font size 14px header, icons) */}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/products/${product.id}`}
                        className="p-1.5 text-zinc-500 rounded-lg cursor-pointer inline-flex items-center justify-center"
                        title="View Details"
                      >
                        <FiEye className="w-4.5 h-4.5" />
                      </Link>

                      <button
                        onClick={() => onEdit(product)}
                        className="p-1.5 text-zinc-500 rounded-lg cursor-pointer inline-flex items-center justify-center"
                        title="Edit Product"
                      >
                        <FiEdit2 className="w-4.5 h-4.5" />
                      </button>

                      <button
                        onClick={() => onDelete(product)}
                        className="p-1.5 text-zinc-500 rounded-lg cursor-pointer inline-flex items-center justify-center"
                        title="Delete Product"
                      >
                        <FiTrash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
