'use server';

import { GoogleGenAI } from '@google/genai';

export async function generatePitchRecommendation(submission: any) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: 'GEMINI_API_KEY is not set in environment variables. Please add it to .env.local' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const prompt = `You are an internal assistant for the 'Latest Craze Productions' sales team.
A potential client submitted an event inquiry. 
Please provide a basic, high-level summary of their event, followed by 2-3 basic ideas in a bulleted list to help the sales team prepare for the call.
Keep it extremely concise, direct, and simple.

CLIENT DETAILS:
Name: ${submission.name}
Company: ${submission.company || 'Not provided'}
Event Type: ${submission.event_type || 'Not provided'}
Venue: ${submission.venue || 'Not provided'}
Location: ${submission.event_location || 'Not provided'}
Attendees: ${submission.attendee_count || 'Not provided'}
Timeline: ${submission.timeline || 'Not provided'}
Project Notes: ${submission.project_details || 'None'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return { result: response.text };
  } catch (error: any) {
    return { error: error.message || 'Failed to generate recommendation from the LLM.' };
  }
}
