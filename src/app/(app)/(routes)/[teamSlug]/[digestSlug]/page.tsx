import DigestPublicPage from '@/components/pages/DigestPublicPage';
import { generateDigestOGUrl } from '@/utils/open-graph-url';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import * as Sentry from '@sentry/nextjs';
import {
  getPublicDigest,
  incrementDigestView,
} from '@/services/database/digest';

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
        type: 'website',
        title: `${digest?.title}`,
        description: digest?.description || digest?.team.name,
        url,
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
