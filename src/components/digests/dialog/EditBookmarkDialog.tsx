import { useTeam } from '@/contexts/TeamContext';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { getTweetId, isTwitterLink } from '@/utils/link';
import { BookmarkDigestStyle } from '@prisma/client';
import { AxiosError, AxiosResponse } from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from '../../Button';
import { Dialog, DialogContent } from '../../Dialog';
import { Input, Select, TextArea } from '../../Input';
import { Props as BookmarkCardProps } from '../block-card/BlockCard';

interface IFormValues {
  title: string;
  description: string;
  style: BookmarkDigestStyle;
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  bookmarkDigest: BookmarkCardProps['block'];
  defaultValues?: Partial<IFormValues>;
}

const StyleSelectOptions: Array<{
  value: BookmarkDigestStyle;
  label: string;
}> = [
  {
    value: BookmarkDigestStyle.INLINE,
    label: 'Inline',
  },
  {
    value: BookmarkDigestStyle.BLOCK,
    label: 'Block',
  },
  {
    value: BookmarkDigestStyle.TWEET_EMBED,
    label: 'Tweet Embed (Only available for tweets)',
  },
];

export default function EditBookmarkDialog({
  isOpen,
  setIsOpen,
  bookmarkDigest,
  defaultValues,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<IFormValues>({
    defaultValues,
  });
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const params = useParams();
  const { id: teamId } = useTeam();

  const { mutate: updateBookDigest, isLoading: isRemoving } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    IFormValues
  >(
    'update-bookmarkdigest',
    ({ title, description, style }) => {
      return api.patch(
        `/teams/${teamId}/digests/${params?.digestId}/block/${bookmarkDigest.id}`,
        {
          title,
          description,
          style,
        }
      );
    },
    {
      onSuccess: () => {
        successToast('Bookmark updated');
        closeDialog();
        refresh();
      },
      onError: (error: AxiosError<ErrorResponse>) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message ||
            'Something went wrong'
        );
      },
    }
  );

  const onSubmit: SubmitHandler<IFormValues> = (data: IFormValues) => {
    updateBookDigest(data);
  };

  function closeDialog() {
    reset();
    setIsOpen(false);
  }

  function getStyleSelectOptions() {
    const url = bookmarkDigest.bookmark?.link?.url;
    const isTweet = url && isTwitterLink(url) && Boolean(getTweetId(url));
    if (isTweet) {
      return StyleSelectOptions;
    } else {
      return StyleSelectOptions.filter(
        (option) => option.value !== BookmarkDigestStyle.TWEET_EMBED
      );
    }
  }

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Object.values(errors).forEach((error) => {
        if (error.message) {
          errorToast(error.message);
        }
      });
    }
  }, [errors, errorToast]);

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!open)}>
      <DialogContent
        title="Edit bookmark"
        closeIcon
        containerClassName="w-full sm:max-w-3xl"
      >
        <form
          className="flex flex-col items-end mt-4 gap-6 w-full max-w-3xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <fieldset className="flex flex-col gap-2 w-full">
            <label htmlFor="title">Title</label>
            <Input
              type="text"
              {...register('title', {
                required: 'Title is required',
              })}
            />
          </fieldset>
          <fieldset className="flex flex-col gap-2 w-full">
            <label htmlFor="description">Description</label>
            <TextArea className="min-h-[10rem]" {...register('description')} />
          </fieldset>
          <fieldset className="flex flex-col gap-2 w-full">
            <label htmlFor="style">
              Style{' '}
              <span className="text-sm">
                {"- define bookmark's style in digest"}
              </span>
            </label>
            <Select
              {...register('style')}
              defaultValue={bookmarkDigest.style}
              options={getStyleSelectOptions()}
            />
          </fieldset>
          <div className="flex justify-start gap-4 w-full items-center">
            <Button
              isLoading={isRemoving || isRefreshing}
              type="submit"
              disabled={!isDirty}
            >
              Save
            </Button>
            <Button
              type="button"
              variant="destructiveGhost"
              onClick={closeDialog}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
