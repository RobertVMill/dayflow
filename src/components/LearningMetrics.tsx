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
import { LearningMetric, addLearningMetric, getLearningMetrics } from '../utils/learning-supabase';
import { fetchGithubCommits } from '../utils/github';

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

interface LearningChartProps {
  title: string;
  metricType: LearningMetric['metric_type'];
  yAxisLabel: string;
  options?: any;
}

function LearningChart({ title, metricType, yAxisLabel, options: chartOptions }: LearningChartProps) {
  const [metrics, setMetrics] = useState<LearningMetric[]>([]);
  const [githubMetrics, setGithubMetrics] = useState<{date: string, value: number}[]>([]);
  const [newValue, setNewValue] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (metricType === 'github_commits') {
      loadGithubMetrics();
    } else {
      loadMetrics();
    }
  }, [metricType]);

  async function loadGithubMetrics() {
    try {
      const commits = await fetchGithubCommits();
      const sortedCommits = Object.entries(commits)
        .map(([date, value]) => ({ date, value }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setGithubMetrics(sortedCommits);
    } catch (err) {
      setError('Failed to load GitHub commits');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadMetrics() {
    try {
      const data = await getLearningMetrics(metricType);
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
      await addLearningMetric(metricType, parseFloat(newValue));
      setNewValue('');
      loadMetrics();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add metric');
      console.error(err);
    }
  }

  const chartData = {
    labels: metricType === 'github_commits' 
      ? githubMetrics.map(m => {
          const date = new Date(m.date);
          return window.innerWidth < 640 
            ? `${date.getMonth() + 1}/${date.getDate()}`
            : date.toLocaleDateString();
        })
      : metrics.map(m => {
          const date = new Date(m.created_at);
          return window.innerWidth < 640 
            ? `${date.getMonth() + 1}/${date.getDate()}`
            : date.toLocaleDateString();
        }),
    datasets: [
      {
        label: title,
        data: metricType === 'github_commits' 
          ? githubMetrics.map(m => m.value)
          : metrics.map(m => m.value),
        borderColor: '#8B1E1E',
        backgroundColor: 'rgba(139, 30, 30, 0.1)',
        tension: 0.1,
        fill: true
      }
    ]
  };

  const defaultOptions = {
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
            if (metricType === 'github_commits') {
              return `${context.raw} commits`;
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
          }
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
        <Line data={chartData} options={defaultOptions} />
      </div>
      {metricType !== 'github_commits' && (
        <form onSubmit={handleAddMetric} className="flex flex-col gap-2">
          <input
            type="number"
            step="1"
            min="0"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()} (${yAxisLabel})`}
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#8B1E1E]/20 placeholder-gray-500"
          />
          <button
            type="submit"
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#8B1E1E] text-white rounded hover:bg-[#661616] transition-colors"
          >
            Add
          </button>
        </form>
      )}
      {metricType === 'github_commits' && (
        <div className="text-sm text-gray-400 text-center italic">
          Commits are updated automatically when page loads
        </div>
      )}
    </div>
  );
}

export default function LearningMetrics() {
  return (
    <div className="w-full grid gap-6 sm:gap-8 -mx-2 sm:mx-0">
      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#8B1E1E]/80 px-2 sm:px-0">Reading & Development</h4>
        <div className="space-y-4 sm:space-y-6">
          <LearningChart
            title="Pages Read"
            metricType="pages_read"
            yAxisLabel="pages"
          />
          <LearningChart
            title="GitHub Commits"
            metricType="github_commits"
            yAxisLabel="commits"
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