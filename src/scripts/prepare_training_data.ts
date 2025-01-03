import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

import { supabaseAdmin } from '@/utils/supabase-client';
import * as fs from 'fs';

interface FeedbackData {
  message: string;
  comment: string | null;
  created_at: string;
}

interface TrainingExample {
  instruction: string;
  input: string;
  output: string;
  comment: string;
}

async function exportFeedbackData() {
  try {
    // Fetch positive feedback with associated messages
    const { data: feedbackData, error } = await supabaseAdmin
      .from('ai_feedback')
      .select('message, comment, created_at')
      .eq('feedback_type', 'positive')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching feedback:', error);
      return;
    }

    // Format data for training
    const trainingData: TrainingExample[] = (feedbackData as FeedbackData[]).map(feedback => ({
      instruction: "Generate a personalized morning message that is motivational and connects daily activities to larger goals.",
      input: "User liked this message format and style.",
      output: feedback.message,
      comment: feedback.comment || ""
    }));

    // Save to JSON file
    fs.writeFileSync(
      'training_data.jsonl',
      trainingData.map((item: TrainingExample) => JSON.stringify(item)).join('\n')
    );

    console.log(`Successfully exported ${trainingData.length} training examples`);
  } catch (error) {
    console.error('Error preparing training data:', error);
  }
}

exportFeedbackData(); 