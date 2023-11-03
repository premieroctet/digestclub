'use client';
import Button from '@/components/Button';
import { Team } from '@prisma/client';
import React, { useEffect, useState, useTransition } from 'react';
import {
  ClipboardIcon,
  ClipboardDocumentCheckIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';
import { copyToClipboard, makeHidden } from '@/utils/string';
import clsx from 'clsx';
import useCustomToast from '@/hooks/useCustomToast';
import { useRouter } from 'next/navigation';
import * as Popover from '@radix-ui/react-popover';
import generateAPIKey from '@/actions/generate-api-key';
interface Props {
  team: Team;
}

export default function TeamAPIKeyServer({ team }: Props) {
  const key = team.apiKey;
  const router = useRouter();

  const displayedKey = key ? makeHidden(key) : '';
  const [isAnimating, setIsAnimating] = useState(false);
  const { successToast, errorToast } = useCustomToast();
  let [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (isAnimating) {
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }
  }, [isAnimating]);

  function handleClick() {
    startTransition(async () => {
      const { error } = await generateAPIKey(team.id);
      if (error) {
        errorToast(error.message);
        return;
      } else {
        successToast('Team API Key updated successfully');
        router.refresh();
      }
    });
  }

  return (
    <div className=" w-full flex flex-col gap-2 items-stretch">
      <span className="font-semibold mt-4 mb-4">API Key</span>
      <div className="flex gap-8 items-center flex-col sm:flex-row">
        {team.apiKey ? (
          <>
            <div
              className="w-full group cursor-pointer"
              onClick={() => {
                if (!key) return;
                setIsAnimating(true);
                successToast('Copied to clipboard ✅');
                copyToClipboard(key);
              }}
            >
              <div className="px-3 py-2 flex justify-between items-center rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                <span className=" overflow-hidden text-ellipsis block select-none items-center text-gray-500 sm:text-base">
                  {displayedKey}
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
                  disabled={isPending}
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
                        onClick={handleClick}
                        isLoading={isPending}
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
            onClick={handleClick}
            className="whitespace-nowrap"
            disabled={isPending}
            variant="outline"
          >
            Create
          </Button>
        )}
      </div>
    </div>
  );
}
