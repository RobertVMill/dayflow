'use client';

import { useState, useEffect } from 'react';
import { JournalEntry, addJournalEntry, getLatestJournalEntry, updateJournalEntry } from '../utils/supabase';

export default function JournalEntries() {
  const [entry, setEntry] = useState<JournalEntry>({
    blessings: '',
    contributions: '',
    fitness_improvements: '',
    microbiome_improvements: '',
    craft_improvements: '',
    best_day_plan: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadLatestEntry();
  }, []);

  async function loadLatestEntry() {
    try {
      const data = await getLatestJournalEntry();
      if (data) {
        setEntry(data);
      }
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading journal entry:', err);
      setError('Failed to load journal entry');
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (entry.id) {
        await updateJournalEntry(entry.id, entry);
      } else {
        await addJournalEntry(entry);
      }
      await loadLatestEntry();
    } catch (err) {
      console.error('Error saving journal entry:', err);
      setError('Failed to save journal entry');
    } finally {
      setIsSaving(false);
    }
  }

  function handleChange(field: keyof JournalEntry, value: string) {
    setEntry(prev => ({ ...prev, [field]: value }));
  }

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium text-[#8B1E1E] mb-2">
            I'm so blessed today for
          </label>
          <textarea
            value={entry.blessings}
            onChange={(e) => handleChange('blessings', e.target.value)}
            className="w-full h-24 bg-black/30 border border-[#8B1E1E]/20 rounded-lg p-3 text-white"
            placeholder="List your blessings..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-[#8B1E1E] mb-2">
            I have so much to give today including
          </label>
          <textarea
            value={entry.contributions}
            onChange={(e) => handleChange('contributions', e.target.value)}
            className="w-full h-24 bg-black/30 border border-[#8B1E1E]/20 rounded-lg p-3 text-white"
            placeholder="List what you can contribute..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-[#8B1E1E] mb-2">
            I have so much to improve my fitness including
          </label>
          <textarea
            value={entry.fitness_improvements}
            onChange={(e) => handleChange('fitness_improvements', e.target.value)}
            className="w-full h-24 bg-black/30 border border-[#8B1E1E]/20 rounded-lg p-3 text-white"
            placeholder="List your fitness goals for today..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-[#8B1E1E] mb-2">
            I have so much to improve my microbiome today including
          </label>
          <textarea
            value={entry.microbiome_improvements}
            onChange={(e) => handleChange('microbiome_improvements', e.target.value)}
            className="w-full h-24 bg-black/30 border border-[#8B1E1E]/20 rounded-lg p-3 text-white"
            placeholder="List your microbiome improvements..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-[#8B1E1E] mb-2">
            I have so much to improve my craft including
          </label>
          <textarea
            value={entry.craft_improvements}
            onChange={(e) => handleChange('craft_improvements', e.target.value)}
            className="w-full h-24 bg-black/30 border border-[#8B1E1E]/20 rounded-lg p-3 text-white"
            placeholder="List your craft improvements..."
          />
        </div>

        <div>
          <label className="block text-lg font-medium text-[#8B1E1E] mb-2">
            I'm going to put it all together and have my best day by
          </label>
          <textarea
            value={entry.best_day_plan}
            onChange={(e) => handleChange('best_day_plan', e.target.value)}
            className="w-full h-24 bg-black/30 border border-[#8B1E1E]/20 rounded-lg p-3 text-white"
            placeholder="Describe your plan for the best day..."
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="px-6 py-2 bg-[#8B1E1E] text-white rounded-lg hover:bg-[#661616] transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Entry'}
        </button>
      </div>
    </form>
  );
} 