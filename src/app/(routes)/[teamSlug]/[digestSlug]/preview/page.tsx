import { getPublicDigest, getUserTeams } from '@/lib/queries';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/sessions';
import DigestPublicPage from '@/components/pages/DigestPublicPage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: { teamSlug: string; digestSlug: string };
}

const PreviewDigestPage = async ({ params }: PageProps) => {
  const session = await getSession();
  const teams = await getUserTeams(session?.user.id);

  if (!teams?.find((team) => team?.slug === params.teamSlug)) {
    redirect('/');
  }

  const digest = await getPublicDigest(
    params.digestSlug,
    params.teamSlug,
    true
  );

  if (!digest) {
    redirect('/');
  }

  return (
    <>
      <div className="flex justify-center">
        <span className="bg-purple-100 text-purple-800 text-lg font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-purple-900 dark:text-purple-300">
          {params.digestSlug.toUpperCase()} - DIGEST PREVIEW
        </span>
      </div>
      <DigestPublicPage digest={digest} />
    </>
  );
};

export default PreviewDigestPage;
