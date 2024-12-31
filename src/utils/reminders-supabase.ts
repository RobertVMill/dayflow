import { supabase } from './supabase';

export interface Reminder {
  id: string;
  created_at: string;
  name: string;
  description: string;
  benefits: string;
}

export async function addReminder(name: string, description: string, benefits: string): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .insert([{ name, description, benefits }]);

  if (error) throw error;
}

export async function updateReminder(id: string, name: string, description: string, benefits: string): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .update({ name, description, benefits })
    .eq('id', id);

  if (error) throw error;
}

export async function deleteReminder(id: string): Promise<void> {
  const { error } = await supabase
    .from('reminders')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getReminders(): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Reminder[];
} 