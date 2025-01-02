import { supabase } from './supabase';

export type MetricType = 'good_deeds' | 'connections';

export interface EmpathyMetric {
  id: string;
  created_at: string;
  metric_type: MetricType;
  value: number;
}

export async function addEmpathyMetric(type: EmpathyMetric['metric_type'], value: number) {
  const { data, error } = await supabase
    .from('empathy_metrics')
    .insert([
      { metric_type: type, value: value }
    ])
    .select();
  
  if (error) throw error;
  return data;
}

export async function getEmpathyMetrics(type: EmpathyMetric['metric_type']) {
  const { data, error } = await supabase
    .from('empathy_metrics')
    .select('*')
    .eq('metric_type', type)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data as EmpathyMetric[];
} 