import { captureException } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { createOGTeamSVG } from '@/utils/open-graph';
import db from '@/lib/db';
import { SatoriOptions } from 'satori/wasm';
import path from 'path';
import fs from 'fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Content-Type', 'image/png');

  try {
    const hasSlug = req.query.team;

    if (!hasSlug) return res.status(404).end();

    const team = await db.team.findUnique({
      where: {
        slug: req.query.team as string,
      },
      select: {
        name: true,
        github: true,
        twitter: true,
        website: true,
        bio: true,
        Digest: {
          select: {
            title: true,
          },
        },
      },
    });

    if (!team) return res.status(404).end();

    const svg = await createOGTeamSVG({
      name: team.name,
      github: team.github,
      twitter: team.twitter,
      bio: team.bio,
      nbOfDigest: team.Digest.length,
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
    // eslint-disable-next-line no-console
    console.log(e);
    return res.status(500).json({ error: e.message });
  }
}
