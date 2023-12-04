import SlackPanel from '../SlackPanel';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';
import { Team } from '@prisma/client';
import TeamMenuTitle from '../../TeamMenuTitle';
import TeamMenuContent from '../../TeamMenuContent';

const TeamIntegrations = ({ team }: { team: Team }) => {
  return (
    <div>
      <TeamMenuTitle
        title="Integrations"
        subtitle="Increase your digest reach by integrating with other tools."
      />
      <TeamMenuContent>
        <SlackPanel team={team} />
        <TypefullyPanel team={team} />
        <TeamAPIKey team={team} />
      </TeamMenuContent>
    </div>
  );
};

export default TeamIntegrations;
