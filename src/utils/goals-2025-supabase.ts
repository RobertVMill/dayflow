import { supabase } from './supabase-client';

export interface Goal2025 {
  id: string;
  created_at: string;
  goal_type: 'subscribers' | 'pm_meetings' | 'mayfair_savings' | 'jazz_sessions';
  current_value: number;
  target_value: number;
  notes: string;
  last_updated: string;
}

export async function getGoals2025(): Promise<Goal2025[]> {
  const { data, error } = await supabase
    .from('goals_2025')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function updateGoalProgress(
  goalType: Goal2025['goal_type'],
  newValue: number
): Promise<void> {
  const { error } = await supabase
    .from('goals_2025')
    .update({ 
      current_value: newValue,
      last_updated: new Date().toISOString()
    })
    .eq('goal_type', goalType);

  if (error) throw error;
}

export function calculateProgressPercentage(current: number, target: number): number {
  return Math.round((current / target) * 100);
}

export function formatGoalValue(
  goalType: Goal2025['goal_type'],
  value: number
): string {
  switch (goalType) {
    case 'mayfair_savings':
      return `$${value.toLocaleString()}`;
    default:
      return value.toString();
  }
} 