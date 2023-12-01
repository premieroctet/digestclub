import client, { isUniqueConstraintError } from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { Digest, DigestBlock, DigestBlockType } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import urlSlug from 'url-slug';

export type ApiDigestResponseSuccess = Digest;
interface PostBody {
  title: string;
  isTemplate: boolean;
  templateId?: string;
}

async function createDigest({
  title,
  teamId,
}: {
  title: string;
  teamId: string;
}) {
  const newDigest = (await client.digest.create({
    data: {
      teamId,
      title: title,
      slug: urlSlug(title),
      isTemplate: false,
    },
    include: {
      digestBlocks: true,
    },
  })) as Digest & {
    digestBlocks: DigestBlock[];
  };

  return newDigest;
}

async function createDigestWithTemplate({
  title,
  templateId,
  teamId,
}: {
  title: string;
  templateId: string;
  teamId: string;
}) {
  // Get template
  const template = await client.digest.findUnique({
    where: {
      id: templateId,
    },
    include: {
      digestBlocks: true,
    },
  });

  // Create new digest
  const newDigest = await createDigest({ title, teamId });

  // Create find all blocks from template
  const templateBlocks = template?.digestBlocks;
  if (!templateBlocks) {
    throw new Error('Template blocks not found');
  }

  await Promise.all(
    templateBlocks.map(async (block) => {
      const { bookmarkId, text, style, type, order } = block;
      return await client.digestBlock.create({
        data: {
          digestId: newDigest.id,
          ...(bookmarkId && { bookmarkId }),
          ...(text && { text }),
          ...(style && { style }),
          order: order,
          type,
          isTemplate: false,
        },
      });
    })
  );

  return newDigest;
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
      const newDigest = createDigest({ title, teamId });
      return res.status(201).json(newDigest);
    }
  } catch (e) {
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
