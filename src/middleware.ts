import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

export async function middleware(req: NextRequest) {
  try {
    const sessionToken =
      req.cookies.get('__Secure-next-auth.session-token')?.value ||
      req.cookies.get('next-auth.session-token')?.value;

    if (sessionToken) {
      const response = await fetch(
        new URL(`/api/user/default-team?sessionToken=${sessionToken}`, req.url)
      ).then((res) => res.json());

      if (response.defaultTeamSlug) {
        return NextResponse.redirect(
          new URL(`/teams/${response.defaultTeamSlug}`, req.url)
        );
      }
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    Sentry.captureException(error);
  }
}

export const config = { matcher: ['/teams'] };
