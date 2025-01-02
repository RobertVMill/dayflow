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
  Filler,
  BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { LearningMetric, getLearningMetrics } from '../utils/learning-supabase';
import { fetchGithubCommits } from '../utils/github';
import { getBooksPerMonth } from '../utils/books-supabase';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface LearningChartProps {
  title: string;
  metricType: 'books_per_month' | 'github_commits';
  yAxisLabel: string;
  options?: any;
}

function LearningChart({ title, metricType, yAxisLabel, options: chartOptions }: LearningChartProps) {
  const [metrics, setMetrics] = useState<{date: string, count: number}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (metricType === 'github_commits') {
      loadGithubMetrics();
    } else {
      loadBookMetrics();
    }
  }, [metricType]);

  async function loadGithubMetrics() {
    try {
      const commits = await fetchGithubCommits();
      const sortedCommits = Object.entries(commits)
        .map(([date, value]) => ({ date, count: value }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setMetrics(sortedCommits);
    } catch (err) {
      setError('Failed to load GitHub commits');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadBookMetrics() {
    try {
      const data = await getBooksPerMonth();
      setMetrics(data);
    } catch (err) {
      setError('Failed to load book metrics');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const chartData = {
    labels: metrics.map(m => {
      const [year, month] = m.date.split('-').map(Number);
      const date = new Date(year, month - 1);
      
      return window.innerWidth < 640 
        ? `${month}/${year.toString().slice(2)}`
        : date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    }),
    datasets: [
      {
        label: title,
        data: metrics.map(m => m.count),
        borderColor: '#D47341',
        backgroundColor: metricType === 'books_per_month' 
          ? 'rgba(212, 115, 65, 0.8)'
          : 'rgba(212, 115, 65, 0.1)',
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
            if (metricType === 'github_commits') {
              return `${count} commits`;
            }
            return `${count} ${count === 1 ? 'book' : 'books'}`;
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

  const ChartComponent = metricType === 'books_per_month' ? Bar : Line;

  return (
    <div className="w-full p-2 sm:p-4 bg-black/30 rounded-lg">
      <div className="aspect-square">
        <ChartComponent data={chartData} options={defaultOptions} />
      </div>
      {metricType === 'github_commits' && (
        <div className="text-xs text-gray-400 text-center italic mt-4">
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
        <h4 className="text-lg font-medium text-[#D47341]/80 px-2 sm:px-0">Reading & Development</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <LearningChart
            title="Books Read"
            metricType="books_per_month"
            yAxisLabel="books"
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