'use client';

import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { ApiDigestResponseSuccess } from '@/pages/api/teams/[teamId]/digests';
import { AxiosError, AxiosResponse } from 'axios';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { routes } from '@/core/constants';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import Button from '../Button';
import { Input } from '../Input';

import DigestGuessTitle from './DigestGuessTitle';

type Props = {
  teamId: string;
  teamSlug: string;
  lastDigestTitles: string[];
};

export const DigestCreateInput = ({
  teamId,
  teamSlug,
  lastDigestTitles,
}: Props) => {
  const router = useRouter();
  const { successToast, errorToast } = useCustomToast();
  const [newDigestTiltle, setNewDigestTitle] = useState('');
  const { isRefreshing, refresh } = useTransitionRefresh();

  const { mutate: createDigest, isLoading } = useMutation<
    AxiosResponse<ApiDigestResponseSuccess>,
    AxiosError<ErrorResponse>,
    string
  >(
    'create-digest',
    (title: string) => api.post(`/teams/${teamId}/digests`, { title }),
    {
      onSuccess: (response) => {
        const newDigest = response.data;
        successToast('Your digest has been created!');
        const route = routes.DIGEST_EDIT.replace(':slug', teamSlug).replace(
          ':id',
          newDigest.id
        );
        refresh();
        router.push(route);
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newDigestTiltle) {
      createDigest(newDigestTiltle);
    }
  };

  return (
    <>
      <div>
        <form
          onSubmit={handleSubmit}
          className={clsx('w-full flex', isRefreshing && 'opacity-80')}
        >
          <Input
            className="px-4 rounded-r-none"
            type="text"
            placeholder="Digest name"
            value={newDigestTiltle}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewDigestTitle(e.target.value)
            }
            required
          />
          <Button
            className="py-2 px-4 bg-violet-600 text-white border-violet-600 !rounded-l-none ring-0"
            type="submit"
            disabled={!newDigestTiltle || isLoading}
            isLoading={isLoading || isRefreshing}
          >
            Create
          </Button>
        </form>
      </div>
      <DigestGuessTitle
        handleGuess={setNewDigestTitle}
        lastDigestTitles={lastDigestTitles}
      />
    </>
  );
};
