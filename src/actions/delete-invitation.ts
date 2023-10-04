'use server';
import db from '@/lib/db';
import * as Sentry from '@sentry/nextjs';
import { checkAuthAction, getErrorMessage } from './utils';
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

    return { data: { invitationId } };
  } catch (err: any) {
    Sentry.captureException(err);
    return {
      error: {
        message: getErrorMessage(err.message),
      },
    };
  }
}
