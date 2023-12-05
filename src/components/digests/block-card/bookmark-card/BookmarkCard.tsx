'use client';
import { BookmarkDigestStyle } from '@prisma/client';
import React, { useState } from 'react';
import ActionsBlockPopover from '../../ActionsBlockPopover';
import { Props as PublicDigestListProps } from '../../PublicDigestList';
import { useTeam } from '@/contexts/TeamContext';
import { useParams } from 'next/navigation';
import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import EditBookmarkDialog from '../../dialog/EditBookmarkDialog';
import * as Sentry from '@sentry/nextjs';
import { CardStyleBlock, CardStyleInline, CardStyleTweet } from './card-style';
import { incrementLinkView } from '@/services/database/link';

export interface Props {
  block: PublicDigestListProps['digest']['digestBlocks'][number];
  isEditable?: boolean;
  remove?: () => void;
  isRemoving?: boolean;
  index?: number;
}

export default function BlockBookmarkCard({
  block,
  isEditable = false,
}: Props) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const params = useParams();
  const { id: teamId } = useTeam();
  const {
    bookmark,
    title: blockTitle,
    description: blockDescription,
    style: blockStyle,
  } = block;
  const { remove, isRefreshing } = useAddAndRemoveBlockOnDigest({
    teamId: teamId,
    digestId: params?.digestId as string,
  });

  if (!bookmark) throw new Error('Block type is BOOKMARK but bookmark is null');
  const { link } = bookmark;
  const { title: linkTitle, description: linkDescription, url } = link;
  const title = blockTitle || linkTitle;
  const description =
    blockDescription !== null ? blockDescription : linkDescription;
  const onClickBookmark = () => {
    !isEditable && incrementLinkView(bookmark.id);
  };
  const views = isEditable ? bookmark.views : undefined;

  function EditPanel() {
    return (
      <>
        <ActionsBlockPopover
          isRemoving={isRefreshing || remove.isLoading}
          onRemoveClick={() => {
            remove.mutate(block.id);
          }}
          onEditClick={() => {
            setIsEditDialogOpen(true);
          }}
        />
        <EditBookmarkDialog
          isOpen={isEditDialogOpen}
          setIsOpen={setIsEditDialogOpen}
          bookmarkDigest={block}
          defaultValues={{
            ...(title && { title }),
            ...(description && { description }),
          }}
          url={url}
        />
      </>
    );
  }

  if (blockStyle === BookmarkDigestStyle.INLINE) {
    return (
      <CardStyleInline
        {...(title && { title })}
        {...(description && { description })}
        url={url}
        panelSlot={isEditable && <EditPanel />}
        onClick={onClickBookmark}
        views={views}
      />
    );
  } else if (blockStyle === BookmarkDigestStyle.BLOCK) {
    return (
      <CardStyleBlock
        bookmarkId={bookmark.id}
        bookmarkLink={{
          image: link.image,
          blurHash: link.blurHash,
          title: link.title,
          url: link?.url,
        }}
        {...(title && { title })}
        {...(description && { description })}
        url={url}
        panelSlot={isEditable && <EditPanel />}
        onClick={onClickBookmark}
        views={views}
      />
    );
  } else if (blockStyle === BookmarkDigestStyle.TWEET_EMBED) {
    return <CardStyleTweet url={url} panelSlot={isEditable && <EditPanel />} />;
  } else {
    Sentry.captureMessage(
      `BlockBookmarkCard: Unknown style ${blockStyle} for block ${block.id}`
    );
    return null;
  }
}
