import { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

export type AuthApiRequest = NextApiRequest & {
  membershipId?: string;
  teamId?: string;
  user?: { id: string; email: string };
};

export const errorHandler = (
  err: unknown,
  req: AuthApiRequest,
  res: NextApiResponse
) => {
  Sentry.captureException(err);
  res.status(400).json({ error: JSON.stringify(err) });
};
