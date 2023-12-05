'use server';

import db from '@/lib/db';
import { reorderList } from '@/utils/actionOnList';
import {
  BookmarkDigestStyle,
  Digest,
  DigestBlock,
  DigestBlockType,
} from '@prisma/client';
import urlSlug from 'url-slug';

export type CreateBlockData = {
  bookmarkId?: string;
  text?: string;
  position?: number;
  type: DigestBlockType;
  style?: BookmarkDigestStyle;
  isTemplate?: boolean;
};

/**
 * Create a new digest with the blocks from a template
 */
export async function createDigest({
  title,
  teamId,
}: {
  title: string;
  teamId: string;
}) {
  const newDigest = (await db.digest.create({
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

/**
 * Create a new digest with the blocks from a template
 */
export async function createDigestWithTemplate({
  title,
  templateId,
  teamId,
}: {
  title: string;
  templateId: string;
  teamId: string;
}) {
  // Get template
  const template = await db.digest.findUnique({
    where: {
      id: templateId,
    },
    include: {
      digestBlocks: true,
    },
  });

  // Create new digest
  const newDigest = await createDigest({ title, teamId });

  // Create all blocks from template
  const templateBlocks = template?.digestBlocks;
  if (!templateBlocks) {
    throw new Error('Template blocks not found');
  }

  await Promise.all(
    templateBlocks.map(async (block) => {
      const { bookmarkId, text, style, type, order } = block;
      return createDigestBlock(
        {
          type: type,
          ...(text && { text: text }),
          ...(style && { style: style }),
          ...(bookmarkId && { bookmarkId: bookmarkId }),
          isTemplate: false,
        },
        newDigest,
        order // we want to keep the same order as the template
      );
    })
  );

  return newDigest;
}

export const orderBlock = async (
  digestId: string,
  blockId: string,
  position: number
) => {
  const digestBlocks = await db.digestBlock.findMany({
    where: {
      digestId: digestId,
    },
    orderBy: {
      order: 'asc',
    },
  });

  if (digestBlocks) {
    const bookmarkDigestMoved = digestBlocks.find(
      (bookmarkDigest) => bookmarkDigest.id === blockId
    );

    if (bookmarkDigestMoved) {
      await db.$transaction(
        reorderList(digestBlocks, bookmarkDigestMoved.order, position).map(
          (currentBookmarkDigest: any, index: number) => {
            return db.digestBlock.updateMany({
              where: {
                id: currentBookmarkDigest.id,
                digestId: digestId,
              },
              data: { order: index },
            });
          }
        )
      );
    }
  }
};

/**
 * Create a digest block in a digest. If position is provided, the block will be ordered to that position depending on the other blocks in the digest.
 * If order is provided, the block will be ordered to that position regardless of the other blocks in the digest.
 * @param blockInfo The data to create the block with
 * @param digest The digest to create the block in
 * @param order Optional | The order to place the block in
 * @returns The created block
 */
export const createDigestBlock = async (
  blockInfo: CreateBlockData,
  digest: Digest & {
    digestBlocks: DigestBlock[];
  },
  order?: number | undefined
) => {
  const { bookmarkId, text, style, type, position, isTemplate } = blockInfo;
  const hasOrderParam = order !== undefined;
  const block = await db.digestBlock.create({
    data: {
      digestId: digest.id,
      ...(bookmarkId && { bookmarkId }),
      ...(text && { text }),
      ...(style && { style }),
      order: hasOrderParam ? order : digest.digestBlocks.length,
      type,
      isTemplate,
    },
  });

  if (position !== undefined && !hasOrderParam) {
    await orderBlock(digest.id, block.id, position);
  }
  return block;
};
