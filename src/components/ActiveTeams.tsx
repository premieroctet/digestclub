import Link from 'next/link';
import TeamAvatar from './teams/TeamAvatar';

interface Props {
  teams: {
    name: string;
    color: string | null;
    slug: string;
  }[];
}
export default function ActiveTeams({ teams }: Props) {
  if (teams.length === 0) {
    return <></>;
  }

  return (
    <div className="bg-white p-4 border border-gray-200 rounded-lg">
      <h4 className="text-xl font-bold">Active Teams</h4>
      <p className="text-xs text-slate-500 mt-0.5">
        Most active teams on digest.club
      </p>
      <div className="flex flex-col gap-4 mt-4">
        {teams.map((team) => (
          <div key={team.slug}>
            <span className="flex items-center gap-2">
              <TeamAvatar team={team} />
              <span className="flex flex-col">
                <span className="font-semibold">{team?.name}</span>
                <Link
                  href={`/${team.slug}`}
                  className="hover:text-violet-600 text-xs text-slate-500"
                  title={` Browse all digests of ${team.name}`}
                  rel="noreferrer"
                >
                  Browse all digests
                </Link>
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
