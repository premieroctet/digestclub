import React, { useState } from 'react';
import { Dialog, DialogContent } from '../../Dialog';
import Button from '../../Button';
import { TextArea } from '../../Input';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import api from '@/lib/api';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { DigestBlockType } from '@prisma/client';

interface FormValues {
  text: string;
}
interface Props {
  teamId: string;
  digestId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  position?: number;
}

export default function AddTextBlockDialog({
  isOpen,
  setIsOpen,
  teamId,
  digestId,
  position,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<FormValues>();
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();

  const onSubmit = (data: FormValues, e?: React.BaseSyntheticEvent) => {
    e?.preventDefault();
    addDigestTextBlock({
      text: data.text,
      position,
      type: DigestBlockType.TEXT,
    });
  };

  const { mutate: addDigestTextBlock, isLoading: isCreating } = useMutation<
    any,
    any,
    { text: string; position?: number; type: DigestBlockType }
  >(
    'update-block',
    (data) => api.post(`/teams/${teamId}/digests/${digestId}/block`, data),
    {
      onSuccess: () => {
        successToast('Text block added!');
        reset();
        setIsOpen(false);
        refresh();
      },
      onError: (error) => {
        errorToast(
          error.response?.data?.error ||
            error.response?.statusText ||
            error.message ||
            'Something went wrong!'
        );
        console.log(error);
      },
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
      <DialogContent
        title="Add a text block"
        description="Write something to add to your digest, markdown is supported."
        closeIcon
        containerClassName="w-full sm:max-w-3xl"
      >
        <form
          className="flex flex-col gap-6 justify-items-stretch w-full items-end"
          onSubmit={handleSubmit(onSubmit)}
        >
          <TextArea
            className="w-full min-h-[200px]"
            placeholder="Write something..."
            {...register('text')}
            rows={10}
          />
          <div className="flex justify-start gap-4 w-full items-center">
            <Button
              type="submit"
              className="m-0"
              disabled={!isDirty}
              isLoading={isCreating || isRefreshing}
            >
              Add
            </Button>
            <Button
              type="button"
              variant="destructiveGhost"
              className="m-0"
              onClick={() => {
                reset();
                setIsOpen(false);
              }}
              disabled={!isDirty || isCreating || isRefreshing}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
