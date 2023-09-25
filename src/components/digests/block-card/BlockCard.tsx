import { DigestBlockType } from '@prisma/client';
import React from 'react';
import { Props as PublicDigestListProps } from '../PublicDigestList';
import TextCard from './text-card/TextCard';
import BookmarkCard from './bookmark-card/BookmarkCard';

export interface Props {
  block: PublicDigestListProps['digest']['digestBlocks'][number];
  isEditable?: boolean;
  index?: number;
}

export default function BlockCard({ block, isEditable = false, index }: Props) {
  if (block.type === DigestBlockType.TEXT) {
    return <TextCard block={block} isEditable={isEditable} index={index} />;
  } else if (block.type === DigestBlockType.BOOKMARK) {
    return <BookmarkCard block={block} isEditable={isEditable} index={index} />;
  }
  throw new Error('BookmarkCard: bookmarkDigest has neither bookmark nor text');
}
