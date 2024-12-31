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
import { BaseMetric, addBaseMetric, getBaseMetrics } from '../utils/base-supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BaseChartProps {
  title: string;
  metricType: BaseMetric['metric_type'];
  yAxisLabel: string;
  isBinary?: boolean;
}

function BaseChart({ title, metricType, yAxisLabel, isBinary = false }: BaseChartProps) {
  const [metrics, setMetrics] = useState<BaseMetric[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMetrics();
  }, [metricType]);

  async function loadMetrics() {
    try {
      const data = await getBaseMetrics(metricType);
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
      const value = isBinary ? (newValue === 'yes' ? 1 : 0) : parseFloat(newValue);
      await addBaseMetric(metricType, value);
      setNewValue('');
      loadMetrics();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add metric');
      console.error(err);
    }
  }

  const chartData = {
    labels: metrics.map(m => {
      const date = new Date(m.created_at);
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
        fill: true,
        stepped: isBinary
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
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            if (isBinary) {
              return `${context.raw === 1 ? 'Yes' : 'No'}`;
            }
            return `${context.raw}${yAxisLabel}`;
          }
        }
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
          color: '#ffffff',
          font: {
            size: 10
          },
          callback: function(value: any) {
            if (isBinary) {
              return value === 1 ? 'Yes' : 'No';
            }
            return value;
          }
        },
        min: 0,
        max: isBinary ? 1 : 100,
        stepSize: isBinary ? 1 : undefined
      } as any,
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 6,
          font: {
            size: 10
          }
        }
      }
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>;

  return (
    <div className="w-full p-2 sm:p-4 bg-black/30 rounded-lg">
      <div className="h-[250px] sm:h-[300px] mb-4">
        <Line data={chartData} options={options} />
      </div>
      <form onSubmit={handleAddMetric} className="flex gap-1 sm:gap-2">
        {isBinary ? (
          <select
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#8B1E1E]/20"
            required
          >
            <option value="">Select...</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        ) : (
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()} (0-100%)`}
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#8B1E1E]/20 placeholder-gray-500"
          />
        )}
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

export default function BaseMetrics() {
  return (
    <div className="w-full grid gap-6 sm:gap-8 -mx-2 sm:mx-0">
      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#8B1E1E]/80 px-2 sm:px-0">Sleep Quality</h4>
        <div className="space-y-4 sm:space-y-6">
          <BaseChart
            title="Sleep Score"
            metricType="sleep_score"
            yAxisLabel="%"
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#8B1E1E]/80 px-2 sm:px-0">Daily Goals</h4>
        <div className="space-y-4 sm:space-y-6">
          <BaseChart
            title="30 Minutes of Sunlight"
            metricType="sunlight"
            yAxisLabel=""
            isBinary={true}
          />
          <BaseChart
            title="6L of Water"
            metricType="water"
            yAxisLabel=""
            isBinary={true}
          />
        </div>
      </div>
    </div>
  );
} 