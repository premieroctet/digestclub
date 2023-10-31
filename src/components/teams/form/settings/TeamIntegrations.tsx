import SlackPanel from '../SlackPanel';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';
import { Team } from '@prisma/client';

const TeamIntegrations = ({ team }: { team: Team }) => {
  return (
    <div>
      <div className="relative py-5">
        <div className="absolute inset-0 flex items-center " aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
      </div>
      <span>
        <h3 className="text-lg font-semibold leading-7">Integrations</h3>
        <span className="text-sm text-gray-500 font-light">
          Increase your digest reach by integrating with other tools.
        </span>
      </span>
      <SlackPanel team={team} />
      <TypefullyPanel team={team} />
      <TeamAPIKey team={team} />
    </div>
  );
};

export default TeamIntegrations;
