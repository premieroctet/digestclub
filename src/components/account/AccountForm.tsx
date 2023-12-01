'use client';
import { Session } from 'next-auth';
import { Input } from '../Input';
import { DangerZoneAccount } from '../teams/form/DangerZone';
import SectionContainer from '../layout/SectionContainer';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  name: HTMLInputElement;
}

interface Form extends HTMLFormElement {
  readonly elements: FormElements;
}
import updateUser from '@/actions/update-user';
import SubmitButton from '../buttons/SubmitButton';
import useCustomToast from '@/hooks/useCustomToast';

type Props = {
  user: Session['user'];
};

const AccountForm = ({ user }: Props) => {
  const { successToast, errorToast } = useCustomToast();
  return (
    <SectionContainer
      title={`Hello ${user?.name || user?.email}`}
      className="flex justify-center max-w-2xl m-auto w-full"
    >
      <form
        className="flex flex-col items-end mt-4 gap-6 w-full max-w-2xl"
        action={async (formData) => {
          // validation du formulaire
          const { error } = await updateUser(formData);
          if (error) {
            errorToast(error.message);
            return;
          }
          successToast('Your account has been updated successfully');
        }}
      >
        <fieldset className="flex flex-col gap-2 w-full">
          <label htmlFor="email">Email address</label>
          <Input
            readOnly
            disabled
            defaultValue={user?.email!}
            type="email"
            name="email"
          />
        </fieldset>
        <fieldset className="flex flex-col gap-2 w-full">
          <label htmlFor="name">Full name</label>
          <Input
            defaultValue={user?.name!}
            type="text"
            name="name"
            minLength={2}
          />
        </fieldset>
        <div className="flex justify-start gap-4 w-full items-center">
          <SubmitButton />
          <div className="flex-2">
            <DangerZoneAccount user={user} />
          </div>
        </div>
      </form>
    </SectionContainer>
  );
};

export default AccountForm;
