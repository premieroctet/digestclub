import Button from '@/components/Button';
import { Team } from '@prisma/client';
import React, { useEffect, useState } from 'react';
import {
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { copyToClipboard, makeHidden } from '@/utils/string';
import clsx from 'clsx';
import useCustomToast from '@/hooks/useCustomToast';
import api from '@/lib/api';
import { useMutation } from 'react-query';
import { ApiTeamResponseSuccess } from '@/pages/api/teams';
import { AxiosError, AxiosResponse } from 'axios';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import * as Popover from '@radix-ui/react-popover';
interface Props {
  team: Team;
}

export default function TeamAPIKey({ team }: Props) {
  const id = team.apiKey;
  const displayedId = id ? makeHidden(id) : '';
  const [isAnimating, setIsAnimating] = useState(false);
  const { isRefreshing, refresh } = useTransitionRefresh();
  const { successToast, errorToast } = useCustomToast();
  const { mutate: updateKey, isLoading } = useMutation<
    AxiosResponse<ApiTeamResponseSuccess>,
    AxiosError<ErrorResponse>,
    void
  >('update-team-key', () => api.get(`/teams/${team.id}/key/new`), {
    onSuccess: () => {
      successToast('Team API Key updated successfully');
      refresh();
    },
    onError: (error) => {
      errorToast('An error occurred while updating the API Key');
      // eslint-disable-next-line no-console
      console.log(error);
    },
  });

  useEffect(() => {
    if (isAnimating) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  }, [isAnimating]);

  return (
    <div className=" w-full flex flex-col gap-2 items-stretch">
      <span className="font-semibold mt-4 mb-4">API Key</span>
      <div className="flex gap-8 items-center">
        {team.apiKey ? (
          <>
            <div
              className="w-full group cursor-pointer"
              onClick={() => {
                if (!id) return;
                setIsAnimating(true);
                successToast('Copied to clipboard ✅');
                copyToClipboard(id);
              }}
            >
              <div className="px-3 py-2 flex justify-between items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <span className="w-[40ch] overflow-hidden text-ellipsis block select-none items-center text-gray-500 sm:text-base">
                  {displayedId}
                </span>

                {isAnimating ? (
                  <ClipboardDocumentCheckIcon className="h-5 w-5 text-green-700" />
                ) : (
                  <ClipboardIcon
                    className={clsx(
                      'h-5 w-5 text-gray-500 group-hover:text-violet-500'
                    )}
                  />
                )}
              </div>
            </div>
            <Popover.Root>
              <Popover.Trigger asChild className="relative">
                <Button
                  className="whitespace-nowrap"
                  icon={<ArrowPathIcon />}
                  disabled={isLoading || isRefreshing}
                  variant="outline"
                >
                  Create new
                </Button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content side="top" sideOffset={10}>
                  <div className="text-sm flex flex-col gap-3 mt-3 items-start justify-between border rounded-md bg-white p-2 text-gray-700 shadow-lg">
                    <span className="font-medium">
                      Are <b>you sure</b> you want to delete the current API Key
                      ?
                    </span>
                    <Popover.Close>
                      <Button
                        variant="destructiveOutline"
                        size="sm"
                        onClick={() => {
                          updateKey();
                        }}
                        isLoading={isLoading}
                      >
                        Yes, regenerate it
                      </Button>
                    </Popover.Close>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>
          </>
        ) : (
          <Button
            onClick={() => {
              updateKey();
            }}
            className="whitespace-nowrap"
            disabled={isLoading || isRefreshing}
            variant="outline"
          >
            Create
          </Button>
        )}
      </div>
    </div>
  );
}
