'use client';

import updateTeamInfo from '@/actions/update-team-info';
import Button from '@/components/Button';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import { Team } from '@prisma/client';
import { ImGithub } from '@react-icons/all-files/im/ImGithub';
import { ImLink } from '@react-icons/all-files/im/ImLink';
import { ImTwitter } from '@react-icons/all-files/im/ImTwitter';
import { FormEvent, useEffect, useTransition } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { DangerZoneTeam } from '../DangerZone';
import AvatarField from './AvatarField';
import SettingsField from './SettingsField';
import TeamColorField from './TeamColorField';
import { FIELDS, FieldName } from './form-data';

/* Represents the form data with fields names perfectly matching the Team model */
interface BasicSettingsForm {
  [FIELDS.avatar]: string;
  [FIELDS.bio]: string;
  [FIELDS.name]: string;
  [FIELDS.website]: string;
  [FIELDS.github]: string;
  [FIELDS.twitter]: string;
  [FIELDS.color]: string;
  [FIELDS.prompt]: string;
}

interface InternalUploadSettingsForm {
  [FIELDS.avatarUpload]: File;
  [FIELDS.avatarRemove]: string;
}

interface SettingsForm extends BasicSettingsForm, InternalUploadSettingsForm {}

const TeamInfo = ({ team }: { team: Team }) => {
  const { successToast, errorToast } = useCustomToast();
  const [isPending, startTransition] = useTransition();

  const methods = useForm<SettingsForm>({
    mode: 'onBlur',
    defaultValues: {
      [FIELDS.avatar]: team?.avatar || undefined,
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
    watch,
    getValues,
    formState: { isDirty, dirtyFields },
  } = methods;
  const { refresh, isRefreshing } = useTransitionRefresh();

  // Watch the entire form or specific fields
  const formValues = watch(); // This will watch all form values

  // Use useEffect to log form values whenever they change
  useEffect(() => {
    console.log('Form values changed:', formValues);
  }, [formValues]); // This effect will run every time formV

  const onSubmit = (e: FormEvent) =>
    startTransition(() => {
      handleSubmit(async (values) => {
        let formData = new FormData();

        // Map to the dirty fields (fields that have been changed) and append to the form data
        Object.keys(dirtyFields).map((key) => {
          const k = key as FieldName;
          const v = values[k];
          formData.append(k, v);
        });

        const { error } = await updateTeamInfo(formData, team?.id);
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
              <AvatarField
                avatar={getValues(FIELDS.avatar) ?? undefined}
                name={team?.name}
                teamId={team.id}
              />

              <SettingsField
                id="name"
                input="text"
                inputType="text"
                label="Name"
                placeholder="Team name"
                registerOptions={{
                  required: 'Team name is required',
                }}
                defaultValue={team?.name || ''}
              />

              <SettingsField
                id="bio"
                input="textarea"
                inputType="text"
                label="Bio"
                placeholder="Tell us about your team"
                registerOptions={{
                  maxLength: {
                    value: 160,
                    message: 'Bio must be less than 160 characters',
                  },
                }}
                defaultValue={team?.bio || ''}
              />

              <SettingsField
                id="website"
                input="text"
                inputType="url"
                label="Website"
                rightElement={<ImLink />}
                placeholder="https://company.io"
                defaultValue={team?.website || ''}
              />

              <SettingsField
                id="github"
                input="text"
                inputType="text"
                label="Github"
                rightElement={<ImGithub />}
                prefix="@"
                placeholder=""
                defaultValue={team?.github || ''}
              />

              <SettingsField
                id="twitter"
                input="text"
                inputType="text"
                label="Twitter"
                rightElement={<ImTwitter />}
                prefix="@"
                placeholder=""
                defaultValue={team?.twitter || ''}
              />

              {team?.subscriptionId && (
                <SettingsField
                  id="prompt"
                  input="textarea"
                  inputType="text"
                  label="Summary generator prompt"
                  placeholder="Add a custom prompt for bookmark summary generation. Your prompt will be followed by : + article content"
                  maxLength={4000}
                  defaultValue={team?.prompt || ''}
                />
              )}

              <TeamColorField id="color" label="Team Color" team={team} />
            </div>
            <div className="flex flex-row-reverse justify-start gap-4 items-center w-full">
              <Button
                // fullWidth
                type="submit"
                isLoading={isPending}
                disabled={!isDirty}
              >
                Save
              </Button>

              <DangerZoneTeam team={team} />
            </div>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default TeamInfo;
