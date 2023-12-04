import client, { isUniqueConstraintError } from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { Digest, DigestBlock } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import urlSlug from 'url-slug';
import { CreateBlockData } from '../digests/[digestId]/block';

export type ApiDigestResponseSuccess = Digest;
interface PostBody {
  title: string;
  digestBlocks: CreateBlockData[];
}

export const router = createRouter<AuthApiRequest, NextApiResponse>();

async function createTemplateBlocks(
  digestBlock: CreateBlockData,
  order: number,
  digest: Digest
) {
  const { bookmarkId, text, style, type, isTemplate } = digestBlock;
  const block = await client.digestBlock.create({
    data: {
      digestId: digest.id,
      ...(bookmarkId && { bookmarkId }),
      ...(text && { text }),
      ...(style && { style }),
      order,
      type,
      isTemplate,
    },
  });
  return block;
}

router.use(checkTeam).post(async (req, res) => {
  try {
    const { title, digestBlocks } = req.body as PostBody;
    const teamId = req.teamId!;

    const newTemplate = (await client.digest.create({
      data: {
        teamId,
        title: title,
        slug: urlSlug(title),
        isTemplate: true,
      },
      include: {
        digestBlocks: true,
      },
    })) as Digest & {
      digestBlocks: DigestBlock[];
    };

    await Promise.all(
      digestBlocks.map(async (block: CreateBlockData, index: number) => {
        await createTemplateBlocks(block, block.position || index, newTemplate);
      })
    );

    const logDigest = await client.digest.findUnique({
      where: {
        id: newTemplate.id,
      },
      include: {
        digestBlocks: true,
      },
    });

    return res.status(201).json(newTemplate);
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
