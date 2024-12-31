import { addBaseMetric, getBaseMetrics } from './base-supabase';

const GITHUB_TOKEN = process.env.NEXT_PUBLIC_GITHUB_TOKEN;
const USERNAME = 'RobertVMill';

async function fetchAllEvents(): Promise<any[]> {
  let page = 1;
  let allEvents: any[] = [];
  let hasMore = true;

  while (hasMore && page <= 3) { // Limit to 3 pages since that's what GitHub reliably provides
    try {
      const response = await fetch(
        `https://api.github.com/users/${USERNAME}/events?per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        console.log(`Reached end of available events at page ${page}`);
        break;
      }

      const events = await response.json();
      if (events.length === 0) {
        break;
      }
      
      allEvents = [...allEvents, ...events];
      page++;
    } catch (error) {
      console.log(`Error fetching page ${page}, continuing with data collected so far`);
      break;
    }
  }

  return allEvents;
}

function processEvents(events: any[]): {[key: string]: number} {
  const commitsByDate: {[key: string]: number} = {};
  const repoSet = new Set<string>();

  events.forEach(event => {
    if (event.type === 'PushEvent') {
      const date = new Date(event.created_at).toISOString().split('T')[0];
      const repoName = event.repo.name;
      const commitCount = event.payload.size || 0;
      
      commitsByDate[date] = (commitsByDate[date] || 0) + commitCount;
      repoSet.add(repoName);
    }
  });

  // Log unique repositories we're getting commits from
  console.log('Commits found in these repositories:', Array.from(repoSet));
  
  return commitsByDate;
}

export async function fetchGithubCommits(): Promise<{[key: string]: number}> {
  if (!GITHUB_TOKEN) {
    throw new Error('GitHub token not configured');
  }

  try {
    // Get all events in one array
    const allEvents = await fetchAllEvents();
    
    // Process all events together
    const commitsByDate = processEvents(allEvents);

    // Always include today's entry
    const today = new Date().toISOString().split('T')[0];
    if (!commitsByDate[today]) {
      commitsByDate[today] = 0;
    }

    // Sort the dates
    const sortedDates = Object.entries(commitsByDate)
      .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
      .reduce((acc: {[key: string]: number}, [date, count]) => {
        acc[date] = count;
        return acc;
      }, {});

    console.log('Fetched commits by date:', sortedDates);
    console.log(`Today (${today}): ${sortedDates[today]} commits`);
    
    return sortedDates;
  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    throw error;
  }
} 