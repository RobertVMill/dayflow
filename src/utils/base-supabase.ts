import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export interface BaseMetric {
  id: string;
  created_at: string;
  metric_type: 'sleep_score' | 'sunlight' | 'water';
  value: number;
}

export async function addBaseMetric(metric_type: BaseMetric['metric_type'], value: number) {
  // Validate value based on metric type
  if (metric_type === 'sleep_score' && (value < 0 || value > 100)) {
    throw new Error('Sleep score must be between 0 and 100');
  }
  if ((metric_type === 'sunlight' || metric_type === 'water') && (value !== 0 && value !== 1)) {
    throw new Error('Sunlight and water metrics must be 0 or 1');
  }

  const { error } = await supabase
    .from('base_metrics')
    .insert([{ metric_type, value }]);

  if (error) throw error;
}

export async function getBaseMetrics(metric_type: BaseMetric['metric_type']) {
  const { data, error } = await supabase
    .from('base_metrics')
    .select('*')
    .eq('metric_type', metric_type)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as BaseMetric[];
} 