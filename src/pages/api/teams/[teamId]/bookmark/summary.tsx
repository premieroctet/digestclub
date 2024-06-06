import { checkProAccount, checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { getTeamById } from '@/services/database/team';
import { openAiCompletion } from '@/utils/openai';
import Parser from '@postlight/parser';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

const OPENAI_ERRORS: { [key: string]: string } = {
  rate_limit_exceeded:
    'Generation service is overloaded, Please try again later',
  context_length_exceeded: 'Cannot generate summary, your prompt is too long !',
};

router
  .use(checkTeam)
  .use(checkProAccount)
  .post(async (req, res) => {
    const { url } = req.body;
    if (!url || !process.env.OPENAI_API_KEY) {
      return res.status(400).json({
        error: 'Invalid request',
      });
    }

    try {
      const team = await getTeamById(req.query.teamId as string);
      const linkInfo = await Parser.parse(url, { contentType: 'text' });
      // (so 130 tokens ~= 100 words). 8K => 6150 words for gpt4 including prompt + answer
      const articleContent = linkInfo.content;

      const prompt = team?.prompt
        ? `${team?.prompt} : "${articleContent}"`
        : `Write a summary of 2 to 3 sentences, using between 40 to 70 words maximum, with a journalistic tone for the following article web content. Only send back the summary text, do not add quotes or any intro sentence. Make liaisons between sentences. Do not use ; characters. Here is the content : ${articleContent}. `
            .split(' ')
            .slice(0, 5500)
            .join(' ');

      const response = await openAiCompletion({ prompt });
      const summary = response[0]?.message?.content;

      return res.status(201).json(summary);
    } catch (e: any) {
      const errorCode = e?.error.code as string;
      return res.status(400).json({
        error: OPENAI_ERRORS[errorCode] || 'Something went wrong',
      });
    }
  });

export default router.handler({
  onError: errorHandler,
});
