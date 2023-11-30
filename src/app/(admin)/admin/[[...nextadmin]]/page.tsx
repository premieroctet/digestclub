import { authOptions } from '@/pages/api/auth/[...nextauth]';
import client from '@/lib/db';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { NextAdmin } from '@premieroctet/next-admin';
import { getPropsFromParams } from '@premieroctet/next-admin/dist/appRouter';
import '@/theme/admin.css';
import '@premieroctet/next-admin/dist/styles.css';
import schema from '../../../../../prisma/json-schema/json-schema.json';
import { options } from '@/utils/nextadmin';
import { submitFormAction } from '@/actions/nextadmin';
import {
  linksByDay,
  linksByDomain,
  newDigestByMonth,
  newUsersByMonth,
} from '@/lib/adminQueries';
import { Digest, Team } from '@prisma/client';
import { Card, Col, Grid, Metric, Text } from '@tremor/react';
import DataOverTime from '@/components/admin/widgets/DataOverTime';
import LinksByWebsite from '@/components/admin/widgets/LinksByWebsite';
import LinksOverTime from '@/components/admin/widgets/LinksOverTime';

type DashboardProps = {
  newUsersByMonth: Awaited<ReturnType<typeof newUsersByMonth>>;
  newDigestByMonth: Awaited<ReturnType<typeof newDigestByMonth>>;
  linksByDomain: Awaited<ReturnType<typeof linksByDomain>>;
  linksCount: number;
  latestTeam: Team | null;
  latestDigest: Digest | null;
  linksByDay: Awaited<ReturnType<typeof linksByDay>>;
};

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
      dashboard={
        dashboardProps && (
          <Grid numItems={1} numItemsSm={2} numItemsLg={3} className="gap-2">
            <Col numColSpan={1} numColSpanLg={2}>
              <DataOverTime
                data={{
                  newUsersByMonth: dashboardProps?.newUsersByMonth,
                  newDigestByMonth: dashboardProps?.newDigestByMonth,
                }}
              />
            </Col>
            <LinksByWebsite data={dashboardProps.linksByDomain} />
            <Col>
              <Card>
                <Text>Dernier digest publié</Text>
                <Metric>
                  <a
                    // @ts-expect-error
                    href={`${dashboardProps.latestDigest?.team?.slug}/${dashboardProps.latestDigest?.slug}`}
                    target="_blank"
                  >
                    {dashboardProps.latestDigest?.title} par {/* @ts-ignore */}
                    {dashboardProps.latestDigest?.team.name}
                  </a>
                </Metric>
              </Card>
            </Col>
            <Card>
              <Text>Dernière team créée</Text>
              <Metric>
                <a href={`${dashboardProps.latestTeam?.slug}`} target="_blank">
                  {dashboardProps.latestTeam?.name}
                </a>
              </Metric>
            </Card>
            <Card>
              <Text>Total des liens</Text>
              <Metric>{dashboardProps?.linksCount}</Metric>
            </Card>
            <Col numColSpan={3} numColSpanLg={3}>
              <LinksOverTime data={{ linksByDay: dashboardProps.linksByDay }} />
            </Col>
          </Grid>
        )
      }
    />
  );
}
