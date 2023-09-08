import db from '@/lib/db';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { saveBookmark } from '@/utils/bookmark';
import { extractLinksFromBlocks, TBlock } from '@/utils/slack';
import axios from 'axios';
import type { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

interface SlackPayload {
  type: 'message_action';
  team: { id: string };
  user: { id: string };
  channel: { id: string };
  response_url: string;
  message: {
    blocks: TBlock[];
  };
}

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  if (!req.body.payload) {
    return res.status(200).end();
  }

  const payload = JSON.parse(req.body.payload) as SlackPayload;
  if (payload.type === 'message_action') {
    const links = payload.message.blocks
      ? extractLinksFromBlocks(payload.message.blocks)
      : [];

    const team = await db.team.findFirstOrThrow({
      where: { slackTeamId: payload.team.id },
    });

    const bookmarks = await Promise.all(
      links.map((url) =>
        saveBookmark(url, team.id, undefined, {
          slackUserId: payload.user.id,
          slackChannelId: payload.channel.id,
        })
      )
    );

    // Send response to Slack
    await axios.post(payload.response_url, {
      text: `:pushpin: ${links.join(',')} has been added to your team feed *${
        team.name
      }*`,
      response_type: 'ephemeral',
    });

    return res.status(200).json({ bookmarks });
  }
  return res.status(200).json({ error: 'no_handler' });
});

export default router.handler({
  onError: errorHandler,
});
