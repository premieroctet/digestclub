import { default as authOptions } from '@/app/api/auth/[...nextauth]/options';
import { checkDigestAuth } from '@/services/database/digest';
import { getTeamMembershipById } from '@/services/database/membership';
import { getTeamById } from '@/services/database/team';
import { NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { NextHandler } from 'next-connect';
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
