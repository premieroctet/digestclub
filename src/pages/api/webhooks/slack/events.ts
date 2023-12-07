import db from '@/lib/db';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { saveBookmark } from '@/services/database/bookmark';
import { extractLinksFromBlocks, TBlock } from '@/utils/slack';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

interface SlackBody {
  team_id: string;
  type: 'event_callback' | 'url_verification';
  challenge?: string;
  event: {
    type: 'message';
    subtype?: 'message_changed';
    team: string;
    user: string;
    channel: string;
    blocks: TBlock[];
  };
}

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  const body = req.body as SlackBody;
  const headers = req.headers;

  // Challenge
  if (body.type === 'url_verification') {
    return res.status(200).json({ challenge: body.challenge });
  }

  if (headers['x-slack-retry-reason']) {
    return res.status(200).end();
  }

  const { event } = body;

  if (
    body.type === 'event_callback' &&
    event.type === 'message' &&
    event.subtype !== 'message_changed'
  ) {
    const blocks = event.blocks;

    const team = await db.team.findFirstOrThrow({
      where: { slackTeamId: event.team },
    });

    const links = blocks ? extractLinksFromBlocks(blocks) : [];

    const bookmarks = await Promise.all(
      links.map((url) =>
        saveBookmark(url, team.id, undefined, {
          slackUserId: event.user,
          slackChannelId: event.channel,
        })
      )
    );

    return res.status(200).json({ bookmarks });
  }

  return res.status(200).json({ error: 'no_handler' });
});

export default router.handler({
  onError: errorHandler,
});
