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
import { TextArea } from '../../Input';
import { Props as BookmarkCardProps } from '../block-card/BlockCard';

interface FormValues {
  text: string;
}
interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  bookmarkDigest: BookmarkCardProps['block'];
  defaultValues?: Partial<FormValues>;
}

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
  } = useForm<FormValues>({
    defaultValues,
  });
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const params = useParams();
  const { id: teamId } = useTeam();

  const { mutate: updateBookDigest, isLoading: isRemoving } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    FormValues
  >(
    'update-bookmarkdigest',
    ({ text }) => {
      return api.patch(
        `/teams/${teamId}/digests/${params?.digestId}/block/${bookmarkDigest.id}`,
        { text }
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

  const onSubmit: SubmitHandler<FormValues> = (data: FormValues) => {
    updateBookDigest(data);
  };

  function closeDialog() {
    reset();
    setIsOpen(false);
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
        title="Edit a text block"
        description="Write something to add to your digest, markdown is supported."
        closeIcon
        containerClassName="w-full sm:max-w-3xl"
      >
        <form
          className="flex flex-col items-end mt-4 gap-6 w-full max-w-3xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextArea
            className="min-h-[10rem]"
            placeholder="Write something..."
            {...register('text')}
            rows={10}
          />
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
