'use client';

import { useState, useEffect } from 'react';
import { Meal, addMeal, getMeals, updateMeal, deleteMeal } from '../../utils/meals-supabase';

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);

  useEffect(() => {
    loadMeals();
  }, []);

  async function loadMeals() {
    try {
      const data = await getMeals();
      setMeals(data);
      setError(null);
    } catch (err) {
      setError('Failed to load meals');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !description || !benefits) return;

    try {
      if (editingMeal) {
        await updateMeal(editingMeal.id, name, description, benefits);
        setEditingMeal(null);
      } else {
        await addMeal(name, description, benefits);
      }
      setName('');
      setDescription('');
      setBenefits('');
      loadMeals();
      setError(null);
    } catch (err) {
      setError(editingMeal ? 'Failed to update meal' : 'Failed to add meal');
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    
    try {
      await deleteMeal(id);
      loadMeals();
      setError(null);
    } catch (err) {
      setError('Failed to delete meal');
      console.error(err);
    }
  }

  function handleEdit(meal: Meal) {
    setEditingMeal(meal);
    setName(meal.name);
    setDescription(meal.description);
    setBenefits(meal.benefits);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditingMeal(null);
    setName('');
    setDescription('');
    setBenefits('');
  }

  if (isLoading) return <div className="text-center py-4 text-white">Loading...</div>;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Add/Edit Meal Form */}
          <div className="bg-black/30 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-white mb-6">
              {editingMeal ? 'Edit Meal' : 'Add New Meal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                  Meal Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded bg-black/30 border border-[#8B1E1E]/20 text-white placeholder-gray-500 focus:ring-[#8B1E1E] focus:border-[#8B1E1E]"
                  placeholder="Enter meal name"
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
                  placeholder="Enter meal description"
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
                  placeholder="Enter meal benefits"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#8B1E1E] text-white rounded hover:bg-[#661616] transition-colors"
                >
                  {editingMeal ? 'Update Meal' : 'Add Meal'}
                </button>
                {editingMeal && (
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

          {/* Meals List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Meal History</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <div key={meal.id} className="bg-black/30 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium text-white">{meal.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(meal)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(meal.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Description</h4>
                    <p className="mt-1 text-gray-300 whitespace-pre-wrap">{meal.description}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-400">Benefits</h4>
                    <p className="mt-1 text-gray-300 whitespace-pre-wrap">{meal.benefits}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(meal.created_at).toLocaleDateString()}
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