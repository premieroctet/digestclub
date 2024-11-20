import Dashboard, { DashboardProps } from '@/components/admin/Dashboard';
import {
  linksByDay,
  linksByDomain,
  newDigestByMonth,
  newUsersByMonth,
} from '@/lib/adminQueries';
import client from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { options } from '@/utils/nextadmin';
import { NextAdmin, PageProps } from '@premieroctet/next-admin';
import { getNextAdminProps } from '@premieroctet/next-admin/appRouter';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function AdminPage({ params, searchParams }: PageProps) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'SUPERADMIN';

  if (!isAdmin) {
    redirect('/');
  }

  const props = await getNextAdminProps({
    basePath: '/admin',
    apiBasePath: '/api/admin',
    params: params.nextadmin as string[],
    searchParams,
    options,
    prisma: client
  });

  const dashboardProps: DashboardProps | undefined = !params.nextadmin
    ? {
        newUsersByMonth: await newUsersByMonth(),
        newDigestByMonth: await newDigestByMonth(),
        linksByDomain: await linksByDomain(),
        linksByDay: await linksByDay(),
        linksCount: await client.link.count(),
        latestDigest: await client.digest.findFirst({
          where: { publishedAt: { not: null } },
          orderBy: { createdAt: 'desc' },
          include: {
            team: true,
          },
        }),
        latestTeam: await client.team.findFirst({
          orderBy: { createdAt: 'desc' },
        }),
      }
    : undefined;

  return (
    <NextAdmin
      {...props}
      dashboard={dashboardProps && <Dashboard {...dashboardProps} />}
      user={{
        data: {
          name: session!.user!.email!,
        },
        logout: '/logout',
      }}
    />
  );
}
