'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b-2 border-gray-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/images/logos/logo.png"
            alt="Omar PT Logo"
            width={120}
            height={60}
            className="h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
            Home
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-gray-900 font-medium">
            Services
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
            About
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
            Contact
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-gray-50 border-t border-gray-300 py-4">
          <div className="flex flex-col gap-3 px-4">
            <Link href="/" className="text-gray-700 hover:text-gray-900 font-medium">
              Home
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-gray-900 font-medium">
              Services
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-gray-900 font-medium">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
