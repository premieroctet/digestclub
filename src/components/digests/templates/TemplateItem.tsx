'use client';
import Button from '@/components/Button';
import { DeletePopover } from '@/components/Popover';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { Digest, Team } from '@prisma/client';
import { AxiosError, AxiosResponse } from 'axios';
import Link from 'next/link';
import { useMutation } from 'react-query';

export const formatTemplateTitle = (title: string, teamSlug: string) => {
  return title.replace(`${teamSlug}-template-`, '');
};

const TemplateItem = ({ template, team }: { template: Digest; team: Team }) => {
  const { successToast, errorToast } = useCustomToast();
  const { refresh, isRefreshing } = useTransitionRefresh();
  const { mutate: deleteTemplate, isLoading: isDeleting } = useMutation<
    AxiosResponse<ApiDigestResponseSuccess>,
    AxiosError<ErrorResponse>
  >(
    'delete-template',
    () => {
      return api.delete(`/teams/${team.id}/digests/${template.id}`);
    },
    {
      onSuccess: () => {
        successToast('Template has been deleted');
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

  return (
    <div className="flex justify-between items-center w-full">
      <span>{formatTemplateTitle(template?.title, team.slug)}</span>
      <div className="flex gap-x-4">
        <Link
          href={`/teams/${team.slug}/digests/${template.id}/edit`}
          prefetch={false}
        >
          <Button
            size={'sm'}
            aria-label="Edit template"
            variant="outline"
            isLoading={isDeleting}
          >
            Edit
          </Button>
        </Link>
        <DeletePopover
          handleDelete={() => deleteTemplate()}
          isLoading={isDeleting}
          trigger={
            <Button
              size={'sm'}
              aria-label="Delete template"
              variant="destructiveGhost"
              isLoading={isDeleting}
            >
              Delete
            </Button>
          }
        />
      </div>
    </div>
  );
};

export default TemplateItem;
