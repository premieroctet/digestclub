import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export const openAiCompletion = async ({
  prompt,
  model = 'gpt-4o',
}: {
  prompt: string;
  model?: 'gpt-4o' | 'gpt-4-turbo';
}) => {
  const chatCompletion = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model,
    temperature: 0.5,
  });

  return chatCompletion.choices;
};
