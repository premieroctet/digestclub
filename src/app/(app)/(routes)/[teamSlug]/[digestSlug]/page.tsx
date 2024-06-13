import DigestPublicPage from '@/components/pages/DigestPublicPage';
import {
  getPublicDigest,
  incrementDigestView,
} from '@/services/database/digest';
import { generateDigestOGUrl } from '@/utils/open-graph-url';
import * as Sentry from '@sentry/nextjs';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';

interface PageProps {
  params: { teamSlug: string; digestSlug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const digest = await getPublicDigest(params.digestSlug, params.teamSlug);
    const url = generateDigestOGUrl(params.digestSlug);

    return {
      title: `${digest?.title} by ${digest?.team.name}`,
      twitter: {
        card: 'summary_large_image',
        title: `${digest?.title}`,
        description: digest?.description || digest?.team.name,
        images: [url],
      },
      openGraph: {
        type: 'article',
        title: `${digest?.title}`,
        description: digest?.description || digest?.team.name,
        siteName: 'digest.club',
        url: `${process.env.NEXT_PUBLIC_PUBLIC_URL}/${params.teamSlug}/${params.digestSlug}`,
        images: [
          {
            url,
            width: 1200,
            height: 600,
          },
        ],
      },
    };
  } catch (error) {
    Sentry.captureException(error);
    return {};
  }
}

const PublicDigestPage = async ({ params }: PageProps) => {
  const digest = await getPublicDigest(params.digestSlug, params.teamSlug);

  if (!digest) {
    redirect('/');
  }

  incrementDigestView(digest.id);

  return <DigestPublicPage digest={digest} />;
};

export default PublicDigestPage;
