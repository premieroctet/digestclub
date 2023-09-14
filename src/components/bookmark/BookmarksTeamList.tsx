'use client';

import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { TeamBookmarksResult } from '@/lib/queries';
import { ApiBookmarkResponseSuccess } from '@/pages/api/teams/[teamId]/bookmark';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useMutation } from 'react-query';
import NoContent from '../layout/NoContent';
import message from '../../messages/en';
import { BookmarkItem } from './BookmarkItem';
import Link from 'next/link';
import SearchInput from '../digests/SearchInput';

type Props = {
  bookmarks: TeamBookmarksResult[];
  teamId: string;
  teamSlug: string;
};

export const BookmarksTeamList = ({ bookmarks, teamId, teamSlug }: Props) => {
  if (bookmarks.length < 1) {
    return (
      <NoContent
        icon={<BsFillBookmarkFill />}
        title="No bookmark"
        subtitle="Start bookmarking links to share them with your team"
      />
    );
  }

  return (
    <div className="w-full">
      <SearchInput className="mb-4" />

      <div className="flex flex-col gap-2">
        {bookmarks.map((bookmark) => (
          <Link
            key={bookmark?.id}
            href={bookmark.link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <BookmarkItem
              bookmark={bookmark}
              teamSlug={teamSlug}
              teamId={teamId}
              digestId={bookmark.digestBlocks[0]?.digest.id}
              nbOfTimesUsed={bookmark.digestBlocks.length}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};
