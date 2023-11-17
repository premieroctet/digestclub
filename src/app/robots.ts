import { MetadataRoute } from 'next';

const siteUrl = process.env.VERCEL_URL || 'https://digest.club';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/admin', '/unsubscribe', '/auth/login', '/teams'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
