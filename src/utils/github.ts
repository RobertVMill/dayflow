import { addBaseMetric, getBaseMetrics } from './base-supabase';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const USERNAME = 'RobertVMill';

export async function fetchGithubCommits(): Promise<{[key: string]: number}> {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    // Get the last 30 days of activity
    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/events?per_page=100`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch GitHub data');
    }

    const events = await response.json();
    
    // Group commits by date
    const commitsByDate = events.reduce((acc: {[key: string]: number}, event: any) => {
      if (event.type === 'PushEvent') {
        const date = new Date(event.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + (event.payload.size || 0);
      }
      return acc;
    }, {});

    console.log('Fetched commits by date:', commitsByDate);
    return commitsByDate;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
} 