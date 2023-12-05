import { getSession } from '@/lib/sessions';
import { getTeamMembershipById } from '@/services/database/membership';

export const CUSTOM_ERROR_MESSAGES = {
  unauthenticated: 'Unauthenticated user',
  wrong_team: 'User is not a team member',
  missing_params: 'Missing query parameters',
};

export const getErrorMessage = (message: string) => message;
// Object.values(CUSTOM_ERROR_MESSAGES)?.includes(message)
//   ? message
//   : 'Something went wrong...';

export const checkAuthAction = async () => {
  const session = await getSession();

  if (!session?.user) {
    throw new Error(CUSTOM_ERROR_MESSAGES.unauthenticated);
  }
  return session?.user;
};

export const checkTeamAction = async (teamId: string) => {
  const session = await getSession();

  if (!session && !teamId) {
    throw new Error(CUSTOM_ERROR_MESSAGES.missing_params);
  }

  const membership = await getTeamMembershipById(teamId, session!.user?.id);

  if (!membership) {
    throw new Error(CUSTOM_ERROR_MESSAGES.wrong_team);
  }
  return membership;
};
