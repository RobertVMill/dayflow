import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
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
  Legend,
  Filler
);

interface EmpathyChartProps {
  title: string;
  metricType: EmpathyMetric['metric_type'];
  yAxisLabel: string;
  options?: any;
}

function EmpathyChart({ title, metricType, yAxisLabel, options: chartOptions }: EmpathyChartProps) {
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
      setError(null);
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
      await addEmpathyMetric(metricType, parseFloat(newValue));
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
        borderColor: '#D47341',
        backgroundColor: 'rgba(212, 115, 65, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        color: '#ffffff',
        font: {
          size: 14
        },
        padding: {
          top: 10,
          bottom: 10
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        padding: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            const count = context.raw;
            if (metricType === 'connections') {
              return `${count} ${count === 1 ? 'activity' : 'activities'}`;
            }
            return `${count} ${yAxisLabel}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: yAxisLabel,
          color: '#ffffff',
          font: {
            size: 10
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: '#ffffff',
          font: {
            size: 9
          },
          stepSize: 1,
          beginAtZero: true
        },
        min: 0,
        ...(chartOptions?.scales?.y || {})
      },
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
            size: 9
          }
        }
      }
    }
  };

  if (isLoading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">{error}</div>;

  return (
    <div className="w-full p-2 sm:p-4 bg-black/30 rounded-lg">
      <div className="aspect-square">
        <Line data={chartData} options={defaultOptions} />
      </div>
      <form onSubmit={handleAddMetric} className="flex flex-col gap-2 mt-4">
        <input
          type="number"
          step="1"
          min="0"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Enter ${title.toLowerCase()} (${yAxisLabel})`}
          className="flex-1 p-2 text-sm rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
        />
        <button
          type="submit"
          className="w-full px-3 py-2 text-sm bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
}

export default function EmpathyMetrics() {
  return (
    <div className="w-full grid gap-6 sm:gap-8 -mx-2 sm:mx-0">
      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Connection & Impact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <EmpathyChart
            title="Good Deeds Done"
            metricType="good_deeds"
            yAxisLabel="deeds"
          />
          <EmpathyChart
            title="Deep Connections"
            metricType="connections"
            yAxisLabel="activities"
            options={{
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 