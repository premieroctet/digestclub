import SlackPanel from '../SlackPanel';
import TypefullyPanel from '../TypefullyPanel';
import TeamAPIKey from '../TeamAPIKey';
import { Team } from '@prisma/client';
import TeamMenuTitle from '../../TeamMenuTitle';

const TeamIntegrations = ({ team }: { team: Team }) => {
  return (
    <div>
      <TeamMenuTitle
        title="Integrations"
        subtitle="  Increase your digest reach by integrating with other tools."
      />
      <SlackPanel team={team} />
      <TypefullyPanel team={team} />
      <TeamAPIKey team={team} />
    </div>
  );
};

export default TeamIntegrations;
