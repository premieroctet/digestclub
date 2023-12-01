import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const openAiCompletion = async ({
  prompt,
  model = 'gpt-3.5-turbo',
}: {
  prompt: string;
  model?: 'gpt-3.5-turbo' | 'gpt-4';
}) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model,
    temperature: 0.5,
  });

  return chatCompletion.choices;
};
