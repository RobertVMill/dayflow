'use client';

import { useState, useEffect } from 'react';
import { Mantra, getMantras, addMantra, updateMantra, deleteMantra, markMantraAsUsed, toggleMantraActive } from '../../utils/mantras-supabase';

export default function Mantras() {
  const [mantras, setMantras] = useState<Mantra[]>([]);
  const [newMantra, setNewMantra] = useState({
    text: '',
    category: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMantra, setEditingMantra] = useState<Mantra | null>(null);
  const [showInactive, setShowInactive] = useState(false);

  useEffect(() => {
    loadMantras();
  }, []);

  async function loadMantras() {
    try {
      const data = await getMantras();
      setMantras(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mantras');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddMantra(e: React.FormEvent) {
    e.preventDefault();
    if (!newMantra.text.trim()) return;

    try {
      await addMantra(
        newMantra.text.trim(),
        newMantra.category.trim() || undefined,
        newMantra.notes.trim() || undefined
      );
      setNewMantra({
        text: '',
        category: '',
        notes: ''
      });
      loadMantras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add mantra');
      console.error(err);
    }
  }

  async function handleUpdateMantra(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMantra) return;

    try {
      await updateMantra(editingMantra.id, {
        text: editingMantra.text,
        category: editingMantra.category,
        notes: editingMantra.notes,
        is_active: editingMantra.is_active
      });
      setEditingMantra(null);
      loadMantras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update mantra');
      console.error(err);
    }
  }

  async function handleDeleteMantra(id: string) {
    try {
      await deleteMantra(id);
      loadMantras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete mantra');
      console.error(err);
    }
  }

  async function handleMarkAsUsed(id: string) {
    try {
      await markMantraAsUsed(id);
      loadMantras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark mantra as used');
      console.error(err);
    }
  }

  async function handleToggleActive(id: string, is_active: boolean) {
    try {
      await toggleMantraActive(id, is_active);
      loadMantras();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle mantra status');
      console.error(err);
    }
  }

  const filteredMantras = mantras.filter(mantra => 
    showInactive ? true : mantra.is_active
  ).sort((a, b) => {
    if (!a.last_used_at && !b.last_used_at) return 0;
    if (!a.last_used_at) return -1;
    if (!b.last_used_at) return 1;
    return new Date(b.last_used_at).getTime() - new Date(a.last_used_at).getTime();
  });

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#D47341] mb-6">Meditation Mantras</h1>

      {!editingMantra && (
        <form onSubmit={handleAddMantra} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <textarea
                value={newMantra.text}
                onChange={(e) => setNewMantra(prev => ({ ...prev, text: e.target.value }))}
                placeholder="Enter your mantra..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={3}
              />
            </div>
            <input
              type="text"
              value={newMantra.category}
              onChange={(e) => setNewMantra(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Category (e.g., Morning, Focus)..."
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
            />
            <div className="sm:col-span-2">
              <textarea
                value={newMantra.notes}
                onChange={(e) => setNewMantra(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Additional notes..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
            >
              Add Mantra
            </button>
          </div>
        </form>
      )}

      {editingMantra && (
        <form onSubmit={handleUpdateMantra} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <textarea
                value={editingMantra.text}
                onChange={(e) => setEditingMantra(prev => ({ ...prev!, text: e.target.value }))}
                placeholder="Enter your mantra..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={3}
              />
            </div>
            <input
              type="text"
              value={editingMantra.category || ''}
              onChange={(e) => setEditingMantra(prev => ({ ...prev!, category: e.target.value }))}
              placeholder="Category (e.g., Morning, Focus)..."
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
            />
            <div className="sm:col-span-2">
              <textarea
                value={editingMantra.notes || ''}
                onChange={(e) => setEditingMantra(prev => ({ ...prev!, notes: e.target.value }))}
                placeholder="Additional notes..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingMantra(null)}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setShowInactive(false)}
            className={`px-4 py-2 rounded transition-colors ${
              !showInactive 
                ? 'bg-[#D47341] text-white' 
                : 'bg-black/30 text-gray-300 hover:bg-black/40'
            }`}
          >
            Active Mantras
          </button>
          <button
            onClick={() => setShowInactive(true)}
            className={`px-4 py-2 rounded transition-colors ${
              showInactive 
                ? 'bg-[#D47341] text-white' 
                : 'bg-black/30 text-gray-300 hover:bg-black/40'
            }`}
          >
            All Mantras
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {filteredMantras.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          No mantras found
        </div>
      )}

      <div className="space-y-4">
        {filteredMantras.map(mantra => (
          <div
            key={mantra.id}
            className={`p-4 rounded ${
              mantra.is_active ? 'bg-black/30' : 'bg-black/20'
            } hover:bg-black/40 transition-colors group`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-medium ${
                    mantra.is_active ? 'text-white' : 'text-gray-400'
                  }`}>
                    {mantra.text}
                  </h3>
                  {mantra.category && (
                    <span className="px-2 py-0.5 text-xs rounded bg-[#D47341]/20 text-[#D47341]">
                      {mantra.category}
                    </span>
                  )}
                </div>
                {mantra.notes && (
                  <p className="text-gray-400 mt-2">{mantra.notes}</p>
                )}
                {mantra.last_used_at && (
                  <p className="text-gray-500 text-sm mt-2">
                    Last used: {new Date(mantra.last_used_at).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAsUsed(mantra.id)}
                  className="text-green-400 hover:text-green-300 transition-colors"
                  title="Mark as used"
                >
                  ✓
                </button>
                <button
                  onClick={() => handleToggleActive(mantra.id, !mantra.is_active)}
                  className={`${
                    mantra.is_active 
                      ? 'text-yellow-400 hover:text-yellow-300' 
                      : 'text-gray-500 hover:text-yellow-400'
                  } transition-colors`}
                  title={mantra.is_active ? 'Deactivate' : 'Activate'}
                >
                  ★
                </button>
                <button
                  onClick={() => setEditingMantra(mantra)}
                  className="text-gray-400 hover:text-[#D47341] transition-colors"
                  title="Edit mantra"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteMantra(mantra.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete mantra"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 