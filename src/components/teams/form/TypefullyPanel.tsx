'use client';
import Button from '@/components/Button';
import { Input } from '@/components/Input';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { Team } from '@prisma/client';
import { AxiosError } from 'axios';
import { ChangeEvent, useState } from 'react';
import { useMutation } from 'react-query';
import { AiOutlineInfoCircle } from '@react-icons/all-files/ai/AiOutlineInfoCircle';
import { Popover } from '@/components/Popover';
import Link from '@/components/Link';

const TypefullyPanel = ({ team }: { team: Team }) => {
  const { refresh } = useTransitionRefresh();
  const { successToast, errorToast } = useCustomToast();
  const [apiKey, setApiKey] = useState(team.typefullyToken || '');
  const { mutate: createTypefullyIntegration, isLoading: createLoading } =
    useMutation(
      `create-typefully-integration-${team.id}`,
      (apiKey: string) =>
        api.post(`/teams/connect/typefully?teamId=${team.id}`, {
          apiKey: apiKey,
        }),
      {
        onSuccess: () => {
          successToast('Typefully integration has been created');
          refresh();
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

  const { mutate: deleteTypefulllyIntegration, isLoading: deleteLoading } =
    useMutation(
      `delete-typefully-integration-${team.id}`,
      () => api.delete(`/teams/connect/typefully?teamId=${team.id}`),
      {
        onSuccess: () => {
          successToast('Typefully integration has been deleted');
          setApiKey('');
          refresh();
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  return (
    <div>
      <div className="flex w-autoitems-center gap-2 mt-4 mb-4">
        <label className="items-center font-semibold" htmlFor="typefully">
          <span className="relative flex items-center gap-2">Typefully</span>
        </label>
        <Popover
          trigger={
            <span className="flex items-center justify-center">
              <AiOutlineInfoCircle />
            </span>
          }
        >
          <div className="bg-white max-w-[50ch] p-2 pb-3">
            <h3 className="font-bold text-gray-900 text-md mb-2">
              How do I find my Typefully token ?
            </h3>
            <ul className="flex flex-col gap-1 list-decimal list-inside">
              <li>
                Go to{' '}
                <a
                  href="https://typefully.com/"
                  target="_blank"
                  className="underline text-violet-500 font-semibold"
                >
                  Typefully
                </a>{' '}
                and open <strong>Settings</strong> by clicking on the gear icon
                in the bottom left-hand corner of the screen.
              </li>
              <li>
                Next, select the <strong>API & Integrations</strong> menu item.
              </li>
              <li>
                Under the API Keys section, copy your API Key. If you do not
                have a key yet, generate one and then copy it.
              </li>
            </ul>
          </div>
        </Popover>
      </div>

      <div className="flex gap-2 w-full">
        <Input
          className=""
          name="typefully"
          placeholder={'Add your API key here'}
          type="text"
          value={
            team.typefullyToken
              ? team.typefullyToken.replaceAll(/./g, '•')
              : apiKey
          }
          disabled={Boolean(team.typefullyToken)}
          onChange={handleChange}
        />
        {team.typefullyToken ? (
          <Button
            type="button"
            isLoading={deleteLoading}
            variant="destructive"
            onClick={() => {
              deleteTypefulllyIntegration();
            }}
            size="sm"
            icon={<MinusIcon className="h-5 w-5" />}
          />
        ) : (
          <Button
            type="button"
            isLoading={createLoading}
            onClick={() => {
              apiKey && createTypefullyIntegration(apiKey);
            }}
            size="sm"
            icon={<PlusIcon className="h-5 w-5" />}
          />
        )}
      </div>
    </div>
  );
};

export default TypefullyPanel;
