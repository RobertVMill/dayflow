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
import { BaseMetric, addBaseMetric, getBaseMetrics } from '../utils/base-supabase';
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

interface BaseChartProps {
  title: string;
  metricType: BaseMetric['metric_type'];
  yAxisLabel: string;
  isBinary?: boolean;
  isPlantBased?: boolean;
  isReliability?: boolean;
  options?: any;
}

const PLANT_BASED_HABITS = [
  'Fast til noon',
  'No dairy',
  'No sugar',
  'No gluten',
  'Plant-Based'
];

const RELIABILITY_HABITS = [
  'Always show up',
  'Be on time',
  'Respond in a timely manner',
  'Over-deliver on your promises'
];

function BaseChart({ title, metricType, yAxisLabel, isBinary = false, isPlantBased = false, isReliability = false, options: chartOptions }: BaseChartProps) {
  const [metrics, setMetrics] = useState<BaseMetric[]>([]);
  const [githubMetrics, setGithubMetrics] = useState<{date: string, value: number}[]>([]);
  const [newValue, setNewValue] = useState('');
  const [selectedHabits, setSelectedHabits] = useState<string[]>([]);
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
    if ((isPlantBased || isReliability) && selectedHabits.length === 0) return;
    if (!isPlantBased && !isReliability && !newValue) return;

    try {
      if (isPlantBased) {
        const value = selectedHabits.length * 20; // Each habit is worth 20%
        await addBaseMetric(metricType, value, selectedHabits);
        setSelectedHabits([]);
      } else if (isReliability) {
        const value = selectedHabits.length * 25; // Each habit is worth 25%
        await addBaseMetric(metricType, value, selectedHabits);
        setSelectedHabits([]);
      } else {
        const value = isBinary ? (newValue === 'yes' ? 1 : 0) : parseFloat(newValue);
        await addBaseMetric(metricType, value);
        setNewValue('');
      }
      loadMetrics();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add metric');
      console.error(err);
    }
  }

  function handleHabitToggle(habit: string) {
    setSelectedHabits(prev => 
      prev.includes(habit)
        ? prev.filter(h => h !== habit)
        : [...prev, habit]
    );
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
        borderColor: '#D47341',
        backgroundColor: 'rgba(212, 115, 65, 0.1)',
        tension: 0.1,
        fill: true,
        stepped: isBinary
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
            const metric = metrics[context.dataIndex];
            if (isPlantBased && metric.habits) {
              return [
                `Score: ${context.raw}%`,
                ...metric.habits.map(h => `✓ ${h}`)
              ];
            }
            if (isReliability && metric.habits) {
              return [
                `Score: ${context.raw}%`,
                ...metric.habits.map(h => `✓ ${h}`)
              ];
            }
            if (isBinary) {
              return `${context.raw === 1 ? 'Yes' : 'No'}`;
            }
            if (metricType === 'savings') {
              return `$${context.raw.toLocaleString()}`;
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
            if (metricType === 'savings') {
              return `$${value.toLocaleString()}`;
            }
            return value;
          }
        },
        min: 0,
        max: isBinary ? 1 : (
          metricType === 'savings' || 
          metricType === 'meditation' || 
          metricType === 'walking' || 
          metricType === 'github_commits' 
            ? undefined 
            : 100
        ),
        stepSize: isBinary ? 1 : undefined,
        ...(chartOptions?.scales?.y || {})
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
      <div className="h-[180px] sm:h-[200px] mb-4">
        <Line data={chartData} options={defaultOptions} />
      </div>
      <form onSubmit={handleAddMetric} className="flex flex-col gap-2">
        {isPlantBased || isReliability ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(isPlantBased ? PLANT_BASED_HABITS : RELIABILITY_HABITS).map(habit => (
                <label key={habit} className="flex items-center gap-3 text-white p-2 hover:bg-white/5 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedHabits.includes(habit)}
                    onChange={() => handleHabitToggle(habit)}
                    className="w-5 h-5 rounded border-[#D47341]/20 bg-black/30 text-[#D47341] focus:ring-[#D47341]"
                  />
                  <span className="text-base">{habit}</span>
                </label>
              ))}
            </div>
            <div className="text-right text-sm text-gray-400">
              Score: {selectedHabits.length * (isPlantBased ? 20 : 25)}%
            </div>
          </>
        ) : isBinary ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewValue('yes')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                newValue === 'yes' 
                  ? 'bg-green-600/20 text-green-400 border-green-600/40' 
                  : 'bg-black/30 text-gray-400 hover:text-green-400'
              } border`}
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => setNewValue('no')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                newValue === 'no'
                  ? 'bg-red-600/20 text-red-400 border-red-600/40'
                  : 'bg-black/30 text-gray-400 hover:text-red-400'
              } border`}
            >
              ✕
            </button>
          </div>
        ) : metricType === 'github_commits' ? (
          <div className="text-sm text-gray-400 text-center italic">
            Commits are updated automatically when page loads
          </div>
        ) : metricType === 'savings' ? (
          <input
            type="number"
            step="1"
            min="0"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Enter cash savings amount ($)"
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
        ) : metricType === 'meditation' || metricType === 'walking' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setNewValue('yes')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                newValue === 'yes' 
                  ? 'bg-green-600/20 text-green-400 border-green-600/40' 
                  : 'bg-black/30 text-gray-400 hover:text-green-400'
              } border`}
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => setNewValue('no')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                newValue === 'no'
                  ? 'bg-red-600/20 text-red-400 border-red-600/40'
                  : 'bg-black/30 text-gray-400 hover:text-red-400'
              } border`}
            >
              ✕
            </button>
          </div>
        ) : (
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()} (0-100%)`}
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
        )}
        <button
          type="submit"
          className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors"
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
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Sleep Quality</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <BaseChart
            title="Sleep Score"
            metricType="sleep_score"
            yAxisLabel="%"
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Daily Goals</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
          <BaseChart
            title="Plant-Based Habits"
            metricType="plant_based"
            yAxisLabel="%"
            isPlantBased={true}
          />
          <BaseChart
            title="Never Letting People Down"
            metricType="reliability"
            yAxisLabel="%"
            isReliability={true}
          />
          <BaseChart
            title="Meditation"
            metricType="meditation"
            yAxisLabel=""
            isBinary={true}
          />
          <BaseChart
            title="Long Walk"
            metricType="walking"
            yAxisLabel=""
            isBinary={true}
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Financial Health</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <BaseChart
            title="Cash Savings"
            metricType="savings"
            yAxisLabel="$"
          />
        </div>
      </div>
    </div>
  );
} 