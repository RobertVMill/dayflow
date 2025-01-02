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

export type MetricType = 
  | 'sleep_score'
  | 'sunlight'
  | 'plant_based'
  | 'reliability'
  | 'savings'
  | 'meditation'
  | 'walking'
  | 'jazz_abstinence'
  | 'yoga'
  | 'clean_space'
  | 'github_commits';

export interface BaseMetric {
  id: string;
  created_at: string;
  metric_type: MetricType;
  value: number;
  habits?: string[];
}

export async function addBaseMetric(metric_type: MetricType, value: number, habits?: string[]) {
  const { data, error } = await supabase
    .from('base_metrics')
    .insert([{ metric_type, value, habits }]);

  if (error) throw error;
  return data;
}

export async function getBaseMetrics(metric_type: MetricType) {
  const { data, error } = await supabase
    .from('base_metrics')
    .select('*')
    .eq('metric_type', metric_type)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as BaseMetric[];
}

export function getMetricLabel(metric_type: MetricType): string {
  switch (metric_type) {
    case 'sleep_score':
      return 'Sleep Score';
    case 'sunlight':
      return 'Sunlight';
    case 'plant_based':
      return 'Plant-Based';
    case 'reliability':
      return 'Reliability';
    case 'savings':
      return 'Savings';
    case 'meditation':
      return 'Meditation';
    case 'walking':
      return 'Walking';
    case 'jazz_abstinence':
      return 'Jazz Abstinence';
    case 'yoga':
      return 'Yoga';
    case 'clean_space':
      return 'Clean Space';
    case 'github_commits':
      return 'GitHub Commits';
    default:
      return metric_type;
  }
} 