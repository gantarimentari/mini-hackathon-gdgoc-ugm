'use client';

import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { FiMap, FiMapPin, FiEdit, FiCompass, FiChevronRight } from 'react-icons/fi';
import { AiOutlineNotification } from 'react-icons/ai';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const stats = [
    { label: 'Routes Found', value: '12', icon: FiMap, bg: 'bg-primary-light', color: 'text-primary' },
    { label: 'Saved Places', value: '28', icon: FiMapPin, bg: 'bg-blue-50', color: 'text-blue-700' },
    { label: 'Reports Made', value: '5', icon: FiEdit, bg: 'bg-orange-50', color: 'text-orange-800' },
  ];

  const quickActions = [
    { label: 'Find Route', desc: 'Search accessible paths', icon: FiCompass, href: '/recommend-route' },
    { label: 'Report Location', desc: 'Share accessibility info', icon: AiOutlineNotification, href: '/update-location' },
    { label: 'View Map', desc: 'Explore the area', icon: FiMap, href: '/recommend-route' },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* Welcome */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-rubik font-bold text-2xl text-gray-900 m-0">
                Hi, {user?.name || 'Traveler'}! 👋
              </h1>
              <p className="font-rubik text-sm text-gray-500 mt-1 mb-0">
                Ready to explore accessible routes?
              </p>
            </div>
            <button
              onClick={logout}
              className="border-none cursor-pointer px-4 py-2 rounded-[10px] bg-red-50 text-danger font-rubik text-[13px] font-medium"
            >
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
            {stats.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`rounded-xl p-3 sm:p-4 text-center ${s.bg}`}>
                  <Icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 ${s.color}`} />
                  <p className={`font-rubik font-bold text-lg sm:text-[22px] m-0 ${s.color}`}>{s.value}</p>
                  <p className="font-rubik text-[10px] sm:text-[11px] text-gray-500 mt-0.5 mb-0">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* User Info */}
          <div className="rounded-xl p-5 mb-6 bg-surface">
            <p className="font-rubik text-xs font-semibold text-gray-500 mb-3 mt-0 uppercase tracking-[0.5px]">
              Account
            </p>
            {[
              { label: 'Email', value: user?.email },
              { label: 'Name', value: user?.name || 'Not set' },
              { label: 'Member ID', value: user?.id?.slice(0, 8) || '—' },
            ].map((item) => (
              <div key={item.label} className="flex justify-between py-2 border-b border-gray-200">
                <span className="font-rubik text-[13px] text-gray-500">{item.label}</span>
                <span className="font-rubik text-[13px] text-gray-900 font-medium">{item.value}</span>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <p className="font-rubik text-xs font-semibold text-gray-500 mb-3 mt-0 uppercase tracking-[0.5px]">
            Quick Actions
          </p>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-4 p-4 rounded-xl no-underline bg-surface border-[1.5px] border-gray-200"
                >
                  <span className="flex items-center justify-center rounded-xl w-12 h-12 bg-primary-light shrink-0">
                    <Icon className="w-[22px] h-[22px] text-primary" />
                  </span>
                  <div>
                    <p className="font-rubik text-[15px] font-semibold text-gray-900 m-0">{action.label}</p>
                    <p className="font-rubik text-xs text-gray-500 mt-0.5 mb-0">{action.desc}</p>
                  </div>
                  <FiChevronRight className="ml-auto w-[18px] h-[18px] text-gray-500" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
