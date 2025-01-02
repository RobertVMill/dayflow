import { supabase } from './base-supabase';

export interface Show {
  id: string;
  created_at: string;
  title: string;
  completed_at: string;
  notes: string | null;
  category: string | null;
  rating: number;
  key_learnings: string | null;
  perspective_changes: string | null;
  status: 'completed' | 'want_to_watch';
}

export async function getShows() {
  const { data, error } = await supabase
    .from('shows')
    .select('*')
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data as Show[];
}

export async function addShow(
  title: string,
  completed_at: string,
  rating: number,
  status: 'completed' | 'want_to_watch',
  category?: string,
  notes?: string,
  key_learnings?: string,
  perspective_changes?: string
) {
  const { data, error } = await supabase
    .from('shows')
    .insert([{
      title,
      completed_at,
      rating,
      status,
      category,
      notes,
      key_learnings,
      perspective_changes
    }]);

  if (error) throw error;
  return data;
}

export async function updateShow(
  id: string,
  updates: Partial<Omit<Show, 'id' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('shows')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function deleteShow(id: string) {
  const { error } = await supabase
    .from('shows')
    .delete()
    .eq('id', id);

  if (error) throw error;
} 