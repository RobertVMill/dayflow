'use client';

import { useState, useEffect } from 'react';
import { Show, getShows, addShow, updateShow, deleteShow } from '../../utils/shows-supabase';

export default function Shows() {
  const [shows, setShows] = useState<Show[]>([]);
  const [newShow, setNewShow] = useState({
    title: '',
    completed_at: new Date().toISOString().split('T')[0],
    rating: 5,
    category: '',
    notes: '',
    key_learnings: '',
    perspective_changes: '',
    status: 'completed' as const
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [editingShow, setEditingShow] = useState<Show | null>(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    try {
      const data = await getShows();
      setShows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shows');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddShow(e: React.FormEvent) {
    e.preventDefault();
    if (!newShow.title.trim() || !newShow.completed_at) return;

    try {
      await addShow(
        newShow.title.trim(),
        newShow.completed_at,
        newShow.rating,
        newShow.status,
        newShow.category.trim() || undefined,
        newShow.notes.trim() || undefined,
        newShow.key_learnings.trim() || undefined,
        newShow.perspective_changes.trim() || undefined
      );
      setNewShow({
        title: '',
        completed_at: new Date().toISOString().split('T')[0],
        rating: 5,
        category: '',
        notes: '',
        key_learnings: '',
        perspective_changes: '',
        status: 'completed'
      });
      loadShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add show');
      console.error(err);
    }
  }

  async function handleUpdateShow(e: React.FormEvent) {
    e.preventDefault();
    if (!editingShow) return;

    try {
      await updateShow(editingShow.id, {
        title: editingShow.title,
        completed_at: editingShow.completed_at,
        rating: editingShow.rating,
        status: editingShow.status,
        category: editingShow.category,
        notes: editingShow.notes,
        key_learnings: editingShow.key_learnings,
        perspective_changes: editingShow.perspective_changes
      });
      setEditingShow(null);
      loadShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update show');
      console.error(err);
    }
  }

  async function handleDeleteShow(id: string) {
    try {
      await deleteShow(id);
      loadShows();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete show');
      console.error(err);
    }
  }

  const filteredShows = shows.filter(show => 
    showWatchlist ? show.status === 'want_to_watch' : show.status === 'completed'
  ).sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime());

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#D47341] mb-6">Shows & Movies</h1>

      {!editingShow && (
        <form onSubmit={handleAddShow} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={newShow.title}
              onChange={(e) => setNewShow(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Title..."
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
            />
            <input
              type="date"
              value={newShow.completed_at}
              onChange={(e) => setNewShow(prev => ({ ...prev, completed_at: e.target.value }))}
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
            />
            <select
              value={newShow.rating}
              onChange={(e) => setNewShow(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
            >
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newShow.category}
              onChange={(e) => setNewShow(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Category (e.g., Movie, TV Show)..."
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
            />
            <select
              value={newShow.status}
              onChange={(e) => setNewShow(prev => ({ 
                ...prev, 
                status: e.target.value as 'completed' | 'want_to_watch'
              }))}
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
            >
              <option value="completed">Completed</option>
              <option value="want_to_watch">Want to Watch</option>
            </select>
            <div className="sm:col-span-2">
              <textarea
                value={newShow.notes}
                onChange={(e) => setNewShow(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Notes/Review..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                value={newShow.key_learnings}
                onChange={(e) => setNewShow(prev => ({ ...prev, key_learnings: e.target.value }))}
                placeholder="Key Learnings..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                value={newShow.perspective_changes}
                onChange={(e) => setNewShow(prev => ({ ...prev, perspective_changes: e.target.value }))}
                placeholder="How did this change your perspective?..."
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
              Add Show
            </button>
          </div>
        </form>
      )}

      {editingShow && (
        <form onSubmit={handleUpdateShow} className="mb-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              value={editingShow.title}
              onChange={(e) => setEditingShow(prev => ({ ...prev!, title: e.target.value }))}
              placeholder="Title..."
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
            />
            <input
              type="date"
              value={editingShow.completed_at}
              onChange={(e) => setEditingShow(prev => ({ ...prev!, completed_at: e.target.value }))}
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
            />
            <select
              value={editingShow.rating}
              onChange={(e) => setEditingShow(prev => ({ ...prev!, rating: parseInt(e.target.value) }))}
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
            >
              {[5, 4, 3, 2, 1].map(rating => (
                <option key={rating} value={rating}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={editingShow.category || ''}
              onChange={(e) => setEditingShow(prev => ({ ...prev!, category: e.target.value }))}
              placeholder="Category (e.g., Movie, TV Show)..."
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
            />
            <select
              value={editingShow.status}
              onChange={(e) => setEditingShow(prev => ({ 
                ...prev!, 
                status: e.target.value as 'completed' | 'want_to_watch'
              }))}
              className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
            >
              <option value="completed">Completed</option>
              <option value="want_to_watch">Want to Watch</option>
            </select>
            <div className="sm:col-span-2">
              <textarea
                value={editingShow.notes || ''}
                onChange={(e) => setEditingShow(prev => ({ ...prev!, notes: e.target.value }))}
                placeholder="Notes/Review..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                value={editingShow.key_learnings || ''}
                onChange={(e) => setEditingShow(prev => ({ ...prev!, key_learnings: e.target.value }))}
                placeholder="Key Learnings..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
            <div className="sm:col-span-2">
              <textarea
                value={editingShow.perspective_changes || ''}
                onChange={(e) => setEditingShow(prev => ({ ...prev!, perspective_changes: e.target.value }))}
                placeholder="How did this change your perspective?..."
                className="w-full p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
                rows={2}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setEditingShow(null)}
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
            onClick={() => setShowWatchlist(false)}
            className={`px-4 py-2 rounded transition-colors ${
              !showWatchlist 
                ? 'bg-[#D47341] text-white' 
                : 'bg-black/30 text-gray-300 hover:bg-black/40'
            }`}
          >
            Completed Shows
          </button>
          <button
            onClick={() => setShowWatchlist(true)}
            className={`px-4 py-2 rounded transition-colors ${
              showWatchlist 
                ? 'bg-[#D47341] text-white' 
                : 'bg-black/30 text-gray-300 hover:bg-black/40'
            }`}
          >
            Watch List
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {filteredShows.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          {showWatchlist ? 'No shows in watch list' : 'No completed shows'}
        </div>
      )}

      <div className="space-y-4">
        {filteredShows.map(show => (
          <div
            key={show.id}
            className="p-4 rounded bg-black/30 hover:bg-black/40 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-white">
                    {show.title}
                  </h3>
                  <span className="px-2 py-0.5 text-xs rounded bg-[#D47341]/20 text-[#D47341]">
                    {show.category || 'Uncategorized'}
                  </span>
                  <span className="text-yellow-400">
                    {'★'.repeat(show.rating)}{'☆'.repeat(5 - show.rating)}
                  </span>
                </div>
                <div className="text-gray-400 text-sm mt-1">
                  {new Date(show.completed_at).toLocaleDateString()}
                </div>
                {show.notes && (
                  <p className="text-gray-300 mt-2">{show.notes}</p>
                )}
                {show.key_learnings && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-[#D47341]">Key Learnings:</h4>
                    <p className="text-gray-300">{show.key_learnings}</p>
                  </div>
                )}
                {show.perspective_changes && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium text-[#D47341]">Perspective Changes:</h4>
                    <p className="text-gray-300">{show.perspective_changes}</p>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingShow(show)}
                  className="text-gray-400 hover:text-[#D47341] transition-colors"
                  title="Edit show"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDeleteShow(show.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete show"
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