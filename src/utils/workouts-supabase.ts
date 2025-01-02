import { supabase } from './base-supabase';

export interface Workout {
  id: string;
  created_at: string;
  name: string;
  description: string | null;
  benefits: string | null;
  completed_at: string;
}

export async function getWorkouts() {
  const { data, error } = await supabase
    .from('workouts')
    .select('*')
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data as Workout[];
}

export async function addWorkout(
  name: string,
  completed_at: string,
  description?: string,
  benefits?: string
) {
  const { data, error } = await supabase
    .from('workouts')
    .insert([{
      name,
      completed_at,
      description,
      benefits
    }]);

  if (error) throw error;
  return data;
}

export async function updateWorkout(
  id: string,
  name: string,
  completed_at: string,
  description?: string,
  benefits?: string
) {
  const { data, error } = await supabase
    .from('workouts')
    .update({
      name,
      completed_at,
      description,
      benefits
    })
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function deleteWorkout(id: string) {
  const { error } = await supabase
    .from('workouts')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 