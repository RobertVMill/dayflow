import { supabase } from './supabase';

export type EmpathyMetric = {
  id: number;
  created_at: string;
  metric_type: 'good_deeds' | 'connecting_time';
  value: number;
};

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