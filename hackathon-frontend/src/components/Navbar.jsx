'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const menuRef = useRef(null);

  // sembunyiin navbar kalo di halaman login/register
  if (pathname.startsWith('/auth/')) return null;

  const navLinks = [
    { href: '/update-location', label: 'Laporkan' },
    { href: '/recommend-route', label: 'Cari Rute' },
  ];

  const isMapPage = pathname === '/recommend-route';

  return (
    <>
      <nav
        className={`w-full h-[52px] flex items-center justify-between px-5 box-border z-50 ${
          isMapPage
            ? 'absolute top-0 left-0 bg-surface/95 backdrop-blur-sm'
            : 'sticky top-0 bg-surface'
        }`}
      >
        {/* logo brand */}
        <Link href="/" className="no-underline flex items-center gap-1.5">
          <span className="font-rubik italic font-semibold text-base leading-[22px] text-primary">
            TemanJalan
          </span>
        </Link>

        {/* tombol menu */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
          className="w-8 h-8 bg-transparent border-none cursor-pointer flex items-center justify-center p-0"
        >
          {menuOpen ? (
            <HiX className="w-[22px] h-[22px] text-primary" />
          ) : (
            <HiMenu className="w-[22px] h-[22px] text-primary" />
          )}
        </button>
      </nav>

      {/* Dropdown menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 top-[52px]">
          {/* Overlay */}
          <div
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 bg-black/25"
          />
          {/* Panel - Figma specs */}
          <div
            ref={menuRef}
            className="relative w-full bg-[#F6F7FB] shadow-[0_4px_4px_rgba(86,151,108,0.33)] rounded-b-lg py-2.5 px-[35px] flex flex-col gap-2.5"
          >
            {/* TemanJalan brand - centered */}
            <div className="flex justify-center items-center py-1">
              <Link 
                href="/" 
                onClick={() => setMenuOpen(false)}
                className="no-underline font-rubik italic font-semibold text-base leading-[22px] text-primary"
              >
                TemanJalan
              </Link>
            </div>

            {/* Menu links - centered text */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="no-underline flex justify-center items-center py-1 font-rubik font-medium text-base leading-[22px] text-primary"
              >
                {link.label}
              </Link>
            ))}

            {/* Keluar / Login button */}
            {isAuthenticated ? (
              <button
                onClick={() => { logout(); setMenuOpen(false); }}
                className="flex justify-center items-center py-1 w-full bg-[#C13127] rounded-lg border-none cursor-pointer"
              >
                <span className="font-rubik font-medium text-base leading-[22px] text-white py-1">
                  Keluar
                </span>
              </button>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="no-underline flex justify-center items-center py-1 w-full bg-primary rounded-lg"
              >
                <span className="font-rubik font-medium text-base leading-[22px] text-white py-1">
                  Login
                </span>
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
