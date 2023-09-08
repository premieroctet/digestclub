'use client';

import { getDigest, getTeamBySlug } from '@/lib/queries';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import api from '@/lib/api';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import useCustomToast from '@/hooks/useCustomToast';
import { IoMail as MailIcon } from '@react-icons/all-files/io5/IoMail';
import { IoMdSend as SendIcon } from '@react-icons/all-files/io/IoMdSend';
import { Popover } from '../Popover';
import Button from '../Button';

export default function DigestEditSendNewsletter({
  team: { id: teamId },
  digest: { id: digestId, hasSentNewsletter },
}: {
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
}) {
  const { refresh } = useTransitionRefresh();
  const { errorToast, successToast } = useCustomToast();

  const { mutate: sendNewsletter, isLoading: isSending } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>
  >(
    ['send-newsletter', teamId, digestId],
    () => api.post(`/teams/${teamId}/digests/${digestId}/newsletter`),
    {
      onSuccess: () => {
        successToast('Newsletter sent successfully');
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

  if (hasSentNewsletter) {
    return (
      <div className="h-full group relative flex items-stretch space-x-3 content-center overflow-hidden rounded-lg bg-white px-4 py-4 shadow-md sm:px-4 sm:py-4 opacity-50">
        <div className="flex items-center justify-center m-auto h-10 w-10  bg-black text-white rounded-lg">
          <span className="inline-flex h-6 w-6 items-center justify-center m-auto animate-in duration-200 delay-500 fade-in zoom-in-50 fill-mode-both">
            <MailIcon size={40} />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-gray-900">
            <div>Newsletter</div>
          </div>
          <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
            <span>Already sent</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <Popover
      trigger={
        <div className="h-full group relative flex items-stretch space-x-3 content-center overflow-hidden rounded-lg bg-white px-4 py-4 shadow-md sm:px-4 sm:py-4 cursor-pointer">
          <div className="flex items-center justify-center m-auto h-10 w-10  bg-black text-white rounded-lg">
            <span className="inline-flex h-6 w-6 items-center justify-center m-auto animate-in duration-200 delay-500 fade-in zoom-in-50 fill-mode-both">
              <MailIcon size={40} />
            </span>
          </div>

          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium text-gray-900">
              <div>Newsletter</div>
            </div>
            <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
              <span>Send as a newsletter</span>
            </p>
          </div>
          <div className="flex-shrink-0 self-center  -translate-x-1 transition-all duration-200 group-hover:translate-x-1">
            <SendIcon
              className="h-5 w-5 text-gray-400 -z-10"
              aria-hidden="true"
            />
          </div>
        </div>
      }
    >
      <div className="max-w-sm text-center">
        <p className="max-w-[30ch]">
          <strong>Are you sure</strong> you want to send this as a newsletter?{' '}
        </p>
        <div className="flex flex-row gap-4 items-center justify-center mt-4">
          <Button
            onClick={() => {
              if (hasSentNewsletter) return;
              sendNewsletter();
            }}
            variant="destructiveOutline"
            size="sm"
            isLoading={isSending}
            disabled={hasSentNewsletter}
          >
            Yes, send the newsletter
          </Button>
        </div>
      </div>
    </Popover>
  );
}
