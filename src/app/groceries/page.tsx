'use client';

import { useState, useEffect } from 'react';
import { GroceryItem, getGroceryItems, addGroceryItem, toggleGroceryItem, deleteGroceryItem } from '../../utils/groceries-supabase';

export default function Groceries() {
  const [items, setItems] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    try {
      const data = await getGroceryItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load groceries');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      await addGroceryItem(newItemName.trim(), newItemCategory.trim() || undefined);
      setNewItemName('');
      setNewItemCategory('');
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add item');
      console.error(err);
    }
  }

  async function handleToggleItem(id: string, is_needed: boolean) {
    try {
      await toggleGroceryItem(id, is_needed);
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update item');
      console.error(err);
    }
  }

  async function handleDeleteItem(id: string) {
    try {
      await deleteGroceryItem(id);
      loadItems();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete item');
      console.error(err);
    }
  }

  // Group items by category
  const itemsByCategory = items.reduce((acc, item) => {
    const category = item.category || 'Uncategorized';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, GroceryItem[]>);

  if (isLoading) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[#D47341] mb-6">Grocery List</h1>

      <form onSubmit={handleAddItem} className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="Add new item..."
            className="flex-1 p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
          <input
            type="text"
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value)}
            placeholder="Category (optional)"
            className="sm:w-1/3 p-2 rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
          >
            Add
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {Object.entries(itemsByCategory).map(([category, categoryItems]) => (
          <div key={category} className="space-y-2">
            <h2 className="text-lg font-medium text-[#D47341]/80">{category}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {categoryItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded bg-black/30 hover:bg-black/40 transition-colors group"
                >
                  <button
                    onClick={() => handleToggleItem(item.id, !item.is_needed)}
                    className={`w-5 h-5 rounded border ${
                      item.is_needed
                        ? 'border-[#D47341]/20 bg-black/30'
                        : 'bg-[#D47341] border-[#D47341]'
                    } flex items-center justify-center transition-colors`}
                  >
                    {!item.is_needed && (
                      <span className="text-white text-sm">✓</span>
                    )}
                  </button>
                  <span className={item.is_needed ? 'text-white' : 'text-gray-500 line-through'}>
                    {item.name}
                  </span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="ml-auto text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 