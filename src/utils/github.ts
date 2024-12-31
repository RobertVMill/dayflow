import { addBaseMetric, getBaseMetrics } from './base-supabase';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const USERNAME = 'RobertVMill'; // Your GitHub username

export async function fetchAndStoreGithubCommits() {
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

    // Get existing metrics to avoid duplicates
    const existingMetrics = await getBaseMetrics('github_commits');
    const existingDates = new Set(existingMetrics.map(m => 
      new Date(m.created_at).toISOString().split('T')[0]
    ));

    // Store new commit counts
    for (const [date, count] of Object.entries(commitsByDate)) {
      if (!existingDates.has(date)) {
        // Create a date object at noon UTC for consistent timestamps
        const commitDate = new Date(date);
        commitDate.setUTCHours(12, 0, 0, 0);
        
        // Ensure count is a number and convert to integer
        const commitCount = Math.floor(Number(count));
        console.log(`Adding ${commitCount} commits for ${date}`);
        
        await addBaseMetric('github_commits', commitCount);
      }
    }
    
    return commitsByDate;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
} 