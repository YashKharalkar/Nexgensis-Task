'use client';

import React from 'react';
import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi';

export default function ErrorState({ message = 'Failed to load data.', onRetry }) {
  return (
    <div className="bg-white border border-[#D5E4EE] rounded-2xl p-6 my-6 text-center max-w-md mx-auto shadow-sm">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-200">
        <FiAlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-sm font-bold text-[#072D44] mb-1">Error Loading Data</h3>
      <p className="text-xs text-zinc-600 mb-4">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          id="retry-button"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#064469] hover:bg-[#072D44] text-white text-xs font-bold rounded-lg transition shadow-md shadow-[#064469]/20 cursor-pointer"
        >
          <FiRefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
}
