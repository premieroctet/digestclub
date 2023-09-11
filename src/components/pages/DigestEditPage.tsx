'use client';

import { useRouter } from 'next/navigation';
import { routes } from '@/core/constants';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';

import useAddAndRemoveBlockOnDigest from '@/hooks/useAddAndRemoveBlockOnDigest';
import {
  getDigest,
  getTeamBookmarksNotInDigest,
  getTeamBySlug,
} from '@/lib/queries';
import { ApiDigestResponseSuccess } from '@/pages/api/teams/[teamId]/digests';
import { reorderList } from '@/utils/actionOnList';
import { getRelativeDate } from '@/utils/date';
import { EyeSlashIcon, RssIcon, TrashIcon } from '@heroicons/react/24/outline';
import { DigestBlock, DigestBlockType } from '@prisma/client';
import { BsFillBookmarkFill } from '@react-icons/all-files/bs/BsFillBookmarkFill';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useState } from 'react';
import {
  DragDropContext,
  DropResult,
  resetServerContext,
} from 'react-beautiful-dnd';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from '../Button';
import { Input, TextArea } from '../Input';
import { DeletePopover } from '../Popover';
import { BlockListDnd } from '../digests/BlockListDnd';
import BookmarkListDnd from '../digests/BookmarkListDnd';
import SearchInput from '../digests/SearchInput';
import NoContent from '../layout/NoContent';
import SectionContainer from '../layout/SectionContainer';
import Pagination from '../list/Pagination';
import { Breadcrumb } from '../teams/Breadcrumb';
import DigestEditVisit from './DigestEditVisit';
import DigestEditTypefully from './DigestEditTypefully';
import DigestEditSendNewsletter from './DigestEditSendNewsletter';

type Props = {
  dataBookmarks: Awaited<ReturnType<typeof getTeamBookmarksNotInDigest>>;
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
};

type DigestData = {
  title?: string;
  description?: string;
  publishedAt?: Date | null;
  digestBlocks?: DigestBlock[];
};

export const DigestEditPage = ({
  dataBookmarks: { totalCount, bookmarks, itemPerPage },
  digest,
  team,
}: Props) => {
  const { push } = useRouter();
  const { successToast, errorToast } = useCustomToast();
  const [isMoving, setIsMoving] = useState(false);

  resetServerContext();

  const {
    register,
    handleSubmit,
    formState: { isDirty },
    reset,
  } = useForm({
    defaultValues: {
      title: digest?.title,
      description: digest?.description,
    },
  });

  const { add, order } = useAddAndRemoveBlockOnDigest({
    teamId: team.id,
    digestId: digest.id,
  });

  const { refresh, isRefreshing } = useTransitionRefresh();
  const { refresh: saveRefresh } = useTransitionRefresh();

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || result.destination.droppableId === 'bookmark') {
      return;
    }

    setIsMoving(true);

    if (result.source.droppableId === 'bookmark') {
      await add.mutateAsync({
        bookmarkId: result.draggableId,
        position: result.destination.index,
        type: DigestBlockType.BOOKMARK,
      });
    } else {
      digest.digestBlocks = reorderList(
        digest.digestBlocks,
        result.source.index,
        result.destination.index
      );

      await order.mutateAsync({
        blockId: result.draggableId,
        position: result.destination.index,
      });
    }

    setIsMoving(false);
  };

  const { mutate: mutatePublish, isLoading: isPublishing } = useMutation<
    AxiosResponse<ApiDigestResponseSuccess>,
    AxiosError<ErrorResponse>,
    Pick<DigestData, 'publishedAt'>
  >(
    ['patch-digest-publish', team.id, digest?.id],
    (data) => api.patch(`/teams/${team.id}/digests/${digest?.id}`, { ...data }),
    {
      onSuccess: (response) => {
        const { data: digest } = response;
        if (!digest.publishedAt) {
          successToast('Your digest has been unpublished');
        } else {
          successToast('Your digest has been published');
        }
        refresh();
      },
      onError: (error) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  const { mutate: mutateSave, isLoading: isSaving } = useMutation<
    DigestData,
    AxiosError<ErrorResponse>,
    DigestData
  >(
    ['patch-digest-save', team.id, digest?.id],
    (data: DigestData) =>
      api.patch(`/teams/${team.id}/digests/${digest?.id}`, { ...data }),
    {
      onSuccess: (digest: DigestData) => {
        reset({ title: digest?.title, description: digest?.description });
        successToast('Your digest has been saved');
        saveRefresh();
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  const { mutate: deleteDigest, isLoading: isDeleting } = useMutation<
    AxiosResponse<ApiDigestResponseSuccess>,
    AxiosError<ErrorResponse>
  >(
    'delete-digest',
    () => {
      return api.delete(`/teams/${team.id}/digests/${digest.id}`);
    },
    {
      onSuccess: () => {
        successToast('Digest has been deleted');
        refresh();
        push(routes.TEAM.replace(':slug', team.slug));
      },
      onError: (error) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message
        );
      },
    }
  );

  const onBlur = (data: any) => {
    if (!isDirty) return;
    mutateSave(data);
  };

  const publish = () => {
    mutatePublish({ publishedAt: new Date() });
  };

  const draft = () => {
    mutatePublish({ publishedAt: null });
  };

  return (
    <>
      <Breadcrumb
        paths={[
          {
            name: team.name,
            href: routes.TEAM.replace(':slug', team.slug),
          },
          {
            name: 'Digest builder',
          },
        ]}
      />
      <div className="flex flex-col gap-5 items-stretch justify-start md:flex-row">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-col  gap-5 w-full md:w-1/2">
            <div className="flex gap-4 items-stretch w-full">
              <Button
                className="flex-1"
                aria-label={`${
                  digest?.publishedAt ? 'Unpublished' : 'Publish'
                } digest`}
                variant="outline"
                icon={digest.publishedAt ? <EyeSlashIcon /> : <RssIcon />}
                isLoading={isPublishing || isRefreshing}
                onClick={() => {
                  digest?.publishedAt ? draft() : publish();
                }}
              >
                {!!digest?.publishedAt ? 'Unpublished' : 'Publish'}
              </Button>
              <DeletePopover
                handleDelete={deleteDigest}
                isLoading={isDeleting}
                trigger={
                  <Button
                    aria-label="Delete digest"
                    icon={<TrashIcon />}
                    variant="destructiveGhost"
                    isLoading={isDeleting || isRefreshing}
                  />
                }
              />
            </div>

            {digest?.publishedAt && (
              <DigestEditVisit
                relativeDate={getRelativeDate(digest.publishedAt)}
                href={`/${team.slug}/${digest?.slug}`}
              />
            )}
            <div className="flex flex-row gap-2">
              <div
                className={clsx(digest.hasSentNewsletter ? 'w-1/3' : 'w-1/2')}
              >
                <DigestEditSendNewsletter team={team} digest={digest} />
              </div>
              <div
                className={clsx(digest.hasSentNewsletter ? 'w-2/3' : 'w-1/2')}
              >
                <DigestEditTypefully team={team} digest={digest} />
              </div>
            </div>

            <SectionContainer title="Bookmarks" className="relative">
              <Pagination
                totalItems={totalCount}
                itemsPerPage={itemPerPage}
                className="absolute top-5 right-5"
              />
              <SearchInput className="mb-4" />
              <div className="flex flex-col gap-2">
                {bookmarks && bookmarks.length > 0 ? (
                  <BookmarkListDnd
                    team={team}
                    digest={digest}
                    bookmarks={bookmarks}
                  />
                ) : (
                  <NoContent
                    icon={<BsFillBookmarkFill />}
                    title="No bookmark"
                  />
                )}
              </div>
              <div className="flex justify-end">
                <Pagination
                  totalItems={totalCount}
                  itemsPerPage={itemPerPage}
                />
              </div>
            </SectionContainer>
          </div>
          <SectionContainer className="md:w-1/2 w-full h-min">
            <form className="flex flex-col gap-5" onBlur={handleSubmit(onBlur)}>
              <div className="w-full items-start flex flex-col gap-6">
                <Input
                  placeholder="Add a title"
                  {...register('title')}
                  className="!text-3xl !font-bold px-4 !py-4"
                />
                <TextArea
                  placeholder="Add a description"
                  {...register('description')}
                />
              </div>
              <div
                className={clsx(
                  'flex flex-col w-full',
                  (isMoving ||
                    isRefreshing ||
                    add.isLoading ||
                    order.isLoading) &&
                    'pointer-events-none cursor-not-allowed opacity-60'
                )}
              >
                <BlockListDnd digest={digest} team={team} />
              </div>
            </form>
          </SectionContainer>
        </DragDropContext>
      </div>
    </>
  );
};
