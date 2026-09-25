'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getIndianAdminName } from '@/utils/indianNames';
import { FiLogOut, FiUser, FiChevronDown, FiArrowLeft } from 'react-icons/fi';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const displayName = getIndianAdminName(user);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isDropdownOpen]);

  const handleLogout = () => {
    setIsDropdownOpen(false);
    logout();
  };

  const handleBack = () => {
    router.push('/products');
  };

  return (
    <header className="bg-[#072D44] border-b border-[#064469]/80 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-14">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleBack}
              className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
              title="Go to Products Home"
              id="navbar-back-button"
              aria-label="Back to products"
            >
              <FiArrowLeft className="w-5 h-5" />
            </button>

            <Link
              href="/products"
              className="flex items-center text-lg sm:text-xl font-black tracking-tight text-white hover:text-[#D5E4EE] transition"
            >
              ADMIN<span className="text-[#64B5F6]">HUB</span>
            </Link>
          </div>

          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 py-1 px-2 rounded-lg bg-transparent text-xs transition cursor-pointer hover:opacity-90"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
                id="user-menu-button"
              >
                <div className="w-6 h-6 rounded-full bg-[#064469] border border-[#64B5F6]/40 flex items-center justify-center text-white shrink-0 font-bold">
                  <FiUser className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-xs text-white">
                  {displayName}
                </span>
                <FiChevronDown
                  className={`w-3.5 h-3.5 text-zinc-300 transition-transform duration-200 ${
                    isDropdownOpen ? 'rotate-180 text-white' : ''
                  }`}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#D5E4EE] rounded-xl shadow-xl p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="px-3 py-2.5 border-b border-zinc-100">
                    <p className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
                      Signed in as
                    </p>
                    <p className="font-bold text-[#072D44] text-xs truncate mt-0.5">
                      {displayName}
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      id="logout-button"
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#072D44] cursor-pointer"
                      title="Log out of account"
                    >
                      <FiLogOut className="w-4 h-4 shrink-0" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
