import React from 'react';
import { ImLink } from '@react-icons/all-files/im/ImLink';
import { ImTwitter } from '@react-icons/all-files/im/ImTwitter';
import { ImGithub } from '@react-icons/all-files/im/ImGithub';
import Link from 'next/link';

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
    <header className="w-full flex flex-col pb-8">
      <div className="w-full flex flex-col">
        <div className="pb-2">
          <Link href={`/${team.slug}`}>
            <h3 className="font-bold text-2xl hover:text-violet-600">
              {team.name}
            </h3>
          </Link>
          {team.website && (
            <a
              className="text-base flex items-center gap-1 font-semibold hover:underline"
              href={`${team.website}`}
              title={`Website of ${team.name}`}
              target="_blank"
              rel="noreferrer"
            >
              <span>
                <ImLink />
              </span>
              <span className="">{stripProtocolFromUrl(team.website)}</span>
            </a>
          )}
        </div>
        {team.bio && (
          <>
            <p className="text-base max-w-[65ch]">{team.bio}</p>
          </>
        )}
      </div>
      <div className="w-full flex flex-row mt-2 gap-4 overflow-hidden">
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
            <span className="font-normal text-base">@{team.twitter}</span>
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
            <span className="font-normal text-base">@{team.github}</span>
          </a>
        )}
      </div>
    </header>
  );
}
