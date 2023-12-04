import { isUniqueConstraintError } from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { Digest } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import { createDigest, createDigestWithTemplate } from '@/lib/queries';

export type ApiDigestResponseSuccess = Digest;
interface PostBody {
  title: string;
  isTemplate: boolean;
  templateId?: string;
}

export const router = createRouter<AuthApiRequest, NextApiResponse>();
router.use(checkTeam).post(async (req, res) => {
  try {
    const { title, templateId } = req.body as PostBody;
    const teamId = req.teamId!;

    if (templateId) {
      const newDigest = await createDigestWithTemplate({
        title,
        templateId,
        teamId,
      });
      return res.status(201).json(newDigest);
    } else {
      const newDigest = await createDigest({ title, teamId });
      return res.status(201).json(newDigest);
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    return res.status(400).json(
      isUniqueConstraintError(e) && {
        error: 'This digest name already exists',
      }
    );
  }
});

export default router.handler({
  onError: errorHandler,
});
