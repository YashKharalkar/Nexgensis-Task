'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { productService } from '@/services/productService';
import { formatINR } from '@/utils/currency';
import { getIndianName } from '@/utils/indianNames';
import Navbar from '@/components/Navbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import {
  FiArrowLeft,
  FiTruck,
  FiShield,
  FiRotateCcw,
  FiMessageSquare,
  FiAlertCircle,
  FiTag,
} from 'react-icons/fi';
import { BsStarFill } from 'react-icons/bs';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      setLoading(true);
      setNotFound(false);
      setError(null);

      try {
        const data = await productService.getProductById(id);
        setProduct(data);
        setActiveImage(data.thumbnail || data.images?.[0] || '');
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setNotFound(true);
        } else {
          setError(err.response?.data?.message || 'Failed to load product details.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchProduct();
    }
  }, [id, isAuthenticated]);

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

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="mb-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-[#064469] transition"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Products</span>
          </Link>
        </div>

        {loading && <LoadingSpinner text="Loading product details..." />}

        {!loading && notFound && (
          <div className="bg-white rounded-2xl border border-[#D5E4EE] p-8 text-center max-w-sm mx-auto my-10 shadow-sm">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-lg font-bold text-[#072D44] mb-1">Product Not Found</h1>
            <p className="text-xs text-zinc-500 mb-5">
              Product ID #{id} was not found in our catalog.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-[#064469] hover:bg-[#072D44] text-white text-xs font-bold rounded-lg transition shadow-md shadow-[#064469]/20"
            >
              Return to Products
            </Link>
          </div>
        )}

        {!loading && !notFound && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center max-w-sm mx-auto my-8">
            <p className="text-red-700 text-xs font-semibold mb-3">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !notFound && product && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#D5E4EE] p-5 sm:p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="w-full h-72 sm:h-80 flex items-center justify-center p-2 overflow-hidden">
                  <img
                    src={activeImage || 'https://via.placeholder.com/400'}
                    alt={product.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {product.images.map((imgUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`w-14 h-14 rounded-lg shrink-0 p-1 overflow-hidden transition cursor-pointer ${
                          activeImage === imgUrl
                            ? 'ring-2 ring-[#064469]'
                            : 'opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-contain"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2.5">
                    <div className="flex items-center gap-1 text-xs font-bold text-[#072D44] capitalize">
                      <FiTag className="w-3.5 h-3.5 text-[#064469]" />
                      <span>{product.category}</span>
                    </div>

                    {product.brand && (
                      <span className="text-xs font-semibold text-zinc-600">
                        Brand: <strong className="text-[#072D44]">{product.brand}</strong>
                      </span>
                    )}

                    {product.sku && (
                      <span className="text-xs text-zinc-400">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>

                  <h1 className="text-xl sm:text-2xl font-black text-[#072D44] leading-snug mb-3">
                    {product.title}
                  </h1>

                  <div className="flex items-center gap-4 mb-4 pb-3 border-b border-zinc-100">
                    <div className="flex items-center gap-1.5">
                      <BsStarFill className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                      <span className="text-sm font-bold text-[#072D44]">
                        {Number(product.rating || 0).toFixed(1)}
                      </span>
                      <span className="text-xs text-zinc-500">
                        ({product.reviews?.length || 0})
                      </span>
                    </div>

                    <div className="flex items-center text-xs font-semibold">
                      <span
                        className={`inline-block w-2 h-2 rounded-full mr-1.5 shrink-0 ${
                          product.stock > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                      />
                      <span className={product.stock > 0 ? 'text-emerald-700' : 'text-rose-600'}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                      </span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl sm:text-3xl font-black text-[#072D44]">
                        {formatINR(product.price)}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-xs font-bold text-[#064469]">
                          {product.discountPercentage}% off
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">
                      Description
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {product.description || 'No description available.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-4 border-t border-zinc-100 text-xs text-zinc-700 font-medium">
                  <div className="flex items-center gap-1.5">
                    <FiTruck className="w-4 h-4 text-[#064469] shrink-0" />
                    <span>{product.shippingInformation || 'Standard Delivery across India'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiShield className="w-4 h-4 text-[#072D44] shrink-0" />
                    <span>{product.warrantyInformation || '1 Year Brand Warranty'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FiRotateCcw className="w-4 h-4 text-[#064469] shrink-0" />
                    <span>{product.returnPolicy || '7-Day Easy Returns'}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#D5E4EE] p-5 sm:p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <FiMessageSquare className="w-4 h-4 text-[#064469]" />
                <h2 className="text-base font-bold text-[#072D44]">
                  Customer Reviews ({product.reviews?.length || 0})
                </h2>
              </div>

              {product.reviews && product.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {product.reviews.map((rev, idx) => {
                    const indianReviewer = getIndianName(rev.reviewerName, idx);

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-white border border-[#D5E4EE] space-y-1.5 hover:border-[#064469]/50 transition"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-[#072D44]">
                            {indianReviewer}
                          </span>
                          <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <BsStarFill
                                key={i}
                                className={`w-3 h-3 ${
                                  i < rev.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-zinc-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-600 italic">
                          "{rev.comment}"
                        </p>

                        {rev.date && (
                          <p className="text-[11px] text-zinc-400">
                            {new Date(rev.date).toLocaleDateString('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-zinc-500 italic">
                  No customer reviews available yet.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
