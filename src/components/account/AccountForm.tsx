'use client';

import useCustomToast from '@/hooks/useCustomToast';
import api from '@/lib/api';

import { User } from '@prisma/client';
import { Session } from 'next-auth';
import { useMutation } from 'react-query';
import Button from '../Button';
import { Input } from '../Input';
import { DangerZoneAccount } from '../teams/form/DangerZone';

interface FormElements extends HTMLFormControlsCollection {
  email: HTMLInputElement;
  name: HTMLInputElement;
}

interface Form extends HTMLFormElement {
  readonly elements: FormElements;
}

type Props = {
  user: Session['user'];
};

const AccountForm = ({ user }: Props) => {
  const { successToast, errorToast } = useCustomToast();
  const { mutate, isLoading } = useMutation(
    'user-update',
    (data: Partial<User>) => api.put(`/user/${user?.id}`, data),
    {
      onSuccess: () => {
        successToast('Your account has been updated successfully');
      },
    }
  );

  const handleSubmit = (e: React.FormEvent<Form>) => {
    e.preventDefault();
    const { name } = e.currentTarget.elements;
    mutate({
      name: name.value.trim(),
    });
  };

  return (
    <form
      className="flex flex-col items-end mt-4 gap-6 w-full max-w-2xl"
      onSubmit={handleSubmit}
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
        <Button type="submit" isLoading={isLoading}>
          Save
        </Button>
        <div className="flex-2">
          <DangerZoneAccount user={user} />
        </div>
      </div>
    </form>
  );
};

export default AccountForm;
