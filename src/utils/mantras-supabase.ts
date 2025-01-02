import { supabase } from './base-supabase';

export interface Mantra {
  id: string;
  created_at: string;
  text: string;
  category: string | null;
  notes: string | null;
  is_active: boolean;
  last_used_at: string | null;
}

export async function getMantras() {
  const { data, error } = await supabase
    .from('mantras')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Mantra[];
}

export async function addMantra(
  text: string,
  category?: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from('mantras')
    .insert([{
      text,
      category,
      notes,
      is_active: true
    }]);

  if (error) throw error;
  return data;
}

export async function updateMantra(
  id: string,
  updates: Partial<Omit<Mantra, 'id' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('mantras')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function deleteMantra(id: string) {
  const { error } = await supabase
    .from('mantras')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function markMantraAsUsed(id: string) {
  const { data, error } = await supabase
    .from('mantras')
    .update({
      last_used_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function toggleMantraActive(id: string, is_active: boolean) {
  const { data, error } = await supabase
    .from('mantras')
    .update({ is_active })
    .eq('id', id);

  if (error) throw error;
  return data;
} 