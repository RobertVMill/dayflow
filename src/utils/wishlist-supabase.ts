import { supabase } from './base-supabase';

export interface WishlistItem {
  id: string;
  created_at: string;
  title: string;
  price: number;
  url: string | null;
  notes: string | null;
  priority: 'low' | 'medium' | 'high';
  purchased: boolean;
  purchased_at: string | null;
}

export async function getWishlistItems() {
  const { data, error } = await supabase
    .from('wishlist')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as WishlistItem[];
}

export async function addWishlistItem(
  title: string,
  price: number,
  priority: 'low' | 'medium' | 'high',
  url?: string,
  notes?: string
) {
  const { data, error } = await supabase
    .from('wishlist')
    .insert([{ title, price, priority, url, notes }]);

  if (error) throw error;
  return data;
}

export async function updateWishlistItem(
  id: string,
  updates: Partial<Omit<WishlistItem, 'id' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('wishlist')
    .update(updates)
    .eq('id', id);

  if (error) throw error;
  return data;
}

export async function deleteWishlistItem(id: string) {
  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function markAsPurchased(id: string) {
  const { data, error } = await supabase
    .from('wishlist')
    .update({
      purchased: true,
      purchased_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) throw error;
  return data;
} 