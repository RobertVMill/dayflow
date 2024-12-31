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
import { FitnessMetric, addMetric, getMetrics } from '../utils/supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface FitnessChartProps {
  title: string;
  metricType: FitnessMetric['metric_type'];
  yAxisLabel: string;
}

export default function FitnessChart({ title, metricType, yAxisLabel }: FitnessChartProps) {
  const [metrics, setMetrics] = useState<FitnessMetric[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [metricType]);

  async function loadMetrics() {
    try {
      const data = await getMetrics(metricType);
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
      await addMetric(metricType, parseFloat(newValue));
      setNewValue('');
      loadMetrics();
    } catch (err) {
      setError('Failed to add metric');
      console.error(err);
    }
  }

  const chartData = {
    labels: metrics.map(m => {
      const date = new Date(m.created_at);
      // On mobile, show shorter date format
      return window.innerWidth < 640 
        ? `${date.getMonth() + 1}/${date.getDate()}`
        : date.toLocaleDateString();
    }),
    datasets: [
      {
        label: title,
        data: metrics.map(m => m.value),
        borderColor: '#8B1E1E',
        backgroundColor: 'rgba(139, 30, 30, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 16
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 12,
        displayColors: false
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: '#ffffff'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          maxRotation: 45,
          minRotation: 45
        }
      }
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>;

  return (
    <div className="w-full p-2 sm:p-4 bg-black/30 rounded-lg">
      <div className="h-[250px] sm:h-[300px] mb-4">
        <Line data={chartData} options={{
          ...options,
          scales: {
            ...options.scales,
            x: {
              ...options.scales.x,
              ticks: {
                ...options.scales.x.ticks,
                autoSkip: true,
                maxTicksLimit: 6,
                maxRotation: 45,
                minRotation: 45,
                font: {
                  size: 10
                }
              }
            },
            y: {
              ...options.scales.y,
              ticks: {
                ...options.scales.y.ticks,
                font: {
                  size: 10
                }
              }
            }
          }
        }} />
      </div>
      <form onSubmit={handleAddMetric} className="flex gap-1 sm:gap-2">
        <input
          type="number"
          step="0.01"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Enter ${title.toLowerCase()}`}
          className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#8B1E1E]/20 placeholder-gray-500"
        />
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#8B1E1E] text-white rounded hover:bg-[#661616] transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
} 