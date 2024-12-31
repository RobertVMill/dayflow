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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadLatestEntry();
  }, []);

  async function loadLatestEntry() {
    try {
      const data = await getLatestJournalEntry();
      if (data) {
        setEntry(data);
        setSuccessMessage('Latest entry loaded successfully');
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
    setSuccessMessage(null);

    try {
      if (entry.id) {
        await updateJournalEntry(entry.id, entry);
        setSuccessMessage('Journal entry updated successfully!');
      } else {
        await addJournalEntry(entry);
        setSuccessMessage('New journal entry saved successfully!');
      }
      await loadLatestEntry();
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="text-green-500 bg-green-500/10 p-4 rounded-lg">
          {successMessage}
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
            required
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
            required
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
            required
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
            required
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
            required
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
            required
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