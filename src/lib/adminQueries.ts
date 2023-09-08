import db from '@/lib/db';
import { Prisma } from '@prisma/client';

export const newUsersByMonth = async () => {
  return await db.$queryRaw<{ createdat: string; count: number }[]>(
    Prisma.sql`SELECT DATE_TRUNC('month', u."createdAt") AS createdAt, COUNT(id)::integer AS count 
    FROM users as u
    WHERE DATE_PART('year', u."createdAt") = DATE_PART('year', CURRENT_DATE)
    GROUP BY DATE_TRUNC('month', u."createdAt")`
  );
};

export const newDigestByMonth = async () => {
  return await db.$queryRaw<{ createdat: string; count: number }[]>(
    Prisma.sql`SELECT DATE_TRUNC('month', d."createdAt") AS createdAt, COUNT(id)::integer AS count 
      FROM digests as d
      WHERE DATE_PART('year', d."createdAt") = DATE_PART('year', CURRENT_DATE)
      GROUP BY DATE_TRUNC('month', d."createdAt")`
  );
};

export const linksByDomain = async () => {
  return await db.$queryRaw<{ url_domain: string; count: number }[]>(
    Prisma.sql`SELECT 
      substring(l.url from '(?:.*://)?(?:www\.)?([^/?]*)') AS url_domain,
      count(l.id)::integer AS count
    FROM links AS l
    GROUP BY url_domain
    ORDER BY count DESC
    LIMIT 10;`
  );
};

export const linksByDay = async () => {
  return await db.$queryRaw<{ createdat: string; count: number }[]>(
    Prisma.sql`SELECT DATE_TRUNC('day', l."createdAt") AS createdAt, count(l.id)::integer AS count
    FROM links AS l
    WHERE DATE_PART('month', l."createdAt") = DATE_PART('month', CURRENT_DATE)
    GROUP BY DATE_TRUNC('day', l."createdAt");`
  );
};
