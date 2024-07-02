'use client';
import { routes } from '@/core/constants';
import message from '@/messages/en';
import { EmailProvider, getEmailProvider } from '@/utils/getEmailProvider';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from 'react-query';
import Button from '../Button';
import { Input } from '../Input';

const LoginForm = () => {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(searchParams?.get('email') || '');
  const [emailProvider, setEmailProvider] = useState<EmailProvider>();

  const {
    mutate: login,
    isLoading,
    isSuccess,
  } = useMutation(
    'login',
    () =>
      signIn('email', {
        email,
        redirect: false,
        callbackUrl: searchParams?.get('callbackUrl') || routes.TEAMS,
      }),
    {
      onSuccess: () => {
        setEmailProvider(getEmailProvider(email));
        setEmail('');
      },
    }
  );

  return (
    <div className="flex flex-col space-y-6 items-stretch box-border">
      {isSuccess ? (
        <>
          <div className="text-center flex justify-center">
            <CheckCircleIcon className="text-green-400 min-h-6 min-w-6 max-h-6 max-w-6 mx-4" />
            {message.auth.success}
          </div>
          {emailProvider?.name && emailProvider?.url && (
            <Link href={emailProvider.url} className="w-full">
              <Button fullWidth>Open {emailProvider.name}</Button>
            </Link>
          )}
        </>
      ) : (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (email) {
              login();
            }
          }}
          className="flex flex-col space-y-4"
        >
          <div className="text-center">{message.auth.formTitle}</div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="email" className="sr-only">
              {message.auth.placeholder}
            </label>
            <Input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              placeholder={message.auth.placeholder}
            />
          </div>
          <div></div>
          <div className="flex justify-center">
            <Button fullWidth type="submit" isLoading={isLoading}>
              {message.auth.submit}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default LoginForm;
