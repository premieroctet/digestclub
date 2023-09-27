'use server';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import { CUSTOM_ERROR_MESSAGES, checkAuthAction } from './utils';
import { revalidateTag } from 'next/cache';

interface DeleteInvitationResult {
  error?: {
    message: string;
  };
  data?: {
    invitationId: string;
  };
}

export default async function deleteInvitation(
  invitationId: string
): Promise<DeleteInvitationResult> {
  try {
    await checkAuthAction();

    // Delete invitation
    const invitation = await db.invitation.delete({
      where: {
        id: invitationId,
      },
    });

    await db.membership.delete({
      where: {
        id: invitation.membershipId,
      },
    });
    revalidateTag('check-user-team-by-slug');
    return { data: { invitationId } };
  } catch (err: any) {
    Sentry.captureException(err);
    return {
      error: {
        message:
          err?.message &&
          Object.values(CUSTOM_ERROR_MESSAGES)?.includes(err?.message)
            ? err.message
            : 'Something went wrong...',
      },
    };
  }
}
