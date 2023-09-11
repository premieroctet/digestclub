'use client';
import { Team } from '@prisma/client';
import { FormEvent } from 'react';
import { useMutation } from 'react-query';
import useCustomToast from '@/hooks/useCustomToast';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import Button from '../Button';
import { Input } from '../Input';
import message from '@/messages/en';

type Props = {
  team: Team;
  onSuccess?: () => void;
};

export const BookmarkModal = ({ team, onSuccess }: Props) => {
  const router = useRouter();
  const { errorToast, successToast } = useCustomToast();
  const teamId = team.id;

  const { mutate: addBookmark, isLoading } = useMutation(
    'send-invite',
    (link: string) =>
      api.post(`/teams/${teamId}/bookmark`, {
        link,
      }),
    {
      onSuccess: () => {
        successToast(message.team.feed.addLinkSuccess);
        if (onSuccess) onSuccess();
        router.refresh();
      },
      onError: (error: any) => {
        if (error.response.data.error) {
          errorToast(error.response.data.error);
        } else {
          errorToast(message.team.feed.errors.defaultError);
        }
      },
    }
  );

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = e.currentTarget.url.value;
    if (!url) return;
    addBookmark(url);
  };

  return (
    <>
      <form
        className="w-full bg-gray-50 flex flex-col gap-4"
        onSubmit={onSubmit}
      >
        <label htmlFor="url" className="hidden" aria-hidden="true">
          url
        </label>
        <Input
          type="url"
          name="url"
          id="url"
          placeholder="https://example.com"
          required
          autoFocus
        />
        <Button isLoading={isLoading} type="submit">
          Confirm
        </Button>
      </form>
    </>
  );
};
