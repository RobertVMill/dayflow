"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FitnessMetrics from '../components/FitnessMetrics';
import LearningMetrics from '../components/LearningMetrics';
import EmpathyMetrics from '../components/EmpathyMetrics';

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="max-w-2xl text-center sm:text-left mb-8">
          <h1 className="text-4xl font-semibold mb-4">Vision</h1>
          <p className="text-lg text-foreground/80 leading-relaxed">
            Go placidly amongst the noise and the haste. Never let people down, most importantly yourself. Relentlessly strengthen your base. Relentlessly extend your differentiation.
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

        <div className="w-full max-w-2xl flex justify-center my-8">
          <svg
            viewBox="0 0 400 200"
            className="w-full max-w-md h-auto stroke-current fill-none stroke-2"
            style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
          >
            {/* Upward Arrow */}
            <path d="M 200 150 L 200 50" className="stroke-current" />
            <path d="M 200 50 L 180 70" className="stroke-current" />
            <path d="M 200 50 L 220 70" className="stroke-current" />
            
            {/* Diverging Paths */}
            <path d="M 200 150 L 150 100" className="stroke-current opacity-70" />
            <path d="M 200 150 L 250 100" className="stroke-current opacity-70" />
            
            {/* Decorative Elements */}
            <circle cx="200" cy="150" r="5" className="fill-current" />
            <circle cx="150" cy="100" r="3" className="fill-current opacity-70" />
            <circle cx="250" cy="100" r="3" className="fill-current opacity-70" />
          </svg>
        </div>

        <div className="max-w-2xl text-center sm:text-left">
          <h2 className="text-2xl font-semibold mb-4">Relentlessly extend your differentiation</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-medium mb-2">Fitness</h3>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Constantly pushing boundaries, setting new personal records, and maintaining peak physical condition.
              </p>
              <FitnessMetrics />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Learning</h3>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Deep work, continuous study, and relentless curiosity across diverse domains. Building knowledge that compounds over time.
              </p>
              <LearningMetrics />
            </div>
            <div>
              <h3 className="text-xl font-medium mb-2">Empathy</h3>
              <p className="text-lg text-foreground/80 leading-relaxed mb-6">
                Developing deeper connections, understanding perspectives, and fostering meaningful relationships.
              </p>
              <EmpathyMetrics />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
