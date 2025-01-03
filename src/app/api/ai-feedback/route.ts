import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/utils/supabase-client';

export async function POST(req: Request) {
  try {
    const { message, feedback_type, comment, created_at } = await req.json();

    if (!message || !feedback_type || !created_at) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from('ai_feedback')
      .insert([
        {
          message,
          feedback_type,
          comment,
          created_at,
        },
      ]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: 'Failed to save feedback' },
      { status: 500 }
    );
  }
} 