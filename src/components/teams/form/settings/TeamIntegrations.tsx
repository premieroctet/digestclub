import SlackPanel from '../SlackPanel';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';
import { Team } from '@prisma/client';
import TeamMenuTitle from '../../TeamMenuTitle';
import TeamMenuContent from '../../TeamMenuContent';

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
