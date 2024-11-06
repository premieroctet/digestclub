import { getEnvHost } from '@/lib/server';
import { parseISO } from 'date-fns';
import { Feed } from 'feed';
import { generateTeamOGUrl } from './open-graph-url';
import { PublicTeamResult } from '@/services/database/team';

export const createFeed = (team: PublicTeamResult, teamSlug: string) => {
  const date = new Date();
  const ogImage = generateTeamOGUrl(team?.slug || '');
  const feed = new Feed({
    title: `Cool stuff from the Web - ${team!.name} - Digest.club`,
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
        digest.digestBlocks?.length
      } bookmarks`,
      date: parseISO(digest.publishedAt!.toString()),
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
