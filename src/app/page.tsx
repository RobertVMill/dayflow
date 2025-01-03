"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import FitnessMetrics from '../components/FitnessMetrics';
import LearningMetrics from '../components/LearningMetrics';
import EmpathyMetrics from '../components/EmpathyMetrics';
import BaseMetrics from '../components/BaseMetrics';
import JournalEntries from '../components/JournalEntries';
import { fetchGithubCommits } from '../utils/github';

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
        // Fetch GitHub commits when the app loads
        fetchGithubCommits().catch(console.error);
      }
    } catch (err) {
      setError('Failed to initialize app');
      console.error(err);
    }
  }, [router]);

  // Set up periodic GitHub commit fetching
  useEffect(() => {
    if (isLoading) return;

    // Fetch commits every hour
    const interval = setInterval(() => {
      fetchGithubCommits().catch(console.error);
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, [isLoading]);

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
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent animate-vision">Purpose</h1>
            
            <div className="space-y-12 py-8">
              {/* First Statement */}
              <div className="flex items-start space-x-6 animate-vision" style={{ animationDelay: '0.2s' }}>
                <div className="w-16 h-16 flex-shrink-0">
                  <svg viewBox="0 0 64 64" className="w-full h-full stroke-[#D47341] fill-none stroke-[2]">
                    <circle cx="32" cy="32" r="20" className="fill-[#D47341]/20" />
                    <g className="stroke-[#D47341]/50">
                      <path d="M 32 12 L 32 4" />
                      <path d="M 32 60 L 32 52" />
                      <path d="M 12 32 L 4 32" />
                      <path d="M 60 32 L 52 32" />
                    </g>
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-white mb-2">Success is a life full of <span className="text-pink-400">LOVE</span>, <span className="text-yellow-400">ENERGY</span>, <span className="text-emerald-400">ENTHUSIASM</span>, and <span className="text-[#D47341]">EXCITEMENT</span>. You achieve this by deeply conencting with others and improving your craft.</h3>
                </div>
              </div>

              {/* Second Statement */}
              <div className="flex items-start space-x-6 animate-vision" style={{ animationDelay: '0.3s' }}>
                <div className="w-16 h-16 flex-shrink-0">
                  <svg viewBox="0 0 64 64" className="w-full h-full stroke-[#D47341] fill-none stroke-[2]">
                    <path d="M 32 8 L 32 56" className="stroke-[#D47341]" />
                    <path d="M 16 24 L 32 8 L 48 24" className="stroke-[#D47341]" />
                    <path d="M 24 40 L 32 32 L 40 40" className="stroke-[#D47341]/50" />
                    <path d="M 28 52 L 32 48 L 36 52" className="stroke-[#D47341]/30" />
                  </svg>
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-semibold text-white">To deeply connect and imrpove your craft</h3>
                  <ul className="space-y-4 text-xl text-gray-300">
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D47341] mt-1.5">•</span>
                      <span>Relentlessly build your base</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D47341] mt-1.5">•</span>
                      <span>Relentlessly follow god's signals</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D47341] mt-1.5">•</span>
                      <span>Relentlessly practice your craft</span>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="text-[#D47341] mt-1.5">•</span>
                      <span>Relentlessly disregard all distraction</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* 2025 Goals Section */}
          <section className="section-gradient space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <div className="space-y-4">
              <h2 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                2025: The Barbell Year
              </h2>
              <ul className="space-y-6 text-lg">
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full stroke-[#D47341] fill-none stroke-[1.5]">
                      <circle cx="12" cy="8" r="5" />
                      <path d="M20 21C20 16.5817 16.4183 13 12 13C7.58172 13 4 16.5817 4 21" />
                      <path d="M12 13L12 21" strokeDasharray="2 2" />
                      <path d="M9 18L15 18" strokeDasharray="2 2" />
                    </svg>
                  </div>
                  <span>100 subscribers on your Web App</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full stroke-[#D47341] fill-none stroke-[1.5]">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M8 12L11 15L16 9" />
                      <path d="M3 8H21" />
                      <circle cx="8" cy="5.5" r="1" className="fill-[#D47341]" />
                    </svg>
                  </div>
                  <span>Get a job as a Product Manager at a tech company</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full stroke-[#D47341] fill-none stroke-[1.5]">
                      <path d="M4 10C4 6.13401 7.13401 3 11 3C14.866 3 18 6.13401 18 10V14H4V10Z" />
                      <path d="M2 14H20V21H2V14Z" />
                      <circle cx="11" cy="17.5" r="1.5" className="fill-[#D47341]" />
                    </svg>
                  </div>
                  <span>Get a membership at the Mayfair Lakeshore</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full stroke-[#D47341] fill-none stroke-[1.5]">
                      <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" />
                      <path d="M12 6V12L15 15" />
                      <path d="M7 8L17 16" strokeDasharray="2 2" />
                    </svg>
                  </div>
                  <span>Take my average recovery score from 60 to 80</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-8 h-8 flex-shrink-0 mt-1">
                    <svg viewBox="0 0 24 24" className="w-full h-full stroke-[#D47341] fill-none stroke-[1.5]">
                      <path d="M6.5 4C4.567 4 3 5.567 3 7.5C3 9.433 4.567 11 6.5 11C8.433 11 10 9.433 10 7.5" />
                      <path d="M17.5 4C19.433 4 21 5.567 21 7.5C21 9.433 19.433 11 17.5 11C15.567 11 14 9.433 14 7.5" />
                      <path d="M12 5V19" />
                      <path d="M8 14L12 10L16 14" />
                      <path d="M8 19L12 15L16 19" />
                    </svg>
                  </div>
                  <span>Be more ripped than ever before (bottom abs showing)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Base Section */}
          <section className="section-gradient space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h2 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              Relentlessly build the base
            </h2>
            
            {/* Foundation SVG */}
            <div className="w-full max-w-xl mx-auto py-4">
              <svg
                viewBox="0 0 400 140"
                className="w-full h-auto stroke-[#D47341] fill-none stroke-[3]"
                style={{ 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round',
                  filter: 'drop-shadow(0 0 8px rgba(212, 115, 65, 0.3))'
                }}
              >
                {/* Ground Line */}
                <path d="M 50 100 L 350 100" className="stroke-white/20" />
                
                {/* Foundation Base */}
                <path 
                  d="M 100 100 L 300 100 L 280 120 L 120 120 Z" 
                  className="fill-[#D47341]/20 stroke-[#D47341]" 
                />
                
                {/* Support Lines */}
                <g className="stroke-[#D47341]">
                  <path d="M 120 100 L 120 85" />
                  <path d="M 160 100 L 160 85" />
                  <path d="M 200 100 L 200 85" />
                  <path d="M 240 100 L 240 85" />
                  <path d="M 280 100 L 280 85" />
                </g>
                
                {/* Foundation Top */}
                <path d="M 100 85 L 300 85" className="stroke-[#D47341]" />
                
                {/* Decorative Growth Lines */}
                <path 
                  d="M 80 100 C 80 60, 320 60, 320 100" 
                  className="stroke-[#D47341]/30" 
                />
                <path 
                  d="M 90 100 C 90 70, 310 70, 310 100" 
                  className="stroke-[#D47341]/20" 
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
          <section className="section-gradient space-y-8 p-8 rounded-2xl bg-[#1c1c1e]/60 backdrop-blur-[2px]">
            <h2 className="text-4xl font-bold tracking-tight text-white">
              Relentlessly work on your craft
            </h2>

            {/* Differentiation SVG */}
            <div className="w-full max-w-xl mx-auto py-4">
              <svg
                viewBox="0 0 400 140"
                className="w-full h-auto stroke-[#D47341] fill-none stroke-[3]"
                style={{ 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round',
                  filter: 'drop-shadow(0 0 4px rgba(212, 115, 65, 0.2))'
                }}
              >
                {/* Central Growth Line */}
                <path 
                  d="M 200 120 L 200 40" 
                  className="stroke-[#D47341]" 
                />
                
                {/* Diverging Paths */}
                <g className="stroke-[#D47341]">
                  <path d="M 200 90 L 160 50" />
                  <path d="M 200 90 L 240 50" />
                </g>

                {/* Path Endpoints */}
                <g className="fill-[#D47341]">
                  <circle cx="160" cy="50" r="4" />
                  <circle cx="240" cy="50" r="4" />
                </g>

                {/* Decorative Elements */}
                <g className="stroke-[#D47341]/30">
                  <path d="M 160 120 C 160 100, 240 100, 240 120" />
                  <path d="M 120 120 C 120 80, 280 80, 280 120" />
                </g>
              </svg>
            </div>

            <div className="space-y-12">
              {/* Learning Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#D47341]">Product Management</h3>
                <p className="text-lg text-gray-200">
                  Build insanely great products.
                </p>
                <div className="mt-6 bg-black/30 p-6 rounded-xl">
                  <LearningMetrics />
                </div>
              </div>

              {/* Empathy Section */}
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#D47341]">Connection</h3>
                <p className="text-lg text-gray-200">
                  Leave deep, loving impressions on everyone you encounter.
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
                className="w-full h-auto stroke-[#D47341] fill-none stroke-[3]"
                style={{ 
                  strokeLinecap: 'round', 
                  strokeLinejoin: 'round',
                  filter: 'drop-shadow(0 0 8px rgba(212, 115, 65, 0.3))'
                }}
              >
                {/* Journal Book Shape */}
                <path 
                  d="M 100 50 L 300 50 L 300 150 L 100 150 Z" 
                  className="fill-[#D47341]/20 stroke-[#D47341]" 
                />
                
                {/* Journal Binding */}
                <path 
                  d="M 90 45 L 90 155 C 90 155, 100 150, 100 150 L 100 50 C 100 50, 90 45, 90 45" 
                  className="fill-[#D47341]/30 stroke-[#D47341]" 
                />
                
                {/* Journal Lines */}
                <g className="stroke-[#D47341]/50">
                  <path d="M 120 70 L 280 70" />
                  <path d="M 120 90 L 280 90" />
                  <path d="M 120 110 L 280 110" />
                  <path d="M 120 130 L 280 130" />
                </g>
                
                {/* Decorative Elements */}
                <path 
                  d="M 150 40 C 150 30, 250 30, 250 40" 
                  className="stroke-[#D47341]/40" 
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
