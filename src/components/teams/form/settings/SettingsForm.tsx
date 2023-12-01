'use client';

import updateTeamInfo from '@/actions/update-team-info';
import Button from '@/components/Button';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { Team } from '@prisma/client';
import { FormEvent, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DangerZoneTeam } from '../DangerZone';
import { FieldName, FIELDS, fieldsData } from './form-data';
import SettingsField from './SettingsField';
import TeamColorField from './TeamColorField';

const PRO_FIELDS = ['prompt'];

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
      [FIELDS.prompt]: team?.prompt || '',
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isDirty, dirtyFields },
  } = methods;
  const { refresh, isRefreshing } = useTransitionRefresh();

  const onSubmit = (e: FormEvent) =>
    startTransition(async () => {
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
    });

  return (
    <FormProvider {...methods}>
      {/* @ts-expect-error */}
      <form action={onSubmit}>
        <div className="flex flex-col gap-6 pt-4">
          <div className="flex flex-col gap-4">
            {fieldsData
              .filter(
                (field) =>
                  team?.subscriptionId || !PRO_FIELDS?.includes(field?.id)
              )
              .map((field) => (
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
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default SettingsForm;
