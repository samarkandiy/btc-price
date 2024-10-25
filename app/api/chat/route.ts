import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY || '',
  baseURL: 'https://api.groq.com/openai/v1/',
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Fetch the JSON data from the provided endpoint
  const jsonData = await fetch(
    'https://api.coindesk.com/v1/bpi/currentprice.json'
  ).then((response) => response.json());

  // Add custom prompt instructions
  const customPrompt = [
    {
      role: 'system',
      content: `You are a freind who can consult in any topic. You have empathy toward your peer.`,
    },
  ];

  // Merge the custom prompt with the user's messages
  const promptWithInstructions = [...customPrompt, ...messages];

  // Ask Groq for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: 'llama3-70b-8192',
    stream: true,
    max_tokens: 8192,
    messages: promptWithInstructions,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);

  // Respond with the stream
  return new StreamingTextResponse(stream);
}
