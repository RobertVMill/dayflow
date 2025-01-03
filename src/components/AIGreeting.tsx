import { useEffect, useState } from 'react';

interface AIGreetingProps {
  currentDate: Date;
  currentWeek: number;
  dayActivities: {
    fitness: string[];
    craft: string[];
  };
}

export default function AIGreeting({ currentDate, currentWeek, dayActivities }: AIGreetingProps) {
  const [greeting, setGreeting] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGreeting();
  }, [currentDate]);

  async function fetchGreeting() {
    try {
      setIsLoading(true);
      const response = await fetch('/api/ai-greeting', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentDate: currentDate.toISOString(),
          currentWeek,
          dayActivities,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch greeting');
      
      const data = await response.json();
      setGreeting(data.message);
    } catch (error) {
      console.error('Error fetching AI greeting:', error);
      setGreeting('Good morning Bert! 🌟 Let\'s make today amazing!');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-6 bg-[#1c1c1e]/30 rounded-xl backdrop-blur-sm border border-[#D47341]/20 mb-8">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 flex-shrink-0">
          <svg viewBox="0 0 48 48" className="w-full h-full stroke-[#D47341] fill-none stroke-[2]">
            <circle cx="24" cy="24" r="20" className="fill-[#D47341]/10" />
            <path d="M16 24C16 24 20 28 24 28C28 28 32 24 32 24" />
            <circle cx="24" cy="24" r="20" className="stroke-[#D47341]/30" />
          </svg>
        </div>
        <div className="flex-1">
          {isLoading ? (
            <div className="animate-pulse h-20 bg-[#D47341]/10 rounded"></div>
          ) : (
            <p className="text-gray-300 whitespace-pre-line">{greeting}</p>
          )}
        </div>
      </div>
    </div>
  );
} 