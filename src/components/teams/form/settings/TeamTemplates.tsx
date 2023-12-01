import TemplateItem from '@/components/digests/templates/TemplateItem';
import { TeamDigestsResult } from '@/lib/queries';
import { Team } from '@prisma/client';
import TeamMenuTitle from '../../TeamMenuTitle';
import NoContent from '@/components/layout/NoContent';
import { ViewColumnsIcon } from '@heroicons/react/24/outline';
import TeamMenuContent from '../../TeamMenuContent';

const TeamTemplates = ({
  team,
  templates,
}: {
  team: Team;
  templates: TeamDigestsResult[];
}) => {
  return (
    <div>
      <TeamMenuTitle title="Templates" subtitle="Manage your team templates" />
      <TeamMenuContent>
        <div className="flex gap-4 flex-col">
          {templates?.map((template) => (
            <TemplateItem key={template?.id} template={template} team={team} />
          ))}
          {!templates?.length && (
            <NoContent
              icon={<ViewColumnsIcon className="w-12 h-12" />}
              title="No templates"
              subtitle="Your team does not have templates yet, create one from one of your digest edition page"
            />
          )}
        </div>
      </TeamMenuContent>
    </div>
  );
};

export default TeamTemplates;
