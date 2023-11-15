import db from '@/lib/db';
import { MetadataRoute } from 'next';
const siteUrl = process.env.VERCEL_URL || 'https://digest.club';

interface TeamData {
  slug: string;
  updatedAt: Date;
}

async function getTeamsData() {
  const teams = await db.team.findMany({
    select: {
      slug: true,
      Digest: {
        select: {
          updatedAt: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  });
  return teams.map((team) => {
    return {
      slug: team.slug,
      updatedAt: team.Digest[0]?.updatedAt,
    };
  });
}

function getTeamRoutes(teamsData: TeamData[]): MetadataRoute.Sitemap {
  return teamsData.map(({ slug, updatedAt }) => ({
    url: `${siteUrl}/teams/${slug}`,
    lastModified: updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));
}

async function getDigestsSlugsOfTeam(teamSlug: string) {
  return db.digest.findMany({
    where: {
      AND: [
        {
          team: {
            slug: teamSlug,
          },
        },
        {
          NOT: {
            publishedAt: null,
          },
        },
      ],
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
}

async function getDigestRoutes(teamsData: TeamData[]) {
  const digestsSiteMap: MetadataRoute.Sitemap = [];
  const promises = teamsData.map(async ({ slug: teamSlug }) => {
    const digests = await getDigestsSlugsOfTeam(teamSlug);
    digests.forEach((digest) => {
      digestsSiteMap.push({
        url: `${siteUrl}/${teamSlug}/${digest.slug}`,
        lastModified: digest.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      });
    });
  });

  await Promise.all(promises);
  return digestsSiteMap;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const teamsData = await getTeamsData();
  const teamRoutes = getTeamRoutes(teamsData);
  const digestRoutes = await getDigestRoutes(teamsData);

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 1,
    },
    {
      url: `${siteUrl}/updates`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${siteUrl}/discover`,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 0.7,
    },
    {
      url: `${siteUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${siteUrl}/unsubscribe`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
    ...teamRoutes,
    ...digestRoutes,
  ];
}
