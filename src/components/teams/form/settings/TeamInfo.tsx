'use client';

import { Team } from '@prisma/client';
import { FormEvent, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DangerZoneTeam } from '../DangerZone';
import useCustomToast from '@/hooks/useCustomToast';
import SettingsField from './SettingsField';
import { fieldsData, FieldName, FIELDS } from './form-data';
import Button from '@/components/Button';
import updateTeamInfo from '@/actions/update-team-info';
import TeamColorField from './TeamColorField';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import TeamMenuTitle from '../../TeamMenuTitle';
import TeamMenuContent from '../../TeamMenuContent';

const PRO_FIELDS = ['prompt'];

type SettingsForm = Record<FieldName, string>;

const TeamInfo = ({ team }: { team: Team }) => {
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
    startTransition(() => {
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
    <>
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
            </div>

            <Button
              fullWidth
              type="submit"
              isLoading={isPending}
              disabled={!isDirty}
            >
              Save
            </Button>

            <DangerZoneTeam team={team} />
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default TeamInfo;
