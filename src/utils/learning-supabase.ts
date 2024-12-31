import { supabase } from './supabase';

export type LearningMetric = {
  id: number;
  created_at: string;
  metric_type: 'pages_read' | 'github_commits';
  value: number;
};

export async function addLearningMetric(type: LearningMetric['metric_type'], value: number) {
  const { data, error } = await supabase
    .from('learning_metrics')
    .insert([
      { metric_type: type, value: value }
    ])
    .select();
  
  if (error) throw error;
  return data;
}

export async function getLearningMetrics(type: LearningMetric['metric_type']) {
  const { data, error } = await supabase
    .from('learning_metrics')
    .select('*')
    .eq('metric_type', type)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as LearningMetric[];
} 