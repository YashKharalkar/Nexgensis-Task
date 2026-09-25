'use client';

import React from 'react';
import { FiLoader } from 'react-icons/fi';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <FiLoader className="w-8 h-8 text-[#064469] animate-spin mb-2" />
      <p className="text-[#072D44] font-semibold text-xs">{text}</p>
    </div>
  );
}
