import db from '@/lib/db';
import { saveBookmark } from '@/services/database/bookmark';
import { TBlock, extractLinksFromBlocks } from '@/utils/slack';
import axios from 'axios';

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


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = JSON.parse(body.payload) as SlackPayload;
    if (!body || !payload) return new Response(null, { status: 200 });

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

      return new Response(JSON.stringify({ bookmarks }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: 'no_handler' }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
    });
  }
}
