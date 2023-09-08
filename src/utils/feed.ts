import { PublicTeamResult } from '@/lib/queries';
import { getEnvHost } from '@/lib/server';
import { Feed } from 'feed';
import { generateTeamOG } from './open-graph';

export const createFeed = (team: PublicTeamResult, teamSlug: string) => {
  const date = new Date();
  const ogImage = generateTeamOG(team?.slug || '');
  const feed = new Feed({
    title: team!.name,
    description: team?.bio || undefined,
    id: `${getEnvHost()}/${teamSlug}`,
    copyright: `All rights reserved ${date.getFullYear()}, Digest.club`,
    updated: date,
    link: `${getEnvHost()}/${teamSlug}`,
    language: 'en',
    image: ogImage,
    favicon: `${getEnvHost()}/favicon.ico`,
    feedLinks: {
      rss2: `${getEnvHost()}/${teamSlug}/rss.xml`,
      atom: `${getEnvHost()}/${teamSlug}/atom.xml`,
    },
  });

  team?.Digest.forEach((digest) => {
    feed.addItem({
      title: digest.title,
      id: `${getEnvHost()}/${teamSlug}/${digest.slug}`,
      link: `${getEnvHost()}/${teamSlug}/${digest.slug}`,
      description: `${digest.description ? digest.description + ' - ' : ''} ${
        digest._count.digestBlocks
      } bookmarks`,
      date: digest.publishedAt!,
    });
  });

  return feed;
};

export const rss = (team: PublicTeamResult, teamSlug: string) => {
  const feed = createFeed(team, teamSlug);
  return feed.rss2();
};

export const atom = (team: PublicTeamResult, teamSlug: string) => {
  const feed = createFeed(team, teamSlug);
  return feed.atom1();
};
