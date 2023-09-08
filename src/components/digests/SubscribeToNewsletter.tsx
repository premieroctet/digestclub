'use client';
import useCustomToast from '@/hooks/useCustomToast';
import useTransitionRefresh from '@/hooks/useTransitionRefresh';
import api from '@/lib/api';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { useMutation } from 'react-query';
import Button from '../Button';

interface Props {
  teamId: string;
}
const SubscribeToNewsLetter = ({ teamId }: Props) => {
  const { refresh, isRefreshing } = useTransitionRefresh();
  const { successToast, errorToast } = useCustomToast();
  const emailInputRef = React.useRef<HTMLInputElement>(null);

  const [hasSubscribed, setHasSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    subscribeToNewsletter(email as string);
  };

  const { mutate: subscribeToNewsletter, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorResponse>,
    string
  >(
    'subscribe-to-newsletter',
    (email) =>
      api.post(`/teams/${teamId}/subscriptions`, {
        email,
      }),
    {
      onSuccess: () => {
        successToast('Subscribed to newsletter');
        refresh();
        setHasSubscribed(true);
        if (emailInputRef.current) {
          emailInputRef.current.value = '';
        }
      },
      onError: (err) => {
        if (err.response && err.response.data.error)
          errorToast(err.response.data.error);
        else errorToast('Error subscribing to newsletter');
      },
    }
  );

  return (
    <div className="bg-white md:px-10 py-12 lg:py-16">
      <div className="mx-auto max-w-7xl flex flex-col items- justify-start">
        <div className="max-w-2xl font-bold tracking-tight text-gray-900 sm:text-2xl">
          <h2 className="inline sm:block">
            Want to stay updated with our digests?
          </h2>{' '}
          <p className="inline sm:block font-light text-gray-800">
            Subscribe to our newsletter
          </p>
        </div>
        <form className="mt-5 max-w-md" onSubmit={handleSubmit}>
          <div className="flex gap-x-4">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-auto rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Enter your email"
              ref={emailInputRef}
              disabled={hasSubscribed}
            />
            <Button
              type="submit"
              variant="outline"
              isLoading={isLoading || isRefreshing}
              disabled={hasSubscribed}
            >
              Subscribe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscribeToNewsLetter;
