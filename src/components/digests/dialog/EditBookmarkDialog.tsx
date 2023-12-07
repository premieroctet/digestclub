import { useTeam } from '@/contexts/TeamContext';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { getTweetId, isTwitterLink } from '@/utils/link';
import { BookmarkDigestStyle } from '@prisma/client';
import { AxiosError, AxiosResponse } from 'axios';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from '../../Button';
import { Dialog, DialogContent } from '../../Dialog';
import { Input, Select, TextArea } from '../../Input';
import { Props as BookmarkCardProps } from '../block-card/BlockCard';
import SummaryButton from './SummaryButton';
import TagsSelect from '@/components/TagsSelect';
import { ITag } from '@/components/Tag';

interface IFormValues {
  title: string;
  description: string;
  style: BookmarkDigestStyle;
  tags: ITag[];
}

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  bookmarkDigest: BookmarkCardProps['block'];
  defaultValues?: Partial<IFormValues>;
  url: string;
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
  url,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    setValue,
  } = useForm<IFormValues>({
    defaultValues,
  });
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const params = useParams();
  const { id: teamId, subscriptionId } = useTeam();

  const { mutate: updateBookDigest, isLoading: isRemoving } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    IFormValues
  >(
    'update-bookmarkdigest',
    ({ title, description, style, tags }) => {
      return api.patch(
        `/teams/${teamId}/digests/${params?.digestId}/block/${bookmarkDigest.id}`,
        {
          title,
          description,
          style,
          tags: tags.map((tag) => tag.id),
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
          <div className="w-full flex flex-col gap-3">
            <fieldset className="flex flex-col gap-2 w-full">
              <label htmlFor="description">Description</label>
              <TextArea
                className="min-h-[10rem]"
                {...register('description')}
              />
            </fieldset>
            <SummaryButton
              url={url}
              handleSuccess={(text) =>
                setValue('description', text, { shouldDirty: true })
              }
              hasAccess={!!subscriptionId}
            />
          </div>
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
          <Controller
            name="tags"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TagsSelect value={value} onChange={onChange} />
            )}
          />
          <div className="flex justify-between gap-4 w-full items-center">
            <Button type="button" variant="ghost" onClick={closeDialog}>
              Cancel
            </Button>
            <Button
              isLoading={isRemoving || isRefreshing}
              type="submit"
              disabled={!isDirty}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
