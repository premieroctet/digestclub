import db from '@/lib/db';

export const getTeamSubscriptions = async (teamSlug: string) => {
  const subscriptions = await db.subscription.findMany({
    where: {
      team: {
        slug: teamSlug,
      },
    },
  });
  return subscriptions;
};
