'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-surface pt-8 pb-6 px-6 border-t border-gray-200">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-8">
          {/* Brand */}
          <div>
            <span className="font-rubik italic font-semibold text-xl text-primary">
              TemanJalan
            </span>
            <p className="font-rubik text-[13px] text-gray-500 mt-2 mb-0 max-w-[260px] leading-[18px]">
              Helping people with disabilities navigate safely with accessible route recommendations.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="font-rubik font-semibold text-[13px] text-gray-700 mb-1">
                Navigate
              </span>
              <Link href="/" className="no-underline font-rubik text-[13px] text-gray-500 hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/recommend-route" className="no-underline font-rubik text-[13px] text-gray-500 hover:text-primary transition-colors">
                Find Route
              </Link>
              <Link href="/update-location" className="no-underline font-rubik text-[13px] text-gray-500 hover:text-primary transition-colors">
                Report Issue
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-rubik font-semibold text-[13px] text-gray-700 mb-1">
                Account
              </span>
              <Link href="/auth/login" className="no-underline font-rubik text-[13px] text-gray-500 hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/dashboard" className="no-underline font-rubik text-[13px] text-gray-500 hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-4 text-center">
          <p className="font-rubik text-xs text-gray-500 m-0">
            &copy; 2026 TemanJalan. Making the world more accessible, one route at a time.
          </p>
        </div>
      </div>
    </footer>
  );
}
