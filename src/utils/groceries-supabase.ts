import { supabase } from './base-supabase';

export interface GroceryItem {
  id: string;
  created_at: string;
  name: string;
  is_needed: boolean;
  category: string | null;
}

export async function getGroceryItems() {
  const { data, error } = await supabase
    .from('groceries')
    .select('*')
    .order('category', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return data as GroceryItem[];
}

export async function addGroceryItem(name: string, category?: string) {
  const { data, error } = await supabase
    .from('groceries')
    .insert([{ name, category }]);

  if (error) throw error;
  return data;
}

export async function toggleGroceryItem(id: string, is_needed: boolean) {
  const { data, error } = await supabase
    .from('groceries')
    .update({ is_needed })
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function deleteGroceryItem(id: string) {
  const { error } = await supabase
    .from('groceries')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 