import { linksByDay, linksByDomain, newDigestByMonth, newUsersByMonth } from "@/lib/adminQueries";
import { Digest, Team } from "@prisma/client";
import { Card, Col, Grid, Metric, Text } from "@tremor/react";
import DataOverTime from "./widgets/DataOverTime";
import LinksByWebsite from "./widgets/LinksByWebsite";
import LinksOverTime from "./widgets/LinksOverTime";


export type DashboardProps = {
  newUsersByMonth: Awaited<ReturnType<typeof newUsersByMonth>>;
  newDigestByMonth: Awaited<ReturnType<typeof newDigestByMonth>>;
  linksByDomain: Awaited<ReturnType<typeof linksByDomain>>;
  linksCount: number;
  latestTeam: Team | null;
  latestDigest: Digest | null;
  linksByDay: Awaited<ReturnType<typeof linksByDay>>;
};

const Dashboard = (dashboardProps: DashboardProps) => {
  return (
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

export default Dashboard