'use client'

import { useState } from 'react';

interface DailyPlan {
  blessings: string;
  goodDeeds: string;
  craft: string;
  microbiome: string;
  workout: string;
  integration: string;
}

export default function DailyFocus() {
  const [plan, setPlan] = useState<DailyPlan>({
    blessings: '',
    goodDeeds: '',
    craft: '',
    microbiome: '',
    workout: '',
    integration: ''
  });

  const handleChange = (field: keyof DailyPlan) => (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlan(prev => ({ ...prev, [field]: e.target.value }));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {[
        { id: 'blessings', label: "What I'm blessed with today?" },
        { id: 'goodDeeds', label: "What good deeds I have to get done today?" },
        { id: 'craft', label: "What do I have to get done for my craft today?" },
        { id: 'microbiome', label: "What do I have to get done for my microbiome today?" },
        { id: 'workout', label: "What do I have to get done for my workout today?" },
        { id: 'integration', label: "How I'm going to put that all together to make today the best day I can?" },
      ].map(({ id, label }) => (
        <div key={id} className="space-y-1 sm:space-y-2">
          <label htmlFor={id} className="block text-sm font-medium text-gray-300">
            {label}
          </label>
          <textarea
            id={id}
            rows={2}
            className="w-full bg-[#1a1a1a] text-white px-3 sm:px-4 py-2 rounded-md border border-[#333333] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors resize-none text-sm sm:text-base"
            value={plan[id as keyof DailyPlan]}
            onChange={handleChange(id as keyof DailyPlan)}
            placeholder="Write your thoughts here..."
          />
        </div>
      ))}
    </div>
  );
} 