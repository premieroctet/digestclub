import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { COOKIES } from './core/constants';

export async function middleware(req: NextRequest) {
  try {
    const sessionToken =
      req.cookies.get('__Secure-next-auth.session-token')?.value ||
      req.cookies.get('next-auth.session-token')?.value;
    if (sessionToken) {
      const teamSlug = req.nextUrl.pathname.split('/')[2];
      const { defaultTeamSlug } = await fetch(
        new URL(
          `/api/user/default-team?sessionToken=${sessionToken}&teamSlug=${teamSlug}`,
          req.url
        ),
        {
          cache: 'no-cache',
        }
      ).then((res) => res.json());
      if (defaultTeamSlug) {
        const response = NextResponse.next();
        response.cookies.set(COOKIES.DEFAULT_TEAM, teamSlug);
        return response;
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error);
  }
}

export const config = { matcher: ['/teams/:slug*'] };
