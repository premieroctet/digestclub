'use client';

import { ArrowPathIcon } from '@heroicons/react/24/solid';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import Image from 'next/image';
import { SquaresPlusIcon } from '@heroicons/react/24/outline';
import { getDigest, getTeamBySlug } from '@/lib/queries';
import { Tooltip } from '../Tooltip';
import { useMutation } from 'react-query';
import { AxiosError, AxiosResponse } from 'axios';
import api from '@/lib/api';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import useCustomToast from '@/hooks/useCustomToast';
import { AiOutlineLoading3Quarters as LoadingIcon } from '@react-icons/all-files/ai/AiOutlineLoading3Quarters';

export default function DigestEditTypefully({
  team: { typefullyToken, id: teamId, slug },
  digest: { id: digestId, typefullyThreadUrl },
}: {
  team: Awaited<ReturnType<typeof getTeamBySlug>>;
  digest: NonNullable<Awaited<ReturnType<typeof getDigest>>>;
}) {
  const { refresh } = useTransitionRefresh();
  const { errorToast, successToast } = useCustomToast();

  const { mutate: createThreadTypefully, isLoading: isCreating } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>
  >(
    ['post-thread-typefully', teamId, digestId],
    () => api.get(`/teams/${teamId}/digests/${digestId}/typefully`),
    {
      onSuccess: (response) => {
        successToast('Thread created successfully');
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

  const hasToken = Boolean(typefullyToken);
  const hasThreadUrl = Boolean(typefullyThreadUrl);

  return (
    <div className="group relative flex items-start space-x-3 content-center overflow-hidden rounded-lg bg-white px-4 py-4 shadow-md sm:px-4 sm:py-4">
      {isCreating ? (
        <LoadingIcon size={40} className="animate-spin text-gray-300" />
      ) : (
        <Image
          src="/typefully.svg"
          alt="Typefully logo"
          width={40}
          height={40}
        />
      )}

      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-gray-900">
          {!hasToken ? (
            <Link href={`/teams/${slug}/settings`}>
              <span
                className="absolute inset-0 cursor-pointer z-10"
                aria-hidden="true"
              />
              Create Twitter thread
            </Link>
          ) : hasThreadUrl ? (
            <div>
              <a
                href={typefullyThreadUrl!}
                target="_blank"
                className="absolute inset-0 cursor-pointer"
                aria-hidden="true"
              />
              View Draft Thread
            </div>
          ) : (
            <div onClick={() => createThreadTypefully()}>
              <span
                className="absolute inset-0 cursor-pointer z-10"
                aria-hidden="true"
              />
              Create Draft Thread
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 whitespace-nowrap overflow-hidden text-ellipsis">
          {!hasToken ? (
            <span>
              You need to link a Typefully Account in your team&apos;s settings
            </span>
          ) : hasThreadUrl ? (
            <span>Go to thread preview</span>
          ) : (
            <span>Draft a new thread</span>
          )}
        </p>
      </div>

      {!hasToken ? (
        <div className="flex-shrink-0 self-center group-hover:translate-x-1 -translate-x-1 transition-all duration-200">
          <ChevronRightIcon
            className="h-5 w-5 text-gray-400 -z-10"
            aria-hidden="true"
          />
        </div>
      ) : hasThreadUrl ? (
        <div className="self-center hover:rotate-180 -translate-x-1 transition-all duration-500 flex">
          <Tooltip
            trigger={
              <ArrowPathIcon
                onClick={() => {
                  createThreadTypefully();
                }}
                className="h-5 w-5 text-gray-400 z-10 cursor-pointer"
                aria-hidden="true"
              />
            }
          >
            Re-genereate thread
          </Tooltip>
        </div>
      ) : (
        <div className=" self-center -translate-x-1 relative group-hover:scale-125 origin-center transition-all duration-200">
          <SquaresPlusIcon
            className="h-5 w-5 text-gray-400 -z-10"
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
