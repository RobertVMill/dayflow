'use client';

import { useState, useEffect } from 'react';
import { Workout, getWorkouts, addWorkout, updateWorkout, deleteWorkout } from '../../utils/workouts-supabase';

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [benefits, setBenefits] = useState('');
  const [completedAt, setCompletedAt] = useState(new Date().toISOString().split('T')[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  useEffect(() => {
    loadWorkouts();
  }, []);

  async function loadWorkouts() {
    try {
      const data = await getWorkouts();
      setWorkouts(data);
      setError(null);
    } catch (err) {
      setError('Failed to load workouts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !completedAt) return;

    try {
      if (editingWorkout) {
        await updateWorkout(
          editingWorkout.id,
          name,
          completedAt,
          description || undefined,
          benefits || undefined
        );
        setEditingWorkout(null);
      } else {
        await addWorkout(
          name,
          completedAt,
          description || undefined,
          benefits || undefined
        );
      }
      setName('');
      setDescription('');
      setBenefits('');
      setCompletedAt(new Date().toISOString().split('T')[0]);
      loadWorkouts();
      setError(null);
    } catch (err) {
      setError(editingWorkout ? 'Failed to update workout' : 'Failed to add workout');
      console.error(err);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this workout?')) return;
    
    try {
      await deleteWorkout(id);
      loadWorkouts();
      setError(null);
    } catch (err) {
      setError('Failed to delete workout');
      console.error(err);
    }
  }

  function handleEdit(workout: Workout) {
    setEditingWorkout(workout);
    setName(workout.name);
    setDescription(workout.description || '');
    setBenefits(workout.benefits || '');
    setCompletedAt(workout.completed_at);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancel() {
    setEditingWorkout(null);
    setName('');
    setDescription('');
    setBenefits('');
    setCompletedAt(new Date().toISOString().split('T')[0]);
  }

  if (isLoading) return <div className="text-center py-4 text-white">Loading...</div>;

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <main className="space-y-12">
          {/* Motivational Reminder */}
          <div className="p-6 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm border border-[#D47341]/20">
            <p className="text-xl text-center font-medium text-white">
              <span className="text-[#D47341]">Building a great physique is the greatest investment</span>
              <br />
              <span className="text-gray-300">Maximize time under tension in your bodybuilding</span>
              <br />
              <span className="text-gray-300">Get to 90% lung capacity in your runs</span>
              <br />
              <span className="text-gray-300">Do a ton of yoga</span>
            </p>
          </div>

          {/* Add Workout Section */}
          <section className="space-y-6 p-8 rounded-2xl bg-[#1c1c1e]/50 backdrop-blur-sm">
            <h1 className="text-4xl font-bold tracking-tight text-white">Add Workout</h1>
            <div className="bg-black/30 rounded-lg p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                    Workout Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full rounded bg-black/30 border border-[#D47341]/20 text-white placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
                    placeholder="Enter workout name"
                  />
                </div>
                <div>
                  <label htmlFor="completed_at" className="block text-sm font-medium text-gray-300">
                    Completion Date
                  </label>
                  <input
                    type="date"
                    id="completed_at"
                    value={completedAt}
                    onChange={(e) => setCompletedAt(e.target.value)}
                    className="mt-1 block w-full rounded bg-black/30 border border-[#D47341]/20 text-white focus:ring-[#D47341] focus:border-[#D47341]"
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
                    className="mt-1 block w-full rounded bg-black/30 border border-[#D47341]/20 text-white placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
                    placeholder="Enter workout description"
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
                    className="mt-1 block w-full rounded bg-black/30 border border-[#D47341]/20 text-white placeholder-gray-500 focus:ring-[#D47341] focus:border-[#D47341]"
                    placeholder="Enter workout benefits"
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
                  >
                    {editingWorkout ? 'Update Workout' : 'Add Workout'}
                  </button>
                  {editingWorkout && (
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
          </section>

          {/* Workouts List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Workout History</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {workouts.map((workout) => (
                <div key={workout.id} className="bg-black/30 rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-medium text-white">{workout.name}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(workout)}
                        className="p-1 text-gray-400 hover:text-white transition-colors"
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => handleDelete(workout.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {new Date(workout.completed_at).toLocaleDateString()}
                  </div>
                  {workout.description && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Description</h4>
                      <p className="mt-1 text-gray-300 whitespace-pre-wrap">{workout.description}</p>
                    </div>
                  )}
                  {workout.benefits && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-400">Benefits</h4>
                      <p className="mt-1 text-gray-300 whitespace-pre-wrap">{workout.benefits}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 