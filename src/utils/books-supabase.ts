import { createClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL');
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export interface Book {
  id: string;
  created_at: string;
  title: string;
  completed_at: string;
  notes?: string;
  category?: string;
}

export async function addBook(book: Omit<Book, 'id' | 'created_at'>): Promise<void> {
  const { error } = await supabase
    .from('books')
    .insert([book]);

  if (error) throw error;
}

export async function getBooks(): Promise<Book[]> {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .order('completed_at', { ascending: false });

  if (error) throw error;
  return data as Book[];
}

export async function getBooksPerMonth(): Promise<{ date: string; count: number }[]> {
  const { data, error } = await supabase
    .from('books')
    .select('completed_at')
    .order('completed_at', { ascending: true });

  if (error) throw error;

  // Group books by month and count them
  const monthCounts = (data as Book[]).reduce((acc, book) => {
    // Parse the date string and get the year and month
    const date = new Date(book.completed_at);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    
    // Format as YYYY-MM
    const monthKey = `${year}-${month.toString().padStart(2, '0')}`;
    
    acc[monthKey] = (acc[monthKey] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array format and sort by date
  return Object.entries(monthCounts)
    .map(([date, count]) => ({
      date,
      count
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
} 