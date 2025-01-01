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
        borderColor: '#D47341',
        backgroundColor: 'rgba(212, 115, 65, 0.1)',
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
          color: '#ffffff',
          stepSize: 1,
          font: {
            size: 10
          }
        },
        beginAtZero: true
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
        <input
          type="number"
          step="1"
          min="0"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={`Enter ${title.toLowerCase()}`}
          className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
        />
        <button
          type="submit"
          className="px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
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
        <div className="space-y-4 sm:space-y-6">
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
      </div>
    </div>
  );
} 