'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="glass-effect sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === '/' 
                  ? 'bg-vision-primary text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/meals"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === '/meals'
                  ? 'bg-vision-primary text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Meals
            </Link>
            <Link
              href="/reminders"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                pathname === '/reminders'
                  ? 'bg-vision-primary text-white shadow-lg'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white'
              }`}
            >
              Reminders
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 