import { addBaseMetric, getBaseMetrics } from './base-supabase';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const USERNAME = 'RobertVMill';

export async function fetchGithubCommits(): Promise<{[key: string]: number}> {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    // Get both user events and today's commits
    const [eventsResponse, todayResponse] = await Promise.all([
      fetch(
        `https://api.github.com/users/${USERNAME}/events?per_page=100`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      ),
      // Get today's commits specifically
      fetch(
        `https://api.github.com/users/${USERNAME}/events`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      )
    ]);

    if (!eventsResponse.ok || !todayResponse.ok) {
      throw new Error('Failed to fetch GitHub data');
    }

    const [events, todayEvents] = await Promise.all([
      eventsResponse.json(),
      todayResponse.json()
    ]);
    
    // Group commits by date
    const commitsByDate = events.reduce((acc: {[key: string]: number}, event: any) => {
      if (event.type === 'PushEvent') {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + (event.payload.size || 0);
      }
      return acc;
    }, {});

    // Add today's commits (always include today's entry)
    const today = new Date().toISOString().split('T')[0];
    const todayCommits = todayEvents.reduce((count: number, event: any) => {
      if (event.type === 'PushEvent' && 
          new Date(event.created_at).toISOString().split('T')[0] === today) {
        return count + (event.payload.size || 0);
      }
      return count;
    }, 0);

    // Always set today's entry, even if it's 0
    commitsByDate[today] = todayCommits;

    console.log('Fetched commits by date:', commitsByDate);
    console.log(`Today (${today}): ${todayCommits} commits`);
    
    return commitsByDate;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
} 