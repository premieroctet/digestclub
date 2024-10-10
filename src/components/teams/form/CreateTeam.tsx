'use client';
import React, { FormEvent } from 'react';
import Button from '@/components/Button';
import { routes } from '@/core/constants';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { ApiTeamResponseSuccess } from '@/app/api/teams/route';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import { useMutation } from 'react-query';
import { Input } from '@/components/Input';

interface FormElements extends HTMLFormControlsCollection {
  team: HTMLInputElement;
}

interface Form extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function CreateTeam() {
  const router = useRouter();
  const { refresh, isRefreshing } = useTransitionRefresh();
  const { successToast, errorToast } = useCustomToast();

  const { mutate: createTeam, isLoading } = useMutation<
    AxiosResponse<ApiTeamResponseSuccess>,
    AxiosError<ErrorResponse>,
    { teamName: string }
  >('create-team', (data) => api.post('/teams', data), {
    onSuccess: ({ data }) => {
      successToast('Your team has been created');
      refresh();
      router.push(routes.TEAM.replace(':slug', data.slug));
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      errorToast(
        error.response?.data?.error ||
          error.response?.statusText ||
          error.message
      );
    },
  });

  function handleSubmit(e: FormEvent<Form>) {
    e.preventDefault();
    const teamName = e.currentTarget.elements.team.value;
    if (teamName.trim().length === 0) {
      errorToast('Team name cannot be empty');
      return;
    }
    createTeam({ teamName });
  }

  return (
    <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
      <fieldset className="py-4">
        <label htmlFor="team" className="sr-only">
          Team name
        </label>
        <Input
          type="text"
          name="team"
          id="team"
          placeholder="Team name"
          required
          autoFocus
        />
      </fieldset>
      <Button isLoading={isLoading || isRefreshing} type="submit">
        Create
      </Button>
    </form>
  );
}
