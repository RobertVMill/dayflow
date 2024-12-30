'use client'

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface CommitLog {
  date: string;
  commits: number;
}

interface CommitsTrackerProps {
  logs: CommitLog[];
}

export default function CommitsTracker({ logs }: CommitsTrackerProps) {
  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          boxWidth: 15,
          padding: 10
        }
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        grid: {
          color: '#333333',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          padding: 8,
          font: {
            size: 11
          }
        }
      },
      x: {
        grid: {
          color: '#333333',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          padding: 8,
          font: {
            size: 11
          }
        }
      }
    },
    layout: {
      padding: {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
      }
    }
  };

  const data = {
    labels: logs.map(log => log.date),
    datasets: [
      {
        label: 'Commits',
        data: logs.map(log => log.commits),
        borderColor: '#2ecc71', // Green color for GitHub theme
        backgroundColor: '#2ecc71',
        tension: 0.4
      }
    ]
  };

  return (
    <div className="w-full">
      <Line options={options} data={data} />
    </div>
  );
} 