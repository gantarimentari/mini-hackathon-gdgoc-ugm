'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { HiMenu, HiX } from 'react-icons/hi';
import { AiOutlineHome, AiOutlineCompass, AiOutlineNotification, AiOutlineDashboard, AiOutlineLogout, AiOutlineLogin } from 'react-icons/ai';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated, user, logout } = useAuth();
  const menuRef = useRef(null);

  // sembunyiin navbar kalo di halaman login/register
  if (pathname.startsWith('/auth/')) return null;

  const navLinks = [
    { href: '/', label: 'Home', icon: AiOutlineHome },
    { href: '/recommend-route', label: 'Find Route', icon: AiOutlineCompass },
    { href: '/update-location', label: 'Report', icon: AiOutlineNotification },
    { href: '/dashboard', label: 'Dashboard', icon: AiOutlineDashboard, auth: true },
  ];

  const isActive = (href) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

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
          {/* Panel */}
          <div
            ref={menuRef}
            className="relative w-full bg-surface shadow-lg p-2 px-4 pb-4 flex flex-col gap-0.5"
          >
            {navLinks
              .filter((link) => !link.auth || isAuthenticated)
              .map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`no-underline flex items-center gap-3 py-3 px-3.5 rounded-[10px] font-inter text-[15px] ${
                      isActive(link.href)
                        ? 'font-semibold text-primary bg-primary-light'
                        : 'font-normal text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </Link>
                );
              })}

            {/* Divider */}
            <div className="h-px bg-gray-200 mx-3.5 my-1.5" />

            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-2.5 px-3.5 py-2 font-inter text-[13px] text-gray-500">
                  <div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                    {(user?.name || user?.email || 'U')[0].toUpperCase()}
                  </div>
                  <span>{user?.name || user?.email}</span>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="flex items-center gap-3 py-3 px-3.5 rounded-[10px] font-inter text-[15px] text-danger bg-transparent border-none cursor-pointer text-left w-full"
                >
                  <AiOutlineLogout className="w-5 h-5" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
                className="no-underline flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-white font-inter text-[15px] font-medium mt-1 shadow-sm"
              >
                <AiOutlineLogin className="w-5 h-5" />
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
