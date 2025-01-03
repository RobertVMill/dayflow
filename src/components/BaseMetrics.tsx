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
import { BaseMetric, addBaseMetric, getBaseMetrics, MetricType } from '../utils/base-supabase';
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
  metricType: MetricType;
  yAxisLabel: string;
  isBinary?: boolean;
  isPlantBased?: boolean;
  isReliability?: boolean;
  options?: any;
  customMax?: number;
}

type BaseChartPropsWithValue = BaseChartProps & {
  onValueChange?: (value: string) => void;
  value?: string;
  selectedHabits?: string[];
  onHabitsChange?: (habits: string[]) => void;
  showSuccess?: boolean;
  isSubmitting?: boolean;
};

const PLANT_BASED_HABITS = [
  'Fast til noon',
  'No dairy',
  'No sugar',
  'No gluten',
  'Plant-Based',
  '6L of Water',
  'Fish Not Meat'
];

const RELIABILITY_HABITS = [
  'Always show up',
  'Be on time',
  'Respond in a timely manner',
  'Over-deliver on your promises'
];

function BaseChart({ 
  title, 
  metricType, 
  yAxisLabel, 
  isBinary = false, 
  isPlantBased = false, 
  isReliability = false, 
  options: chartOptions,
  onValueChange,
  value = '',
  selectedHabits = [],
  onHabitsChange
}: BaseChartPropsWithValue) {
  const [metrics, setMetrics] = useState<BaseMetric[]>([]);
  const [githubMetrics, setGithubMetrics] = useState<{date: string, value: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (metricType === 'github_commits') {
      loadGithubMetrics();
    } else {
      loadMetrics();
    }
  }, [metricType]);

  useEffect(() => {
    if ((metricType === 'jazz_abstinence' || metricType === 'yoga' || 
         metricType === 'clean_space' || metricType === 'sunlight' ||
         metricType === 'meditation' || metricType === 'walking' ||
         metricType === 'read_til_sleepy') && metrics.length > 0) {
      calculateStreak();
    }
  }, [metrics, metricType]);

  function calculateStreak() {
    let currentStreak = 0;
    const sortedMetrics = [...metrics].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    // Check if we have a metric for today
    const today = new Date().setHours(0, 0, 0, 0);
    const lastMetricDate = new Date(sortedMetrics[0]?.created_at).setHours(0, 0, 0, 0);
    
    if (today !== lastMetricDate) {
      setStreak(0);
      return;
    }

    for (let i = 0; i < sortedMetrics.length; i++) {
      const metric = sortedMetrics[i];
      if (metricType === 'jazz_abstinence') {
        if (metric.value === 0) { // 0 means abstained from jazz
          currentStreak++;
        } else {
          break;
        }
      } else if (metricType === 'yoga' || metricType === 'clean_space' || 
                 metricType === 'sunlight' || metricType === 'meditation' || 
                 metricType === 'walking' || metricType === 'read_til_sleepy') {
        if (metric.value === 1) { // 1 means completed the activity
          currentStreak++;
        } else {
          break;
        }
      }
    }
    setStreak(currentStreak);
  }

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
      const data = await getBaseMetrics();
      setMetrics(data[metricType] || []);
    } catch (err) {
      setError('Failed to load metrics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleHabitToggle(habit: string) {
    if (onHabitsChange) {
      onHabitsChange(
        selectedHabits.includes(habit)
          ? selectedHabits.filter(h => h !== habit)
          : [...selectedHabits, habit]
      );
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
          metricType === 'strain_score' ? 21 : (
            metricType === 'savings' || 
            metricType === 'meditation' || 
            metricType === 'walking' || 
            metricType === 'github_commits' 
              ? undefined 
              : 100
          )
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
      {metricType !== 'jazz_abstinence' && metricType !== 'yoga' && 
       metricType !== 'clean_space' && metricType !== 'sunlight' &&
       metricType !== 'meditation' && metricType !== 'walking' &&
       metricType !== 'read_til_sleepy' && (
        <div className="h-[180px] sm:h-[200px] mb-4">
          <Line data={chartData} options={defaultOptions} />
        </div>
      )}
      {(metricType === 'jazz_abstinence' || metricType === 'yoga' || 
        metricType === 'clean_space' || metricType === 'sunlight' ||
        metricType === 'meditation' || metricType === 'walking' ||
        metricType === 'read_til_sleepy') && (
        <div className="py-8 text-center">
          <div className="text-4xl font-bold text-[#D47341]">{streak} Days</div>
          <div className="text-gray-400 mt-2">
            {metricType === 'jazz_abstinence' && 'Without Jazz'}
            {metricType === 'yoga' && 'Yoga Streak'}
            {metricType === 'clean_space' && 'Clean while brushing teeth Streak'}
            {metricType === 'sunlight' && '30 min Sunlight Streak'}
            {metricType === 'meditation' && 'Meditation Streak'}
            {metricType === 'walking' && 'Walking Streak'}
            {metricType === 'read_til_sleepy' && 'Read til sleepy Streak'}
          </div>
        </div>
      )}
      <div className="flex flex-col gap-2">
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
              Score: {isPlantBased 
                ? Math.min(100, Math.round(selectedHabits.length * (100 / 7)))
                : selectedHabits.length * 25}%
            </div>
          </>
        ) : metricType === 'jazz_abstinence' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onValueChange?.('no')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                value === 'no' 
                  ? 'bg-green-600/20 text-green-400 border-green-600/40' 
                  : 'bg-black/30 text-gray-400 hover:text-green-400'
              } border`}
            >
              No Jazz Today
            </button>
            <button
              type="button"
              onClick={() => onValueChange?.('yes')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                value === 'yes'
                  ? 'bg-red-600/20 text-red-400 border-red-600/40'
                  : 'bg-black/30 text-gray-400 hover:text-red-400'
              } border`}
            >
              Reset Streak
            </button>
          </div>
        ) : metricType === 'yoga' ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onValueChange?.('yes')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                value === 'yes' 
                  ? 'bg-green-600/20 text-green-400 border-green-600/40' 
                  : 'bg-black/30 text-gray-400 hover:text-green-400'
              } border`}
            >
              Did Yoga Today
            </button>
            <button
              type="button"
              onClick={() => onValueChange?.('no')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                value === 'no'
                  ? 'bg-red-600/20 text-red-400 border-red-600/40'
                  : 'bg-black/30 text-gray-400 hover:text-red-400'
              } border`}
            >
              Break Streak
            </button>
          </div>
        ) : isBinary ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onValueChange?.('yes')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                value === 'yes' 
                  ? 'bg-green-600/20 text-green-400 border-green-600/40' 
                  : 'bg-black/30 text-gray-400 hover:text-green-400'
              } border`}
            >
              ✓
            </button>
            <button
              type="button"
              onClick={() => onValueChange?.('no')}
              className={`flex-1 p-2 rounded text-sm sm:text-base transition-colors ${
                value === 'no'
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
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder="Enter cash savings amount ($)"
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
        ) : metricType === 'strain_score' ? (
          <input
            type="number"
            step="1"
            min="0"
            max="21"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder="Enter strain score (0-21)"
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
        ) : (
          <input
            type="number"
            step="1"
            min="0"
            max="100"
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
            placeholder={`Enter ${title.toLowerCase()} (0-100%)`}
            className="flex-1 p-2 text-sm sm:text-base rounded bg-black/30 text-white border border-[#D47341]/20 placeholder-gray-500"
          />
        )}
      </div>
    </div>
  );
}

export default function BaseMetrics() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [habits, setHabits] = useState<Record<string, string[]>>({
    plant_based: [],
    reliability: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setShowSuccess(false);

    try {
      // Submit all metrics
      await Promise.all(Object.entries(values).map(async ([metricType, value]) => {
        if (!value) return;

        if (metricType === 'plant_based') {
          const itemValue = 100 / 7; // 14.29% per item
          const numericValue = Math.min(100, Math.round(habits.plant_based.length * itemValue));
          await addBaseMetric(metricType as MetricType, numericValue, habits.plant_based);
        } else if (metricType === 'reliability') {
          const numericValue = habits.reliability.length * 25;
          await addBaseMetric(metricType as MetricType, numericValue, habits.reliability);
        } else {
          const numericValue = value === 'yes' ? 1 : value === 'no' ? 0 : parseFloat(value);
          await addBaseMetric(metricType as MetricType, numericValue);
        }
      }));

      // Show success message
      setShowSuccess(true);
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000);

      // Reset form
      setValues({});
      setHabits({ plant_based: [], reliability: [] });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit metrics');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full grid gap-6 sm:gap-8 -mx-2 sm:mx-0">
      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Strain/Recovery Cycle</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <BaseChart
            title="Recovery Score"
            metricType="sleep_score"
            yAxisLabel="%"
            value={values.sleep_score || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, sleep_score: value }))}
          />
          <BaseChart
            title="Strain Score"
            metricType="strain_score"
            yAxisLabel="Strain"
            value={values.strain_score || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, strain_score: value }))}
            options={{
              scales: {
                y: {
                  max: 21,
                  ticks: {
                    stepSize: 3
                  }
                }
              }
            }}
          />
        </div>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Connection & Impact</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <BaseChart
            title="Good Deeds Done"
            metricType="good_deeds"
            yAxisLabel="deeds"
            value={values.good_deeds || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, good_deeds: value }))}
          />
          <BaseChart
            title="Deep Connections"
            metricType="connections"
            yAxisLabel="activities"
            value={values.connections || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, connections: value }))}
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

      <div className="space-y-4 sm:space-y-6">
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Success Habits</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <BaseChart
            title="Clean and Organize while brushing teeth"
            metricType="clean_space"
            yAxisLabel=""
            isBinary={true}
            value={values.clean_space || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, clean_space: value }))}
          />
          <BaseChart
            title="30 Minutes of Sunlight"
            metricType="sunlight"
            yAxisLabel=""
            isBinary={true}
            value={values.sunlight || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, sunlight: value }))}
          />
          <BaseChart
            title="Microbiome Checklist"
            metricType="plant_based"
            yAxisLabel="%"
            isPlantBased={true}
            selectedHabits={habits.plant_based}
            onHabitsChange={(newHabits) => setHabits(prev => ({ ...prev, plant_based: newHabits }))}
          />
          <BaseChart
            title="Never Letting People Down"
            metricType="reliability"
            yAxisLabel="%"
            isReliability={true}
            selectedHabits={habits.reliability}
            onHabitsChange={(newHabits) => setHabits(prev => ({ ...prev, reliability: newHabits }))}
          />
          <BaseChart
            title="Meditation"
            metricType="meditation"
            yAxisLabel=""
            isBinary={true}
            value={values.meditation || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, meditation: value }))}
          />
          <BaseChart
            title="Long Walk"
            metricType="walking"
            yAxisLabel=""
            isBinary={true}
            value={values.walking || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, walking: value }))}
          />
          <BaseChart
            title="Read til sleepy"
            metricType="read_til_sleepy"
            yAxisLabel=""
            isBinary={true}
            value={values.read_til_sleepy || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, read_til_sleepy: value }))}
          />
          <BaseChart
            title="Jazz Abstinence"
            metricType="jazz_abstinence"
            yAxisLabel="Days"
            isBinary={true}
            value={values.jazz_abstinence || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, jazz_abstinence: value }))}
          />
          <BaseChart
            title="Yoga Practice"
            metricType="yoga"
            yAxisLabel="Days"
            isBinary={true}
            value={values.yoga || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, yoga: value }))}
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
            value={values.savings || ''}
            onValueChange={(value) => setValues(prev => ({ ...prev, savings: value }))}
          />
        </div>
      </div>

      {error && (
        <div className="text-red-500 bg-red-500/10 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 bg-black/95 p-4">
        {showSuccess && (
          <div className="mb-4 bg-green-600/90 text-white px-4 py-3 rounded-lg text-center shadow-lg transition-all duration-300 ease-in-out">
            ✓ Metrics submitted successfully!
          </div>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-3 text-lg bg-[#D47341] text-white rounded hover:bg-[#B85C2C] transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit All Metrics'}
        </button>
      </div>
    </form>
  );
} 