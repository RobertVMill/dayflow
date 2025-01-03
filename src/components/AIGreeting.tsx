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
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [selectedType, setSelectedType] = useState<'positive' | 'negative' | null>(null);

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

  async function submitFeedback(type: 'positive' | 'negative') {
    try {
      const response = await fetch('/api/ai-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: greeting,
          feedback_type: type,
          comment: feedback,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('Server error:', error);
        throw new Error(error.error || 'Failed to submit feedback');
      }
      
      setFeedbackSubmitted(true);
      setTimeout(() => {
        setShowFeedback(false);
        setFeedbackSubmitted(false);
        setFeedback('');
        setSelectedType(null);
      }, 2000);
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
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
            <>
              <p className="text-gray-300 whitespace-pre-line">{greeting}</p>
              {!showFeedback && !feedbackSubmitted && (
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowFeedback(true);
                      setSelectedType('positive');
                    }}
                    className="text-[#D47341] hover:text-[#D47341]/80 transition-colors"
                    title="This message was helpful"
                  >
                    👍
                  </button>
                  <button
                    onClick={() => {
                      setShowFeedback(true);
                      setSelectedType('negative');
                    }}
                    className="text-[#D47341] hover:text-[#D47341]/80 transition-colors"
                    title="This message could be better"
                  >
                    👎
                  </button>
                </div>
              )}
              {showFeedback && !feedbackSubmitted && (
                <div className="mt-4">
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Any specific feedback? (optional)"
                    className="w-full p-2 bg-[#1c1c1e] border border-[#D47341]/20 rounded text-gray-300 text-sm"
                    rows={2}
                  />
                  <div className="mt-2 flex justify-end gap-2">
                    <button
                      onClick={() => {
                        setShowFeedback(false);
                        setFeedback('');
                        setSelectedType(null);
                      }}
                      className="px-3 py-1 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => selectedType && submitFeedback(selectedType)}
                      className="px-3 py-1 bg-[#D47341]/20 hover:bg-[#D47341]/30 text-[#D47341] rounded text-sm transition-colors"
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
              {feedbackSubmitted && (
                <p className="mt-4 text-sm text-[#D47341]">Thanks for your feedback! 🙏</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
} 