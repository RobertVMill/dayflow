import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Fitness Metrics Types and Functions
export type FitnessMetric = {
  id: number;
  created_at: string;
  metric_type: 'heart_rate' | 'hrv' | 'running_pace' | 'bench_press' | 'power_clean';
  value: number;
};

export async function addMetric(type: FitnessMetric['metric_type'], value: number) {
  const { data, error } = await supabase
    .from('fitness_metrics')
    .insert([{ metric_type: type, value: value }])
    .select();

  if (error) throw error;
  return data;
}

export async function getMetrics(type: FitnessMetric['metric_type']) {
  const { data, error } = await supabase
    .from('fitness_metrics')
    .select('*')
    .eq('metric_type', type)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as FitnessMetric[];
}

// Journal Entry Types and Functions
export type JournalEntry = {
  id?: string;
  created_at?: string;
  blessings: string;
  contributions: string;
  fitness_improvements: string;
  microbiome_improvements: string;
  craft_improvements: string;
  best_day_plan: string;
};

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([entry])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestJournalEntry() {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
} 