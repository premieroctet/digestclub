'use server';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import { revalidatePath } from 'next/cache';
import { checkAuthAction, getErrorMessage } from './utils';

interface UpdateUserResult {
  error?: {
    message: string;
  };
  data?: {
    user: string;
  };
}

export default async function updateUser(
  formData: FormData
): Promise<UpdateUserResult> {
  try {
    const user = await checkAuthAction();
    const updatedUser = await db.user.update({
      where: {
        id: user?.id,
      },
      data: { name: formData?.get('name')?.toString() ?? '' },
    });

    revalidatePath('/account');
    return {
      data: {
        user: JSON.stringify(updatedUser),
      },
    };
  } catch (err: any) {
    Sentry.captureException(err);
    return {
      error: {
        message: getErrorMessage(err.message),
      },
    };
  }
}
