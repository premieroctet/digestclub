import { NextRequest, NextResponse } from 'next/server';
import { rss } from '@/utils/feed';
import { getPublicTeam } from '@/services/database/team';

export async function GET(
  _request: NextRequest,
  { params: { teamSlug } }: { params: { teamSlug: string } }
) {
  const team = await getPublicTeam(teamSlug);
  return new NextResponse(rss(team, teamSlug), {
    headers: {
      'content-type': 'application/rss+xml; charset=utf-8',
    },
  });
}
