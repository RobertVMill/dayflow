'use client';

import { useState, useEffect } from 'react';
import { JournalEntry, addJournalEntry } from '../utils/supabase';

export default function JournalEntries() {
  const emptyEntry: JournalEntry = {
    blessings: '',
    contributions: '',
    fitness_improvements: '',
    microbiome_improvements: '',
    craft_improvements: '',
    best_day_plan: ''
  };

  const [entry, setEntry] = useState<JournalEntry>(emptyEntry);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await addJournalEntry(entry);
      setSuccessMessage('New journal entry saved successfully!');
      // Reset form after successful save
      setEntry(emptyEntry);
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save journal entry');
    } finally {
      setIsSaving(false);
      // Scroll the success/error message into view
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function handleChange(field: keyof JournalEntry, value: string) {
    setEntry(prev => ({ ...prev, [field]: value }));
    // Clear messages when user starts typing
    setError(null);
    setSuccessMessage(null);
  }

  if (isLoading) {
    return <div className="text-center py-4 text-white">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 -mx-2">
      {error && (
        <div className="text-red-500 bg-red-500/10 px-2 py-3 text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="text-green-500 bg-green-500/10 px-2 py-3 text-sm">
          {successMessage}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-[#D47341] text-lg mb-2">I'm so blessed today for</label>
          <textarea
            value={entry.blessings}
            onChange={(e) => handleChange('blessings', e.target.value)}
            placeholder="List your blessings..."
            className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
          />
        </div>

        <div>
          <label className="block text-[#D47341] text-lg mb-2">Good deeds I will do today</label>
          <textarea
            value={entry.contributions}
            onChange={(e) => handleChange('contributions', e.target.value)}
            placeholder="List specific ways you'll go above and beyond for others today..."
            className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
          />
        </div>

        <div>
          <label className="block text-[#D47341] text-lg mb-2">How I will chisel my physique today</label>
          <textarea
            value={entry.fitness_improvements}
            onChange={(e) => handleChange('fitness_improvements', e.target.value)}
            placeholder="Example: Upper body lift in the morning, yoga or running or squash/tennis in the evening..."
            className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
          />
        </div>

        <div>
          <label className="block text-[#D47341] text-lg mb-2">How I will cultivate an extremely powerful microbiome</label>
          <textarea
            value={entry.microbiome_improvements}
            onChange={(e) => handleChange('microbiome_improvements', e.target.value)}
            placeholder="List the specific foods and activities that will build your strongest microbiome today..."
            className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
          />
        </div>

        <div>
          <label className="block text-[#D47341] text-lg mb-2">How I will beat on my craft today</label>
          <textarea
            value={entry.craft_improvements}
            onChange={(e) => handleChange('craft_improvements', e.target.value)}
            placeholder="List the specific activities you'll do to relentlessly improve as a product manager today..."
            className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
          />
        </div>

        <div>
          <label className="block text-[#D47341] text-lg mb-2">How I will put it all together and make the most out of today</label>
          <textarea
            value={entry.best_day_plan}
            onChange={(e) => handleChange('best_day_plan', e.target.value)}
            placeholder="Describe your specific plan to maximize every moment of today..."
            className="w-full h-32 p-3 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
          />
        </div>
      </div>

      <div className="flex justify-end px-2">
        <button
          type="submit"
          disabled={isSaving}
          className="w-full bg-[#D47341] text-white py-3 text-base disabled:opacity-50 active:bg-[#B85C2C]"
        >
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
} 