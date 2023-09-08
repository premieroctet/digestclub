'use client';

import useCustomToast from '@/hooks/useCustomToast';
import api from '@/lib/api';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import Button from '../Button';
import Link from '../Link';

import { CheckIcon } from '@heroicons/react/24/solid';

interface Props {
  teamId: string;
  teamName: string;
  email: string;
}

export default function UnsubscribeConfirmation({
  teamId,
  email,
  teamName,
}: Props) {
  const [hasUnsubscribed, setHasUnsubscribed] = useState(false);
  const { successToast, errorToast } = useCustomToast();

  const { mutate: unsubscribe, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    {
      email: string;
    }
  >(
    'unsubscribe',
    ({ email }) => {
      return api.delete(`/teams/${teamId}/subscriptions`, {
        data: {
          email,
        },
      });
    },
    {
      onSuccess: () => {
        successToast('You have been unsubscribed from the team.');
        setHasUnsubscribed(true);
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
  if (hasUnsubscribed) {
    return (
      <div className="px-4 py-5 sm:p-6">
        <div className="relative flex flex-col items-center justify-center gap-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-600 animate-in duration-300 delay-200 fade-in fill-mode-both">
            <CheckIcon
              className="h-6 w-6 text-white animate-in duration-200 delay-500 fade-in zoom-in-50 fill-mode-both"
              aria-hidden="true"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold leading-7 text-gray-900 text-center">
              You have been unsubscribed from {teamName}
            </h2>
            <p className="text-base leading-7 text-gray-600 text-center mt-3">
              You will no longer receive any emails from this team.
            </p>
            <div className="mt-8 flex justify-center items-center">
              <Link href="/" variant="ghost" size="sm" className="w-auto">
                Go to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="px-4 py-5 sm:p-6 flex-col items-center justify-center">
      <h3 className="text-xl font-semibold leading-6 text-gray-900 text-center">
        {teamName}
      </h3>
      <div className="mt-4 max-w-xl text-base text-gray-500 text-center">
        <p>
          Are you sure you want to unsubscribe <strong>{email}</strong> this
          team?
        </p>
      </div>
      <div className="mt-8 flex items-center justify-center">
        <Button
          type="button"
          onClick={() => {
            unsubscribe({ email });
          }}
          isLoading={isLoading}
        >
          Unsubscribe
        </Button>
      </div>
    </div>
  );
}
