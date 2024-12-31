import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create a single instance of the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export type MetricType = 'sleep_score' | 'sunlight' | 'water' | 'plant_based' | 'reliability' | 'savings' | 'meditation' | 'walking';

export interface BaseMetric {
  id: string;
  created_at: string;
  metric_type: MetricType;
  value: number;
  habits?: string[];
}

export async function addBaseMetric(
  metric_type: MetricType,
  value: number,
  habits?: string[]
): Promise<void> {
  // Validate value based on metric type
  switch (metric_type) {
    case 'sleep_score':
      if (value < 0 || value > 100) {
        throw new Error('Sleep score must be between 0 and 100');
      }
      break;
    case 'sunlight':
    case 'water':
      if (value !== 0 && value !== 1) {
        throw new Error('Sunlight and water metrics must be 0 or 1');
      }
      break;
    case 'plant_based':
      if (value < 0 || value > 100 || value % 20 !== 0) {
        throw new Error('Plant-based score must be a multiple of 20 between 0 and 100');
      }
      if (!habits || habits.length === 0) {
        throw new Error('Plant-based metrics require habits to be specified');
      }
      break;
    case 'reliability':
      if (value < 0 || value > 100 || value % 25 !== 0) {
        throw new Error('Reliability score must be a multiple of 25 between 0 and 100');
      }
      if (!habits || habits.length === 0) {
        throw new Error('Reliability metrics require habits to be specified');
      }
      break;
    case 'savings':
      if (value < 0) {
        throw new Error('Savings amount cannot be negative');
      }
      break;
    case 'meditation':
    case 'walking':
      if (value < 0) {
        throw new Error('Minutes cannot be negative');
      }
      break;
    default:
      throw new Error('Invalid metric type');
  }

  const { error } = await supabase
    .from('base_metrics')
    .insert([{ metric_type, value, habits }]);

  if (error) throw error;
}

export async function getBaseMetrics(metric_type: MetricType): Promise<BaseMetric[]> {
  const { data, error } = await supabase
    .from('base_metrics')
    .select('*')
    .eq('metric_type', metric_type)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as BaseMetric[];
} 