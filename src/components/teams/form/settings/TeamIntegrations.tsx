import SlackPanel from '../SlackPanel';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';
import { Team } from '@prisma/client';

const TeamIntegrations = ({ team }: { team: Team }) => {
  return (
    <div>
      <SlackPanel team={team} />
      <TypefullyPanel team={team} />
      <TeamAPIKey team={team} />
    </div>
  );
};

export default TeamIntegrations;
