import client from '@/lib/db';
import '@/theme/admin.css';
import {
  AdminComponentProps,
  NextAdmin,
  NextAdminOptions,
} from '@premieroctet/next-admin';
import '@premieroctet/next-admin/dist/styles.css';
import { Card, Col, Grid, Metric, Text } from '@tremor/react';
import { GetServerSideProps, GetServerSidePropsResult } from 'next';
import { getServerSession } from 'next-auth';
import schema from '../../../prisma/json-schema/json-schema.json';

import DataOverTime from '@/components/admin/widgets/DataOverTime';
import LinksByWebsite from '@/components/admin/widgets/LinksByWebsite';
import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { Digest, Team } from '@prisma/client';
import {
  linksByDay,
  linksByDomain,
  newDigestByMonth,
  newUsersByMonth,
} from '@/lib/adminQueries';
import LinksOverTime from '@/components/admin/widgets/LinksOverTime';

type DashboardProps = {
  newUsersByMonth: Awaited<ReturnType<typeof newUsersByMonth>>;
  newDigestByMonth: Awaited<ReturnType<typeof newDigestByMonth>>;
  linksByDomain: Awaited<ReturnType<typeof linksByDomain>>;
  totalLinks: number;
  latestTeam: Team | null;
  latestDigest: Digest | null;
  linksByDay: Awaited<ReturnType<typeof linksByDay>>;
};

export default function Admin(
  props: AdminComponentProps & { dashboardProps?: DashboardProps }
) {
  const dashboardProps = props.dashboardProps;

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
              <Metric>{dashboardProps?.totalLinks}</Metric>
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

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
  const isAdmin = session?.user?.role === 'SUPERADMIN';

  if (!isAdmin) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  const { nextAdminRouter } = await import(
    '@premieroctet/next-admin/dist/router'
  );

  const options: NextAdminOptions = {
    model: {
      User: {
        toString: (user) => user.email ?? user.id,
        list: {
          fields: {
            id: {
              display: true,
            },
            email: {
              display: true,
              search: true,
            },
            name: {
              search: true,
            },
            role: {
              display: true,
            },
            createdAt: {
              display: true,
            },
          },
        },
      },
      Team: {
        list: {
          fields: {
            id: {
              display: true,
            },
            name: {
              display: true,
              search: true,
            },
            // @ts-expect-error
            memberships: {
              display: true,
            },
            createdAt: {
              display: true,
            },
          },
        },
      },
      Link: {
        list: {
          fields: {
            id: {
              display: true,
            },
            title: {
              display: true,
            },
            description: {
              display: true,
            },
            url: {
              display: true,
              search: true,
            },
          },
        },
      },
      Digest: {
        list: {
          fields: {
            id: {
              display: true,
            },
            title: {
              display: true,
            },
            description: {
              display: true,
            },
            createdAt: {
              display: true,
            },
          },
        },
      },
    },
  };

  const adminRouter = await nextAdminRouter(client, schema, options);
  const serverSideProps = (await adminRouter.run(
    req,
    res
  )) as GetServerSidePropsResult<{
    [key: string]: any;
    dashboardProps?: DashboardProps;
  }>;

  if (
    'props' in serverSideProps &&
    (req.url === '/admin' || req.url?.endsWith('/admin.json'))
  ) {
    const dashboardProps: DashboardProps = {
      newUsersByMonth: await newUsersByMonth(),
      newDigestByMonth: await newDigestByMonth(),
      linksByDomain: await linksByDomain(),
      linksByDay: await linksByDay(),
      totalLinks: await client.link.count(),
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
    };
    // @ts-ignore
    serverSideProps.props.dashboardProps = JSON.parse(
      JSON.stringify(dashboardProps)
    );
  }

  return serverSideProps;
};
