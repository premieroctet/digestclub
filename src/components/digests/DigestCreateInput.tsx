'use client';

import { ResponseSuccess } from '@/app/api/teams/[teamId]/digests/route';
import { COOKIES, routes } from '@/core/constants';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { TeamDigestsResult } from '@/services/database/digest';
import { Team } from '@prisma/client';
import { AxiosError, AxiosResponse } from 'axios';
import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import Button from '../Button';
import { Input, Select } from '../Input';
import { formatTemplateTitle } from './templates/TemplateItem';

type Props = {
  team: Team;
  predictedDigestTitle: string | null;
  templates?: TeamDigestsResult[];
};

export const DigestCreateInput = ({
  team,
  predictedDigestTitle,
  templates,
}: Props) => {
  const router = useRouter();
  const [_, setCookie] = useCookies([COOKIES.DEFAULT_TEAM]);
  const { successToast, errorToast } = useCustomToast();
  const { isRefreshing, refresh } = useTransitionRefresh();
  const methods = useForm<{ title: string; templateId?: string }>({
    mode: 'onBlur',
    defaultValues: {
      title: predictedDigestTitle ?? '',
      templateId: undefined,
    },
  });
  const { handleSubmit, register, watch } = methods;

  const { mutate: createDigest, isLoading } = useMutation<
    AxiosResponse<ResponseSuccess>,
    AxiosError<ErrorResponse>,
    { title: string; templateId?: string }
  >(
    'create-digest',
    ({ title, templateId }) =>
      api.post(`/teams/${team.id}/digests`, { title, templateId }),
    {
      onSuccess: (response) => {
        const newDigest = response.data;
        successToast('Your digest has been created!');
        const route = routes.DIGEST_EDIT.replace(':slug', team.slug).replace(
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

  const onSubmit = (e: FormEvent) => {
    handleSubmit((values) => {
      createDigest(values);
    })(e);
  };

  const hasTemplates = !!templates?.length;
  const title = watch('title');
  const templateId = watch('templateId');

  useEffect(() => {
    if (!team.slug) return;
    setCookie(COOKIES.DEFAULT_TEAM, team.slug, {
      sameSite: 'strict',
      path: '/',
    });
  });

  return (
    <div>
      <form
        onSubmit={onSubmit}
        className={clsx(
          'w-full flex',
          isRefreshing && 'opacity-80',
          hasTemplates && 'flex-col gap-4'
        )}
      >
        <div className={clsx('flex-col flex w-full', hasTemplates && 'gap-2')}>
          <Input
            className={clsx('px-4', !hasTemplates && 'rounded-r-none')}
            type="text"
            placeholder="Digest name"
            required
            {...register('title')}
          />
          {hasTemplates && (
            <Select
              options={[
                ...templates?.map((template) => ({
                  value: template?.id,
                  label: formatTemplateTitle(template?.title, team.slug),
                })),
              ]}
              {...register('templateId')}
            />
          )}
        </div>
        <Button
          className={clsx(
            'py-2 px-4 bg-violet-600 text-white border-violet-600 ring-0',
            hasTemplates ? '' : '!rounded-l-none'
          )}
          type="submit"
          disabled={!title || (hasTemplates && !templateId) || isLoading}
          isLoading={isLoading || isRefreshing}
        >
          Create
        </Button>
      </form>
    </div>
  );
};
