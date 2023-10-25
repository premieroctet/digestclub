import client, { isUniqueConstraintError } from '@/lib/db';
import { checkTeam } from '@/lib/middleware';
import { Digest, DigestBlock, DigestBlockType } from '@prisma/client';
import { AuthApiRequest, errorHandler } from '@/lib/router';
import { NextApiResponse } from 'next';
import { createRouter } from 'next-connect';
import urlSlug from 'url-slug';
import { CreateBlockData, createDigestBlock } from './[digestId]/block';

export type ApiDigestResponseSuccess = Digest;

export const router = createRouter<AuthApiRequest, NextApiResponse>();

router.use(checkTeam).post(async (req, res) => {
  try {
    const { title, isTemplate, templateId } = req.body;
    const teamId = req.teamId!;

    const newDigest = (await client.digest.create({
      data: {
        teamId,
        title: title,
        slug: urlSlug(title),
        isTemplate: Boolean(isTemplate),
      },
      include: {
        digestBlocks: true,
      },
    })) as Digest & {
      digestBlocks: DigestBlock[];
    };

    if (templateId) {
      const template = await client.digest.findUnique({
        where: {
          id: templateId,
        },
        include: {
          digestBlocks: true,
        },
      });

      const templateBlocks = await client.digestBlock.findMany({
        where: {
          digestId: templateId,
        },
      });

      // Createnew blocks to add to digest if template was provided
      if (template && templateBlocks) {
        await Promise.all(
          templateBlocks.map(async (block) => {
            return await createDigestBlock(
              {
                ...block,
                isTemplate: false,
              } as CreateBlockData,
              newDigest
            );
          })
        );
      }
    }

    if (isTemplate) {
      await Promise.all(
        req.body.digestBlocks.map(async (block: CreateBlockData) => {
          const { text, position } = block;
          await createDigestBlock(
            { type: DigestBlockType.TEXT, text, position, isTemplate: true },
            newDigest
          );
        })
      );
    }

    return res.status(201).json(newDigest);
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
