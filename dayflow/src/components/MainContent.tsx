'use client'

import Link from 'next/link';
import ReadingTracker from './ReadingTracker';
import CommitsTracker from './CommitsTracker';
import GoodDeedsTracker from './GoodDeedsTracker';
import WorkoutTracker from './WorkoutTracker';
import MicrobiomeTracker from './MicrobiomeTracker';
import SleepTracker from './SleepTracker';
import DailyFocus from './DailyFocus';

export default function MainContent() {
  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <header className="sticky top-0 backdrop-blur-xl bg-[#1a1a1a]/80 border-b border-[#333333] px-4 sm:px-6 py-2 sm:py-3">
        <nav className="max-w-screen-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-lg sm:text-xl font-semibold">dayflow</Link>
          </div>
          <div className="flex items-center space-x-3 sm:space-x-6">
            <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white">Documentation</Link>
            <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white">Support</Link>
            <Link href="#" className="text-xs sm:text-sm text-gray-300 hover:text-white">Account</Link>
          </div>
        </nav>
      </header>

      <main className="flex-1 p-4 sm:p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-6 sm:mb-12">
            Go placidly amongst the noise and the haste. Stay aligned to your purpose despite any setback. Never let yourself or your friends down.
          </h1>
          
          <div className="space-y-8 sm:space-y-12">
            {/* Base Stack Section */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Always keep a strong base.
              </h2>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                {[
                  "Sunlight",
                  "Long Walks",
                  "Long Sleeps",
                  "Meditation",
                  "Eating Plants",
                  "Never Let People Down",
                  "Hydration",
                  "Great Exercise",
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-[#252525] rounded-lg p-5 border border-[#333333] hover:border-[#444444] transition-all hover:transform hover:-translate-y-1"
                  >
                    <h3 className="text-lg font-semibold text-white text-center">{item}</h3>
                  </div>
                ))}
              </div>
            </div>

            {/* Build Upon Base Section */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Build upon your unique abilities.
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { 
                    title: "Your special ability to read",
                    content: (
                      <div className="mt-4 h-[150px]">
                        <ReadingTracker 
                          logs={[
                            { date: '2024-03-01', pages: 25 },
                            { date: '2024-03-02', pages: 30 },
                            { date: '2024-03-03', pages: 15 },
                            { date: '2024-03-04', pages: 45 },
                            { date: '2024-03-05', pages: 20 },
                          ]} 
                        />
                      </div>
                    )
                  },
                  { 
                    title: "Your special ability to code",
                    content: (
                      <div className="mt-4 h-[150px]">
                        <CommitsTracker 
                          logs={[
                            { date: '2024-03-01', commits: 5 },
                            { date: '2024-03-02', commits: 8 },
                            { date: '2024-03-03', commits: 3 },
                            { date: '2024-03-04', commits: 12 },
                            { date: '2024-03-05', commits: 6 },
                          ]} 
                        />
                      </div>
                    )
                  },
                  {
                    title: "Your special level of empathy",
                    content: (
                      <div className="mt-4 h-[150px]">
                        <GoodDeedsTracker 
                          logs={[
                            { date: '2024-03-01', deeds: 3 },
                            { date: '2024-03-02', deeds: 4 },
                            { date: '2024-03-03', deeds: 2 },
                            { date: '2024-03-04', deeds: 5 },
                            { date: '2024-03-05', deeds: 3 },
                          ]} 
                        />
                      </div>
                    )
                  },
                  {
                    title: "Your special physical ability",
                    content: (
                      <div className="mt-4 h-[150px]">
                        <WorkoutTracker 
                          logs={[
                            { 
                              date: '2024-03-01',
                              benchReps: 8,
                              powerCleanWeight: 185,
                              runningPace: 12.5
                            },
                            // ... rest of the workout logs
                          ]} 
                        />
                      </div>
                    )
                  },
                  {
                    title: "Your special passion for nutrition",
                    content: (
                      <div className="mt-4 h-[150px]">
                        <MicrobiomeTracker 
                          logs={[
                            { 
                              date: '2024-03-01',
                              mostlyPlants: true,
                              noDairy: true,
                              noAddedSugar: false,
                              fastingTilNoon: true
                            },
                            // ... rest of the microbiome logs
                          ]} 
                        />
                      </div>
                    )
                  },
                  {
                    title: "Your special passion for great sleep",
                    content: (
                      <div className="mt-4 h-[150px]">
                        <SleepTracker 
                          logs={[
                            { date: '2024-03-01', score: 85 },
                            { date: '2024-03-02', score: 92 },
                            { date: '2024-03-03', score: 78 },
                            { date: '2024-03-04', score: 88 },
                            { date: '2024-03-05', score: 95 },
                          ]} 
                        />
                      </div>
                    )
                  },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="bg-[#252525] rounded-lg p-6 border border-[#333333] hover:border-[#444444] transition-all hover:transform hover:-translate-x-2"
                  >
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    {item.content}
                  </div>
                ))}
              </div>
            </div>

            {/* Stay Focused Section */}
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Stay focused on today.
              </h2>
              
              <div className="bg-[#252525] rounded-lg p-4 sm:p-6 border border-[#333333]">
                <DailyFocus />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 