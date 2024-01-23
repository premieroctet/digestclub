import { deleteItem, submitFormAction } from '@/actions/nextadmin';
import Dashboard, { DashboardProps } from '@/components/admin/Dashboard';
import {
  linksByDay,
  linksByDomain,
  newDigestByMonth,
  newUsersByMonth,
} from '@/lib/adminQueries';
import client from '@/lib/db';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import '@/theme/admin.css';
import { options } from '@/utils/nextadmin';
import { NextAdmin } from '@premieroctet/next-admin';
import { getPropsFromParams } from '@premieroctet/next-admin/dist/appRouter';
import '@premieroctet/next-admin/dist/styles.css';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import schema from '../../../../../prisma/json-schema/json-schema.json';


export default async function AdminPage({
  params,
  searchParams,
}: {
  params: { [key: string]: string[] };
  searchParams: { [key: string]: string | string[] | undefined } | undefined;
}) {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === 'SUPERADMIN';

  if (!isAdmin) {
    redirect('/');
  }

  const props = await getPropsFromParams({
    params: params.nextadmin,
    searchParams,
    options: options,
    prisma: client,
    schema,
    action: submitFormAction,
    deleteAction: deleteItem
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
    />
  );
}
