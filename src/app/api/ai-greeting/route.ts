import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function getRecentPositiveFeedback() {
  const { data: recentFeedback } = await supabase
    .from('ai_feedback')
    .select('message, comment')
    .eq('feedback_type', 'positive')
    .order('created_at', { ascending: false })
    .limit(3);

  if (!recentFeedback?.length) return '';

  return `\nLearning from recent positive feedback:
${recentFeedback.map(f => f.comment ? `- "${f.comment}"` : '').filter(Boolean).join('\n')}`;
}

export async function POST(req: Request) {
  try {
    const { currentDate, currentWeek, dayActivities } = await req.json();
    const feedbackContext = await getRecentPositiveFeedback();
    const formattedDate = "Friday, January 3rd";

    const prompt = `You are a highly motivational AI assistant for Bert. You have access to his daily schedule and goals.

Current Context:
- Today is ${formattedDate}
- Week: ${currentWeek} of the journey (Jan 1 - Aug 1)
- Today's Fitness Activities: ${dayActivities.fitness.join(', ')}
- Today's Craft Activities: ${dayActivities.craft.join(', ')}

Bert's Goals for 2025:
1. Get 100 subscribers on his Web App
2. Get a job as a Product Manager at a tech company
3. Get a membership at the Mayfair Lakeshore
4. Take average recovery score from 60 to 80
5. Get more ripped than ever (bottom abs showing)

His purpose is to live a life full of LOVE, ENERGY, ENTHUSIASM, and EXCITEMENT through deeply connecting with others and improving his craft.${feedbackContext}

Generate a short, personalized morning message (2-3 sentences) that:
1. Always starts with "Today is ${formattedDate}"
2. Mentions specific activities for today
3. Connects these to his larger goals
4. Is uplifting and motivational
5. Uses emojis sparingly but effectively
6. Takes into account any positive feedback to maintain what users like`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4-1106-preview",
      temperature: 0.7,
      max_tokens: 200,
    });

    return NextResponse.json({ message: completion.choices[0].message.content });
  } catch (error) {
    console.error('Error generating AI greeting:', error);
    return NextResponse.json(
      { error: 'Failed to generate greeting' },
      { status: 500 }
    );
  }
} 