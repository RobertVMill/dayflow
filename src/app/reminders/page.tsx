'use client';

import { useState, useEffect } from 'react';
import { Reminder, addReminder, getReminders, updateReminder, deleteReminder } from '../../utils/reminders-supabase';

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  useEffect(() => {
    loadReminders();
  }, []);

  async function loadReminders() {
    try {
      const data = await getReminders();
      setReminders(data);
      setError(null);
    } catch (err) {
      setError('Failed to load reminders');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description || !benefits) return;

    try {
      if (editingReminder) {
        await updateReminder(editingReminder.id, name, description, benefits);
        setEditingReminder(null);
      } else {
        await addReminder(name, description, benefits);
      }
      setName('');
      setDescription('');
      setBenefits('');
      loadReminders();
      setError(null);
    } catch (err) {
      setError(editingReminder ? 'Failed to update reminder' : 'Failed to add reminder');
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    
    try {
      await deleteReminder(id);
      loadReminders();
      setError(null);
    } catch (err) {
      setError('Failed to delete reminder');
      console.error(err);
    }
  }

  function handleEdit(reminder: Reminder) {
    setEditingReminder(reminder);
    setName(reminder.name);
    setDescription(reminder.description);
    setBenefits(reminder.benefits);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditingReminder(null);
    setName('');
    setDescription('');
    setBenefits('');
  }

  if (isLoading) return <div className="text-center py-4 text-white">Loading...</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Add/Edit Reminder Form */}
          <div className="bg-black/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingReminder ? 'Edit Reminder' : 'Add New Reminder'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Reminder Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded bg-black/30 border border-[#8B1E1E]/20 text-white placeholder-gray-500 focus:ring-[#8B1E1E] focus:border-[#8B1E1E]"
                  placeholder="Enter reminder name"
                />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded bg-black/30 border border-[#8B1E1E]/20 text-white placeholder-gray-500 focus:ring-[#8B1E1E] focus:border-[#8B1E1E]"
                  placeholder="Enter reminder description"
                />
              </div>
              <div>
                <label htmlFor="benefits" className="block text-sm font-medium text-gray-300">
                  Benefits
                </label>
                <textarea
                  id="benefits"
                  value={benefits}
                  onChange={(e) => setBenefits(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded bg-black/30 border border-[#8B1E1E]/20 text-white placeholder-gray-500 focus:ring-[#8B1E1E] focus:border-[#8B1E1E]"
                  placeholder="Enter reminder benefits"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#8B1E1E] text-white rounded hover:bg-[#661616] transition-colors"
                >
                  {editingReminder ? 'Update Reminder' : 'Add Reminder'}
                </button>
                {editingReminder && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
            {error && (
              <div className="mt-4 text-red-500 bg-red-500/10 p-4 rounded">
                {error}
              </div>
            )}
          </div>

          {/* Reminders List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Reminder History</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {reminders.map((reminder) => (
                <div key={reminder.id} className="bg-black/30 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium text-white">{reminder.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(reminder)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(reminder.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Description</h4>
                    <p className="mt-1 text-gray-300 whitespace-pre-wrap">{reminder.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Benefits</h4>
                    <p className="mt-1 text-gray-300 whitespace-pre-wrap">{reminder.benefits}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(reminder.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 