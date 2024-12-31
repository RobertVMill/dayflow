import { addBaseMetric } from './base-supabase';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const USERNAME = 'RobertVMill'; // Your GitHub username

interface GithubCommit {
  commit: {
    author: {
      date: string;
    };
  };
}

export async function fetchAndStoreGithubCommits() {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  // Get yesterday's date in ISO format
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const since = yesterday.toISOString().split('T')[0];
  
  // Get today's date in ISO format
  const until = new Date().toISOString().split('T')[0];

  try {
    const response = await fetch(
      `https://api.github.com/users/${USERNAME}/events`,
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
    
    // Count push events (commits) for yesterday
    const yesterdayCommits = events.filter((event: any) => {
      const eventDate = new Date(event.created_at).toISOString().split('T')[0];
      return event.type === 'PushEvent' && eventDate === since;
    }).reduce((total: number, event: any) => total + event.payload.size, 0);

    // Store the commit count
    await addBaseMetric('github_commits', yesterdayCommits);
    
    return yesterdayCommits;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
} 