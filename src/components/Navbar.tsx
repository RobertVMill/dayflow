'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16">
          <div className="flex space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/' 
                  ? 'bg-[#8B1E1E] text-white'
                  : 'text-gray-300 hover:bg-[#8B1E1E]/50 hover:text-white'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/meals"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === '/meals'
                  ? 'bg-[#8B1E1E] text-white'
                  : 'text-gray-300 hover:bg-[#8B1E1E]/50 hover:text-white'
              }`}
            >
              Meals
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 