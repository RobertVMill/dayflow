import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export type MetricType = 'pages_read' | 'github_commits';

export interface LearningMetric {
  id: string;
  created_at: string;
  metric_type: MetricType;
  value: number;
}

export async function addLearningMetric(metric_type: MetricType, value: number): Promise<void> {
  // Validate value based on metric type
  switch (metric_type) {
    case 'pages_read':
      if (value < 0) {
        throw new Error('Pages read cannot be negative');
      }
      break;
    case 'github_commits':
      throw new Error('GitHub commits are tracked automatically');
    default:
      throw new Error('Invalid metric type');
  }

  const { error } = await supabase
    .from('learning_metrics')
    .insert([{ metric_type, value }]);

  if (error) throw error;
}

export async function getLearningMetrics(metric_type: MetricType): Promise<LearningMetric[]> {
  const { data, error } = await supabase
    .from('learning_metrics')
    .select('*')
    .eq('metric_type', metric_type)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return data as LearningMetric[];
} 