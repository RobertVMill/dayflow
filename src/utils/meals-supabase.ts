import { supabase } from './supabase';

export interface Meal {
  id: string;
  created_at: string;
  name: string;
  description: string;
  benefits: string;
}

export async function addMeal(name: string, description: string, benefits: string): Promise<void> {
  const { error } = await supabase
    .from('meals')
    .insert([{ name, description, benefits }]);

  if (error) throw error;
}

export async function updateMeal(id: string, name: string, description: string, benefits: string): Promise<void> {
  const { error } = await supabase
    .from('meals')
    .update({ name, description, benefits })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteMeal(id: string): Promise<void> {
  const { error } = await supabase
    .from('meals')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getMeals(): Promise<Meal[]> {
  const { data, error } = await supabase
    .from('meals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Meal[];
} 