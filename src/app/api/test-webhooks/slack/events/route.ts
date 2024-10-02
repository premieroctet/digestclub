import db from '@/lib/db';
import { saveBookmark } from '@/services/database/bookmark';
import { TBlock, extractLinksFromBlocks } from '@/utils/slack';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headers = request.headers;

    // Challenge
    if (body.type === 'url_verification') {
      return new Response(JSON.stringify({ challenge: body.challenge }));
    }

    if (headers.get('x-slack-retry-reason') as string) {
      return new Response(null, { status: 200 });
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
