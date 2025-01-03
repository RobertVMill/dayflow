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
import { getBooksPerMonth, addBook } from '../utils/books-supabase';

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
  const [showAddBook, setShowAddBook] = useState(false);
  const [newBook, setNewBook] = useState({
    title: '',
    completed_at: new Date().toISOString().split('T')[0],
    notes: '',
    category: ''
  });

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

  async function handleAddBook(e: React.FormEvent) {
    e.preventDefault();
    try {
      await addBook(newBook);
      setShowAddBook(false);
      setNewBook({
        title: '',
        completed_at: new Date().toISOString().split('T')[0],
        notes: '',
        category: ''
      });
      // Reload book metrics
      await loadBookMetrics();
    } catch (err) {
      console.error('Failed to add book:', err);
      alert('Failed to add book. Please try again.');
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
      {metricType === 'books_per_month' && (
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => setShowAddBook(true)}
            className="text-sm px-3 py-1.5 bg-[#D47341]/20 hover:bg-[#D47341]/30 text-[#D47341] rounded-lg transition-colors"
          >
            + Add Book
          </button>
        </div>
      )}
      {metricType === 'github_commits' && (
        <div className="text-xs text-gray-400 text-center italic mt-4">
          Commits are updated automatically when page loads
        </div>
      )}

      {/* Add Book Modal */}
      {showAddBook && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1e] p-6 rounded-xl w-full max-w-md mx-4 shadow-xl">
            <h3 className="text-xl font-semibold text-white mb-4">Add Book</h3>
            <form onSubmit={handleAddBook} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/30 rounded border border-[#D47341]/20 text-white placeholder-gray-500"
                  placeholder="Enter book title"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Completion Date</label>
                <input
                  type="date"
                  value={newBook.completed_at}
                  onChange={(e) => setNewBook(prev => ({ ...prev, completed_at: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/30 rounded border border-[#D47341]/20 text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  value={newBook.category || ''}
                  onChange={(e) => setNewBook(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/30 rounded border border-[#D47341]/20 text-white placeholder-gray-500"
                  placeholder="Enter book category (optional)"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Notes</label>
                <textarea
                  value={newBook.notes || ''}
                  onChange={(e) => setNewBook(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 bg-black/30 rounded border border-[#D47341]/20 text-white placeholder-gray-500 h-24 resize-none"
                  placeholder="Enter notes (optional)"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddBook(false)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#D47341] text-white rounded hover:bg-[#D47341]/80 transition-colors"
                >
                  Add Book
                </button>
              </div>
            </form>
          </div>
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