import { ImGithub } from '@react-icons/all-files/im/ImGithub';
import { ImLink } from '@react-icons/all-files/im/ImLink';
import { ImTwitter } from '@react-icons/all-files/im/ImTwitter';
import Link from 'next/link';
import TeamAvatar from '../teams/TeamAvatar';

interface Props {
  team: {
    name: string;
    website?: string;
    bio?: string;
    twitter?: string;
    github?: string;
    slug?: string;
  };
}
export default function PublicDigestHeader({ team }: Props) {
  function stripProtocolFromUrl(string: string) {
    const url = new URL(string);
    const hostname = url.hostname;
    if (hostname.startsWith('www.')) {
      return hostname.slice(4);
    }
    return url.hostname;
  }

  return (
    <header className="flex flex-col border border-gray-200 bg-white rounded-lg overflow-hidden gap-4">
      <div className="w-full flex flex-col">
        <div className="relative z-0 overflow-hidden pt-10 px-4">
          <div className="h-12 bg-[#DCFCE7] absolute left-0 right-0 -z-10 top-0"></div>
          <Link
            className="flex flex-row items-end gap-2"
            href={`/${team.slug}`}
          >
            <TeamAvatar team={team} className="h-9 w-9 text-lg" />
            <h3 className="font-bold text-lg hover:text-violet-600">
              {team.name}
            </h3>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-4 px-6 text-slate-600 text-sm pb-6">
        {team.bio && <p>{team.bio}</p>}
        <a
          href={`/${team.slug}`}
          className="font-semibold hover:text-violet-600 underline"
          title={` Browse all digests of ${team.name}`}
          rel="noreferrer"
        >
          Browse all digests
        </a>
        <div className="flex flex-col gap-1">
          {team.website && (
            <a
              className="flex items-center gap-1 font-semibold hover:text-violet-600"
              href={`${team.website}`}
              title={`Website of ${team.name}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <ImLink />
              </span>
              <span>{stripProtocolFromUrl(team.website)}</span>
            </a>
          )}
          {team.twitter && (
            <a
              className="flex items-center gap-1 text-gray-500 hover:text-violet-600"
              href={`https://twitter.com/${team.twitter}`}
              title="Twitter"
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <ImTwitter />
              </span>
              <span>@{team.twitter}</span>
            </a>
          )}
          {team.github && (
            <a
              className="flex items-center gap-1 text-gray-500 hover:text-violet-600"
              href={`https://github.com/${team.github}`}
              title="Github"
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <ImGithub />
              </span>
              <span>@{team.github}</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
