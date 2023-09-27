import { getSession } from '@/lib/sessions';

export const CUSTOM_ERROR_MESSAGES = {
  unauthenticated: 'Unauthenticated user',
};

export const checkAuthAction = async () => {
  const session = await getSession();

  if (!session?.user) {
    throw new Error(CUSTOM_ERROR_MESSAGES.unauthenticated);
  }
  return session?.user;
};
