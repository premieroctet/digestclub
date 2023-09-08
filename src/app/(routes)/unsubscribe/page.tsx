import UnsubscribeConfirmation from '@/components/newsletter/UnsubscribeConfirmation';
import db from '@/lib/db';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  if (!searchParams.email || !searchParams.teamId) notFound();
  const { email, teamId } = searchParams;

  const team = await db.team.findUnique({
    where: {
      id: teamId,
    },
    select: {
      name: true,
    },
  });
  if (!team) notFound();

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="bg-white shadow sm:rounded-lg flex flex-col justify-center items-center max-w-lg animate-in duration-200 fade-in">
        <UnsubscribeConfirmation
          teamId={teamId}
          email={email}
          teamName={team.name}
        />
      </div>
    </div>
  );
}
