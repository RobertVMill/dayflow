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

      <div className="space-y-3">
        <div>
          <label className="block text-[#D47341] px-2 mb-1 text-base">
            I'm so blessed today for
          </label>
          <textarea
            value={entry.blessings}
            onChange={(e) => handleChange('blessings', e.target.value)}
            className="w-full h-24 bg-black/30 border-y border-[#D47341]/20 p-2 text-white text-base"
            placeholder="List your blessings..."
            required
          />
        </div>

        <div>
          <label className="block text-[#D47341] px-2 mb-1 text-base">
            I have so much to give today including
          </label>
          <textarea
            value={entry.contributions}
            onChange={(e) => handleChange('contributions', e.target.value)}
            className="w-full h-24 bg-black/30 border-y border-[#D47341]/20 p-2 text-white text-base"
            placeholder="List what you can contribute..."
            required
          />
        </div>

        <div>
          <label className="block text-[#D47341] px-2 mb-1 text-base">
            I have so much to improve my fitness including
          </label>
          <textarea
            value={entry.fitness_improvements}
            onChange={(e) => handleChange('fitness_improvements', e.target.value)}
            className="w-full h-24 bg-black/30 border-y border-[#D47341]/20 p-2 text-white text-base"
            placeholder="List your fitness goals for today..."
            required
          />
        </div>

        <div>
          <label className="block text-[#D47341] px-2 mb-1 text-base">
            I have so much to improve my microbiome today including
          </label>
          <textarea
            value={entry.microbiome_improvements}
            onChange={(e) => handleChange('microbiome_improvements', e.target.value)}
            className="w-full h-24 bg-black/30 border-y border-[#D47341]/20 p-2 text-white text-base"
            placeholder="List your microbiome improvements..."
            required
          />
        </div>

        <div>
          <label className="block text-[#D47341] px-2 mb-1 text-base">
            I have so much to improve my craft including
          </label>
          <textarea
            value={entry.craft_improvements}
            onChange={(e) => handleChange('craft_improvements', e.target.value)}
            className="w-full h-24 bg-black/30 border-y border-[#D47341]/20 p-2 text-white text-base"
            placeholder="List your craft improvements..."
            required
          />
        </div>

        <div>
          <label className="block text-[#D47341] px-2 mb-1 text-base">
            I'm going to put it all together and have my best day by
          </label>
          <textarea
            value={entry.best_day_plan}
            onChange={(e) => handleChange('best_day_plan', e.target.value)}
            className="w-full h-24 bg-black/30 border-y border-[#D47341]/20 p-2 text-white text-base"
            placeholder="Describe your plan for the best day..."
            required
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