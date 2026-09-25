'use client';

import React, { useState } from 'react';
import { FiAlertTriangle, FiLoader } from 'react-icons/fi';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  productTitle = 'this product',
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-zinc-200 p-6 text-center">
        
        {/* Warning Icon */}
        <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3 border border-red-200">
          <FiAlertTriangle className="w-6 h-6" />
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-bold text-zinc-900 mb-1.5">Delete Product</h3>
        <p className="text-xs text-zinc-600 mb-6">
          Are you sure you want to delete <span className="font-bold text-zinc-900">"{productTitle}"</span>? This will remove it from your inventory display.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-100 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isDeleting}
            id="confirm-delete-button"
            className="inline-flex items-center gap-1.5 px-5 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition shadow-md shadow-red-600/20 cursor-pointer"
          >
            {isDeleting && <FiLoader className="w-3.5 h-3.5 animate-spin" />}
            <span>Delete</span>
          </button>
        </div>

      </div>
    </div>
  );
}
