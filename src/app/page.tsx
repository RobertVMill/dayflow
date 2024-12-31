"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FitnessMetrics from '../components/FitnessMetrics';
import LearningMetrics from '../components/LearningMetrics';
import EmpathyMetrics from '../components/EmpathyMetrics';
import BaseMetrics from '../components/BaseMetrics';
import JournalEntries from '../components/JournalEntries';

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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="space-y-16">
          {/* Vision Section */}
          <section className="section-gradient space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent animate-vision">Vision</h1>
            
            {/* Vision SVG */}
            <div className="w-full max-w-2xl mx-auto py-8 animate-vision" style={{ animationDelay: '0.2s' }}>
              <svg
                viewBox="0 0 400 200"
                className="w-full h-auto stroke-[#8B1E1E] fill-none stroke-2"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {/* Divine Light Rays */}
                <g className="stroke-[#8B1E1E]/30">
                  <path d="M 200 40 L 200 10" />
                  <path d="M 180 45 L 170 15" />
                  <path d="M 220 45 L 230 15" />
                  <path d="M 160 55 L 140 30" />
                  <path d="M 240 55 L 260 30" />
                </g>

                {/* Central Circle (Divine Guidance) */}
                <circle 
                  cx="200" 
                  cy="80" 
                  r="30" 
                  className="fill-[#8B1E1E]/10 stroke-[#8B1E1E]" 
                />

                {/* Person Silhouette */}
                <path 
                  d="M 185 140 C 185 120, 215 120, 215 140" 
                  className="stroke-[#8B1E1E]" 
                />
                <circle 
                  cx="200" 
                  cy="110" 
                  r="10" 
                  className="fill-[#8B1E1E]/10 stroke-[#8B1E1E]" 
                />

                {/* Growth Path */}
                <path 
                  d="M 200 150 C 200 180, 140 170, 120 150" 
                  className="stroke-[#8B1E1E]" 
                />
                <path 
                  d="M 200 150 C 200 180, 260 170, 280 150" 
                  className="stroke-[#8B1E1E]" 
                />

                {/* Decorative Elements */}
                <path 
                  d="M 100 180 C 100 100, 300 100, 300 180" 
                  className="stroke-[#8B1E1E]/20" 
                />
              </svg>
            </div>

            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl animate-vision" style={{ animationDelay: '0.4s' }}>
              You&apos;ve got something special, Bert. Listen to god&apos;s plan for you. Relentlessly build your base, then relentlessly express your gifts.
            </p>
          </section>

          {/* Base Section */}
          <section className="section-gradient space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h2 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Relentlessly build the base
            </h2>
            
            {/* Foundation SVG */}
            <div className="w-full max-w-2xl mx-auto py-8">
              <svg
                viewBox="0 0 400 200"
                className="w-full h-auto stroke-[#8B1E1E] fill-none stroke-2"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {/* Ground Line */}
                <path d="M 50 150 L 350 150" className="stroke-white/20" />
                
                {/* Foundation Base */}
                <path 
                  d="M 100 150 L 300 150 L 280 180 L 120 180 Z" 
                  className="fill-[#8B1E1E]/10 stroke-[#8B1E1E]" 
                />
                
                {/* Support Lines */}
                <g className="stroke-[#8B1E1E]">
                  <path d="M 120 150 L 120 130" />
                  <path d="M 160 150 L 160 130" />
                  <path d="M 200 150 L 200 130" />
                  <path d="M 240 150 L 240 130" />
                  <path d="M 280 150 L 280 130" />
                </g>
                
                {/* Foundation Top */}
                <path d="M 100 130 L 300 130" className="stroke-[#8B1E1E]" />
                
                {/* Decorative Growth Lines */}
                <path 
                  d="M 80 150 C 80 100, 320 100, 320 150" 
                  className="stroke-[#8B1E1E]/30" 
                />
                <path 
                  d="M 90 150 C 90 110, 310 110, 310 150" 
                  className="stroke-[#8B1E1E]/20" 
                />
              </svg>
            </div>

            <div className="space-y-8">
              <div className="mt-6 bg-black/30 p-6 rounded-xl">
                <BaseMetrics />
              </div>

              <ul className="space-y-3 text-lg text-gray-300">
                {/* All bullet points have been removed */}
              </ul>
            </div>
          </section>

          {/* Differentiation Section */}
          <section className="section-gradient space-y-8 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h2 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Relentlessly extend your differentiation
            </h2>

            {/* Differentiation SVG */}
            <div className="w-full max-w-2xl mx-auto py-8">
              <svg
                viewBox="0 0 400 200"
                className="w-full h-auto stroke-[#8B1E1E] fill-none stroke-2"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {/* Central Growth Line */}
                <path 
                  d="M 200 180 L 200 40" 
                  className="stroke-[#8B1E1E]" 
                />
                
                {/* Diverging Paths */}
                <g className="stroke-[#8B1E1E]">
                  <path d="M 200 120 L 140 60" />
                  <path d="M 200 120 L 260 60" />
                  <path d="M 200 120 L 200 60" />
                </g>

                {/* Path Endpoints */}
                <g className="fill-[#8B1E1E]">
                  <circle cx="140" cy="60" r="4" />
                  <circle cx="200" cy="40" r="4" />
                  <circle cx="260" cy="60" r="4" />
                </g>

                {/* Decorative Elements */}
                <g className="stroke-[#8B1E1E]/30">
                  <path d="M 160 180 C 160 140, 240 140, 240 180" />
                  <path d="M 120 180 C 120 100, 280 100, 280 180" />
                </g>

                {/* Labels */}
                <g className="fill-white text-sm">
                  <text x="125" y="50" className="text-[10px]">Fitness</text>
                  <text x="180" y="30" className="text-[10px]">Learning</text>
                  <text x="245" y="50" className="text-[10px]">Empathy</text>
                </g>
              </svg>
            </div>

            <div className="space-y-12">
              {/* Fitness Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium text-[#8B1E1E]">Fitness</h3>
                <p className="text-lg text-gray-300">
                  Fitness is the hidden superpower because it lets you do 10x more for 10x longer.
                </p>
                <div className="mt-6 bg-black/30 p-6 rounded-xl">
                  <FitnessMetrics />
                </div>
              </div>

              {/* Learning Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium text-[#8B1E1E]">Learning</h3>
                <p className="text-lg text-gray-300">
                  The best learner is the best earner.
                </p>
                <div className="mt-6 bg-black/30 p-6 rounded-xl">
                  <LearningMetrics />
                </div>
              </div>

              {/* Empathy Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-medium text-[#8B1E1E]">Empathy</h3>
                <p className="text-lg text-gray-300">
                  Building an empathy is an absolute super power for making friends, money, and fullfillment.
                </p>
                <div className="mt-6 bg-black/30 p-6 rounded-xl">
                  <EmpathyMetrics />
                </div>
              </div>
            </div>
          </section>

          {/* Execute Today Section */}
          <section className="section-gradient space-y-8 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h2 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Relentlessly Execute Today
            </h2>
            
            {/* Journal SVG */}
            <div className="w-full max-w-2xl mx-auto py-8">
              <svg
                viewBox="0 0 400 200"
                className="w-full h-auto stroke-[#8B1E1E] fill-none stroke-2"
                style={{ strokeLinecap: 'round', strokeLinejoin: 'round' }}
              >
                {/* Journal Book Shape */}
                <path 
                  d="M 100 50 L 300 50 L 300 150 L 100 150 Z" 
                  className="fill-[#8B1E1E]/10 stroke-[#8B1E1E]" 
                />
                
                {/* Journal Binding */}
                <path 
                  d="M 90 45 L 90 155 C 90 155, 100 150, 100 150 L 100 50 C 100 50, 90 45, 90 45" 
                  className="fill-[#8B1E1E]/20 stroke-[#8B1E1E]" 
                />
                
                {/* Journal Lines */}
                <g className="stroke-[#8B1E1E]/30">
                  <path d="M 120 70 L 280 70" />
                  <path d="M 120 90 L 280 90" />
                  <path d="M 120 110 L 280 110" />
                  <path d="M 120 130 L 280 130" />
                </g>
                
                {/* Decorative Elements */}
                <path 
                  d="M 150 40 C 150 30, 250 30, 250 40" 
                  className="stroke-[#8B1E1E]/20" 
                />
              </svg>
            </div>

            <div className="mt-8">
              <JournalEntries />
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
