import { NextRequest, NextResponse } from 'next/server';
import { atom } from '@/utils/feed';
import { getPublicTeam } from '@/services/database/team';

export async function GET(
  _request: NextRequest,
  { params: { teamSlug } }: { params: { teamSlug: string } }
) {
  const team = await getPublicTeam(teamSlug);
  return new NextResponse(atom(team, teamSlug), {
    headers: {
      'content-type': 'application/atom+xml; charset=utf-8',
    },
  });
}
