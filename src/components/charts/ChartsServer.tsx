import React from 'react';
import Charts from './Charts';
import db from '@/lib/db';

interface Props {
  linkCount: number;
  teamId: string;
}

async function getTeamLinksCountByMonth(teamId: string) {
  // Safe from SQL injection --> https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw
  const result = await db.$queryRaw`SELECT
    CAST(EXTRACT(MONTH FROM b."createdAt") AS INTEGER) AS month,
    CAST(COUNT(link."id") AS INTEGER) AS link_count
FROM
    bookmarks b
JOIN
    links link ON b."linkId" = link."id"
JOIN
    teams t ON b."teamId" = t."id"
WHERE
    t."id" = ${teamId}
    AND EXTRACT(YEAR FROM b."createdAt") = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY
    month;`;

  return result as Array<{
    month: number;
    link_count: number;
  }>;
}

export default async function ChartsServer({ linkCount, teamId }: Props) {
  const teamLinkCountByMonth = await getTeamLinksCountByMonth(teamId);
  const emptyCount = teamLinkCountByMonth.length === 0;
  const text = linkCount > 1 ? 'bookmarks' : 'bookmark';
  if (emptyCount) {
    return null;
  }

  return (
    <div className="h-full flex flex-grow-0 w-ful items-end">
      <p className="flex flex-col justify-end">
        <span className="text-3xl font-bold">{linkCount}</span>
        <span title="Link bookmarked" className="text-xs text-gray-400">
          {text}
        </span>
      </p>
      <div className="h-[60px] w-full">
        <Charts teamLinksByMonth={teamLinkCountByMonth} />
      </div>
    </div>
  );
}
