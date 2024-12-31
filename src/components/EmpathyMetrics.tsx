import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { EmpathyMetric, addEmpathyMetric, getEmpathyMetrics } from '../utils/empathy-supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface EmpathyChartProps {
  title: string;
  metricType: EmpathyMetric['metric_type'];
  yAxisLabel: string;
}

function EmpathyChart({ title, metricType, yAxisLabel }: EmpathyChartProps) {
  const [metrics, setMetrics] = useState<EmpathyMetric[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [metricType]);

  async function loadMetrics() {
    try {
      const data = await getEmpathyMetrics(metricType);
      setMetrics(data);
    } catch (err) {
      setError('Failed to load metrics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddMetric(e: React.FormEvent) {
    e.preventDefault();
    if (!newValue) return;

    try {
      await addEmpathyMetric(metricType, parseInt(newValue));
      setNewValue('');
      loadMetrics();
    } catch (err) {
      setError('Failed to add metric');
      console.error(err);
    }
  }

  const chartData = {
    labels: metrics.map(m => new Date(m.created_at).toLocaleDateString()),
    datasets: [
      {
        label: title,
        data: metrics.map(m => m.value),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="w-full max-w-2xl p-4 bg-white/5 rounded-lg">
      <div className="mb-4">
        <Line data={chartData} options={options} />
      </div>
      <form onSubmit={handleAddMetric} className="flex gap-2">
        <input
          type="number"
          step="1"
          min="0"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Enter ${title.toLowerCase()}`}
          className="flex-1 p-2 rounded bg-white/10 text-foreground"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default function EmpathyMetrics() {
  return (
    <div className="w-full space-y-8">
      <EmpathyChart
        title="Good Deeds Done"
        metricType="good_deeds"
        yAxisLabel="Deeds"
      />
      <EmpathyChart
        title="Connecting Time"
        metricType="connecting_time"
        yAxisLabel="Minutes"
      />
    </div>
  );
} 