import { openAiCompletion } from '@/utils/openai';
import { checkProAccount, checkTeam } from '@/lib/middleware';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import Parser from '@postlight/parser';
import { getTeamById } from '@/lib/queries';
const MAX_PROMPT_LENGTH = 4097;
export const router = createRouter<AuthApiRequest, NextApiResponse>();

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
      const articleContent = linkInfo.content.substring(0, MAX_PROMPT_LENGTH);

      const prompt = team?.prompt
        ? `${team?.prompt} : "${articleContent}"`
        : `Write a summary of 2 to 3 sentences, using between 40 to 70 words maximum, with a journalistic tone for the following article web content ${articleContent}. Only send back the summary text, do not add quotes or any intro sentence. Make liaisons between sentences. Do not use ; characters.`;

      const response = await openAiCompletion({ prompt, model: 'gpt-4' });
      const summary = response[0]?.message?.content;

      return res.status(201).json(summary);
    } catch (e) {
      return res.status(400).json({
        error: 'Something went wrong',
      });
    }
  });

export default router.handler({
  onError: errorHandler,
});
