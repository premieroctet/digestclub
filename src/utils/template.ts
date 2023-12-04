import { getDigest } from '@/lib/queries';
import { CreateBlockData } from '@/pages/api/teams/[teamId]/digests/[digestId]/block';
import { DigestBlock, DigestBlockType } from '@prisma/client';

type DigestBlocks = NonNullable<
  Awaited<ReturnType<typeof getDigest>>
>['digestBlocks'];

/**
 * Function to convert digest blocks to template blocks and transform them to CreateBlockData (API format)
 * @param blocks
 * @returns
 */
export function digestBlockToTemplateBlocks(
  blocks: DigestBlocks
): CreateBlockData[] {
  let position = 0; // start at 0 because we increment before adding the block
  const AUTHORIZED_TEMPLATE_BLOCK_TYPES: Array<DigestBlockType> = [
    DigestBlockType.TEXT,
  ];

  const authorizedBlocks = blocks
    .filter((block) => AUTHORIZED_TEMPLATE_BLOCK_TYPES.includes(block.type))
    .map((block) => {
      position++;
      return {
        ...(block.bookmarkId && { bookmarkId: block.bookmarkId }),
        ...(block.text && { text: block.text }),
        position: position,
        type: block.type,
        style: block.style,
        isTemplate: block.isTemplate,
      };
    });

  return authorizedBlocks;
}
