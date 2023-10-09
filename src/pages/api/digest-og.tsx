import db from '@/lib/db';
import { createOGDigestSVG } from '@/utils/open-graph';
import { DigestBlockType } from '@prisma/client';
import { Resvg } from '@resvg/resvg-js';
import { captureException } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Content-Type', 'image/png');
  try {
    const hasSlug = req.query.digest;
    if (!hasSlug) return res.status(404).end();
    const digest = await db.digest.findFirst({
      where: {
        slug: req.query.digest as string,
        publishedAt: {
          not: null,
        },
      },
      select: {
        title: true,
        team: {
          select: {
            name: true,
          },
        },
        digestBlocks: {
          select: {
            id: true,
          },
          where: {
            type: DigestBlockType?.BOOKMARK,
          },
        },
      },
    });

    if (!digest) return res.status(404).end();

    const { title, team } = digest;
    const nbOfLink = digest.digestBlocks.length;

    const svg = await createOGDigestSVG({
      title,
      team: team.name,
      nbOfLink,
    });
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const png = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader(
      'Cache-Control',
      'public, max-age=86400, immutable'
    ); /* 1 day */
    res.status(200).end(png);
  } catch (e: any) {
    captureException(e);
    res.status(500).json({ error: 'Internal server error' });
  }
}
