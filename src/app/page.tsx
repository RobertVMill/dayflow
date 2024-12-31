"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FitnessMetrics from '../components/FitnessMetrics';
import LearningMetrics from '../components/LearningMetrics';
import EmpathyMetrics from '../components/EmpathyMetrics';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const password = localStorage.getItem('appPassword');
      if (password !== process.env.NEXT_PUBLIC_APP_PASSWORD) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    } catch (err) {
      setError('Failed to initialize app');
      console.error(err);
    }
  }, [router]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="space-y-12">
          {/* Vision Section */}
          <section className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tight">Vision</h1>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
              Go placidly amongst the noise and the haste. Never let people down, most importantly yourself. 
              Relentlessly strengthen your base. Relentlessly extend your differentiation.
            </p>
          </section>

          {/* Base Section */}
          <section className="space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight">Relentlessly strengthen the base</h2>
            <ul className="space-y-2 text-lg text-gray-300">
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
          </section>

          {/* Differentiation Section */}
          <section className="space-y-8">
            <h2 className="text-3xl font-semibold tracking-tight">Relentlessly extend your differentiation</h2>
            <div className="space-y-12">
              {/* Fitness Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Fitness</h3>
                <p className="text-lg text-gray-300">
                  Constantly pushing boundaries, setting new personal records, and maintaining peak physical condition.
                </p>
                <div className="mt-6">
                  <FitnessMetrics />
                </div>
              </div>

              {/* Learning Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Learning</h3>
                <p className="text-lg text-gray-300">
                  Deep work, continuous study, and relentless curiosity across diverse domains. 
                  Building knowledge that compounds over time.
                </p>
                <div className="mt-6">
                  <LearningMetrics />
                </div>
              </div>

              {/* Empathy Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium">Empathy</h3>
                <p className="text-lg text-gray-300">
                  Developing deeper connections, understanding perspectives, and fostering meaningful relationships.
                </p>
                <div className="mt-6">
                  <EmpathyMetrics />
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
