import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type FitnessMetric = {
  id: number;
  created_at: string;
  metric_type: 'heart_rate' | 'hrv' | 'running_pace' | 'bench_press' | 'power_clean';
  value: number;
};

export async function addMetric(type: FitnessMetric['metric_type'], value: number) {
  const { data, error } = await supabase
    .from('fitness_metrics')
    .insert([
      { metric_type: type, value: value }
    ])
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