import api from '@/lib/api';
import db from '@/lib/db';
import { checkDigest, checkTeam } from '@/lib/middleware';
import { getDigestDataForTypefully, getPublicDigest } from '@/lib/queries';
import { AuthApiRequest } from '@/lib/router';
import { createTypefullyDraft } from '@/utils/typefully';
import { Digest } from '@prisma/client';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router
  .use(checkTeam)
  .use(checkDigest)
  .get(async (req, res) => {
    const teamId = req.query.teamId as string;
    const digestId = req.query.digestId as string;

    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { typefullyToken: true, slug: true },
    });

    if (!team?.typefullyToken)
      return res
        .status(400)
        .json({ error: 'No Typefully token found for this team' });

    const digest = await getDigestDataForTypefully(digestId, teamId);

    if (!digest) return res.status(404).json({ error: 'Digest not found' });

    const { threadUrl } = await createTypefullyDraft(
      digest,
      team.typefullyToken
    );
    if (!threadUrl)
      return res.status(500).json({ error: 'Error creating thread' });
    await db.digest.update({
      where: { id: digestId },
      data: { typefullyThreadUrl: threadUrl },
    });
    return res.status(200).json({ threadUrl: threadUrl });
  });

export default router.handler({});
