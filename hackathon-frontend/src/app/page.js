'use client';

import Link from 'next/link';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { MdAccessible, MdLocationOn, MdInfo, MdPeople } from 'react-icons/md';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* bagian hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 bg-gradient-to-b from-surface to-white">
        <div className="max-w-lg mx-auto">
          {/* icon aksesibilitas */}
          <div className="mx-auto mb-6 flex items-center justify-center w-20 h-20 rounded-full bg-primary-light">
            <MdAccessible className="w-10 h-10 text-primary" />
          </div>

          <h1 className="font-rubik font-bold text-[32px] leading-10 text-gray-900 mb-3 mt-0">
            Navigate with
            <span className="text-primary"> Confidence</span>
          </h1>

          <p className="font-rubik text-base leading-6 text-gray-500 mb-8 mt-0">
            TemanJalan helps people with disabilities find accessible, safe routes.
            Report obstacles, discover wheelchair-friendly paths, and travel independently.
          </p>

          {/* tombol aksi */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/recommend-route"
              className="no-underline px-8 py-3 rounded-full text-white font-rubik font-semibold text-base bg-primary shadow-[0_4px_14px_rgba(86,151,108,0.3)] transition-transform hover:scale-105"
            >
              Find Accessible Route
            </Link>
            {!isAuthenticated && (
              <Link
                href="/auth/login"
                className="no-underline px-8 py-3 rounded-full font-rubik font-semibold text-base border-2 border-primary text-primary bg-transparent transition-colors hover:bg-gray-50"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* bagian fitur-fitur */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center mb-12 font-rubik font-semibold text-2xl text-gray-900">
            How TemanJalan Helps You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* fitur pertama */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface">
              <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl bg-primary-light">
                <MdLocationOn className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-rubik font-semibold text-base text-gray-900 mb-2 mt-0">
                Accessible Routes
              </h3>
              <p className="font-rubik text-sm text-gray-500 leading-5 m-0">
                Find wheelchair-friendly paths, ramps, and smooth sidewalks near you.
              </p>
            </div>

            {/* fitur kedua */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface">
              <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl bg-primary-light">
                <MdInfo className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-rubik font-semibold text-base text-gray-900 mb-2 mt-0">
                Report Obstacles
              </h3>
              <p className="font-rubik text-sm text-gray-500 leading-5 m-0">
                Help the community by reporting barriers, construction, or inaccessible areas.
              </p>
            </div>

            {/* fitur ketiga */}
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-surface">
              <div className="flex items-center justify-center mb-4 w-14 h-14 rounded-2xl bg-primary-light">
                <MdPeople className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-rubik font-semibold text-base text-gray-900 mb-2 mt-0">
                Community Driven
              </h3>
              <p className="font-rubik text-sm text-gray-500 leading-5 m-0">
                Powered by real reports from users who share accessibility information.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
