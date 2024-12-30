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

interface WorkoutLog {
  date: string;
  benchReps?: number;
  powerCleanWeight?: number;
  runningPace?: number;
}

interface WorkoutTrackerProps {
  logs: WorkoutLog[];
}

export default function WorkoutTracker({ logs }: WorkoutTrackerProps) {
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#fff',
          boxWidth: 12,
          padding: 8,
          font: { size: 10 }
        }
      },
      title: { display: false }
    },
    scales: {
      y: {
        grid: {
          color: '#333333',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          padding: 4,
          font: { size: 9 }
        }
      },
      x: {
        grid: {
          color: '#333333',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          padding: 4,
          font: { size: 9 }
        }
      }
    },
    layout: {
      padding: { top: 5, right: 5, bottom: 5, left: 5 }
    }
  };

  const createDataset = (data: number[], label: string, color: string) => ({
    label,
    data,
    borderColor: color,
    backgroundColor: color,
    tension: 0.4
  });

  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="h-[120px]">
        <Line 
          options={chartOptions}
          data={{
            labels: logs.map(log => log.date),
            datasets: [createDataset(
              logs.map(log => log.benchReps || 0),
              'Bench Press (225lb)',
              '#ff0080' // Pink
            )]
          }}
        />
      </div>
      <div className="h-[120px]">
        <Line 
          options={chartOptions}
          data={{
            labels: logs.map(log => log.date),
            datasets: [createDataset(
              logs.map(log => log.powerCleanWeight || 0),
              'Power Clean (lbs)',
              '#7928ca' // Purple
            )]
          }}
        />
      </div>
      <div className="h-[120px]">
        <Line 
          options={chartOptions}
          data={{
            labels: logs.map(log => log.date),
            datasets: [createDataset(
              logs.map(log => log.runningPace || 0),
              'Running (km/h)',
              '#0070f3' // Blue
            )]
          }}
        />
      </div>
    </div>
  );
} 