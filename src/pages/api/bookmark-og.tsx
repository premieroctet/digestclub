import db from '@/lib/db';
import { createOGBookmarkSVG } from '@/utils/open-graph';
import { Resvg } from '@resvg/resvg-js';
import { captureException } from '@sentry/nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const hasId = req.query.bookmark;

    if (!hasId) return res.status(404).end();

    const bookmark = await db.bookmark.findUnique({
      where: {
        id: req.query.bookmark as string,
      },
      include: {
        link: true,
      },
    });

    if (!bookmark) return res.status(404).end();

    const {
      link: { title },
    } = bookmark;

    const svg = await createOGBookmarkSVG({
      title,
      favicon: bookmark.link.logo,
    });
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const png = pngData.asPng();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
    res.status(200).end(png);
  } catch (e: any) {
    captureException(e);
    console.log(e);
    res.status(500).json({ error: 'Internal server error' });
  }
}
