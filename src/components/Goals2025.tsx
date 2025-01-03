'use client';

import { useState, useEffect } from 'react';
import { Goal2025, getGoals2025, updateGoalProgress, calculateProgressPercentage, formatGoalValue } from '../utils/goals-2025-supabase';

export default function Goals2025() {
  const [goals, setGoals] = useState<Goal2025[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingGoal, setEditingGoal] = useState<string | null>(null);
  const [newValue, setNewValue] = useState<string>('');

  useEffect(() => {
    loadGoals();
  }, []);

  async function loadGoals() {
    try {
      const goalsData = await getGoals2025();
      setGoals(goalsData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load goals');
      setLoading(false);
      console.error(err);
    }
  }

  async function handleUpdateProgress(goal: Goal2025) {
    try {
      const value = parseInt(newValue);
      if (isNaN(value) || value < 0 || value > goal.target_value) {
        throw new Error(`Value must be between 0 and ${goal.target_value}`);
      }

      await updateGoalProgress(goal.goal_type, value);
      setEditingGoal(null);
      setNewValue('');
      await loadGoals();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to update progress');
    }
  }

  function getGoalLabel(goalType: Goal2025['goal_type']): string {
    switch (goalType) {
      case 'subscribers':
        return 'Web App Subscribers';
      case 'pm_meetings':
        return 'Product Manager Meetings';
      case 'mayfair_savings':
        return 'Mayfair Lakeshore Savings';
      default:
        return goalType;
    }
  }

  if (loading) return <div>Loading goals...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      {goals.map((goal) => (
        <div key={goal.id} className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">{getGoalLabel(goal.goal_type)}</h3>
            <div className="text-sm text-gray-400">
              {formatGoalValue(goal.goal_type, goal.current_value)} / {formatGoalValue(goal.goal_type, goal.target_value)}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#D47341] transition-all duration-500"
              style={{ width: `${calculateProgressPercentage(goal.current_value, goal.target_value)}%` }}
            />
          </div>

          {/* Edit Progress */}
          <div className="flex items-center space-x-2">
            {editingGoal === goal.id ? (
              <>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="px-2 py-1 rounded bg-gray-700 text-white w-24"
                  placeholder="New value"
                />
                <button
                  onClick={() => handleUpdateProgress(goal)}
                  className="px-3 py-1 bg-[#D47341] rounded hover:bg-[#D47341]/80"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingGoal(null);
                    setNewValue('');
                  }}
                  className="px-3 py-1 bg-gray-700 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditingGoal(goal.id);
                  setNewValue(goal.current_value.toString());
                }}
                className="text-sm text-gray-400 hover:text-white"
              >
                Update Progress
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
} 