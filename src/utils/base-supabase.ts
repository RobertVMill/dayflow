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
  | 'strain_score'
  | 'sunlight'
  | 'plant_based'
  | 'reliability'
  | 'savings'
  | 'meditation'
  | 'walking'
  | 'jazz_abstinence'
  | 'yoga'
  | 'clean_space'
  | 'github_commits'
  | 'good_deeds'
  | 'connections'
  | 'read_til_sleepy';

export interface BaseMetric {
  id: string;
  created_at: string;
  metric_type: MetricType;
  value: number;
  habits?: string[];
}

export async function addBaseMetric(metric_type: MetricType, value: number, habits?: string[]) {
  if (metric_type === 'strain_score') {
    const { data, error } = await supabase
      .from('strain_score')
      .insert([{ score: value }]);
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from('base_metrics')
    .insert([{ metric_type, value, habits }]);

  if (error) throw error;
  return data;
}

export async function getBaseMetrics() {
  try {
    // Get strain scores
    const { data: strainScores, error: strainError } = await supabase
      .from('strain_score')
      .select('*')
      .order('date', { ascending: true });
    
    if (strainError) throw strainError;

    // Get all other metrics
    const { data: baseMetrics, error: baseError } = await supabase
      .from('base_metrics')
      .select('*')
      .order('created_at', { ascending: true });

    if (baseError) throw baseError;

    // Group base metrics by type
    const groupedMetrics = baseMetrics.reduce((acc, metric) => {
      if (!acc[metric.metric_type]) {
        acc[metric.metric_type] = [];
      }
      acc[metric.metric_type].push(metric);
      return acc;
    }, {} as Record<MetricType, BaseMetric[]>);

    // Add strain scores
    groupedMetrics.strain_score = strainScores || [];

    return groupedMetrics;
  } catch (error) {
    console.error('Error fetching base metrics:', error);
    throw error;
  }
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
    case 'good_deeds':
      return 'Good Deeds Done';
    case 'connections':
      return 'Deep Connections';
    case 'read_til_sleepy':
      return 'Read til sleepy';
    default:
      return metric_type;
  }
} 