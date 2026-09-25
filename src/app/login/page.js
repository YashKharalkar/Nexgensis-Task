'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FiLock, FiUser, FiAlertCircle, FiLoader } from 'react-icons/fi';

export default function LoginPage() {
  const [username, setUsername] = useState('emilys');
  const [password, setPassword] = useState('emilyspass');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.replace('/products');
    }
  }, [isAuthenticated, loading, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple clicks/requests

    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(username, password);
      router.push('/products');
    } catch (err) {
      const apiMessage =
        err.response?.data?.message || 'Invalid username or password. Please try again.';
      setError(apiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemoCredentials = () => {
    setUsername('emilys');
    setPassword('emilyspass');
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <FiLoader className="w-8 h-8 text-[#064469] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-white text-[#072D44] relative">
      {/* Login Card (Increased length & breadth with border) */}
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-[#D5E4EE] p-8 sm:p-12">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#072D44] tracking-tight">
            ADMIN<span className="text-[#064469]">HUB</span>
          </h1>
          <p className="text-sm text-zinc-500 mt-1.5">
            Sign in to manage product inventory
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <FiAlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <FiUser className="w-4 h-4" />
              </div>
              <input
                type="text"
                id="username-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5E4EE] rounded-lg text-sm text-[#072D44] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#064469] focus:border-[#064469] transition"
                disabled={isSubmitting}
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-[#072D44] mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-400">
                <FiLock className="w-4 h-4" />
              </div>
              <input
                type="password"
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#D5E4EE] rounded-lg text-sm text-[#072D44] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#064469] focus:border-[#064469] transition"
                disabled={isSubmitting}
                autoComplete="current-password"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            id="login-submit-button"
            disabled={isSubmitting}
            className="w-full mt-3 py-3 px-4 bg-[#064469] hover:bg-[#072D44] disabled:opacity-50 text-white font-bold rounded-lg text-sm transition shadow-md shadow-[#064469]/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <FiLoader className="w-4 h-4 animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>

        </form>

        {/* Auto Fill Section (Background removed, clean layout) */}
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="text-xs font-bold text-[#072D44]">Auto Fill :</span>
            <button
              type="button"
              onClick={fillDemoCredentials}
              className="text-xs font-bold text-[#064469] hover:text-[#072D44] underline underline-offset-2 cursor-pointer"
            >
              Fill Credentials
            </button>
          </div>
          <div className="space-y-1 text-xs text-zinc-600 font-medium">
            <div>
              Username: <span className="font-mono text-[#072D44] font-bold">emilys</span>
            </div>
            <div>
              Password: <span className="font-mono text-[#072D44] font-bold">emilyspass</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
