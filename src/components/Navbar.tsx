'use client';

import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-brand-700 leading-tight">CheapHouseHub</span>
              <span className="text-[10px] text-gray-400 leading-tight -mt-0.5 hidden sm:block">AFFORDABLE HOMES ACROSS AMERICA</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Home</Link>
            <Link href="/search" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Search Homes</Link>
            <Link href="/search?type=foreclosure" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Foreclosures</Link>
            <Link href="/search?type=auction" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">Auctions</Link>
            <Link href="/about" className="text-gray-600 hover:text-brand-600 font-medium transition-colors">About</Link>
            <Link
              href="/search"
              className="bg-brand-500 hover:bg-brand-600 text-white px-5 py-2 rounded-lg font-semibold transition-colors shadow-md shadow-brand-500/20"
            >
              Find Deals
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-gray-600 transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-3">
            <Link href="/" className="block text-gray-600 hover:text-brand-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/search" className="block text-gray-600 hover:text-brand-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Search Homes</Link>
            <Link href="/search?type=foreclosure" className="block text-gray-600 hover:text-brand-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Foreclosures</Link>
            <Link href="/search?type=auction" className="block text-gray-600 hover:text-brand-600 font-medium py-2" onClick={() => setMobileOpen(false)}>Auctions</Link>
            <Link href="/about" className="block text-gray-600 hover:text-brand-600 font-medium py-2" onClick={() => setMobileOpen(false)}>About</Link>
            <Link
              href="/search"
              className="block bg-brand-500 text-white text-center px-5 py-2.5 rounded-lg font-semibold mt-2"
              onClick={() => setMobileOpen(false)}
            >
              Find Deals
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
