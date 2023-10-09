'use client';

import { Team } from '@prisma/client';
import { FormEvent, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DangerZoneTeam } from '../DangerZone';
import SlackPanel from '../SlackPanel';
import useCustomToast from '@/hooks/useCustomToast';
import SettingsField from './SettingsField';
import { fieldsData, FieldName, FIELDS } from './form-data';
import Button from '@/components/Button';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';
import updateTeamInfo from '@/actions/update-team-info';
import TeamColorField from './TeamColorField';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';

type SettingsForm = Record<FieldName, string>;

const SettingsForm = ({ team }: { team: Team }) => {
  const { successToast, errorToast } = useCustomToast();
  const [isPending, startTransition] = useTransition();

  const methods = useForm<SettingsForm>({
    mode: 'onBlur',
    defaultValues: {
      [FIELDS.bio]: team?.bio || '',
      [FIELDS.name]: team?.name || '',
      [FIELDS.website]: team?.website || '',
      [FIELDS.github]: team?.github || '',
      [FIELDS.twitter]: team?.twitter || '',
      [FIELDS.color]: team?.color || '#6d28d9',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
    getValues,
  } = methods;
  const { refresh, isRefreshing } = useTransitionRefresh();

  const onSubmit = (e: FormEvent) =>
    startTransition(
      //@ts-expect-error
      async () => {
        handleSubmit(async (values) => {
          let changedValues: Partial<Team> = {};
          Object.keys(dirtyFields).map((key) => {
            changedValues[key as FieldName] = values[key as FieldName];
          });
          const { error } = await updateTeamInfo(changedValues, team?.id);
          if (error) {
            errorToast(error.message);
          } else {
            successToast('Team info updated successfully');
            refresh();
          }

          reset({}, { keepValues: true });
        })(e);
      }
    );

  return (
    <FormProvider {...methods}>
      {/* @ts-expect-error */}
      <form action={onSubmit}>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-4">
            {fieldsData.map((field) => (
              <SettingsField
                {...field}
                key={field.id}
                defaultValue={team[field.id] || ''}
              />
            ))}

            <TeamColorField id="color" label="Team Color" team={team} />

            <div className="flex justify-start gap-4 w-full items-center pt-6 pb-2">
              <div className="flex-1">
                <Button
                  fullWidth
                  type="submit"
                  isLoading={isPending}
                  disabled={!isDirty}
                >
                  Save
                </Button>
              </div>
              <div className="flex-1">
                <DangerZoneTeam team={team} />
              </div>
            </div>

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
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SettingsForm;
