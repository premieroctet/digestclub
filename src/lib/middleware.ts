import options, {
  default as authOptions,
} from '@/app/api/auth/[...nextauth]/options';
import { TeamsRequestContext } from '@/app/api/teams/[teamId]/bookmark/route';
import { TeamsDigestsRequestContext } from '@/app/api/teams/[teamId]/digests/[digestId]/route';
import { checkDigestAuth } from '@/services/database/digest';
import { getTeamMembershipById } from '@/services/database/membership';
import { getTeamById } from '@/services/database/team';
import { HandlerApiError } from '@/utils/handlerResponse';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
import { NextRequest } from 'next/server';
import { AuthApiRequest } from './router';

export const checkProAccount = async (
  req: AuthApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const teamId = (req.query.teamId as string) || (req.query.state as string);
  const teamInfo = await getTeamById(teamId);

  if (!teamInfo?.subscriptionId) {
    return res
      .status(403)
      .json({ error: 'This feature requires a pro account' });
  }

  return next();
};

export const checkTeam = async (
  req: AuthApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await getServerSession(req, res, authOptions);
  // req.query.state is for Slack integration (we cant choose the name of the query param)
  const teamId = (req.query.teamId as string) || (req.query.state as string);

  if (!session && !teamId) {
    return res.status(403).end();
  }

  const membership = await getTeamMembershipById(teamId, session!.user?.id);

  if (!membership) {
    return res.status(403).end();
  }

  req.membershipId = membership.id;
  req.teamId = membership.teamId;
  req.user = { id: session!.user.id, email: session!.user.email! };

  return next();
};

export const checkTeamAppRouter = async (
  req: NextRequest,
  event: TeamsRequestContext,
  next: NextHandler
) => {
  const session = await getServerSession(options);
  // req.query.state is for Slack integration (we cant choose the name of the query param)
  // @todo implement slack integration with teamId (req.query.state)
  const teamId = event.params.teamId as string;

  if (!session && !teamId) {
    return HandlerApiError.unauthorized();
  }

  const membership = await getTeamMembershipById(teamId, session!.user?.id);

  if (!membership) {
    return HandlerApiError.unauthorized();
  }

  event.membershipId = membership.id;
  event.teamId = membership.teamId;
  event.user = { id: session!.user.id, email: session!.user.email! };
  return next();
};

export const checkAuth = async (
  req: AuthApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(403).end();
  }

  req.user = { id: session!.user.id, email: session!.user.email! };

  return next();
};

export const checkAuthAppRouter = async (
  req: NextRequest,
  event: {},
  next: NextHandler
) => {
  const session = await getServerSession(options);

  if (!session) return HandlerApiError.unauthorized();
  const { teamName } = await req.json();
  if (!teamName) return HandlerApiError.badRequest();

  return next();
};

export const checkDigest = async (
  req: AuthApiRequest,
  res: NextApiResponse,
  next: NextHandler
) => {
  const teamId = req.query.teamId as string;
  const digestId = req.query.digestId as string;

  if (!teamId && !digestId) {
    return res.status(403).end();
  }

  const count = await checkDigestAuth(teamId, digestId);

  if (count === 0) {
    return res.status(403).end();
  }

  return next();
};

export const checkDigestAppRouter = async (
  req: NextRequest,
  event: TeamsDigestsRequestContext,
  next: NextHandler
) => {
  const teamId = event.params.teamId as string;
  const digestId = event.params.digestId as string;

  if (!teamId && !digestId) {
    return HandlerApiError.unauthorized();
  }

  const count = await checkDigestAuth(teamId, digestId);

  if (count === 0) {
    return HandlerApiError.unauthorized();
  }

  return next();
};