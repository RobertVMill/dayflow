'use client';

import { useState, useEffect } from 'react';
import { WishlistItem, getWishlistItems, addWishlistItem, updateWishlistItem, deleteWishlistItem, markAsPurchased } from '../../utils/wishlist-supabase';

export default function Wishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItem, setNewItem] = useState({
    title: '',
    price: '',
    priority: 'medium' as const,
    url: '',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPurchased, setShowPurchased] = useState(false);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await getWishlistItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load wishlist');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItem.title.trim() || !newItem.price) return;

    try {
      await addWishlistItem(
        newItem.title.trim(),
        parseFloat(newItem.price),
        newItem.priority,
        newItem.url.trim() || undefined,
        newItem.notes.trim() || undefined
      );
      setNewItem({
        title: '',
        price: '',
        priority: 'medium',
        url: '',
        notes: ''
      });
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      console.error(err);
    }
  }

  async function handleMarkAsPurchased(id: string) {
    try {
      await markAsPurchased(id);
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark as purchased');
      console.error(err);
    }
  }

  async function handleDeleteItem(id: string) {
    try {
      await deleteWishlistItem(id);
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      console.error(err);
    }
  }

  const filteredItems = items.filter(item => showPurchased ? true : !item.purchased);
  const totalValue = filteredItems.reduce((sum, item) => sum + (item.price || 0), 0);

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#D47341] mb-6">Wishlist</h1>

      <form onSubmit={handleAddItem} className="mb-8 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={newItem.title}
            onChange={(e) => setNewItem(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Item name..."
            className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
          <input
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
            placeholder="Price..."
            step="0.01"
            min="0"
            className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
          <select
            value={newItem.priority}
            onChange={(e) => setNewItem(prev => ({ ...prev, priority: e.target.value as 'low' | 'medium' | 'high' }))}
            className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20"
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
          <input
            type="url"
            value={newItem.url}
            onChange={(e) => setNewItem(prev => ({ ...prev, url: e.target.value }))}
            placeholder="URL (optional)..."
            className="p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
          <div className="sm:col-span-2">
            <textarea
              value={newItem.notes}
              onChange={(e) => setNewItem(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Notes (optional)..."
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
            Add to Wishlist
          </button>
        </div>
      </form>

      <div className="flex justify-between items-center mb-4">
        <div className="text-lg text-[#D47341]">
          Total Value: ${totalValue.toFixed(2)}
        </div>
        <label className="flex items-center gap-2 text-gray-300">
          <input
            type="checkbox"
            checked={showPurchased}
            onChange={(e) => setShowPurchased(e.target.checked)}
            className="rounded border-gray-400"
          />
          Show Purchased Items
        </label>
      </div>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {filteredItems.map(item => (
          <div
            key={item.id}
            className={`p-4 rounded ${
              item.purchased ? 'bg-black/20' : 'bg-black/30'
            } hover:bg-black/40 transition-colors group`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className={`text-lg font-medium ${item.purchased ? 'text-gray-500' : 'text-white'}`}>
                    {item.title}
                  </h3>
                  <span className={`px-2 py-0.5 text-xs rounded ${
                    item.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                    item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-green-500/20 text-green-300'
                  }`}>
                    {item.priority}
                  </span>
                </div>
                <div className="text-[#D47341] mt-1">${item.price.toFixed(2)}</div>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm mt-1 block"
                  >
                    View Product →
                  </a>
                )}
                {item.notes && (
                  <p className="text-gray-400 text-sm mt-2">{item.notes}</p>
                )}
                {item.purchased && (
                  <p className="text-gray-500 text-sm mt-2">
                    Purchased on {new Date(item.purchased_at!).toLocaleDateString()}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {!item.purchased && (
                  <button
                    onClick={() => handleMarkAsPurchased(item.id)}
                    className="text-green-400 hover:text-green-300 transition-colors"
                    title="Mark as purchased"
                  >
                    ✓
                  </button>
                )}
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors"
                  title="Delete item"
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