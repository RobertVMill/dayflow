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

interface MicrobiomeLog {
  date: string;
  mostlyPlants: boolean;
  noDairy: boolean;
  noAddedSugar: boolean;
  fastingTilNoon: boolean;
}

interface MicrobiomeTrackerProps {
  logs: MicrobiomeLog[];
}

export default function MicrobiomeTracker({ logs }: MicrobiomeTrackerProps) {
  const calculateScore = (log: MicrobiomeLog): number => {
    let score = 0;
    if (log.mostlyPlants) score += 25;
    if (log.noDairy) score += 25;
    if (log.noAddedSugar) score += 25;
    if (log.fastingTilNoon) score += 25;
    return score;
  };

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
          padding: 8,
          font: { size: 11 },
          callback: (value: number) => `${value}%`
        },
        min: 0,
        max: 100
      },
      x: {
        grid: {
          color: '#333333',
          drawBorder: false
        },
        ticks: {
          color: '#fff',
          padding: 8,
          font: { size: 11 }
        }
      }
    },
    layout: {
      padding: { top: 10, right: 10, bottom: 10, left: 10 }
    }
  };

  const data = {
    labels: logs.map(log => log.date),
    datasets: [
      {
        label: 'Gut Health Score',
        data: logs.map(log => calculateScore(log)),
        borderColor: '#10b981', // Emerald green
        backgroundColor: '#10b981',
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