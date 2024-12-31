"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const password = localStorage.getItem('appPassword');
    if (password !== process.env.NEXT_PUBLIC_APP_PASSWORD) {
      router.push('/login');
    } else {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="max-w-2xl text-center sm:text-left mb-8">
          <h1 className="text-4xl font-semibold mb-4">Vision</h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Go placidly amongst the noise and the haste. Never let people down, most importantly yourself. Relentlessly strengthen your base. Relentlessly build upon your unique capabilities.
          </p>
        </div>

        <div className="w-full max-w-2xl flex justify-center my-8">
          <svg
            viewBox="0 0 400 200"
            className="w-full max-w-md h-auto stroke-current fill-none stroke-2"
            style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          >
            {/* Ground Line */}
            <path d="M 50 150 L 350 150" className="stroke-current" />
            
            {/* Foundation Base */}
            <path d="M 100 150 L 300 150 L 280 170 L 120 170 Z" className="fill-foreground/10" />
            
            {/* Foundation Layers */}
            <g className="stroke-current">
              <path d="M 120 150 L 120 130" />
              <path d="M 160 150 L 160 130" />
              <path d="M 200 150 L 200 130" />
              <path d="M 240 150 L 240 130" />
              <path d="M 280 150 L 280 130" />
            </g>
            
            {/* Foundation Top */}
            <path d="M 100 130 L 300 130" className="stroke-current" />
            
            {/* Decorative Elements */}
            <path d="M 80 150 C 80 100, 320 100, 320 150" className="stroke-current opacity-20" />
            <path d="M 90 150 C 90 110, 310 110, 310 150" className="stroke-current opacity-30" />
          </svg>
        </div>

        <div className="max-w-2xl text-center sm:text-left">
          <h2 className="text-2xl font-semibold mb-4">Relentlessly strengthen the base</h2>
          <ul className="list-none text-lg text-foreground/80 leading-relaxed space-y-2">
            <li>Sleep</li>
            <li>Workout</li>
            <li>Sunlight</li>
            <li>Water</li>
            <li>Plants</li>
            <li>Never letting people down</li>
            <li>Savings</li>
            <li>Meditation</li>
            <li>Long Walks</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
