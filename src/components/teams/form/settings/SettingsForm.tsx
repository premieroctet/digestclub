import { Team } from '@prisma/client';
import { FormEvent } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DangerZoneTeam } from '../DangerZone';
import SlackPanel from '../SlackPanel';
import { useMutation } from 'react-query';
import { ApiTeamResponseSuccess } from '@/pages/api/teams';
import { AxiosError, AxiosResponse } from 'axios';
import api from '@/lib/api';
import { routes } from '@/core/constants';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import SettingsField from './SettingsField';
import { fieldsData, FieldName, FIELDS } from './form-data';
import Button from '@/components/Button';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';

type SettingsForm = Record<FieldName, string>;
type PartialRecord<K extends keyof any, T> = {
  [P in K]?: T;
};

const SettingsForm = ({ team }: { team: Team }) => {
  const { successToast, errorToast } = useCustomToast();
  const { refresh } = useTransitionRefresh();

  const { mutate: updateTeam, isLoading } = useMutation<
    AxiosResponse<ApiTeamResponseSuccess>,
    AxiosError<ErrorResponse>,
    PartialRecord<FieldName, string>
  >(
    'update-team-profile',
    (data) => api.patch(routes.TEAM.replace(':slug', team.id.toString()), data),
    {
      onSuccess: () => {
        successToast('Team info updated successfully');
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
  const methods = useForm<SettingsForm>({
    mode: 'onBlur',
    defaultValues: {
      [FIELDS.bio]: team?.bio || '',
      [FIELDS.name]: team?.name || '',
      [FIELDS.website]: team?.website || '',
      [FIELDS.github]: team?.github || '',
      [FIELDS.twitter]: team?.twitter || '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
  } = methods;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    handleSubmit((values) => {
      const { bio, name, website, github, twitter } = values;
      const dataToUpdate = {
        ...(dirtyFields.bio && { bio }),
        ...(dirtyFields.name && { name }),
        ...(dirtyFields.website && { website }),
        ...(dirtyFields.github && { github }),
        ...(dirtyFields.twitter && { twitter }),
      };

      updateTeam(dataToUpdate);
      reset({}, { keepValues: true });
    })(e);
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-4">
            {fieldsData.map((field) => (
              <SettingsField
                {...field}
                key={field.id}
                defaultValue={team[field.id] || ''}
              />
            ))}
            <div className="relative py-5">
              <div
                className="absolute inset-0 flex items-center "
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-300" />
              </div>
            </div>
            <span>
              <h3 className="text-lg font-semibold leading-7">Integrations</h3>
              <span className="text-sm text-gray-500 font-light">
                Increase your digest reach by integrating with other tools.
              </span>
            </span>
            <SlackPanel team={team} />
            <TypefullyPanel team={team} />
            <TeamAPIKey team={team} />
            <div className="flex justify-start gap-4 w-full items-center pt-6 pb-2">
              <div className="flex-1">
                <Button
                  fullWidth
                  type="submit"
                  isLoading={isLoading}
                  disabled={!isDirty}
                >
                  Save
                </Button>
              </div>
              <div className="flex-1">
                <DangerZoneTeam team={team} />
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SettingsForm;
