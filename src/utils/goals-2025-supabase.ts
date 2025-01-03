import { supabase } from './base-supabase';

export interface Goal2025 {
  id: string;
  created_at: string;
  goal_type: 'subscribers' | 'pm_meetings' | 'mayfair_savings';
  current_value: number;
  target_value: number;
}

export async function getGoals2025(): Promise<Goal2025[]> {
  const { data, error } = await supabase
    .from('goals_2025')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data;
}

export async function updateGoalProgress(goal_type: Goal2025['goal_type'], current_value: number): Promise<void> {
  const { error } = await supabase
    .from('goals_2025')
    .update({ current_value })
    .eq('goal_type', goal_type);

  if (error) throw error;
}

export function calculateProgressPercentage(current: number, target: number): number {
  return Math.min(100, Math.round((current / target) * 100));
}

export function formatGoalValue(goal_type: Goal2025['goal_type'], value: number): string {
  switch (goal_type) {
    case 'subscribers':
      return value.toString();
    case 'pm_meetings':
      return value.toString();
    case 'mayfair_savings':
      return `$${value.toLocaleString()}`;
    default:
      return value.toString();
  }
} 