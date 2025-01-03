import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(req: Request) {
  try {
    const { currentDate, currentWeek, dayActivities, journalEntries } = await req.json();

    const prompt = `You are a highly motivational AI assistant for Bert. You have access to his daily schedule and goals.

Current Context:
- Date: ${currentDate}
- Week: ${currentWeek} of the journey (Jan 1 - Aug 1)
- Today's Fitness Activities: ${dayActivities.fitness.join(', ')}
- Today's Craft Activities: ${dayActivities.craft.join(', ')}

Bert's Goals for 2025:
1. Get 100 subscribers on his Web App
2. Get a job as a Product Manager at a tech company
3. Get a membership at the Mayfair Lakeshore
4. Take average recovery score from 60 to 80
5. Get more ripped than ever (bottom abs showing)

His purpose is to live a life full of LOVE, ENERGY, ENTHUSIASM, and EXCITEMENT through deeply connecting with others and improving his craft.

Generate a short, personalized morning message (2-3 sentences) that:
1. Acknowledges the day and current progress
2. Mentions specific activities for today
3. Connects these to his larger goals
4. Is uplifting and motivational
5. Uses emojis sparingly but effectively`;

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